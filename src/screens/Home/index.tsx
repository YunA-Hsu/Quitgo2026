import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { base, mood, font, shadow, radius } from '../../styles/tokens'
import { copy } from '../../copy/zh-TW'
import BottomNav from '../../components/BottomNav'
import DateStrip from '../../components/DateStrip'
import MoodBall from '../../components/MoodBall'
import type { MoodKey } from '../../styles/tokens'

// ── 素材 ──────────────────────────────────────────────────────
import bgImage from '../../assets/backgrounds/Background.png'
import yaYaImg from '../../assets/characters/Yaya.png'
import notificationIcon from '../../assets/icons/notification.png'
import noteIcon from '../../assets/icons/NOTE.png'
import coinJarImg from '../../assets/icons/Coin jar.png'
import coinImg from '../../assets/icons/Coin.png'
import coinPileImg from '../../assets/icons/Coins.png'

import { homeService } from '../../services/home'

// ── Mock 資料（V1 靜態，後端接手後替換）──────────────────────

// 模擬本週每天的已記錄心情色（null = 未記錄）
const MOCK_WEEK_MOODS: (MoodKey | null)[] = [
  'achievement',  // 週一
  'calm',         // 週二
  'ordinary',     // 週三
  'happy',        // 週四
  null,           // 週五（未記錄）
  null,           // 週六
  null,           // 週日
]

// 根據 MOCK_WEEK_MOODS 產生 mockMoodData (以本週為準)
function getMockMoodData() {
  const data: Record<string, MoodKey> = {}
  const now = new Date()
  const dayOfWeek = now.getDay()
  const monday = new Date(now)
  monday.setDate(now.getDate() - ((dayOfWeek + 6) % 7))
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    const yyyy = d.getFullYear()
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    const dateStr = `${yyyy}-${mm}-${dd}`
    if (MOCK_WEEK_MOODS[i]) {
      data[dateStr] = MOCK_WEEK_MOODS[i] as MoodKey
    }
  }
  return data
}
const mockMoodData = getMockMoodData()

const MOCK_BOARD_CELLS = [
  { id: 10, name: '無效會議城', visited: true },
  { id: 11, name: '小確幸便利店', visited: true },
  { id: 12, name: '目前位置', visited: true, current: true },
  { id: 13, name: '未知', visited: false },
  { id: 14, name: '未知', visited: false },
]
const MOCK_DETECTED_MOOD: MoodKey = 'hurt'
const MOCK_WEEKLY_RANGE = '5/12 — 5/18'
const MOCK_TOP_EMOTION: MoodKey = 'hurt'
const MOCK_TOP_EMOTION_PERCENT = 32
const MOCK_TRIGGER = '主管臨時\n推翻提案'
const MOCK_AI_TIP = '臨時被打亂的提案讓你措手不及，也難怪了。休息時間，記得這不是你的問題，是節奏被打亂了。明天可以先確認會議時間是否還有調整空間。'
import { moodLabels } from '../../styles/tokens'

// ── 金幣罐插圖（PNG 圖檔合成：罐子底 → 金幣堆 → 玻璃反光） ──
function CoinIllustration() {
  // 罐身內部裁切（配合 Coin jar.png 玻璃瓶身，內縮 ~8%）
  const jarClip = 'polygon(24% 20%, 76% 20%, 80% 26%, 84% 40%, 86% 58%, 85% 76%, 82% 88%, 76% 96%, 24% 96%, 18% 88%, 15% 76%, 14% 58%, 16% 40%, 20% 26%)'

  return (
    <div style={{ width: '120px', height: '130px', position: 'relative', flexShrink: 0 }}>

      {/* ═══ Layer 1: 罐子底圖 ═══ */}
      <img
        src={coinJarImg}
        alt="金幣罐"
        style={{
          width: '100%', height: '100%',
          objectFit: 'contain',
          position: 'absolute', top: 0, left: 0,
        }}
      />

      {/* ═══ Layer 2: 金幣堆（被 clip-path 裁切在罐身內） ═══ */}
      <div style={{
        position: 'absolute', top: 0, left: 0,
        width: '100%', height: '100%',
        clipPath: jarClip,
        WebkitClipPath: jarClip,
      }}>
        {/* 金幣堆底部柔和陰影 */}
        <div style={{
          position: 'absolute',
          bottom: 'calc(4% - 10px)', left: '15%', right: '15%', height: '6%',
          borderRadius: '50%',
          background: 'rgba(0,0,0,0.06)',
          filter: 'blur(6px)',
        }} />

        {/* 整個金幣堆插圖 */}
        <img src={coinPileImg} alt="" style={{
          position: 'absolute',
          left: '50%', bottom: 'calc(4% - 10px)',
          width: '114%',
          transform: 'translateX(-50%) scale(0.95)',
          objectFit: 'contain',
          filter: 'brightness(1.12) saturate(1.08)',
        }} />
      </div>

      {/* ═══ Layer 3: 玻璃反光覆蓋（在金幣上方） ═══ */}
      <div style={{
        position: 'absolute', top: 0, left: 0,
        width: '100%', height: '100%',
        clipPath: jarClip,
        WebkitClipPath: jarClip,
        background: `
          linear-gradient(90deg,
            transparent 22%,
            rgba(255,255,255,0.28) 26%,
            rgba(255,255,255,0.12) 30%,
            transparent 34%,
            transparent 36%,
            rgba(255,255,255,0.15) 38%,
            transparent 42%,
            transparent 66%,
            rgba(255,255,255,0.10) 70%,
            transparent 74%
          )
        `,
        pointerEvents: 'none',
      }} />
    </div>
  )
}

// ── 共用按鈕樣式 ──────────────────────────────────────────────
const UNIFIED_BTN_HEIGHT = '44px'
const UNIFIED_BTN_RADIUS = radius.lg

// ── 共用卡片 ──────────────────────────────────────────────────
const cardStyle: React.CSSProperties = {
  backgroundColor: base.card,
  borderRadius: radius.lg,
  boxShadow: shadow.card,
  padding: '16px',
  width: '100%',
}

// ═════════════════════════════════════════════════════════════
export default function HomeScreen() {
  const navigate = useNavigate()
  const c = copy.home

  // State for greeting text and button
  const [promptText, setPromptText] = useState<string>(c.todayPrompt)
  const [canRecord, setCanRecord] = useState(true)
  
  // Track selected date for Energy Jar & Mood Tally
  const todayStr = new Date().toISOString().split('T')[0]
  const [selectedDateStr, setSelectedDateStr] = useState(todayStr)

  const wallet = homeService.getWalletInfo()
  const moodTally = homeService.getMoodTally(selectedDateStr)
  // 固定顯示順序
  const MOODS_ORDER: MoodKey[] = ['happy', 'calm', 'ordinary', 'achievement', 'depressed', 'hurt', 'angry']

  const handleDateClick = (dateStr: string, recorded: boolean, canBackfill: boolean, isToday: boolean) => {
    setSelectedDateStr(dateStr)
    
    if (recorded) {
      navigate('/diary')
    } else if (canBackfill) {
      setPromptText(isToday ? c.todayPrompt : copy.dateStrip.backfillPrompt)
      setCanRecord(true)
    } else {
      setPromptText(copy.dateStrip.futurePlaceholder)
      setCanRecord(false)
    }
  }

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
        justifyContent: 'center',
      }}
    >
      <div
        className="app-container"
        style={{
          paddingBottom: 'calc(80px + var(--safe-bottom))',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >

        {/* ━━━ 1. 頂部招呼列（左對齊）━━━━━━━━━━━━━━━━━━━━━━━ */}
        <div
          className="fade-in-up"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <button
            onClick={() => navigate('/profile')}
            aria-label="個人資料"
            style={{
              background: 'none', border: 'none', padding: 0, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '12px', minHeight: '44px',
            }}
          >
            <div
              style={{
                width: '52px', height: '52px', borderRadius: '50%',
                overflow: 'hidden', border: `2px solid ${base.brandSprout}`, flexShrink: 0,
                backgroundColor: base.card,
              }}
            >
              <img src={yaYaImg} alt="阿芽" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            {/* 修改1：文字向左對齊 */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <span style={{
                fontSize: '22px', fontWeight: font.weight.semibold,
                color: base.textPrimary, fontFamily: font.family, lineHeight: 1.3,
                textAlign: 'left',
              }}>
                {c.greeting}
              </span>
              <span style={{
                fontSize: font.size.caption, color: canRecord ? base.accentCoral : base.textSecondary,
                fontFamily: font.family, lineHeight: font.lineHeight,
                textAlign: 'left',
                transition: 'color 0.2s',
              }}>
                {promptText}
              </span>
            </div>
          </button>

          <button
            onClick={() => navigate('/notifications')}
            aria-label="通知"
            style={{
              background: 'none', border: 'none', padding: '8px', cursor: 'pointer',
              minWidth: '44px', minHeight: '44px', display: 'flex',
              alignItems: 'center', justifyContent: 'center', position: 'relative',
            }}
          >
            <img src={notificationIcon} alt="通知" style={{ width: '26px', height: '26px', opacity: 0.6 }} />
            <div style={{
              position: 'absolute', top: '6px', right: '6px',
              width: '8px', height: '8px', borderRadius: '50%',
              backgroundColor: base.accentCoral,
            }} />
          </button>
        </div>

        {/* ━━━ 2. 日曆列（Date Strip）━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <div className="fade-in-up fade-in-up-delay-1" style={{ position: 'relative' }}>
          <DateStrip 
            moodData={mockMoodData} 
            onDateClick={handleDateClick}
          />
        </div>

        {/* ━━━ 3. 記錄操作列（日記本左上 + 按鈕置中）━━━━━ */}
        <div
          className="fade-in-up fade-in-up-delay-1"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <button
            onClick={() => navigate('/diary')}
            style={{
              background: 'none', border: 'none', padding: 0, cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
              minWidth: '48px', minHeight: '44px', flexShrink: 0,
            }}
          >
            <img src={noteIcon} alt="日記本" style={{ width: '32px', height: '32px', objectFit: 'contain', opacity: 0.65 }} />
            <span style={{
              fontSize: '10px', color: base.textSecondary,
              fontFamily: font.family, whiteSpace: 'nowrap',
            }}>
              我的日記本
            </span>
          </button>

          <button
            onClick={() => canRecord && navigate('/diary/write')}
            id="btn-record-today"
            style={{
              flex: 1, height: UNIFIED_BTN_HEIGHT,
              borderRadius: UNIFIED_BTN_RADIUS,
              border: 'none', backgroundColor: canRecord ? base.textPrimary : base.border,
              color: canRecord ? '#FFF' : base.textSecondary,
              fontFamily: font.family, fontSize: font.size.body,
              fontWeight: font.weight.medium, cursor: canRecord ? 'pointer' : 'not-allowed',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: canRecord ? shadow.raised : 'none',
              transition: 'all 0.2s',
            }}
            disabled={!canRecord}
          >
            {c.quickRecord}
          </button>
        </div>

        {/* ━━━ 4. 能量罐卡片（Energy Jar）━━━━━━━━━━━━━━━ */}
        <div className="fade-in-up fade-in-up-delay-2" style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* 修改4：CSS 金幣罐插圖 */}
            <CoinIllustration />

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{
                fontSize: font.size.caption, color: base.textSecondary,
                fontFamily: font.family,
              }}>
                {copy.energyJar.todayCoins}
              </span>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                <img src={coinImg} alt="金幣" style={{ width: '28px', height: '28px', objectFit: 'contain', transform: 'translateY(4px)' }} />
                <span style={{
                  fontSize: '40px', fontWeight: font.weight.semibold,
                  color: base.textPrimary, fontFamily: font.family, lineHeight: 1,
                }}>
                  {wallet.todayCoins}
                </span>
                <span style={{
                  fontSize: font.size.body, color: base.textSecondary,
                  fontFamily: font.family,
                }}>
                  /{wallet.todayCoinCap}
                </span>
              </div>
              
              <span style={{
                fontSize: '13px', color: base.textSecondary,
                fontFamily: font.family, marginTop: '-4px', marginBottom: '4px'
              }}>
                {copy.energyJar.totalCoins(wallet.totalCoins.toLocaleString())}
              </span>

              {/* 進度條 */}
              <div style={{
                width: '100%', height: '8px', borderRadius: '4px',
                backgroundColor: base.border, overflow: 'hidden',
              }}>
                <div style={{
                  width: `${(wallet.todayCoins / wallet.todayCoinCap) * 100}%`,
                  height: '100%', borderRadius: '4px',
                  backgroundColor: base.brandSprout,
                  transition: 'width 0.5s ease',
                }} />
              </div>
            </div>
          </div>

          {/* 七色心情盤點列 */}
          <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: `1px solid ${base.border}` }}>
            <span style={{
              fontSize: '12px', color: base.textSecondary,
              fontFamily: font.family, display: 'block', marginBottom: '12px'
            }}>
              {copy.energyJar.moodTallyTitle}
            </span>
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}>
              {MOODS_ORDER.map(key => {
                const count = moodTally[key] || 0
                return (
                  <div key={key} style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
                  }}>
                    <button
                      onClick={() => {
                        // onTapMood: 先留空
                      }}
                      style={{
                        background: 'none', border: 'none', padding: 0, margin: 0,
                        cursor: 'pointer',
                        width: '40px', height: '40px',
                        opacity: count > 0 ? 1 : 0.6,
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <MoodBall moodKey={key} size={40} />
                    </button>
                    <span style={{
                      fontSize: '12px', color: base.textPrimary,
                      fontFamily: font.family,
                      fontWeight: count > 0 ? font.weight.semibold : font.weight.regular,
                      opacity: count > 0 ? 1 : 0.6,
                    }}>
                      {count}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* ━━━ 5. 社畜大富翁卡片 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <div className="fade-in-up fade-in-up-delay-2" style={cardStyle}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginBottom: '12px',
          }}>
            <span style={{
              fontSize: font.size.section, fontWeight: font.weight.semibold,
              color: base.textPrimary, fontFamily: font.family,
            }}>
              {c.boardCardTitle}
            </span>
            <button
              onClick={() => navigate('/board')}
              style={{
                background: 'none', border: 'none', padding: '4px 0',
                cursor: 'pointer', fontSize: '12px', color: base.textSecondary,
                fontFamily: font.family, minHeight: '44px',
                display: 'flex', alignItems: 'center',
              }}
            >
              {c.boardViewMap}
            </button>
          </div>

          <div style={{
            display: 'flex', gap: '8px', overflowX: 'auto',
            paddingBottom: '4px', WebkitOverflowScrolling: 'touch',
          }}>
            {MOCK_BOARD_CELLS.map(cell => (
              <div
                key={cell.id}
                style={{
                  minWidth: '72px', padding: '10px 8px',
                  borderRadius: radius.md,
                  backgroundColor: cell.current ? base.card : base.bg,
                  border: cell.current ? `2px solid ${base.brandSprout}` : `1px solid ${base.border}`,
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', gap: '6px',
                  opacity: cell.visited ? 1 : 0.5,
                }}
              >
                <span style={{
                  fontSize: '14px', fontWeight: font.weight.semibold,
                  color: base.textPrimary, fontFamily: font.family,
                }}>
                  {cell.id}
                </span>
                {cell.current ? (
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '50%',
                    backgroundColor: base.brandSprout,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <circle cx="7" cy="4" r="3" fill="#FFFFFF" />
                      <path d="M3 12C3 9.79 4.79 8 7 8C9.21 8 11 9.79 11 12" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </div>
                ) : cell.visited ? (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <rect x="6" y="10" width="12" height="10" rx="1" stroke={base.textSecondary} strokeWidth="1.2" fill={base.border} />
                    <path d="M4 11L12 5L20 11" stroke={base.textSecondary} strokeWidth="1.2" strokeLinejoin="round" />
                    <rect x="10" y="15" width="4" height="5" rx="0.5" fill={base.card} />
                  </svg>
                ) : (
                  <span style={{ fontSize: '20px', fontWeight: font.weight.semibold, color: base.textSecondary, opacity: 0.5 }}>?</span>
                )}
                <span style={{
                  fontSize: '10px', color: cell.current ? base.brandSprout : base.textSecondary,
                  fontFamily: font.family, textAlign: 'center', lineHeight: 1.3,
                  fontWeight: cell.current ? font.weight.semibold : font.weight.regular,
                }}>
                  {cell.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ━━━ 前進大富翁按鈕（統一大小，置中）━━━━ */}
        <div
          className="fade-in-up fade-in-up-delay-3"
          style={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <button
            onClick={() => navigate('/board')}
            style={{
              width: '100%', height: UNIFIED_BTN_HEIGHT,
              borderRadius: UNIFIED_BTN_RADIUS,
              border: 'none', backgroundColor: base.brandSprout,
              color: '#FFFFFF', fontSize: '15px', fontWeight: font.weight.semibold,
              fontFamily: font.family, cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(143, 168, 118, 0.3)',
              transition: 'transform 0.1s ease',
              letterSpacing: '0.06em',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
            onTouchStart={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(0.96)' }}
            onTouchEnd={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)' }}
          >
            前進大富翁 {'>>'}
          </button>
        </div>

        {/* ━━━ 6. 情緒偵測卡 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <div
          className="fade-in-up fade-in-up-delay-3"
          style={{
            ...cardStyle,
            background: `linear-gradient(135deg, ${mood[MOCK_DETECTED_MOOD]}18, ${mood[MOCK_DETECTED_MOOD]}08)`,
            border: `1px solid ${mood[MOCK_DETECTED_MOOD]}33`,
            display: 'flex', alignItems: 'center', gap: '12px',
            cursor: 'pointer',
          }}
          onClick={() => navigate('/divination')}
        >
          <div style={{ flex: 1 }}>
            <p style={{
              margin: 0, fontSize: font.size.body,
              fontWeight: font.weight.semibold, color: base.textPrimary,
              fontFamily: font.family, lineHeight: font.lineHeight,
            }}>
              {c.emotionDetect}
              <span style={{ color: mood[MOCK_DETECTED_MOOD], fontWeight: font.weight.semibold }}>
                {moodLabels[MOCK_DETECTED_MOOD]}
              </span>
              {' 🌫'}
            </p>
            <p style={{
              margin: '4px 0 0', fontSize: font.size.caption,
              color: base.textSecondary, fontFamily: font.family,
              lineHeight: font.lineHeight,
            }}>
              {c.emotionDetectAction}
            </p>
          </div>
          <div style={{
            width: '52px', height: '52px', borderRadius: '50%',
            background: `linear-gradient(135deg, ${base.brandSprout}33, ${mood[MOCK_DETECTED_MOOD]}44)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, fontSize: '28px',
          }}>
            ☯
          </div>
        </div>

        {/* ━━━ 7. 本週前進總覽 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <div className="fade-in-up fade-in-up-delay-3" style={cardStyle}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginBottom: '14px',
          }}>
            <span style={{
              fontSize: font.size.section, fontWeight: font.weight.semibold,
              color: base.textPrimary, fontFamily: font.family,
            }}>
              {c.weeklySummaryTitle}
            </span>
            <span style={{
              fontSize: font.size.caption, color: base.textSecondary,
              fontFamily: font.family,
            }}>
              {MOCK_WEEKLY_RANGE}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '11px', color: base.textSecondary, fontFamily: font.family }}>
                {c.weeklySummaryEmotion}
              </span>
              <div style={{
                width: '56px', height: '56px', borderRadius: '50%',
                background: `conic-gradient(
                  ${mood[MOCK_TOP_EMOTION]} 0% ${MOCK_TOP_EMOTION_PERCENT}%,
                  ${mood.calm} ${MOCK_TOP_EMOTION_PERCENT}% ${MOCK_TOP_EMOTION_PERCENT + 22}%,
                  ${mood.happy} ${MOCK_TOP_EMOTION_PERCENT + 22}% ${MOCK_TOP_EMOTION_PERCENT + 42}%,
                  ${base.border} ${MOCK_TOP_EMOTION_PERCENT + 42}% 100%
                )`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  backgroundColor: base.card, display: 'flex',
                  flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span style={{ fontSize: '11px', fontWeight: font.weight.semibold, color: base.textPrimary, fontFamily: font.family, lineHeight: 1 }}>
                    {MOCK_TOP_EMOTION_PERCENT}%
                  </span>
                </div>
              </div>
              <span style={{
                fontSize: '11px', color: mood[MOCK_TOP_EMOTION],
                fontWeight: font.weight.semibold, fontFamily: font.family,
              }}>
                {moodLabels[MOCK_TOP_EMOTION]}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '11px', color: base.textSecondary, fontFamily: font.family, textAlign: 'center' }}>
                {c.weeklySummaryTrigger}
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                <span style={{ fontSize: '20px' }}>👥</span>
                <span style={{
                  fontSize: '12px', fontWeight: font.weight.semibold,
                  color: base.textPrimary, fontFamily: font.family,
                  textAlign: 'center', lineHeight: 1.4, whiteSpace: 'pre-line',
                }}>
                  {MOCK_TRIGGER}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontSize: '11px', color: base.textSecondary, fontFamily: font.family }}>
                {c.weeklySummaryAI} ✨
              </span>
              <p style={{
                margin: 0, fontSize: '10px', color: base.textPrimary,
                fontFamily: font.family, lineHeight: 1.6,
                display: '-webkit-box', WebkitLineClamp: 6,
                WebkitBoxOrient: 'vertical', overflow: 'hidden',
              }}>
                {MOCK_AI_TIP}
              </p>
            </div>
          </div>
        </div>

      </div>

      <BottomNav />
    </div>
  )
}
