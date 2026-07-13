import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { base, mood, font, radius, shadow } from '../../styles/tokens'
import { copy } from '../../copy/zh-TW'
import type { MoodKey } from '../../styles/tokens'
import MoodBall from '../../components/MoodBall'

const MOOD_KEYS: MoodKey[] = ['happy', 'calm', 'ordinary', 'achievement', 'depressed', 'hurt', 'angry']

// ── 預設標籤 ──────────────────────────────────────────────────
const PRESET_TAGS = ['工作', '同事', '主管', '生活', '感情', '健康', '家人', '朋友', '理財', '自我成長']

// ═════════════════════════════════════════════════════════════
export default function DiaryEditorScreen() {
  const navigate = useNavigate()
  const c = copy.diary

  const now = new Date()
  const dateStr = `${now.getMonth() + 1}月${now.getDate()}日`
  const weekDay = c.weekDaysFull[now.getDay()]
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

  const [selectedMood, setSelectedMood] = useState<MoodKey | null>(null)
  const [content, setContent] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [showTagPicker, setShowTagPicker] = useState(false)
  const [customTagInput, setCustomTagInput] = useState('')

  // 動態背景色計算
  const bgGradient = useMemo(() => {
    if (!selectedMood) {
      return `linear-gradient(180deg, ${base.bg} 0%, ${base.bg} 100%)`
    }
    const moodColor = mood[selectedMood]
    // 由上往下漸層：心情色柔和→米色底
    return `linear-gradient(180deg, ${moodColor}30 0%, ${moodColor}12 40%, ${base.bg} 100%)`
  }, [selectedMood])

  // 方格筆記本紋路 CSS
  const gridPattern = `repeating-linear-gradient(
    0deg, transparent, transparent 23px, rgba(74,66,56,0.04) 23px, rgba(74,66,56,0.04) 24px
  ), repeating-linear-gradient(
    90deg, transparent, transparent 23px, rgba(74,66,56,0.04) 23px, rgba(74,66,56,0.04) 24px
  )`

  function toggleTag(tag: string) {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }

  function handleSave() {
    // TODO: 連接後端儲存
    navigate('/diary')
  }

  return (
    <div
      style={{
        minHeight: '100dvh', width: '100%',
        background: bgGradient,
        backgroundImage: gridPattern,
        transition: 'background 0.6s ease',
        display: 'flex', justifyContent: 'center',
      }}
    >
      <div
        className="app-container"
        style={{
          display: 'flex', flexDirection: 'column',
        }}
      >

        {/* ━━━ 頂部列：✕ + 日期時間 ━━━━━━━━━━━━━━━━━━━━━━ */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '8px 0',
        }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              background: 'none', border: 'none', padding: '10px',
              cursor: 'pointer', minWidth: '44px', minHeight: '44px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <line x1="4" y1="4" x2="16" y2="16" stroke={base.textPrimary} strokeWidth="2" strokeLinecap="round" />
              <line x1="16" y1="4" x2="4" y2="16" stroke={base.textPrimary} strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>

          <span style={{
            fontSize: font.size.caption, color: base.textSecondary,
            fontFamily: font.family, fontWeight: font.weight.regular,
          }}>
            {dateStr}{'　'}{weekDay}{'　'}{timeStr}
          </span>
        </div>

        {/* ━━━ 標題 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <div style={{ padding: '16px 8px 8px' }}>
          <h1 style={{
            margin: 0, fontSize: '22px', fontWeight: font.weight.semibold,
            color: base.textPrimary, fontFamily: font.family,
            lineHeight: 1.4,
          }}>
            {c.editorTitle}
          </h1>
        </div>

        {/* ━━━ 主要書寫區 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <div style={{ flex: 1, padding: '8px 8px', display: 'flex', flexDirection: 'column' }}>
          <div style={{
            display: 'flex', gap: '12px', flex: 1,
          }}>
            {/* 左側豎線（模擬筆記本邊線） */}
            <div style={{
              width: '3px', borderRadius: '2px',
              backgroundColor: selectedMood ? `${mood[selectedMood]}40` : base.border,
              transition: 'background-color 0.6s ease',
              flexShrink: 0,
            }} />

            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder={c.editorPlaceholder}
              style={{
                flex: 1, border: 'none', background: 'transparent',
                resize: 'none', outline: 'none',
                fontSize: font.size.body, lineHeight: 2,
                fontFamily: font.family, color: base.textPrimary,
                padding: '4px 0', minHeight: '200px',
              }}
            />
          </div>
        </div>

        {/* ━━━ 心情選擇器 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <div style={{ padding: '12px 4px 4px' }}>
          <p style={{
            margin: '0 0 10px', fontSize: font.size.body,
            color: base.textPrimary, fontFamily: font.family,
            fontWeight: font.weight.regular,
          }}>
            {c.editorMoodPrompt}
          </p>

          <div style={{
            display: 'flex', justifyContent: 'space-between',
            gap: '4px',
          }}>
            {MOOD_KEYS.map(key => {
              const isSelected = selectedMood === key
              return (
                <button
                  key={key}
                  onClick={() => setSelectedMood(isSelected ? null : key)}
                  style={{
                    background: 'none', border: 'none', padding: '4px',
                    cursor: 'pointer', display: 'flex', flexDirection: 'column',
                    alignItems: 'center', gap: '4px', minWidth: '44px',
                    transition: 'transform 0.15s ease',
                  }}
                >
                  <MoodBall moodKey={key} size={40} selected={isSelected} />
                  <span style={{
                    fontSize: '11px',
                    color: isSelected ? base.textPrimary : base.textSecondary,
                    fontFamily: font.family,
                    fontWeight: isSelected ? font.weight.semibold : font.weight.regular,
                    whiteSpace: 'nowrap',
                  }}>
                    {c.moodShortLabels[key]}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* ━━━ 標籤選擇 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <div style={{ padding: '12px 4px 8px' }}>
          <p style={{
            margin: '0 0 8px', fontSize: font.size.body,
            color: base.textPrimary, fontFamily: font.family,
          }}>
            {c.editorTagPrompt}
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {selectedTags.map(tag => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                style={{
                  padding: '6px 14px', borderRadius: radius.pill,
                  border: 'none',
                  backgroundColor: selectedMood ? `${mood[selectedMood]}25` : `${base.brandSprout}20`,
                  color: base.textPrimary,
                  fontSize: font.size.caption, fontFamily: font.family,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px',
                  transition: 'background-color 0.3s ease',
                }}
              >
                {tag} <span style={{ opacity: 0.5, fontSize: '11px' }}>✕</span>
              </button>
            ))}

            <button
              onClick={() => setShowTagPicker(!showTagPicker)}
              style={{
                padding: '6px 14px', borderRadius: radius.pill,
                border: `1px dashed ${base.border}`,
                backgroundColor: 'transparent',
                color: base.textSecondary,
                fontSize: font.size.caption, fontFamily: font.family,
                cursor: 'pointer',
              }}
            >
              {c.editorAddTag}
            </button>
          </div>

          {/* 標籤選擇面板 */}
          {showTagPicker && (
            <div style={{
              marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '6px',
              padding: '10px', borderRadius: radius.md,
              backgroundColor: `${base.card}CC`,
              backdropFilter: 'blur(8px)',
              alignItems: 'center',
            }}>
              {/* 自訂標籤輸入框 */}
              <input
                type="text"
                placeholder="輸入自訂標籤..."
                value={customTagInput}
                onChange={(e) => setCustomTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && customTagInput.trim()) {
                    e.preventDefault()
                    const newTag = customTagInput.trim()
                    if (!selectedTags.includes(newTag)) {
                      toggleTag(newTag)
                    }
                    setCustomTagInput('')
                    // 可以選擇輸入完後自動收合面板，或保持展開
                    // setShowTagPicker(false)
                  }
                }}
                style={{
                  padding: '5px 12px', borderRadius: radius.pill,
                  border: `1px solid ${base.brandSprout}`,
                  backgroundColor: 'transparent',
                  color: base.textPrimary,
                  fontSize: font.size.caption, fontFamily: font.family,
                  outline: 'none', minWidth: '100px', flex: 1,
                  maxWidth: '150px'
                }}
              />
              {PRESET_TAGS.filter(t => !selectedTags.includes(t)).map(tag => (
                <button
                  key={tag}
                  onClick={() => { toggleTag(tag); setShowTagPicker(false) }}
                  style={{
                    padding: '5px 12px', borderRadius: radius.pill,
                    border: `1px solid ${base.border}`,
                    backgroundColor: 'transparent',
                    color: base.textPrimary,
                    fontSize: font.size.caption, fontFamily: font.family,
                    cursor: 'pointer',
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ━━━ 送出前視覺小結 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {(selectedMood || selectedTags.length > 0) && (
          <div style={{
            padding: '12px 16px', margin: '0 8px', borderRadius: radius.md,
            backgroundColor: `${base.card}AA`, backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', gap: '12px',
          }}>
            {selectedMood && (
              <MoodBall moodKey={selectedMood} size={40} />
            )}
            <div style={{
              display: 'flex', flexWrap: 'wrap', gap: '6px',
            }}>
              {selectedTags.map(tag => (
                <span key={tag} style={{
                  padding: '4px 10px', borderRadius: radius.pill,
                  backgroundColor: selectedMood ? `${mood[selectedMood]}15` : `${base.brandSprout}15`,
                  color: selectedMood ? mood[selectedMood] : base.brandSprout,
                  fontSize: font.size.caption, fontFamily: font.family,
                  fontWeight: font.weight.medium,
                }}>
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ━━━ 底部操作列 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 0 calc(16px + var(--safe-bottom))',
          gap: '8px',
        }}>
          {/* 回到日記本 */}
          <button
            onClick={() => navigate('/diary')}
            style={{
              background: 'none', border: 'none', padding: '8px',
              cursor: 'pointer', display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: '2px', minWidth: '56px', minHeight: '44px',
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect x="5" y="3" width="14" height="18" rx="2" stroke={base.textSecondary} strokeWidth="1.5" fill="none" />
              <line x1="8" y1="7" x2="16" y2="7" stroke={base.textSecondary} strokeWidth="1" strokeLinecap="round" />
              <line x1="8" y1="10" x2="16" y2="10" stroke={base.textSecondary} strokeWidth="1" strokeLinecap="round" />
              <line x1="8" y1="13" x2="13" y2="13" stroke={base.textSecondary} strokeWidth="1" strokeLinecap="round" />
            </svg>
            <span style={{
              fontSize: '10px', color: base.textSecondary,
              fontFamily: font.family, whiteSpace: 'nowrap',
            }}>
              {c.editorBackToDiary}
            </span>
          </button>

          {/* 儲存日記 */}
          <button
            onClick={handleSave}
            disabled={!content.trim() && !selectedMood}
            style={{
              flex: 1, maxWidth: '200px', height: '48px',
              borderRadius: radius.pill, border: 'none',
              backgroundColor: selectedMood ? mood[selectedMood] : base.brandSprout,
              color: '#FFFFFF', fontSize: font.size.body,
              fontWeight: font.weight.semibold, fontFamily: font.family,
              cursor: (!content.trim() && !selectedMood) ? 'not-allowed' : 'pointer',
              opacity: (!content.trim() && !selectedMood) ? 0.5 : 1,
              boxShadow: selectedMood ? `0 4px 16px ${mood[selectedMood]}44` : shadow.raised,
              transition: 'all 0.4s ease',
              letterSpacing: '0.08em',
            }}
          >
            {c.editorSave}
          </button>

          {/* 等等再寫 */}
          <button
            onClick={() => navigate(-1)}
            style={{
              background: 'none', border: 'none', padding: '8px',
              cursor: 'pointer', display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: '2px', minWidth: '56px', minHeight: '44px',
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke={base.textSecondary} strokeWidth="1.5" fill="none" />
              <polyline points="12,7 12,12 16,14" stroke={base.textSecondary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span style={{
              fontSize: '10px', color: base.textSecondary,
              fontFamily: font.family, whiteSpace: 'nowrap',
            }}>
              {c.editorSaveLater}
            </span>
          </button>
        </div>

      </div>
    </div>
  )
}
