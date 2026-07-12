import { useNavigate, useLocation } from 'react-router-dom'
import { base, font } from '../styles/tokens'
import { copy } from '../copy/zh-TW'

// ── SVG Icons ─────────────────────────────────────────────────

const IconHome = ({ active }: { active: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      d="M3 10.5L12 3L21 10.5V20C21 20.55 20.55 21 20 21H15V15H9V21H4C3.45 21 3 20.55 3 20V10.5Z"
      stroke={active ? base.brandSprout : base.textSecondary}
      strokeWidth="1.8"
      fill={active ? base.brandSprout + '22' : 'none'}
      strokeLinejoin="round"
    />
  </svg>
)

const IconBoard = ({ active }: { active: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="3" width="7" height="7" rx="1.5" stroke={active ? base.brandSprout : base.textSecondary} strokeWidth="1.8" fill={active ? base.brandSprout + '22' : 'none'} />
    <rect x="14" y="3" width="7" height="7" rx="1.5" stroke={active ? base.brandSprout : base.textSecondary} strokeWidth="1.8" fill={active ? base.brandSprout + '22' : 'none'} />
    <rect x="3" y="14" width="7" height="7" rx="1.5" stroke={active ? base.brandSprout : base.textSecondary} strokeWidth="1.8" fill={active ? base.brandSprout + '22' : 'none'} />
    <rect x="14" y="14" width="7" height="7" rx="1.5" stroke={active ? base.brandSprout : base.textSecondary} strokeWidth="1.8" fill={active ? base.brandSprout + '22' : 'none'} />
  </svg>
)

const IconPlus = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <path d="M14 6V22M6 14H22" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
)

const IconAnalytics = ({ active }: { active: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <rect x="4" y="13" width="4" height="8" rx="1" stroke={active ? base.brandSprout : base.textSecondary} strokeWidth="1.8" fill={active ? base.brandSprout + '22' : 'none'} />
    <rect x="10" y="8" width="4" height="13" rx="1" stroke={active ? base.brandSprout : base.textSecondary} strokeWidth="1.8" fill={active ? base.brandSprout + '22' : 'none'} />
    <rect x="16" y="3" width="4" height="18" rx="1" stroke={active ? base.brandSprout : base.textSecondary} strokeWidth="1.8" fill={active ? base.brandSprout + '22' : 'none'} />
  </svg>
)

const IconProfile = ({ active }: { active: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="8" r="4" stroke={active ? base.brandSprout : base.textSecondary} strokeWidth="1.8" fill={active ? base.brandSprout + '22' : 'none'} />
    <path d="M4 20C4 16.69 7.58 14 12 14C16.42 14 20 16.69 20 20" stroke={active ? base.brandSprout : base.textSecondary} strokeWidth="1.8" strokeLinecap="round" />
  </svg>
)

// ── Component ─────────────────────────────────────────────────

const tabs = [
  { key: 'home', path: '/home', Icon: IconHome },
  { key: 'board', path: '/board', Icon: IconBoard },
  { key: 'diary', path: '/diary/write', Icon: null }, // 中央凸起
  { key: 'analytics', path: '/analytics', Icon: IconAnalytics },
  { key: 'profile', path: '/profile', Icon: IconProfile },
] as const

export default function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()
  const nav = copy.home.nav

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: 'auto',
        paddingBottom: 'calc(12px + var(--safe-bottom))',
        backgroundColor: base.card,
        borderTop: `1px solid ${base.border}`,
        display: 'flex',
        justifyContent: 'center',
        zIndex: 100,
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '430px',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          padding: '0 8px',
        }}
      >
        {tabs.map(tab => {
          const active = location.pathname === tab.path ||
            (tab.key === 'home' && location.pathname === '/home')

          // 中央凸起的「＋日記」按鈕
          if (tab.key === 'diary') {
            return (
              <button
                key={tab.key}
                onClick={() => navigate(tab.path)}
                aria-label={nav.diary}
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  border: 'none',
                  backgroundColor: base.brandSprout,
                  boxShadow: '0 4px 16px rgba(143, 168, 118, 0.4)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: '-24px',
                  transition: 'transform 0.15s ease',
                  flexShrink: 0,
                }}
                onTouchStart={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(0.92)' }}
                onTouchEnd={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)' }}
              >
                <IconPlus />
              </button>
            )
          }

          const label = nav[tab.key as keyof typeof nav]
          return (
            <button
              key={tab.key}
              onClick={() => navigate(tab.path)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2px',
                padding: '4px 0',
                minWidth: '48px',
                minHeight: '44px',
              }}
            >
              {tab.Icon && <tab.Icon active={active} />}
              <span
                style={{
                  fontSize: '10px',
                  fontFamily: font.family,
                  fontWeight: active ? font.weight.semibold : font.weight.regular,
                  color: active ? base.brandSprout : base.textSecondary,
                  lineHeight: 1.4,
                }}
              >
                {label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
