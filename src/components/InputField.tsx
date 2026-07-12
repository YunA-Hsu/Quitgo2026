import { type InputHTMLAttributes } from 'react'
import { base } from '../styles/tokens'

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  icon: string          // png 路徑
  iconAlt: string
  rightIcon?: string    // 可選右側圖示（密碼顯示眼睛）
  onRightIconClick?: () => void
}

export default function InputField({
  icon,
  iconAlt,
  rightIcon,
  onRightIconClick,
  ...inputProps
}: InputFieldProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        backgroundColor: base.card,
        border: `1.5px solid ${base.border}`,
        borderRadius: '12px',
        padding: '0 14px',
        height: '52px',
        width: '100%',
      }}
    >
      {/* 左側圖示 */}
      <img
        src={icon}
        alt={iconAlt}
        style={{ width: '20px', height: '20px', objectFit: 'contain', flexShrink: 0, opacity: 0.6 }}
      />

      {/* 輸入框 */}
      <input
        {...inputProps}
        style={{
          flex: 1,
          border: 'none',
          outline: 'none',
          background: 'transparent',
          fontFamily: "'Noto Sans TC', 'PingFang TC', sans-serif",
          fontSize: '15px',
          color: base.textPrimary,
          lineHeight: 1.6,
        }}
      />

      {/* 右側圖示（可點） */}
      {rightIcon && (
        <button
          type="button"
          onClick={onRightIconClick}
          style={{
            background: 'none',
            border: 'none',
            padding: '4px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            flexShrink: 0,
            minWidth: '44px',
            minHeight: '44px',
            justifyContent: 'center',
          }}
          aria-label="切換密碼顯示"
        >
          <img
            src={rightIcon}
            alt="顯示密碼"
            style={{ width: '20px', height: '20px', objectFit: 'contain', opacity: 0.5 }}
          />
        </button>
      )}
    </div>
  )
}
