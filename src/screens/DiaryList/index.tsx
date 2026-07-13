import { useState, useMemo, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { base, font, shadow, radius } from '../../styles/tokens'
import { copy } from '../../copy/zh-TW'
import BottomNav from '../../components/BottomNav'
import MoodBall from '../../components/MoodBall'
import type { MoodKey } from '../../styles/tokens'

// ── 素材 ──────────────────────────────────────────────────────
import bgImage from '../../assets/backgrounds/Background.png'

// ── Mock 日記資料 ────────────────────────────────────────────
interface DiaryEntry {
  id: string
  date: string // 'YYYY-MM-DD'
  time: string // 'HH:mm'
  mood: MoodKey
  preview: string
}

const MOCK_ENTRIES: DiaryEntry[] = [
  { id: '1', date: '2026-07-01', time: '20:15', mood: 'calm', preview: '今天在公園散步了一會兒，微風很舒服。' },
  { id: '2', date: '2026-07-02', time: '22:30', mood: 'achievement', preview: '終於把專案報告提前完成了！' },
  { id: '3', date: '2026-07-03', time: '12:00', mood: 'calm', preview: '中午和同事去吃了新開的定食。' },
  { id: '4', date: '2026-07-03', time: '21:15', mood: 'depressed', preview: '回家路上突然覺得很疲累，什麼都不想做。' },
  { id: '5', date: '2026-07-06', time: '09:30', mood: 'angry', preview: '被客戶一大早就打電話罵了一頓⋯' },
  { id: '6', date: '2026-07-06', time: '14:00', mood: 'calm', preview: '午休後去了趟便利商店，心情好一點了。' },
  { id: '7', date: '2026-07-07', time: '20:00', mood: 'ordinary', preview: '普通的一天，沒什麼特別的事。' },
  { id: '8', date: '2026-07-08', time: '18:45', mood: 'happy', preview: '收到好朋友寄來的明信片，好感動！' },
  { id: '9', date: '2026-07-09', time: '19:30', mood: 'achievement', preview: '主管誇獎今天的簡報做得很好。' },
  { id: '10', date: '2026-07-10', time: '22:00', mood: 'hurt', preview: '和家人吵架了，覺得被誤解。' },
  { id: '11', date: '2026-07-12', time: '13:47', mood: 'hurt', preview: '被主管否決提案，中午沒得休息⋯' },
  { id: '12', date: '2026-07-12', time: '15:28', mood: 'happy', preview: '下午同事幫我分擔，真的很感謝！' },
  { id: '13', date: '2026-07-12', time: '20:12', mood: 'calm', preview: '回家後放空一下，聽音樂心情好多了' },
]


// ── Helper ────────────────────────────────────────────────────
function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfWeek(year: number, month: number) {
  return new Date(year, month, 1).getDay() // 0=Sun
}

function formatDateKey(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}

// ═════════════════════════════════════════════════════════════
export default function DiaryListScreen() {
  const navigate = useNavigate()
  const c = copy.diary
  const today = new Date()

  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth()) // 0-indexed
  const [selectedDay, setSelectedDay] = useState(today.getDate())
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // 組織每日的心情色點
  const dayMoodsMap = useMemo(() => {
    const map: Record<string, MoodKey[]> = {}
    MOCK_ENTRIES.forEach(e => {
      if (!map[e.date]) map[e.date] = []
      map[e.date].push(e.mood)
    })
    return map
  }, [])

  // 選中日期的日記
  const selectedDateKey = formatDateKey(viewYear, viewMonth, selectedDay)
  const selectedEntries = MOCK_ENTRIES.filter(e => e.date === selectedDateKey)

  // 月曆計算
  const daysInMonth = getDaysInMonth(viewYear, viewMonth)
  const firstDayOfWeek = getFirstDayOfWeek(viewYear, viewMonth)

  // 星期幾名稱
  const weekDayOfSelected = new Date(viewYear, viewMonth, selectedDay).getDay()

  // 月份切換
  function goMonth(delta: number) {
    let m = viewMonth + delta
    let y = viewYear
    if (m < 0) { m = 11; y-- }
    if (m > 11) { m = 0; y++ }
    setViewYear(y)
    setViewMonth(m)
    setSelectedDay(1)
  }

  // 上下滑動切換月份（iPhone 日曆風格）
  let touchStartY = 0
  const wheelLock = useRef(false)
  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (wheelLock.current) return
    if (Math.abs(e.deltaY) > 30) {
      wheelLock.current = true
      goMonth(e.deltaY > 0 ? 1 : -1)
      setTimeout(() => { wheelLock.current = false }, 300)
    }
  }, [viewYear, viewMonth])

  return (
    <div
      style={{
        minHeight: '100dvh', width: '100%',
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover', backgroundPosition: 'center top',
        backgroundRepeat: 'no-repeat', backgroundAttachment: 'fixed',
        display: 'flex', justifyContent: 'center',
      }}
    >
      <div
        className="app-container"
        style={{
          paddingBottom: 'calc(80px + var(--safe-bottom))',
          display: 'flex', flexDirection: 'column',
        }}
      >

        {/* ━━━ 1. 頂部導覽列 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '8px 0',
        }}>
          {/* 年份按鈕 */}
          <button
            onClick={() => navigate(-1)}
            style={{
              background: 'none', border: `1px solid ${base.border}`,
              borderRadius: radius.pill, padding: '6px 14px',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px',
              minHeight: '44px', fontFamily: font.family,
              fontSize: font.size.caption, color: base.textPrimary,
            }}
          >
            <span style={{ fontSize: '14px' }}>‹</span>
            {viewYear}{c.yearSuffix}
          </button>

          {/* 右側工具列 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {/* 列表切換 */}
            <button
              style={{
                background: 'none', border: 'none', padding: '10px',
                cursor: 'pointer', minWidth: '44px', minHeight: '44px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <line x1="4" y1="6" x2="18" y2="6" stroke={base.textSecondary} strokeWidth="1.8" strokeLinecap="round" />
                <line x1="4" y1="11" x2="18" y2="11" stroke={base.textSecondary} strokeWidth="1.8" strokeLinecap="round" />
                <line x1="4" y1="16" x2="18" y2="16" stroke={base.textSecondary} strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>

            {/* 搜尋 */}
            <button
              onClick={() => setShowSearch(!showSearch)}
              style={{
                background: 'none', border: 'none', padding: '10px',
                cursor: 'pointer', minWidth: '44px', minHeight: '44px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <circle cx="10" cy="10" r="6" stroke={base.textSecondary} strokeWidth="1.8" />
                <line x1="14.5" y1="14.5" x2="18" y2="18" stroke={base.textSecondary} strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>

            {/* + 新增日記 */}
            <button
              onClick={() => navigate('/diary/write')}
              style={{
                width: '36px', height: '36px', borderRadius: '50%',
                backgroundColor: base.brandSprout, border: 'none',
                cursor: 'pointer', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                boxShadow: shadow.raised,
              }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <line x1="9" y1="3" x2="9" y2="15" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" />
                <line x1="3" y1="9" x2="15" y2="9" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* 搜尋列（條件展開） */}
        {showSearch && (
          <div style={{ padding: '0 0 8px' }}>
            <input
              type="text"
              placeholder={c.searchPlaceholder}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                width: '100%', height: '40px', borderRadius: radius.md,
                border: `1px solid ${base.border}`, backgroundColor: base.card,
                padding: '0 14px', fontSize: font.size.caption,
                fontFamily: font.family, color: base.textPrimary,
                outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>
        )}

        {/* ━━━ 2. 月份標題 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <div
          style={{ padding: '4px 4px 8px' }}
          onTouchStart={e => { touchStartY = e.touches[0].clientY }}
          onTouchEnd={e => {
            const diff = e.changedTouches[0].clientY - touchStartY
            if (Math.abs(diff) > 40) goMonth(diff > 0 ? -1 : 1)
          }}
          onWheel={handleWheel}
        >
          <h1 style={{
            margin: 0, fontSize: '32px', fontWeight: font.weight.semibold,
            color: base.textPrimary, fontFamily: font.family, lineHeight: 1.2,
          }}>
            {viewMonth + 1}{c.monthSuffix}
          </h1>
        </div>

        {/* ━━━ 3. 月曆網格 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <div
          style={{ padding: '0' }}
          onTouchStart={e => { touchStartY = e.touches[0].clientY }}
          onTouchEnd={e => {
            const diff = e.changedTouches[0].clientY - touchStartY
            if (Math.abs(diff) > 40) goMonth(diff > 0 ? -1 : 1)
          }}
          onWheel={handleWheel}
        >
          {/* 星期列 */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)',
            textAlign: 'center', marginBottom: '4px',
          }}>
            {c.weekDays.map(d => (
              <span key={d} style={{
                fontSize: font.size.caption, color: base.textSecondary,
                fontFamily: font.family, fontWeight: font.weight.regular,
                padding: '4px 0',
              }}>
                {d}
              </span>
            ))}
          </div>

          {/* 日期格子 */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)',
            rowGap: '2px',
          }}>
            {/* 前置空格 */}
            {Array.from({ length: firstDayOfWeek }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}

            {/* 日期 */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1
              const dateKey = formatDateKey(viewYear, viewMonth, day)
              const moods = dayMoodsMap[dateKey] || []
              const isSel = day === selectedDay
              const isTodayCell = viewYear === today.getFullYear() && viewMonth === today.getMonth() && day === today.getDate()

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  style={{
                    background: 'none', border: 'none', padding: '4px 0',
                    cursor: 'pointer', display: 'flex', flexDirection: 'column',
                    alignItems: 'center', gap: '3px', minHeight: '48px',
                    justifyContent: 'flex-start',
                  }}
                >
                  {/* 日期數字 */}
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    backgroundColor: isSel ? base.textPrimary : 'transparent',
                    transition: 'all 0.15s ease',
                  }}>
                    <span style={{
                      fontSize: '14px',
                      fontWeight: isSel || isTodayCell ? font.weight.semibold : font.weight.regular,
                      color: isSel ? '#FFFFFF' : (moods.length > 0 ? base.textPrimary : base.textSecondary),
                      fontFamily: font.family,
                    }}>
                      {day}
                    </span>
                  </div>

                  {/* 心情色點 */}
                  {moods.length > 0 && (
                    <div style={{
                      display: 'flex', gap: '2px', justifyContent: 'center',
                      height: '6px',
                    }}>
                      {moods.slice(0, 3).map((m, mi) => (
                        <MoodBall key={mi} moodKey={m} size={6} />
                      ))}
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* ━━━ 4. 分隔線 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <div style={{
          height: '1px', backgroundColor: base.border,
          margin: '12px 4px',
        }} />

        {/* ━━━ 5. 選中日期標頭 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <div style={{ padding: '0 4px 8px' }}>
          <span style={{
            fontSize: font.size.body, fontWeight: font.weight.semibold,
            color: base.textPrimary, fontFamily: font.family,
          }}>
            {viewMonth + 1}{c.monthSuffix}{selectedDay}日{'　'}
            {c.weekDaysFull[weekDayOfSelected]}
          </span>
          <span style={{
            fontSize: font.size.caption, color: base.textSecondary,
            fontFamily: font.family, marginLeft: '12px',
          }}>
            {c.entriesCount(selectedEntries.length)}
          </span>
        </div>

        {/* ━━━ 6. 日記條列表 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <div style={{ flex: 1, padding: '0', overflowY: 'auto' }}>
          {selectedEntries.length === 0 ? (
            /* 空狀態 */
            <div style={{
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              padding: '40px 20px', gap: '12px',
            }}>
              <span style={{ fontSize: '40px', opacity: 0.4 }}>📝</span>
              <p style={{
                margin: 0, fontSize: font.size.body, color: base.textSecondary,
                fontFamily: font.family, textAlign: 'center', lineHeight: font.lineHeight,
              }}>
                {c.emptyTitle}
              </p>
            </div>
          ) : (
            selectedEntries.map(entry => (
              <button
                key={entry.id}
                onClick={() => navigate(`/diary/${entry.id}`)}
                style={{
                  width: '100%', background: 'none', border: 'none',
                  borderBottom: `1px solid ${base.border}`,
                  padding: '14px 4px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '12px',
                  minHeight: '60px', textAlign: 'left',
                }}
              >
                {/* 心情圓形圖示 */}
                <MoodBall moodKey={entry.mood} size={36} />

                {/* 文字預覽 */}
                <div style={{
                  flex: 1, overflow: 'hidden',
                  display: 'flex', flexDirection: 'column', gap: '2px',
                }}>
                  <span style={{
                    fontSize: font.size.body, color: base.textPrimary,
                    fontFamily: font.family, lineHeight: font.lineHeight,
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>
                    {entry.preview}
                  </span>
                </div>

                {/* 時間 + 箭頭 */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  flexShrink: 0,
                }}>
                  <span style={{
                    fontSize: font.size.caption, color: base.textSecondary,
                    fontFamily: font.family,
                  }}>
                    {entry.time}
                  </span>
                  <span style={{
                    fontSize: '16px', color: base.textSecondary, opacity: 0.5,
                  }}>
                    ›
                  </span>
                </div>
              </button>
            ))
          )}
        </div>

      </div>

      <BottomNav />
    </div>
  )
}
