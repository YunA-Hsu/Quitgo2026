import type { ReactNode, ButtonHTMLAttributes } from 'react'

interface SocialButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode
  label: string
  variant: 'line' | 'google'
}

const variantStyles = {
  line: {
    backgroundColor: '#06C755',
    color: '#FFFFFF',
    border: 'none',
  },
  google: {
    backgroundColor: '#FFFFFF',
    color: '#4A4238',
    border: '1.5px solid #E5DECF',
  },
} as const

export default function SocialButton({ icon, label, variant, ...btnProps }: SocialButtonProps) {
  const styles = variantStyles[variant]

  return (
    <button
      type="button"
      {...btnProps}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        width: '100%',
        height: '52px',
        borderRadius: '12px',
        cursor: 'pointer',
        fontFamily: "'Noto Sans TC', 'PingFang TC', sans-serif",
        fontSize: '15px',
        fontWeight: 600,
        lineHeight: 1,
        transition: 'opacity 0.15s ease, transform 0.1s ease',
        ...styles,
      }}
      onMouseDown={e => { (e.currentTarget as HTMLElement).style.opacity = '0.85' }}
      onMouseUp={e => { (e.currentTarget as HTMLElement).style.opacity = '1' }}
      onTouchStart={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(0.98)' }}
      onTouchEnd={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)' }}
    >
      <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>{icon}</span>
      <span>{label}</span>
    </button>
  )
}
