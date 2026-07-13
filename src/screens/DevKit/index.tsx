import { useState } from 'react'
import { base, font } from '../../styles/tokens'
import MoodBall from '../../components/MoodBall'
import DateStrip from '../../components/DateStrip'
import type { MoodKey } from '../../styles/tokens'

const MOODS: MoodKey[] = ['happy', 'calm', 'ordinary', 'achievement', 'depressed', 'hurt', 'angry']

export default function DevKitScreen() {
  const [promptText, setPromptText] = useState('尚未點擊')
  const mockMoodData = getMockMoodData()

  return (
    <div className="app-container screen-bg" style={{ minHeight: '100dvh', padding: '24px 20px' }}>
      <h1 style={{ color: base.textPrimary, fontFamily: font.family, marginBottom: '24px' }}>Dev Kit</h1>
      
      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '18px', color: base.textPrimary, fontFamily: font.family, marginBottom: '16px' }}>
          MoodBall - 小尺寸 (size: 24, 純色點)
        </h2>
        <div style={{ display: 'flex', gap: '12px' }}>
          {MOODS.map(m => <MoodBall key={m} moodKey={m} size={24} />)}
        </div>
      </section>

      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '18px', color: base.textPrimary, fontFamily: font.family, marginBottom: '16px' }}>
          MoodBall - 中尺寸 (size: 40, 圖片)
        </h2>
        <div style={{ display: 'flex', gap: '12px' }}>
          {MOODS.map(m => <MoodBall key={m} moodKey={m} size={40} />)}
        </div>
      </section>

      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '18px', color: base.textPrimary, fontFamily: font.family, marginBottom: '16px' }}>
          MoodBall - 大尺寸 (size: 64, 圖片)
        </h2>
        <div style={{ display: 'flex', gap: '16px' }}>
          {MOODS.map(m => <MoodBall key={m} moodKey={m} size={64} />)}
        </div>
      </section>

      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '18px', color: base.textPrimary, fontFamily: font.family, marginBottom: '16px' }}>
          MoodBall - 選中狀態 (size: 48, 放大 + 光暈)
        </h2>
        <div style={{ display: 'flex', gap: '16px', padding: '16px 0' }}>
          {MOODS.map(m => <MoodBall key={m} moodKey={m} size={48} selected />)}
        </div>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '18px', color: base.textPrimary, fontFamily: font.family, marginBottom: '8px' }}>
          DateStrip - 首頁日期條
        </h2>
        <div style={{
          marginBottom: '16px',
          padding: '12px',
          backgroundColor: base.card,
          borderRadius: '8px',
          color: base.textPrimary,
          fontFamily: font.family,
          fontSize: '14px',
        }}>
          測試狀態: {promptText} <br/>
          (點未來日應顯示佔位 / 點過去空點應顯示補記)
        </div>
        <div style={{ backgroundColor: '#FDFBF5', borderRadius: '16px', padding: '0 8px' }}>
          <DateStrip 
            moodData={mockMoodData} 
            onDateClick={(dateStr, recorded, canBackfill, isToday) => {
              if (recorded) {
                setPromptText(`[${dateStr}] 進入日記 (recorded: true)`)
              } else if (canBackfill) {
                setPromptText(`[${dateStr}] 顯示補記: 想幫這天補一筆嗎? (isToday: ${isToday})`)
              } else {
                setPromptText(`[${dateStr}] 佔位: 這一天還沒發生,先好好過今天吧`)
              }
            }}
          />
        </div>
      </section>
    </div>
  )
}

function getMockMoodData() {
  const data: Record<string, MoodKey> = {}
  const now = new Date()
  const dayOfWeek = now.getDay()
  const monday = new Date(now)
  monday.setDate(now.getDate() - ((dayOfWeek + 6) % 7))
  
  const mockWeek: (MoodKey | null)[] = ['achievement', 'calm', 'ordinary', 'happy', null, null, null]
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    const yyyy = d.getFullYear()
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    const dateStr = `${yyyy}-${mm}-${dd}`
    if (mockWeek[i]) {
      data[dateStr] = mockWeek[i] as MoodKey
    }
  }
  return data
}

