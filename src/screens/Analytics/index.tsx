import React from 'react';
import BottomNav from '../../components/BottomNav';
import { base, font, radius, shadow, mood } from '../../styles/tokens';
import { copy } from '../../copy/zh-TW';
import { analyticsService } from '../../services/analytics';
import type { UserPlan } from '../../fixtures/analytics';
import bgImage from '../../assets/backgrounds/Background.png';

const c = copy.analytics;
const data = analyticsService.getAnalytics();
const plan: UserPlan = analyticsService.getUserPlan();

/* ──────────── helpers ──────────── */

function hexToRgba(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/* ──────────── SVG Radar ──────────── */

function RadarChart({ axes, size = 200 }: { axes: { label: string; value: number }[]; size?: number }) {
  const cx = size / 2;
  const cy = size / 2;
  const maxR = size * 0.38;
  const n = axes.length;
  const angleStep = (2 * Math.PI) / n;
  const startAngle = -Math.PI / 2;

  const getPoint = (i: number, r: number): [number, number] => {
    const angle = startAngle + i * angleStep;
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
  };

  // grid rings
  const rings = [0.25, 0.5, 0.75, 1.0];
  const gridLines = rings.map((pct) => {
    const pts = axes.map((_, i) => getPoint(i, maxR * pct));
    return pts.map((p) => `${p[0]},${p[1]}`).join(' ');
  });

  // axis lines
  const axisLines = axes.map((_, i) => getPoint(i, maxR));

  // data polygon
  const dataPts = axes.map((a, i) => getPoint(i, maxR * (a.value / 100)));
  const dataPath = dataPts.map((p) => `${p[0]},${p[1]}`).join(' ');

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* grid */}
      {gridLines.map((pts, i) => (
        <polygon key={i} points={pts} fill="none" stroke={base.border} strokeWidth="0.8" />
      ))}
      {/* axis lines */}
      {axisLines.map(([x, y], i) => (
        <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke={base.border} strokeWidth="0.8" />
      ))}
      {/* data area */}
      <polygon points={dataPath} fill={hexToRgba(mood.calm, 0.2)} stroke={mood.calm} strokeWidth="2" />
      {/* dots */}
      {dataPts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3" fill={mood.calm} />
      ))}
      {/* labels */}
      {axes.map((a, i) => {
        const [lx, ly] = getPoint(i, maxR + 18);
        return (
          <text
            key={i}
            x={lx}
            y={ly}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="12"
            fill={base.textPrimary}
            fontFamily={font.family}
          >
            {a.label}
          </text>
        );
      })}
    </svg>
  );
}

/* ──────────── Blur Gate ──────────── */

function BlurGate({ locked, label, children }: { locked: boolean; label: string; children: React.ReactNode }) {
  if (!locked) return <>{children}</>;
  return (
    <div style={{ position: 'relative' }}>
      <div style={{ filter: 'blur(6px)', pointerEvents: 'none', userSelect: 'none' }}>
        {children}
      </div>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 5,
        }}
      >
        <button
          style={{
            backgroundColor: base.card,
            border: `1.5px solid ${base.border}`,
            borderRadius: radius.pill,
            padding: '10px 20px',
            fontSize: '14px',
            fontWeight: font.weight.medium,
            color: base.textPrimary,
            fontFamily: font.family,
            boxShadow: shadow.raised,
            cursor: 'pointer',
          }}
        >
          {label}
        </button>
      </div>
    </div>
  );
}

/* ──────────── Bank Icon SVG ──────────── */

const BankIcon = () => (
  <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
    <rect x="4" y="44" width="48" height="6" rx="2" fill={base.border} />
    <rect x="8" y="22" width="6" height="22" rx="1" fill="#C4BBA8" />
    <rect x="18" y="22" width="6" height="22" rx="1" fill="#C4BBA8" />
    <rect x="32" y="22" width="6" height="22" rx="1" fill="#C4BBA8" />
    <rect x="42" y="22" width="6" height="22" rx="1" fill="#C4BBA8" />
    <path d="M4 22 L28 6 L52 22 Z" fill={mood.achievement} opacity="0.7" />
    <rect x="2" y="20" width="52" height="4" rx="1" fill={base.textPrimary} opacity="0.15" />
    <circle cx="28" cy="14" r="4" fill={mood.achievement} />
    <text x="28" y="16" textAnchor="middle" fontSize="6" fill="#FFF" fontWeight="bold">$</text>
  </svg>
);

/* ──────────── Main Screen ──────────── */

export default function AnalyticsScreen() {
  const canSeeRadar = plan === 'plus' || plan === 'pro';
  const canSeeAI = plan === 'pro';

  const painColors = ['#8C7B6B', '#A89888', '#C4B8A8'];

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
        paddingBottom: `calc(80px + max(24px, env(safe-area-inset-bottom)))`,
        overflowX: 'hidden',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <div className="app-container" style={{ padding: '32px 20px 24px' }}>
        {/* ═══════ 1) 頁首 ═══════ */}
        <h1
          style={{
            margin: '0 0 4px',
            fontSize: `${font.size.title}px`,
            fontWeight: font.weight.semibold,
            color: base.textPrimary,
            fontFamily: font.family,
          }}
        >
          {c.title}
        </h1>
        <p
          style={{
            margin: '0 0 24px',
            fontSize: `${font.size.caption}px`,
            color: base.textSecondary,
            fontFamily: font.family,
            lineHeight: font.lineHeight,
          }}
        >
          {c.subtitle}
        </p>

        {/* ═══════ 2) 銀行存摺卡 ═══════ */}
        <div
          style={{
            backgroundColor: base.card,
            borderRadius: radius.lg,
            boxShadow: shadow.card,
            padding: '24px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '20px',
          }}
        >
          <BankIcon />
          <div>
            <div
              style={{
                fontSize: `${font.size.caption}px`,
                color: base.textSecondary,
                fontFamily: font.family,
                marginBottom: '2px',
              }}
            >
              {c.bankCardDeposited}
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
              <span
                style={{
                  fontSize: '32px',
                  fontWeight: 700,
                  color: base.textPrimary,
                  fontFamily: font.family,
                }}
              >
                {data.diaryCount}
              </span>
              <span
                style={{
                  fontSize: `${font.size.body}px`,
                  color: base.textPrimary,
                  fontFamily: font.family,
                }}
              >
                {c.bankCardUnit}
              </span>
            </div>
            <div
              style={{
                fontSize: `${font.size.caption}px`,
                color: base.textSecondary,
                fontFamily: font.family,
                marginTop: '2px',
              }}
            >
              {c.bankCardStreak(data.streakDays)}
            </div>
          </div>
        </div>

        {/* ═══════ 3) 忍受地圖卡 ═══════ */}
        <div
          style={{
            backgroundColor: base.card,
            borderRadius: radius.lg,
            boxShadow: shadow.card,
            padding: '24px 20px',
            marginBottom: '20px',
          }}
        >
          {/* header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <h2
              style={{
                margin: 0,
                fontSize: `${font.size.section}px`,
                fontWeight: font.weight.semibold,
                color: base.textPrimary,
                fontFamily: font.family,
              }}
            >
              {c.enduranceTitle}
            </h2>
            <span
              style={{
                fontSize: '11px',
                fontWeight: font.weight.semibold,
                color: '#FFF',
                backgroundColor: mood.calm,
                borderRadius: radius.pill,
                padding: '2px 8px',
                fontFamily: font.family,
              }}
            >
              Plus {canSeeRadar ? '✓' : ''}
            </span>
          </div>

          {/* a. 雷點 TOP 3 — 免費可見 */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
            {data.topPains.map((pain, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: painColors[i],
                  color: '#FFF',
                  borderRadius: radius.md,
                  padding: '12px 16px',
                  flex: i === 0 ? '1 1 100%' : '1 1 40%',
                  fontSize: i === 0 ? '15px' : '14px',
                  fontWeight: font.weight.semibold,
                  fontFamily: font.family,
                  minHeight: i === 0 ? '56px' : '48px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {pain.label}
              </div>
            ))}
          </div>

          {/* b. 共鳴句 — 免費可見 */}
          <p
            style={{
              margin: '0 0 20px',
              fontSize: '15px',
              color: base.textPrimary,
              fontFamily: font.family,
              lineHeight: font.lineHeight,
              fontWeight: font.weight.medium,
            }}
          >
            {data.resonanceLine}
          </p>

          {/* c+d gated area */}
          <BlurGate locked={!canSeeRadar} label={c.unlockPlus}>
            {/* c. 壓力雷達圖 */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '16px',
                alignItems: 'flex-start',
                marginBottom: '16px',
              }}
            >
              <div style={{ flex: '1 1 180px', display: 'flex', justifyContent: 'center' }}>
                <RadarChart axes={data.radarData} size={180} />
              </div>

              {/* d. 高頻關鍵字 */}
              <div style={{ flex: '1 1 140px' }}>
                <h3
                  style={{
                    margin: '0 0 8px',
                    fontSize: `${font.size.body}px`,
                    fontWeight: font.weight.semibold,
                    color: base.textPrimary,
                    fontFamily: font.family,
                  }}
                >
                  {c.keywordsTitle}
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {data.keywords.map((kw, i) => (
                    <span
                      key={i}
                      style={{
                        display: 'inline-block',
                        backgroundColor: hexToRgba(mood.achievement, 0.15),
                        border: `1px solid ${hexToRgba(mood.achievement, 0.3)}`,
                        borderRadius: radius.pill,
                        padding: '6px 14px',
                        fontSize: `${11 + kw.weight}px`,
                        fontWeight: kw.weight >= 4 ? font.weight.semibold : font.weight.medium,
                        color: base.textPrimary,
                        fontFamily: font.family,
                      }}
                    >
                      {kw.text}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </BlurGate>

          {/* e. 底注 */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '16px',
              flexWrap: 'wrap',
              gap: '8px',
            }}
          >
            <span
              style={{
                fontSize: `${font.size.caption}px`,
                color: base.textSecondary,
                fontFamily: font.family,
              }}
            >
              {c.statsNote(data.diaryCount)}
            </span>
            <button
              style={{
                background: 'none',
                border: 'none',
                fontSize: `${font.size.caption}px`,
                color: base.brandSprout,
                fontWeight: font.weight.medium,
                fontFamily: font.family,
                cursor: 'pointer',
                padding: 0,
              }}
            >
              {c.detailLink}
            </button>
          </div>
        </div>

        {/* ═══════ 4) AI 職涯探索報告卡 ═══════ */}
        <div
          style={{
            backgroundColor: base.card,
            borderRadius: radius.lg,
            boxShadow: shadow.card,
            padding: '24px 20px',
            marginBottom: '20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <h2
              style={{
                margin: 0,
                fontSize: `${font.size.section}px`,
                fontWeight: font.weight.semibold,
                color: base.textPrimary,
                fontFamily: font.family,
              }}
            >
              {c.aiTitle}
            </h2>
            <span
              style={{
                fontSize: '11px',
                fontWeight: font.weight.semibold,
                color: '#FFF',
                backgroundColor: mood.depressed,
                borderRadius: radius.pill,
                padding: '2px 8px',
                fontFamily: font.family,
              }}
            >
              Pro {canSeeAI ? '✓' : ''}
            </span>
          </div>

          <BlurGate locked={!canSeeAI} label={c.unlockPro}>
            <div
              style={{
                display: 'flex',
                gap: '12px',
                overflowX: 'auto',
                paddingBottom: '4px',
              }}
            >
              {data.aiReports.map((report, i) => (
                <div
                  key={i}
                  style={{
                    flex: '0 0 240px',
                    backgroundColor: base.bg,
                    borderRadius: radius.md,
                    padding: '16px',
                    border: `1px solid ${base.border}`,
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <span style={{ fontSize: '28px', marginBottom: '8px' }}>{report.icon}</span>
                  <h3
                    style={{
                      margin: '0 0 8px',
                      fontSize: '14px',
                      fontWeight: font.weight.semibold,
                      color: base.textPrimary,
                      fontFamily: font.family,
                    }}
                  >
                    {report.title}
                  </h3>
                  <p
                    style={{
                      margin: '0 0 12px',
                      fontSize: `${font.size.caption}px`,
                      color: base.textSecondary,
                      fontFamily: font.family,
                      lineHeight: font.lineHeight,
                      flex: 1,
                    }}
                  >
                    {report.summary}
                  </p>
                  <button
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: `${font.size.caption}px`,
                      color: base.brandSprout,
                      fontWeight: font.weight.medium,
                      fontFamily: font.family,
                      cursor: 'pointer',
                      padding: 0,
                      textAlign: 'left',
                    }}
                  >
                    {c.aiViewFull}
                  </button>
                </div>
              ))}
            </div>
          </BlurGate>
        </div>

        {/* ═══════ 5) 當你準備好了 ═══════ */}
        <div style={{ marginBottom: '24px' }}>
          <h2
            style={{
              margin: '0 0 12px',
              fontSize: `${font.size.section}px`,
              fontWeight: font.weight.semibold,
              color: base.textPrimary,
              fontFamily: font.family,
            }}
          >
            {c.guideTitle}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
            {[
              { icon: '💼', label: '職涯諮詢' },
              { icon: '❤️', label: '心理支持' },
              { icon: '⚖️', label: '勞基法資源' },
              { icon: '🔎', label: '求職平台' },
            ].map((entry, i) => (
              <button
                key={i}
                onClick={() => alert(c.guideSoon)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: base.card,
                  border: `1px solid ${base.border}`,
                  borderRadius: radius.md,
                  padding: '16px 8px',
                  cursor: 'pointer',
                  fontFamily: font.family,
                }}
              >
                <span style={{ fontSize: '28px' }}>{entry.icon}</span>
                <span
                  style={{
                    fontSize: '12px',
                    color: base.textPrimary,
                    fontWeight: font.weight.medium,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {entry.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
