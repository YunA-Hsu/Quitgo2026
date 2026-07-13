import { useState, useRef, useLayoutEffect, useEffect } from 'react';
import BottomNav from '../../components/BottomNav';
import { base, font, radius, shadow, rarity, mood, game } from '../../styles/tokens';
import { MOCK_BOARD_DECK, BoardCard } from '../../fixtures/boardDeck';
import { copy } from '../../copy/zh-TW';
import bgImage from '../../assets/backgrounds/Background.png';

const c = copy.board;

function getResidentImageUrl(fileName: string) {
  return new URL(`../../assets/characters/${fileName}`, import.meta.url).href;
}

function hexToRgba(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const GiftIcon = ({ color }: { color: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ filter: `drop-shadow(0 0 4px ${color}66)` }}>
    <polyline points="20 12 20 22 4 22 4 12"></polyline>
    <rect x="2" y="7" width="20" height="5"></rect>
    <line x1="12" y1="22" x2="12" y2="7"></line>
    <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path>
    <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path>
  </svg>
);

const IChingIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={base.textPrimary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
    <circle cx="12" cy="12" r="2" fill={base.textPrimary}></circle>
  </svg>
);

const FlagIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
    <line x1="4" y1="22" x2="4" y2="15"></line>
  </svg>
);

const initialCards = [
  MOCK_BOARD_DECK[0],
  MOCK_BOARD_DECK[15],
  MOCK_BOARD_DECK[1],
  MOCK_BOARD_DECK[2]
];

type AnimationState = 'IDLE' | 'ROLLING' | 'SHOW_RESULT' | 'JUMPING' | 'SETTLEMENT';

export default function BoardScreen() {
  const [drawnCards, setDrawnCards] = useState<BoardCard[]>(initialCards);
  const [energy, setEnergy] = useState(250);

  // Animation states
  const [animState, setAnimState] = useState<AnimationState>('IDLE');
  const [rollResult, setRollResult] = useState(0);
  const [pendingCards, setPendingCards] = useState<BoardCard[]>([]);
  const [yayaJumpIndex, setYayaJumpIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [svgPath, setSvgPath] = useState('');
  
  const hasScrolledRef = useRef(false);

  const handleDraw = () => {
    if (energy < game.energyPerRoll || animState !== 'IDLE') return;

    setEnergy(e => e - game.energyPerRoll);
    setAnimState('ROLLING');

    const steps = Math.floor(Math.random() * 3) + 1; // 1-3
    setRollResult(steps);

    // Draw `steps` cards
    const history = drawnCards;
    const newCards: BoardCard[] = [];
    const recentIds = history.slice(-5).map(c => c.id);

    for (let i = 0; i < steps; i++) {
      const isPity = (history.length + i) >= 2 && 
                     (newCards.length >= 2 ? newCards.slice(-2).every(c => c.type === 'skip') : 
                      [...history, ...newCards].slice(-2).every(c => c.type === 'skip'));

      let pool: BoardCard[];
      if (isPity) {
        pool = MOCK_BOARD_DECK.filter(c => c.type === 'reward' && !recentIds.includes(c.id) && !newCards.some(n => n.id === c.id));
        if (pool.length === 0) pool = MOCK_BOARD_DECK.filter(c => c.type === 'reward');
      } else {
        const isReward = Math.random() < 0.75;
        pool = MOCK_BOARD_DECK.filter(c => c.type === (isReward ? 'reward' : 'skip') && !recentIds.includes(c.id) && !newCards.some(n => n.id === c.id));
        if (pool.length === 0) pool = MOCK_BOARD_DECK.filter(c => c.type === (isReward ? 'reward' : 'skip'));
      }
      newCards.push(pool[Math.floor(Math.random() * pool.length)]);
    }

    setPendingCards(newCards);

    // Timeline
    setTimeout(() => {
      setAnimState('SHOW_RESULT');
      setTimeout(() => {
        setAnimState('JUMPING');
        setYayaJumpIndex(0);
      }, 800);
    }, 1200);
  };

  const handleSkip = () => {
    if (animState !== 'IDLE' && animState !== 'SETTLEMENT') {
      setAnimState('SETTLEMENT');
      setDrawnCards(prev => [...prev, ...pendingCards]);
      setPendingCards([]);
      setYayaJumpIndex(-1);
    }
  };

  useEffect(() => {
    if (animState === 'JUMPING') {
      if (yayaJumpIndex < pendingCards.length) {
        const t = setTimeout(() => {
          setYayaJumpIndex(i => i + 1);
          // scroll to the card
          const targetCardEl = cardsRef.current[drawnCards.length + yayaJumpIndex + 1];
          if (targetCardEl) {
            window.scrollTo({ top: targetCardEl.offsetTop - window.innerHeight / 2, behavior: 'smooth' });
          }
        }, 350);
        return () => clearTimeout(t);
      } else {
        setAnimState('SETTLEMENT');
        // Do not clear pendingCards here, keep them for the dialog to read
      }
    }
  }, [animState, yayaJumpIndex, pendingCards, drawnCards]);

  const visibleHistoryCount = animState === 'JUMPING' || animState === 'SETTLEMENT' ? drawnCards.length + Math.max(0, yayaJumpIndex) : drawnCards.length;
  const currentHistory = animState === 'IDLE' ? drawnCards : [...drawnCards, ...pendingCards].slice(0, visibleHistoryCount);
  const allDisplayCards = [...currentHistory, null, null, null, null]; // currentPos + 3 fogs

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const updatePath = () => {
      let path = '';
      let lastX = 0, lastY = 0;
      let hasLast = false;

      cardsRef.current.forEach((el, index) => {
        if (!el || index >= allDisplayCards.length) return;
        
        // 中心點
        const x = el.offsetLeft + el.offsetWidth / 2;
        const y = el.offsetTop + el.offsetHeight / 2;

        if (hasLast) {
          const dy = (y - lastY) / 2;
          path += ` C ${lastX} ${lastY + dy}, ${x} ${y - dy}, ${x} ${y}`;
        } else {
          path += `M ${x} ${y}`;
        }

        lastX = x;
        lastY = y;
        hasLast = true;
      });

      // 延伸一段到迷霧區
      if (hasLast) {
        path += ` C ${lastX} ${lastY + 50}, ${lastX} ${lastY + 100}, ${lastX} ${lastY + 150}`;
      }

      setSvgPath(path);
      
      // 初始捲動
      if (!hasScrolledRef.current && animState === 'IDLE') {
        const currentPosEl = cardsRef.current[drawnCards.length];
        if (currentPosEl) {
          window.scrollTo({ top: currentPosEl.offsetTop - window.innerHeight / 2, behavior: 'instant' });
          hasScrolledRef.current = true;
        }
      }
    };

    updatePath();
    const t = setTimeout(updatePath, 50);
    const t2 = setTimeout(updatePath, 200);
    window.addEventListener('resize', updatePath);
    return () => {
      clearTimeout(t);
      clearTimeout(t2);
      window.removeEventListener('resize', updatePath);
    };
  }, [allDisplayCards.length, currentHistory.length, drawnCards, animState]);

  const totalEnergy = 500;
  const isEnergyEnough = energy >= game.energyPerRoll;

  return (
    <div
      style={{
        minHeight: '100dvh',
        width: '100%',
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        paddingTop: '116px',
        paddingBottom: '200px',
        overflowX: 'hidden'
      }}
    >
      {/* 頂部固定區域 */}
      <div style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        backgroundColor: 'rgba(245, 240, 230, 0.95)',
        backdropFilter: 'blur(8px)',
        zIndex: 20,
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Title */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '16px', position: 'relative'
        }}>
          <h1 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: base.textPrimary, fontFamily: font.family }}>職涯大富翁</h1>
          <button style={{
            position: 'absolute', right: '16px',
            background: 'none', border: 'none', fontSize: '12px',
            color: base.textSecondary, fontWeight: 500, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '4px'
          }} onClick={() => alert('玩法說明建置中...')}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: '14px', height: '14px', borderRadius: '50%',
              border: `1.5px solid ${base.textSecondary}`, fontSize: '10px'
            }}>?</span> 玩法說明
          </button>
        </div>
        
        {/* Status */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 16px 16px 16px',
          borderBottom: `1px solid ${base.border}`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: base.card, overflow: 'hidden' }}>
              <img src={getResidentImageUrl('Lulu.png')} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{
              backgroundColor: base.card, padding: '4px 8px', borderRadius: radius.pill,
              border: `1px solid ${base.border}`, fontSize: '11px', color: base.textPrimary,
              fontFamily: font.family, fontWeight: font.weight.medium
            }}>
              職場新手村 Lv.2
            </div>
          </div>
          <div style={{
            backgroundColor: base.card, border: `1px solid ${base.border}`, borderRadius: radius.pill,
            padding: '4px 12px', display: 'flex', alignItems: 'center', gap: '8px'
          }}>
            <span style={{ fontSize: '11px', color: base.textSecondary, fontFamily: font.family, fontWeight: font.weight.medium }}>
              {energy} / {totalEnergy}
            </span>
            <div style={{ width: '48px', height: '6px', borderRadius: '3px', backgroundColor: base.border, overflow: 'hidden' }}>
              <div style={{ width: `${(energy/totalEnergy)*100}%`, height: '100%', backgroundColor: mood.achievement, transition: 'width 0.3s ease' }} />
            </div>
          </div>
        </div>
      </div>

      <div className="app-container" style={{ position: 'relative', flex: 1, padding: '24px 24px' }}>
        
        <div ref={containerRef} style={{ 
          display: 'flex', flexDirection: 'column', gap: '48px', position: 'relative', zIndex: 1, paddingTop: '24px'
        }}>
          
          {/* 動態蛇行虛線 (SVG) */}
          <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}>
            <defs>
              <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#C9BFA8" stopOpacity="1" />
                <stop offset="85%" stopColor="#C9BFA8" stopOpacity="1" />
                <stop offset="100%" stopColor="#C9BFA8" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={svgPath} fill="none" stroke="url(#fade)" strokeWidth="3" strokeDasharray="6 6" />
          </svg>

          {allDisplayCards.map((card, index) => {
            const isCurrentPos = index === currentHistory.length;
            const isFog = index > currentHistory.length;
            const isLeft = index % 2 === 0;
            
            const cardWidth = isCurrentPos ? '100%' : '62%';
            const alignSelf = isCurrentPos ? 'center' : (isLeft ? 'flex-start' : 'flex-end');
            
            const hasResident = !isCurrentPos && !isFog && (index % 3 !== 0) && card?.residentId;

            if (isCurrentPos) {
              return (
                <div key={`current-pos-${index}`} ref={el => cardsRef.current[index] = el} style={{ position: 'relative', width: cardWidth, alignSelf, zIndex: 10 }}>
                  <div style={{
                    position: 'relative', backgroundColor: mood.achievement, borderRadius: radius.md,
                    padding: '20px 16px', boxShadow: shadow.raised, minHeight: '120px',
                    display: 'flex', flexDirection: 'column', zIndex: 11
                  }}>
                    <h3 style={{ margin: '0 0 4px', fontSize: '16px', color: '#FFF', fontFamily: font.family, fontWeight: font.weight.semibold, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <FlagIcon /> 目前位置
                    </h3>
                    <p style={{ margin: 0, fontSize: '13px', color: 'rgba(255,255,255,0.9)', fontFamily: font.family, lineHeight: font.lineHeight }}>
                      準備好擲骰子了嗎？
                    </p>
                    <img 
                      src={getResidentImageUrl('Yaya.png')} 
                      alt="Yaya"
                      style={{ 
                        position: 'absolute', bottom: '0', right: '16px', height: '65%', objectFit: 'contain',
                        transform: animState === 'JUMPING' ? 'translateY(-10px) scale(1.1)' : 'none',
                        transition: 'transform 0.15s ease'
                      }}
                    />
                  </div>
                </div>
              );
            }

            if (isFog) {
              return (
                <div key={`fog-${index}`} ref={el => cardsRef.current[index] = el} style={{ position: 'relative', width: cardWidth, alignSelf, zIndex: 5 }}>
                  <div style={{
                    backgroundColor: '#D8D4CC', borderRadius: radius.md, minHeight: '100px', position: 'relative',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 6
                  }}>
                    <div style={{ position: 'absolute', top: '-10px', left: '-10px', width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#B0A89A', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: font.weight.bold, fontFamily: font.family }}>
                      {index + 1}
                    </div>
                    <span style={{ fontSize: '48px', color: '#B0A89A', opacity: 0.5, fontWeight: 'bold' }}>?</span>
                  </div>
                </div>
              );
            }

            if (card) {
              const isReward = card.type === 'reward';
              const borderColor = card.rarity ? rarity[card.rarity] : rarity.common;
              const bgColor = isReward ? hexToRgba(borderColor, 0.12) : '#D8D4CC';

              return (
                <div key={`card-${card.id}-${index}`} ref={el => cardsRef.current[index] = el} style={{ position: 'relative', width: cardWidth, alignSelf, zIndex: 10 }}>
                  <div style={{
                    position: 'relative', backgroundColor: bgColor, borderRadius: radius.md,
                    padding: '20px 16px', boxShadow: shadow.card, border: isReward ? `2px solid ${borderColor}` : 'none',
                    minHeight: '100px', display: 'flex', flexDirection: 'column', zIndex: 11
                  }}>
                    <div style={{
                      position: 'absolute', top: '-10px', left: '-10px',
                      width: '24px', height: '24px', borderRadius: '50%',
                      backgroundColor: isReward ? borderColor : '#B0A89A', color: '#FFF', 
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '12px', fontWeight: font.weight.bold, fontFamily: font.family, boxShadow: shadow.raised
                    }}>
                      {index + 1}
                    </div>

                    {isReward && (
                      <div style={{ position: 'absolute', top: '8px', right: '8px' }}>
                        <GiftIcon color={borderColor} />
                      </div>
                    )}

                    <h3 style={{ margin: '0 0 8px', fontSize: '15px', color: base.textPrimary, fontFamily: font.family, fontWeight: font.weight.semibold }}>
                      {card.title}
                    </h3>
                    <p style={{ margin: 0, fontSize: '12px', color: base.textSecondary, fontFamily: font.family, lineHeight: font.lineHeight }}>
                      {card.description}
                    </p>
                  </div>

                  {hasResident && (
                    <img 
                      src={getResidentImageUrl(card.residentId!)} 
                      alt="Resident"
                      style={{
                        position: 'absolute', top: '50%',
                        ...(isLeft ? { left: 'calc(100% + 12px)' } : { right: 'calc(100% + 12px)' }),
                        transform: `translateY(-50%) translateY(${index % 2 === 0 ? 12 : -12}px)`,
                        width: '80px', height: '80px', objectFit: 'contain', zIndex: 9
                      }}
                    />
                  )}
                </div>
              );
            }
            return null;
          })}
        </div>
      </div>

      {/* 底部操作區 */}
      <div style={{
        position: 'fixed',
        bottom: 'calc(var(--safe-bottom, 0px) + 56px)',
        left: 0, right: 0,
        backgroundColor: base.bg,
        borderTop: `1px solid ${base.border}`,
        padding: '16px 24px 24px 24px', // 墊高 padding-bottom 避免裁切
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 30,
        boxShadow: '0 -4px 12px rgba(0,0,0,0.03)'
      }}>
        {/* 左側佔位 */}
        <div style={{ width: '64px' }} />

        {/* 中間骰子 */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ position: 'relative', width: '80px', height: '80px', marginBottom: '8px' }}>
            <svg style={{ position: 'absolute', top: '-4px', left: '-4px', width: '88px', height: '88px', transform: 'rotate(-90deg)' }}>
              <circle cx="44" cy="44" r="40" fill="none" stroke={base.border} strokeWidth="4" />
              <circle 
                cx="44" cy="44" r="40" 
                fill="none" 
                stroke={base.brandSprout} 
                strokeWidth="4"
                strokeDasharray="251.2"
                strokeDashoffset={251.2 * (1 - energy / totalEnergy)}
                style={{ transition: 'stroke-dashoffset 0.3s ease' }}
              />
            </svg>
            
            <style>{`
              @keyframes diceRoll {
                0% { transform: scale(1) rotate(0deg); }
                20% { transform: scale(1.2) translateY(-20px) rotate(45deg); }
                50% { transform: scale(1.1) translateY(-10px) rotate(180deg); }
                80% { transform: scale(1.05) translateY(-5px) rotate(315deg); }
                100% { transform: scale(1) rotate(360deg); }
              }
              .dice-rolling {
                animation: diceRoll 1.2s cubic-bezier(0.25, 1, 0.5, 1) forwards;
              }
            `}</style>
            
            <button 
              onClick={handleDraw}
              disabled={!isEnergyEnough || animState !== 'IDLE'}
              className={animState === 'ROLLING' ? 'dice-rolling' : ''}
              style={{
                position: 'absolute',
                top: 0, left: 0, width: '80px', height: '80px',
                borderRadius: '50%',
                backgroundColor: base.card,
                border: 'none',
                boxShadow: shadow.raised,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: isEnergyEnough && animState === 'IDLE' ? 'pointer' : 'not-allowed',
                opacity: isEnergyEnough ? 1 : 0.5,
                zIndex: 35
              }}
            >
              <span style={{ fontSize: '36px' }}>
                {animState === 'SHOW_RESULT' || animState === 'JUMPING' ? rollResult : '🎲'}
              </span>
              
              {/* 顯示 +N 步大字 */}
              {(animState === 'SHOW_RESULT' || animState === 'JUMPING') && (
                <div style={{
                  position: 'absolute', top: '-40px', left: '50%', transform: 'translateX(-50%)',
                  backgroundColor: base.brandSprout, color: '#FFF', padding: '4px 12px',
                  borderRadius: radius.pill, fontSize: '14px', fontWeight: 'bold',
                  boxShadow: shadow.raised, whiteSpace: 'nowrap',
                  animation: 'jumpText 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards'
                }}>
                  +{rollResult} 步!
                </div>
              )}
            </button>
            <style>{`
              @keyframes jumpText {
                from { opacity: 0; transform: translate(-50%, 10px) scale(0.5); }
                to { opacity: 1; transform: translate(-50%, 0) scale(1); }
              }
            `}</style>
          </div>
          <div style={{ fontSize: '12px', color: base.textSecondary, fontFamily: font.family, textAlign: 'center' }}>
            {isEnergyEnough ? `每次擲骰消耗 ${game.energyPerRoll} 能量` : c.energyNotEnough}
          </div>
        </div>

        {/* 右側易經卜卦鈕 */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '64px' }}>
          <button style={{
            width: '48px', height: '48px',
            borderRadius: '50%',
            backgroundColor: base.card,
            border: `1px solid ${base.border}`,
            boxShadow: shadow.card,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
            color: base.textPrimary,
            marginBottom: '4px'
          }}>
            <IChingIcon />
          </button>
          <span style={{ fontSize: '10px', color: base.textSecondary, whiteSpace: 'nowrap' }}>今日易經卜卦</span>
        </div>
      </div>

      <BottomNav />

      {/* 動畫覆蓋層 (攔截點擊進行 Skip) */}
      {animState !== 'IDLE' && animState !== 'SETTLEMENT' && (
        <div onClick={handleSkip} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 100, cursor: 'pointer' }} />
      )}

      {/* 獎勵結算卡 Dialog */}
      {animState === 'SETTLEMENT' && pendingCards.length > 0 && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 200,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px'
        }} onClick={() => setAnimState('IDLE')}>
          <div style={{
            backgroundColor: base.card, borderRadius: radius.lg, padding: '32px 24px',
            width: '100%', maxWidth: '320px', textAlign: 'center', boxShadow: shadow.raised
          }} onClick={e => e.stopPropagation()}>
            <h2 style={{ margin: '0 0 16px', fontSize: '20px', color: base.textPrimary }}>抵達新位置！</h2>
            <div style={{ 
              backgroundColor: hexToRgba(rarity[pendingCards[pendingCards.length-1].rarity || 'common'], 0.12),
              padding: '16px', borderRadius: radius.md, marginBottom: '24px'
            }}>
              <h3 style={{ margin: '0 0 8px', fontSize: '16px' }}>{pendingCards[pendingCards.length-1].title}</h3>
              <p style={{ margin: 0, fontSize: '14px', color: base.textSecondary }}>{pendingCards[pendingCards.length-1].description}</p>
            </div>
            <button 
              onClick={() => {
                setDrawnCards(prev => [...prev, ...pendingCards]);
                setPendingCards([]);
                setYayaJumpIndex(-1);
                setAnimState('IDLE');
              }}
              style={{
                width: '100%', padding: '14px', borderRadius: radius.md,
                backgroundColor: base.textPrimary, color: '#FFF', border: 'none',
                fontSize: '16px', fontWeight: 'bold', cursor: 'pointer'
              }}
            >
              繼續前進
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
