import React from 'react';
import { useNavigate } from 'react-router-dom';
import { base, font, radius, shadow } from '../../styles/tokens';
import { MOCK_ACCOUNT_INFO } from '../../fixtures/profile';

const ChevronLeft = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={base.textPrimary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 18l-6-6 6-6" />
  </svg>
);

const MailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={base.textPrimary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={base.textPrimary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"></path>
    <path d="M12 22C14.7614 22 17 17.5228 17 12C17 6.47715 14.7614 2 12 2C9.23858 2 7 6.47715 7 12C7 17.5228 9.23858 22 12 22Z"></path>
    <path d="M2 12H22"></path>
  </svg>
); // Placeholder for google icon

const LineIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={base.textPrimary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 8.5-8.5 8.5 8.5 0 0 1 8.5 8.5z"></path>
  </svg>
); // Placeholder for chat/line icon

export default function ProfileAccountScreen() {
  const navigate = useNavigate();
  const { email, googleLinked, lineLinked } = MOCK_ACCOUNT_INFO;

  return (
    <div
      className="app-container screen-bg"
      style={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: '16px 8px',
        position: 'sticky',
        top: 0,
        backgroundColor: base.bg,
        zIndex: 10
      }}>
        <button 
          onClick={() => navigate(-1)}
          style={{ background: 'none', border: 'none', padding: '8px', cursor: 'pointer', display: 'flex' }}
        >
          <ChevronLeft />
        </button>
        <h1 style={{
          margin: 0,
          fontSize: font.size.title,
          fontWeight: font.weight.semibold,
          color: base.textPrimary,
          fontFamily: font.family,
          marginLeft: '8px'
        }}>
          登入帳號設定
        </h1>
      </div>

      <div style={{ padding: '0 20px 24px' }}>
        <p style={{
          fontSize: font.size.body,
          color: base.textSecondary,
          fontFamily: font.family,
          marginBottom: '24px'
        }}>
          目前綁定的社群帳號與電子郵件。若需要修改，請洽詢客服中心。
        </p>

        <div style={{
          backgroundColor: base.card,
          borderRadius: radius.lg,
          padding: '0 20px',
          boxShadow: shadow.soft,
        }}>
          {/* Email */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            padding: '16px 0',
            borderBottom: `1px solid ${base.border}`,
          }}>
            <div style={{ width: '24px', display: 'flex', justifyContent: 'center', marginRight: '16px', flexShrink: 0 }}>
              <MailIcon />
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span style={{ fontSize: font.size.body, color: base.textPrimary, fontFamily: font.family }}>電子郵件</span>
            </div>
            <div style={{ color: base.textSecondary, fontSize: font.size.body, fontFamily: font.family }}>
              {email}
            </div>
          </div>

          {/* Google */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            padding: '16px 0',
            borderBottom: `1px solid ${base.border}`,
          }}>
            <div style={{ width: '24px', display: 'flex', justifyContent: 'center', marginRight: '16px', flexShrink: 0 }}>
              <GoogleIcon />
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span style={{ fontSize: font.size.body, color: base.textPrimary, fontFamily: font.family }}>Google 帳號</span>
            </div>
            <div style={{ color: googleLinked ? base.brandSprout : base.textSecondary, fontSize: font.size.body, fontFamily: font.family }}>
              {googleLinked ? '已綁定' : '未綁定'}
            </div>
          </div>

          {/* LINE */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            padding: '16px 0',
          }}>
            <div style={{ width: '24px', display: 'flex', justifyContent: 'center', marginRight: '16px', flexShrink: 0 }}>
              <LineIcon />
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span style={{ fontSize: font.size.body, color: base.textPrimary, fontFamily: font.family }}>LINE 帳號</span>
            </div>
            <div style={{ color: lineLinked ? base.brandSprout : base.textSecondary, fontSize: font.size.body, fontFamily: font.family }}>
              {lineLinked ? '已綁定' : '未綁定'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
