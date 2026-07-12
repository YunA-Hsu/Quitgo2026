import { useState, useEffect, useRef, useMemo } from 'react'
import { base, mood, font } from '../styles/tokens'
import type { MoodKey } from '../styles/tokens'
import { copy } from '../copy/zh-TW'

// ── Helper ─────────────────────────────────────────────────────────

export type DateInfo = {
  label: string
  dayOfWeek: string
  isToday: boolean
  isPast: boolean
  index: number
  date: Date
  dateStr: string // YYYY-MM-DD
}

// 產生過去 8 週 + 本週 (共 9 週) 的資料，最右邊是本週
function getNineWeeksData(): DateInfo[][] {
  const weeks: DateInfo[][] = []
  const now = new Date()
  const dayOfWeek = now.getDay()
  const currentMonday = new Date(now)
  currentMonday.setDate(now.getDate() - ((dayOfWeek + 6) % 7))
  
  const weekLabels = ['一', '二', '三', '四', '五', '六', '日']

  for (let w = -8; w <= 0; w++) {
    const monday = new Date(currentMonday)
    monday.setDate(currentMonday.getDate() + w * 7)
    
    const week: DateInfo[] = []
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday)
      d.setDate(monday.getDate() + i)
      
      const yyyy = d.getFullYear()
      const mm = String(d.getMonth() + 1).padStart(2, '0')
      const dd = String(d.getDate()).padStart(2, '0')
      const dateStr = `${yyyy}-${mm}-${dd}`

      const isToday = d.toDateString() === now.toDateString()
      const isPast = d < new Date(now.getFullYear(), now.getMonth(), now.getDate())

      week.push({
        label: String(d.getDate()),
        dayOfWeek: weekLabels[i],
        isToday,
        isPast,
        index: i,
        date: d,
        dateStr
      })
    }
    weeks.push(week)
  }
  return weeks
}

// ── Component ──────────────────────────────────────────────────────

export interface DateStripProps {
  /** Map of date string (YYYY-MM-DD) to MoodKey */
  moodData: Record<string, MoodKey>
  /** Callback when a date is clicked */
  onDateClick?: (dateStr: string, recorded: boolean, canBackfill: boolean, isToday: boolean) => void
}

export default function DateStrip({ moodData, onDateClick }: DateStripProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const weeksData = useMemo(() => getNineWeeksData(), [])
  
  const [currentMonthStr, setCurrentMonthStr] = useState('')
  const [isAtCurrentWeek, setIsAtCurrentWeek] = useState(true)
  
  // Drag to scroll logic
  const isDragging = useRef(false)
  const startX = useRef(0)
  const scrollLeft = useRef(0)

  // Initialization: scroll to the very end (current week)
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth
      updateMonthLabel(scrollRef.current)
    }
  }, [])

  const updateMonthLabel = (el: HTMLDivElement) => {
    // 透過捲動位置估算目前可見的是哪一週
    const clientWidth = el.clientWidth
    const scrollPos = el.scrollLeft
    const maxScroll = el.scrollWidth - clientWidth
    
    // index from 0 to 8 (8 is current week)
    let weekIndex = 8
    if (maxScroll > 0) {
      weekIndex = Math.max(0, Math.min(8, Math.round((scrollPos / maxScroll) * 8)))
    }
    
    if (weekIndex === 8) {
      setIsAtCurrentWeek(true)
    } else {
      setIsAtCurrentWeek(false)
    }

    // 取得該週星期四（週中）的月份來代表這一週
    const midWeekDate = weeksData[weekIndex][3].date
    const year = midWeekDate.getFullYear()
    const month = midWeekDate.getMonth() + 1
    setCurrentMonthStr(`${year}年 ${month}月`)
  }

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (!isDragging.current) {
      updateMonthLabel(e.currentTarget)
    }
  }

  const scrollToCurrentWeek = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ left: scrollRef.current.scrollWidth, behavior: 'smooth' })
    }
  }

  // --- Mouse Drag Logic ---
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return
    isDragging.current = true
    startX.current = e.pageX - scrollRef.current.offsetLeft
    scrollLeft.current = scrollRef.current.scrollLeft
    // 拖曳時暫時關閉 snap
    scrollRef.current.style.scrollSnapType = 'none'
    scrollRef.current.style.cursor = 'grabbing'
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !scrollRef.current) return
    e.preventDefault()
    const x = e.pageX - scrollRef.current.offsetLeft
    const walk = (x - startX.current) * 2 // scroll speed multiplier
    scrollRef.current.scrollLeft = scrollLeft.current - walk
    updateMonthLabel(scrollRef.current)
  }

  const handleMouseUpOrLeave = () => {
    if (!scrollRef.current || !isDragging.current) return
    isDragging.current = false
    scrollRef.current.style.scrollSnapType = 'x mandatory'
    scrollRef.current.style.cursor = 'grab'
    
    // 微調，觸發重新 snap
    const currentScroll = scrollRef.current.scrollLeft
    scrollRef.current.scrollTo({ left: currentScroll + 1, behavior: 'smooth' })
  }

  return (
    <div style={{ position: 'relative' }}>
      
      {/* 標頭列：年份月份 + 回到今天 */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '12px',
        padding: '0 4px',
        height: '24px'
      }}>
        <span style={{ 
          fontSize: '14px', 
          fontWeight: font.weight.medium, 
          color: base.textPrimary, 
          fontFamily: font.family 
        }}>
          {currentMonthStr}
        </span>

        {!isAtCurrentWeek && (
          <button
            onClick={scrollToCurrentWeek}
            style={{
              background: base.card,
              border: `1px solid ${base.border}`,
              borderRadius: '12px',
              padding: '2px 10px',
              fontSize: '12px',
              color: base.textPrimary,
              fontFamily: font.family,
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
              cursor: 'pointer',
              animation: 'fadeIn 0.2s ease-out'
            }}
          >
            {copy.dateStrip.backToToday}
          </button>
        )}
      </div>

      {/* 橫向滾動容器 */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        className="date-strip-scroll"
        style={{
          display: 'flex',
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none', // Firefox
          WebkitOverflowScrolling: 'touch',
          cursor: 'grab',
        }}
      >
        <style>{`
          .date-strip-scroll::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        
        {weeksData.map((week, wIndex) => (
          <div
            key={wIndex}
            style={{
              flex: '0 0 100%',
              scrollSnapAlign: 'start',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px 0',
            }}
          >
            {week.map(day => {
              const weekMood = moodData[day.dateStr]
              const recorded = !!weekMood
              const isToday = day.isToday

              // 樣式規則計算
              let circleBg = 'transparent'
              let textColor = base.textSecondary
              let fontWt = font.weight.regular
              let borderStyle = 'none'

              if (recorded) {
                circleBg = mood[weekMood]
                textColor = '#4A4238' // 深色文字
                fontWt = font.weight.medium
                if (isToday) {
                  borderStyle = `2px solid ${base.brandSprout}`
                }
              } else {
                if (isToday) {
                  textColor = base.textPrimary
                  fontWt = font.weight.bold
                  borderStyle = `2px solid ${base.brandSprout}`
                } else {
                  // 未記錄非今天：正常顯示、無背景
                  textColor = base.textSecondary
                }
              }

              return (
                <button
                  key={day.dateStr}
                  onClick={() => {
                    // 防止拖曳時觸發點擊
                    if (isDragging.current) return
                    
                    if (onDateClick) {
                      const canBackfill = !recorded && day.isPast
                      onDateClick(day.dateStr, recorded, canBackfill, isToday)
                    }
                  }}
                  style={{
                    flex: 1,
                    background: 'none', border: 'none',
                    cursor: 'pointer',
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', gap: '8px', padding: '4px 0',
                    minHeight: '48px',
                  }}
                >
                  <span style={{
                    fontSize: '13px', color: base.textSecondary,
                    fontFamily: font.family, fontWeight: font.weight.regular,
                  }}>
                    {day.dayOfWeek}
                  </span>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    backgroundColor: circleBg,
                    border: borderStyle,
                    boxSizing: 'border-box',
                    transition: 'all 0.2s ease',
                  }}>
                    <span style={{
                      fontSize: '15px',
                      fontWeight: fontWt,
                      color: textColor,
                      fontFamily: font.family,
                    }}>
                      {day.label}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
