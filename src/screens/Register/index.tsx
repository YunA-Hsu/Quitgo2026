import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { base } from '../../styles/tokens'
import { copy } from '../../copy/zh-TW'
import InputField from '../../components/InputField'

import bgImage from '../../assets/backgrounds/Background.png'
import yaYaImg from '../../assets/characters/Yaya.png'
import emailIcon from '../../assets/icons/email.png'
import padlockIcon from '../../assets/icons/padlock.png'
import visibleIcon from '../../assets/icons/visible.png'
import eyebrowIcon from '../../assets/icons/eyebrow.png'

// ── 暱稱 icon（用 NOTE.png，代表「幫自己命名」）──
import noteIcon from '../../assets/icons/NOTE.png'
import lineLoginImg from '../../assets/icons/Line login.png'
import googleLoginImg from '../../assets/icons/Google Login.png'

// ─────────────────────────────────────────────────────────────

export default function RegisterScreen() {
  const navigate = useNavigate()
  const c = copy.register

  const [nickname, setNickname] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [passwordError, setPasswordError] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setPasswordError(true)
      return
    }
    setPasswordError(false)
    // V1 佔位：後端工程師接手後替換
    navigate('/home')
  }

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
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
      }}
    >
      <div
        className="app-container"
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >

        {/* ── 返回按鈕 ── */}
        <button
          type="button"
          onClick={() => navigate('/login')}
          className="fade-in-up"
          style={{
            alignSelf: 'flex-start',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 0',
            minHeight: '44px',
            color: base.textSecondary,
            fontSize: '14px',
            fontFamily: "'Noto Sans TC', 'PingFang TC', sans-serif",
            marginBottom: '8px',
          }}
          aria-label="返回登入頁"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M12.5 15L7.5 10L12.5 5"
              stroke={base.textSecondary}
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          返回
        </button>

        {/* ── Hero：Yaya + 標題 ── */}
        <div
          className="fade-in-up fade-in-up-delay-1"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            marginTop: '8px',
            marginBottom: '4px',
          }}
        >
          <img
            src={yaYaImg}
            alt="阿芽帶路"
            style={{
              width: '100px',
              height: '100px',
              objectFit: 'contain',
              flexShrink: 0,
            }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span
              style={{
                fontSize: '22px',
                fontWeight: 700,
                color: base.textPrimary,
                fontFamily: "'Noto Sans TC', 'PingFang TC', sans-serif",
                lineHeight: 1.3,
              }}
            >
              {c.heading}
            </span>
            <span
              style={{
                fontSize: '13px',
                fontWeight: 400,
                color: base.accentCoral,
                fontFamily: "'Noto Sans TC', 'PingFang TC', sans-serif",
                lineHeight: 1.6,
              }}
            >
              {c.subheading}
            </span>
          </div>
        </div>

        {/* ── 步驟進度條（視覺裝飾，1 步完成）── */}
        <div
          className="fade-in-up fade-in-up-delay-1"
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '6px',
            marginBottom: '28px',
            marginTop: '16px',
          }}
        >
          {[0, 1, 2].map(i => (
            <div
              key={i}
              style={{
                width: i === 0 ? '24px' : '8px',
                height: '8px',
                borderRadius: '999px',
                backgroundColor: i === 0 ? base.brandSprout : base.border,
                transition: 'width 0.3s ease',
              }}
            />
          ))}
        </div>

        {/* ── 社群註冊按鈕 ── */}
        <div
          className="fade-in-up fade-in-up-delay-2"
          style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '4px' }}
        >
          <button
            type="button"
            id="btn-line-register"
            aria-label={c.lineRegister}
            style={{
              background: 'none', border: 'none', padding: 0, cursor: 'pointer',
              width: '100%', minHeight: '44px', display: 'flex',
              borderRadius: '12px', overflow: 'hidden',
              transition: 'opacity 0.15s ease, transform 0.1s ease',
            }}
            onTouchStart={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(0.98)' }}
            onTouchEnd={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)' }}
            onMouseDown={e => { (e.currentTarget as HTMLElement).style.opacity = '0.85' }}
            onMouseUp={e => { (e.currentTarget as HTMLElement).style.opacity = '1' }}
          >
            <img src={lineLoginImg} alt={c.lineRegister} style={{ width: '100%', height: 'auto', display: 'block' }} />
          </button>

          <button
            type="button"
            id="btn-google-register"
            aria-label={c.googleRegister}
            style={{
              background: 'none', border: 'none', padding: 0, cursor: 'pointer',
              width: '100%', minHeight: '44px', display: 'flex',
              borderRadius: '12px', overflow: 'hidden',
              transition: 'opacity 0.15s ease, transform 0.1s ease',
            }}
            onTouchStart={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(0.98)' }}
            onTouchEnd={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)' }}
            onMouseDown={e => { (e.currentTarget as HTMLElement).style.opacity = '0.85' }}
            onMouseUp={e => { (e.currentTarget as HTMLElement).style.opacity = '1' }}
          >
            <img src={googleLoginImg} alt={c.googleRegister} style={{ width: '100%', height: 'auto', display: 'block' }} />
          </button>
        </div>

        {/* ── 分隔線 ── */}
        <div
          className="fade-in-up fade-in-up-delay-2"
          style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}
        >
          <div style={{ flex: 1, height: '1px', backgroundColor: base.border }} />
          <span style={{ fontSize: '12px', color: base.textSecondary, whiteSpace: 'nowrap', lineHeight: 1.6 }}>
            {c.divider}
          </span>
          <div style={{ flex: 1, height: '1px', backgroundColor: base.border }} />
        </div>

        {/* ── 表單 ── */}
        <form
          className="fade-in-up fade-in-up-delay-3"
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: '14px', flex: 1 }}
        >
          {/* 暱稱 */}
          <InputField
            id="input-nickname"
            type="text"
            icon={noteIcon}
            iconAlt="暱稱圖示"
            placeholder={c.nicknamePlaceholder}
            value={nickname}
            onChange={e => setNickname(e.target.value)}
            autoComplete="nickname"
            required
          />

          {/* 電子郵件 */}
          <InputField
            id="input-email"
            type="email"
            icon={emailIcon}
            iconAlt="電子郵件圖示"
            placeholder={c.emailPlaceholder}
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoComplete="email"
            inputMode="email"
            required
          />

          {/* 密碼 */}
          <InputField
            id="input-password"
            type={showPassword ? 'text' : 'password'}
            icon={padlockIcon}
            iconAlt="密碼圖示"
            rightIcon={showPassword ? eyebrowIcon : visibleIcon}
            onRightIconClick={() => setShowPassword(v => !v)}
            placeholder={c.passwordPlaceholder}
            value={password}
            onChange={e => {
              setPassword(e.target.value)
              if (passwordError) setPasswordError(false)
            }}
            autoComplete="new-password"
            required
          />

          {/* 確認密碼 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <InputField
              id="input-confirm-password"
              type={showConfirm ? 'text' : 'password'}
              icon={padlockIcon}
              iconAlt="確認密碼圖示"
              rightIcon={showConfirm ? eyebrowIcon : visibleIcon}
              onRightIconClick={() => setShowConfirm(v => !v)}
              placeholder={c.confirmPasswordPlaceholder}
              value={confirmPassword}
              onChange={e => {
                setConfirmPassword(e.target.value)
                if (passwordError) setPasswordError(false)
              }}
              autoComplete="new-password"
              required
              style={
                passwordError
                  ? { outline: `1.5px solid ${base.accentCoral}` }
                  : undefined
              }
            />
            {/* 密碼不一致提示 */}
            {passwordError && (
              <p
                style={{
                  margin: 0,
                  fontSize: '12px',
                  color: base.accentCoral,
                  fontFamily: "'Noto Sans TC', 'PingFang TC', sans-serif",
                  lineHeight: 1.6,
                  paddingLeft: '4px',
                }}
                role="alert"
              >
                {c.passwordMismatch}
              </p>
            )}
          </div>

          {/* 立即開始按鈕 */}
          <button
            type="submit"
            id="btn-register-submit"
            style={{
              width: '100%',
              height: '52px',
              borderRadius: '12px',
              border: 'none',
              backgroundColor: base.brandSprout,
              color: '#FFFFFF',
              fontSize: '16px',
              fontWeight: 600,
              fontFamily: "'Noto Sans TC', 'PingFang TC', sans-serif",
              cursor: 'pointer',
              letterSpacing: '0.05em',
              transition: 'opacity 0.15s ease, transform 0.1s ease',
              boxShadow: '0 4px 16px rgba(143, 168, 118, 0.35)',
              marginTop: '6px',
            }}
            onMouseDown={e => { (e.currentTarget as HTMLElement).style.opacity = '0.85' }}
            onMouseUp={e => { (e.currentTarget as HTMLElement).style.opacity = '1' }}
            onTouchStart={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(0.98)' }}
            onTouchEnd={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)' }}
          >
            {c.registerButton}
          </button>

          {/* 返回登入 */}
          <div
            style={{
              textAlign: 'center',
              fontSize: '14px',
              color: base.textSecondary,
              lineHeight: 1.6,
              marginTop: '4px',
            }}
          >
            {c.hasAccount}
            <button
              type="button"
              id="btn-back-to-login"
              onClick={() => navigate('/login')}
              style={{
                background: 'none',
                border: 'none',
                padding: '0 4px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 600,
                color: base.brandSprout,
                fontFamily: "'Noto Sans TC', 'PingFang TC', sans-serif",
                textDecoration: 'underline',
                minHeight: '44px',
              }}
            >
              {c.loginLink}
            </button>
          </div>

          {/* 條款 */}
          <div style={{ flex: 1 }} />
          <p
            style={{
              textAlign: 'center',
              fontSize: '12px',
              color: base.textSecondary,
              lineHeight: 1.8,
              margin: 0,
            }}
          >
            {c.terms}
            <button
              type="button"
              style={{
                background: 'none',
                border: 'none',
                padding: '0 2px',
                cursor: 'pointer',
                fontSize: '12px',
                color: base.brandSprout,
                fontFamily: "'Noto Sans TC', 'PingFang TC', sans-serif",
                textDecoration: 'underline',
                minHeight: '44px',
              }}
            >
              {c.termsLink}
            </button>
            {c.and}
            <button
              type="button"
              style={{
                background: 'none',
                border: 'none',
                padding: '0 2px',
                cursor: 'pointer',
                fontSize: '12px',
                color: base.brandSprout,
                fontFamily: "'Noto Sans TC', 'PingFang TC', sans-serif",
                textDecoration: 'underline',
                minHeight: '44px',
              }}
            >
              {c.privacyLink}
            </button>
          </p>
        </form>

      </div>
    </div>
  )
}
