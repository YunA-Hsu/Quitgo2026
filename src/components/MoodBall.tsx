// MoodBall component
import { mood } from '../styles/tokens'
import type { MoodKey } from '../styles/tokens'

import happyImg from '../assets/icons/badge-happy.png.png'
import calmImg from '../assets/icons/badge-Calm.png'
import ordinaryImg from '../assets/icons/Icon_2_Ordinary Day.png'
import achievementImg from '../assets/icons/badge-Achievement.png'
import depressedImg from '../assets/icons/badge-Depressed.png'
import hurtImg from '../assets/icons/badge-Hurt.png'
import angryImg from '../assets/icons/badge-Angry.png'

const badgeImages: Record<MoodKey, string> = {
  happy: happyImg,
  calm: calmImg,
  ordinary: ordinaryImg,
  achievement: achievementImg,
  depressed: depressedImg,
  hurt: hurtImg,
  angry: angryImg,
}

export interface MoodBallProps {
  moodKey: MoodKey
  size: number
  selected?: boolean
}

export default function MoodBall({ moodKey, size, selected = false }: MoodBallProps) {
  const isSmall = size < 32

  // 小於 32px 渲染純色圓點
  if (isSmall) {
    return (
      <div
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          backgroundColor: mood[moodKey],
          transform: selected ? 'scale(1.08)' : 'scale(1)',
          boxShadow: selected ? `0 0 8px 2px ${mood[moodKey]}66` : 'none',
          transition: 'all 0.2s ease',
          flexShrink: 0,
        }}
      />
    )
  }

  // 否則渲染圖片
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: selected ? 'scale(1.08)' : 'scale(1)',
        boxShadow: selected ? `0 0 12px 2px ${mood[moodKey]}66` : 'none',
        transition: 'all 0.2s ease',
        flexShrink: 0,
      }}
    >
      <img
        src={badgeImages[moodKey]}
        alt={moodKey}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
        }}
        draggable={false}
      />
    </div>
  )
}
