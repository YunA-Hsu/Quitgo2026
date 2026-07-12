import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { base, font, radius, shadow } from '../../styles/tokens'
import { copy } from '../../copy/zh-TW'
import MoodBall from '../../components/MoodBall'
import type { MoodKey } from '../../styles/tokens'

// 模擬拿取日記內容
const MOCK_ENTRY = {
  id: '1',
  date: '2026年7月1日 週三 20:15',
  mood: 'calm' as MoodKey,
  tags: ['生活', '健康'],
  content: '今天在公園散步了一會兒，微風很舒服。\n原本煩躁的心情平靜了不少，希望明天也能保持。',
  coins: 10
}

export default function DiaryDetailScreen() {
  const { id: _id } = useParams()
  const navigate = useNavigate()
  const c = copy.diaryDetail

  const [showMenu, setShowMenu] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  // CSS 轉場：右滑入場
  const slideInStyle = {
    animation: 'slideInRight 0.3s ease-out forwards',
  }

  function handleRetract() {
    // TODO: 呼叫 API 刪除 / 收回
    navigate(-1) // 返回上一頁
  }

  return (
    <div
      style={{
        minHeight: '100dvh', width: '100%',
        backgroundColor: base.bg,
        display: 'flex', justifyContent: 'center',
        position: 'relative',
        ...slideInStyle
      }}
    >
      <style>
        {`
          @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0.5; }
            to { transform: translateX(0); opacity: 1; }
          }
        `}
      </style>

      <div
        className="app-container"
        style={{
          display: 'flex', flexDirection: 'column',
          backgroundColor: '#FDFBF5',
          boxShadow: shadow.raised
        }}
      >
        {/* ━━━ 頂部列：返回 + ⋯選單 ━━━━━━━━━━━━━━━━━━━━━━ */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 8px', borderBottom: `1px solid ${base.border}`
        }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              background: 'none', border: 'none', padding: '8px',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px'
            }}
          >
            <span style={{ fontSize: '18px', color: base.textSecondary }}>‹</span>
            <span style={{ fontSize: font.size.body, color: base.textSecondary, fontFamily: font.family }}>
              返回
            </span>
          </button>

          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              style={{
                background: 'none', border: 'none', padding: '8px 16px',
                cursor: 'pointer', fontSize: '18px', color: base.textSecondary,
                letterSpacing: '2px', fontWeight: 'bold'
              }}
            >
              ⋯
            </button>

            {/* ⋯選單 */}
            {showMenu && (
              <div style={{
                position: 'absolute', top: '40px', right: '8px',
                backgroundColor: base.card, borderRadius: radius.md,
                boxShadow: shadow.raised, padding: '8px 0',
                minWidth: '120px', zIndex: 10
              }}>
                <button
                  onClick={() => {
                    setShowMenu(false)
                    setShowConfirm(true)
                  }}
                  style={{
                    width: '100%', padding: '12px 16px', background: 'none', border: 'none',
                    textAlign: 'left', cursor: 'pointer', fontFamily: font.family,
                    fontSize: font.size.body, color: base.textPrimary,
                  }}
                >
                  {c.menuDelete}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ━━━ 日記內容 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <div style={{ padding: '24px 20px', flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: font.size.caption, color: base.textSecondary, fontFamily: font.family }}>
              {MOCK_ENTRY.date}
            </span>
            <MoodBall moodKey={MOCK_ENTRY.mood} size={40} />
          </div>

          {MOCK_ENTRY.tags.length > 0 && (
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {MOCK_ENTRY.tags.map(t => (
                <span key={t} style={{
                  padding: '4px 10px', borderRadius: radius.pill,
                  backgroundColor: `${base.brandSprout}15`,
                  color: base.brandSprout, fontSize: font.size.caption,
                  fontFamily: font.family
                }}>
                  #{t}
                </span>
              ))}
            </div>
          )}

          <p style={{
            margin: '8px 0 0', fontSize: font.size.body, color: base.textPrimary,
            lineHeight: 1.8, fontFamily: font.family, whiteSpace: 'pre-wrap'
          }}>
            {MOCK_ENTRY.content}
          </p>
          
          <div style={{ marginTop: 'auto', textAlign: 'center', opacity: 0.6 }}>
            <span style={{
               fontSize: font.size.caption, color: base.brandSprout, fontFamily: font.family,
               backgroundColor: `${base.brandSprout}10`, padding: '6px 12px', borderRadius: radius.pill
            }}>
              {c.coinNote(MOCK_ENTRY.coins)}
            </span>
          </div>
        </div>

        {/* 收回確認 Modal */}
        {showConfirm && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', zIndex: 100,
            backdropFilter: 'blur(2px)'
          }}>
            <div style={{
              backgroundColor: base.card, width: '80%', maxWidth: '320px',
              borderRadius: radius.lg, padding: '24px',
              display: 'flex', flexDirection: 'column', gap: '20px',
              boxShadow: shadow.raised
            }}>
              <p style={{
                margin: 0, fontSize: font.size.body, color: base.textPrimary,
                fontFamily: font.family, lineHeight: 1.6, textAlign: 'center'
              }}>
                {c.deleteConfirm}
              </p>
              
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => setShowConfirm(false)}
                  style={{
                    flex: 1, padding: '12px', borderRadius: radius.pill,
                    border: `1px solid ${base.border}`, background: 'none',
                    color: base.textPrimary, fontFamily: font.family, cursor: 'pointer'
                  }}
                >
                  {c.deleteNo}
                </button>
                <button
                  onClick={handleRetract}
                  style={{
                    flex: 1, padding: '12px', borderRadius: radius.pill,
                    border: 'none', backgroundColor: base.textSecondary,
                    color: '#FFF', fontFamily: font.family, cursor: 'pointer'
                  }}
                >
                  {c.deleteYes}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
