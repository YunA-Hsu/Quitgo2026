import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { base } from '../../styles/tokens'
import { copy } from '../../copy/zh-TW'
import InputField from '../../components/InputField'


// ── 素材 import ──────────────────────────────────────────────
import yaYaWellcome from '../../assets/characters/Yaya-Wellcome.png'
import bgImage from '../../assets/backgrounds/Background.png'
import emailIcon from '../../assets/icons/email.png'
import padlockIcon from '../../assets/icons/padlock.png'
import visibleIcon from '../../assets/icons/visible.png'
import eyebrowIcon from '../../assets/icons/eyebrow.png'
import lineLoginImg from '../../assets/icons/Line login.png'
import googleLoginImg from '../../assets/icons/Google Login.png'


// ─────────────────────────────────────────────────────────────

export default function LoginScreen() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const c = copy.login
  const appName = copy.app.name

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // V1：直接導向首頁（後端串接後替換）
    navigate('/home')
  }

  return (
    /* 全畫面背景 */
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
      {/* App 容器：統一透過 app-container 管理最大寬、安全區域與 padding */}
      <div
        className="app-container"
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >

        {/* ── Hero 區塊：Yaya + 社畜日記 ── */}
        <div
          className="fade-in-up"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            marginTop: '40px',
            marginBottom: '8px',
          }}
        >
          <img
            src={yaYaWellcome}
            alt="阿芽迎賓"
            style={{
              width: '110px',
              height: '110px',
              objectFit: 'contain',
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontSize: '32px',
              fontWeight: 700,
              color: base.textPrimary,
              fontFamily: "'Noto Sans TC', 'PingFang TC', sans-serif",
              letterSpacing: '0.02em',
              lineHeight: 1.2,
            }}
          >
            {appName}
          </span>
        </div>

        {/* ── Slogan ── */}
        <p
          className="fade-in-up fade-in-up-delay-1"
          style={{
            textAlign: 'center',
            fontSize: '13px',
            fontWeight: 400,
            color: base.accentCoral,
            marginTop: '4px',
            marginBottom: '32px',
            lineHeight: 1.6,
          }}
        >
          {c.slogan}
        </p>

        {/* ── 第三方登入按鈕 ── */}
        <div
          className="fade-in-up fade-in-up-delay-2"
          style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}
        >
          {/* LINE 官方按鈕圖 */}
          <button
            type="button"
            id="btn-line-login"
            aria-label={c.lineLogin}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              width: '100%',
              minHeight: '44px',
              display: 'flex',
              borderRadius: '12px',
              overflow: 'hidden',
              transition: 'opacity 0.15s ease, transform 0.1s ease',
            }}
            onTouchStart={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(0.98)' }}
            onTouchEnd={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)' }}
            onMouseDown={e => { (e.currentTarget as HTMLElement).style.opacity = '0.85' }}
            onMouseUp={e => { (e.currentTarget as HTMLElement).style.opacity = '1' }}
          >
            <img src={lineLoginImg} alt={c.lineLogin} style={{ width: '100%', height: 'auto', display: 'block' }} />
          </button>

          {/* Google 官方按鈕圖 */}
          <button
            type="button"
            id="btn-google-login"
            aria-label={c.googleLogin}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              width: '100%',
              minHeight: '44px',
              display: 'flex',
              borderRadius: '12px',
              overflow: 'hidden',
              transition: 'opacity 0.15s ease, transform 0.1s ease',
            }}
            onTouchStart={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(0.98)' }}
            onTouchEnd={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)' }}
            onMouseDown={e => { (e.currentTarget as HTMLElement).style.opacity = '0.85' }}
            onMouseUp={e => { (e.currentTarget as HTMLElement).style.opacity = '1' }}
          >
            <img src={googleLoginImg} alt={c.googleLogin} style={{ width: '100%', height: 'auto', display: 'block' }} />
          </button>
        </div>

        {/* ── 分隔線 ── */}
        <div
          className="fade-in-up fade-in-up-delay-3"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '20px',
          }}
        >
          <div style={{ flex: 1, height: '1px', backgroundColor: base.border }} />
          <span
            style={{
              fontSize: '12px',
              color: base.textSecondary,
              whiteSpace: 'nowrap',
              lineHeight: 1.6,
            }}
          >
            {c.divider}
          </span>
          <div style={{ flex: 1, height: '1px', backgroundColor: base.border }} />
        </div>

        {/* ── Email / Password 表單 ── */}
        <form
          className="fade-in-up fade-in-up-delay-3"
          onSubmit={handleEmailLogin}
          style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
        >
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
          />

          <InputField
            id="input-password"
            type={showPassword ? 'text' : 'password'}
            icon={padlockIcon}
            iconAlt="密碼鎖圖示"
            rightIcon={showPassword ? eyebrowIcon : visibleIcon}
            onRightIconClick={() => setShowPassword(v => !v)}
            placeholder={c.passwordPlaceholder}
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="current-password"
          />

          {/* 忘記密碼 */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="button"
              id="btn-forgot-password"
              style={{
                background: 'none',
                border: 'none',
                padding: '4px 0',
                cursor: 'pointer',
                fontSize: '13px',
                color: base.textSecondary,
                fontFamily: "'Noto Sans TC', 'PingFang TC', sans-serif",
                lineHeight: 1.6,
                minHeight: '44px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {c.forgotPassword}
            </button>
          </div>

          {/* 登入按鈕 */}
          <button
            type="submit"
            id="btn-email-login"
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
              marginTop: '4px',
            }}
            onMouseDown={e => { (e.currentTarget as HTMLElement).style.opacity = '0.85' }}
            onMouseUp={e => { (e.currentTarget as HTMLElement).style.opacity = '1' }}
            onTouchStart={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(0.98)' }}
            onTouchEnd={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)' }}
          >
            {c.loginButton}
          </button>
        </form>

        {/* ── 註冊連結 ── */}
        <div
          className="fade-in-up fade-in-up-delay-4"
          style={{
            textAlign: 'center',
            marginTop: '20px',
            fontSize: '14px',
            color: base.textSecondary,
            lineHeight: 1.6,
          }}
        >
          {c.noAccount}
          <button
            type="button"
            id="btn-register"
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
            onClick={() => navigate('/register')}
          >
            {c.registerLink}
          </button>
        </div>

        {/* ── 底部條款（推到底部） ── */}
        <div style={{ flex: 1 }} />
        <p
          className="fade-in-up fade-in-up-delay-5"
          style={{
            textAlign: 'center',
            fontSize: '12px',
            color: base.textSecondary,
            lineHeight: 1.8,
            marginTop: '16px',
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
      </div>
    </div>
  )
}
