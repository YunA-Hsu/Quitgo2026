import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { base, font, radius, shadow } from '../../styles/tokens'
import { copy } from '../../copy/zh-TW'
import BottomNav from '../../components/BottomNav'
import { profileService } from '../../services/profile'

import avatarImg from '../../assets/characters/Lulu.png'

const c = copy.profile

// ── SVG Icons ────────────────────────────────────────────────────────
const CameraIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={base.textPrimary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
    <circle cx="12" cy="13" r="4"></circle>
  </svg>
)

const PencilIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={base.textSecondary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
  </svg>
)

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={base.brandSprout} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
)
const ChevronRight = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M6 3.5L10.5 8L6 12.5" stroke={base.textSecondary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const GearIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={base.textPrimary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
  </svg>
)

const CrownIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M4 19L5 7L9 11L12 4L15 11L19 7L20 19H4Z" fill="#E6B655"/>
  </svg>
)

const LockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={base.textPrimary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
)

const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={base.textPrimary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
)

const BellIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={base.textPrimary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
  </svg>
)

const MoonIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={base.textPrimary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
  </svg>
)

const GlobeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={base.textPrimary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="2" y1="12" x2="22" y2="12"></line>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
  </svg>
)

const InfoIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={base.textPrimary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="16" x2="12" y2="12"></line>
    <line x1="12" y1="8" x2="12.01" y2="8"></line>
  </svg>
)

const RefreshIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={base.textPrimary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10"></polyline>
    <polyline points="1 20 1 14 7 14"></polyline>
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
  </svg>
)

const ChatIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={base.textPrimary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
)

const TeamIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={base.textPrimary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
)

// ── Components ────────────────────────────────────────────────────────

function Switch({ checked, onChange }: { checked: boolean; onChange: (c: boolean) => void }) {
  return (
    <div
      onClick={() => onChange(!checked)}
      style={{
        width: '50px',
        height: '30px',
        borderRadius: '15px',
        backgroundColor: checked ? '#708E9C' : '#E5DECF',
        position: 'relative',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
        flexShrink: 0,
      }}
    >
      <div
        style={{
          width: '26px',
          height: '26px',
          borderRadius: '50%',
          backgroundColor: '#FFFFFF',
          position: 'absolute',
          top: '2px',
          left: checked ? '22px' : '2px',
          transition: 'left 0.3s',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}
      />
    </div>
  )
}

function SettingItem({
  icon,
  title,
  subtext,
  rightElement,
  onClick
}: {
  icon?: React.ReactNode,
  title: string,
  subtext?: string,
  rightElement?: React.ReactNode,
  onClick?: () => void
}) {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '16px 0',
        borderBottom: `1px solid ${base.border}`,
        cursor: onClick ? 'pointer' : 'default'
      }}
    >
      {icon && (
        <div style={{ width: '24px', display: 'flex', justifyContent: 'center', marginRight: '16px', flexShrink: 0 }}>
          {icon}
        </div>
      )}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <span style={{ fontSize: font.size.body, color: base.textPrimary, fontFamily: font.family }}>{title}</span>
        {subtext && (
          <span style={{ fontSize: font.size.caption, color: base.textSecondary, fontFamily: font.family }}>{subtext}</span>
        )}
      </div>
      {rightElement ? (
        <div style={{ marginLeft: '16px' }}>{rightElement}</div>
      ) : (
        <ChevronRight />
      )}
    </div>
  )
}

function CardSection({ title, icon, children }: { title?: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div style={{
      backgroundColor: base.card,
      borderRadius: radius.lg,
      padding: '0 20px',
      marginBottom: '16px',
      boxShadow: shadow.soft,
    }}>
      {title && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          paddingTop: '20px', paddingBottom: '4px',
        }}>
          {icon && icon}
          <span style={{ fontSize: font.size.title, fontWeight: font.weight.semibold, color: base.textPrimary, fontFamily: font.family }}>{title}</span>
        </div>
      )}
      {children}
    </div>
  )
}

// ── Screen ────────────────────────────────────────────────────────────

export default function ProfileScreen() {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [faceIdEnabled, setFaceIdEnabled] = useState(true)
  const [quietNotifyEnabled, setQuietNotifyEnabled] = useState(true)
  const [darkModeEnabled, setDarkModeEnabled] = useState(false)
  
  const [nickname, setNickname] = useState('LuLu')
  const [isEditingName, setIsEditingName] = useState(false)
  const [editNameInput, setEditNameInput] = useState('')
  const [avatarUrl, setAvatarUrl] = useState(avatarImg)
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  useEffect(() => {
    const savedName = localStorage.getItem('userNickname')
    if (savedName) setNickname(savedName)
    
    const savedAvatar = localStorage.getItem('userAvatar')
    if (savedAvatar) setAvatarUrl(savedAvatar)
  }, [])

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async (e) => {
      const base64 = e.target?.result as string
      setAvatarUrl(base64)
      await profileService.updateAvatar(base64)
    }
    reader.readAsDataURL(file)
  }

  const handleEditNameClick = () => {
    setEditNameInput(nickname)
    setIsEditingName(true)
  }

  const handleSaveNameClick = async () => {
    if (!editNameInput.trim()) return
    const newName = editNameInput.trim().slice(0, 12)
    setNickname(newName)
    setIsEditingName(false)
    await profileService.updateNickname(newName)
  }

  const handleLogout = async () => {
    await profileService.logout()
    setShowLogoutModal(false)
    navigate('/login', { replace: true })
  }

  return (
    <div
      className="app-container screen-bg"
      style={{
        minHeight: '100dvh',
        paddingBottom: 'calc(100px + var(--safe-bottom))',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 0 20px',
      }}>
        <h1 style={{ margin: 0, fontSize: '28px', fontWeight: font.weight.semibold, color: base.textPrimary, fontFamily: font.family }}>
          {c.title}
        </h1>
        <button style={{ background: 'none', border: 'none', padding: '8px', cursor: 'pointer' }}>
          <GearIcon />
        </button>
      </div>

      <div style={{
        backgroundColor: base.card,
        borderRadius: radius.lg,
        padding: '24px 20px',
        marginBottom: '16px',
        boxShadow: shadow.soft,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
          
          {/* Avatar with Camera Button */}
          <div style={{ position: 'relative', marginRight: '20px', flexShrink: 0 }}>
            <div style={{
              width: '80px', height: '80px', borderRadius: '50%', overflow: 'hidden',
              backgroundColor: '#EAE1D3'
            }}>
              <img src={avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <button 
              onClick={handleAvatarClick}
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: '#FFF',
                border: 'none',
                boxShadow: shadow.card,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <CameraIcon />
            </button>
            <input 
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                
                {/* Nickname Row */}
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px', gap: '8px' }}>
                  {isEditingName ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input 
                        type="text"
                        value={editNameInput}
                        onChange={(e) => setEditNameInput(e.target.value.slice(0, 12))}
                        maxLength={12}
                        style={{
                          fontSize: '24px',
                          fontWeight: font.weight.semibold,
                          color: base.textPrimary,
                          fontFamily: font.family,
                          border: `1px solid ${base.border}`,
                          borderRadius: '4px',
                          padding: '0 4px',
                          width: '120px',
                          outline: 'none'
                        }}
                        autoFocus
                      />
                      <button 
                        onClick={handleSaveNameClick}
                        style={{ background: 'none', border: 'none', padding: '4px', cursor: 'pointer', display: 'flex' }}
                      >
                        <CheckIcon />
                      </button>
                    </div>
                  ) : (
                    <>
                      <h2 style={{ margin: 0, fontSize: '24px', fontWeight: font.weight.semibold, color: base.textPrimary, fontFamily: font.family }}>
                        {nickname}
                      </h2>
                      <button 
                        onClick={handleEditNameClick}
                        style={{ background: 'none', border: 'none', padding: '4px', cursor: 'pointer', display: 'flex' }}
                      >
                        <PencilIcon />
                      </button>
                    </>
                  )}
                </div>

                <p style={{ margin: 0, fontSize: font.size.caption, color: base.textSecondary, fontFamily: font.family }}>
                  本週也辛苦了 🌿
                </p>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '32px' }}>
          <div>
            <div style={{ fontSize: '24px', fontWeight: font.weight.bold, color: base.textPrimary, fontFamily: font.family }}>47</div>
            <div style={{ fontSize: '13px', color: base.textSecondary, fontFamily: font.family }}>{c.diariesCount}</div>
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: font.weight.bold, color: base.textPrimary, fontFamily: font.family }}>23</div>
            <div style={{ fontSize: '13px', color: base.textSecondary, fontFamily: font.family }}>{c.streakCount}</div>
          </div>
        </div>
      </div>

      <div style={{
        backgroundColor: base.card,
        borderRadius: radius.lg,
        padding: '20px',
        marginBottom: '24px',
        boxShadow: shadow.soft,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#F3E8D0',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <CrownIcon />
          </div>
          <div>
            <div style={{ fontSize: '16px', fontWeight: font.weight.semibold, color: base.textPrimary, fontFamily: font.family, marginBottom: '2px' }}>
              {c.currentPlan}
            </div>
            <div style={{ fontSize: '12px', color: base.textSecondary, fontFamily: font.family }}>
              {c.unlockPlus}
            </div>
          </div>
        </div>
        <button style={{
          backgroundColor: '#C59648',
          color: '#FFFFFF',
          border: 'none',
          borderRadius: radius.pill,
          padding: '8px 16px',
          fontSize: '14px',
          fontWeight: font.weight.medium,
          fontFamily: font.family,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          flexShrink: 0
        }}>
          {c.upgradePlan} &rarr;
        </button>
      </div>

      <CardSection title={c.sectionPrivacy} icon={<LockIcon />}>
        <SettingItem 
          icon={<UserIcon />} 
          title={c.loginAccount} 
          onClick={() => navigate('/profile/account')}
        />
        <SettingItem 
          icon={<LockIcon />} 
          title={c.privacyLock} 
          rightElement={<Switch checked={faceIdEnabled} onChange={setFaceIdEnabled} />} 
        />
        <SettingItem 
          icon={<BellIcon />} 
          title={c.quietNotify} 
          subtext={c.quietNotifyDesc}
          rightElement={<Switch checked={quietNotifyEnabled} onChange={setQuietNotifyEnabled} />} 
        />
        <div style={{ height: '8px' }} />
      </CardSection>

      <CardSection title={c.sectionGeneral} icon={<GearIcon />}>
        <SettingItem 
          icon={<BellIcon />} 
          title={c.notifySettings} 
        />
        <SettingItem 
          icon={<MoonIcon />} 
          title={c.darkMode} 
          rightElement={<Switch checked={darkModeEnabled} onChange={setDarkModeEnabled} />} 
        />
        <SettingItem 
          icon={<GlobeIcon />} 
          title={c.language} 
          rightElement={
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: base.textSecondary, fontSize: font.size.body, fontFamily: font.family }}>
              {c.langValue} <ChevronRight />
            </div>
          } 
        />
        <div style={{ height: '8px' }} />
      </CardSection>

      <CardSection title={c.sectionAbout} icon={<InfoIcon />}>
        <SettingItem 
          icon={<RefreshIcon />} 
          title={c.systemUpdate} 
          subtext={c.currentVersion}
        />
        <SettingItem 
          icon={<ChatIcon />} 
          title={c.feedback} 
        />
        <SettingItem 
          icon={<TeamIcon />} 
          title={c.aboutUs} 
        />
        <div style={{ height: '8px' }} />
      </CardSection>

      <button 
        onClick={() => setShowLogoutModal(true)}
        style={{
          marginTop: '16px',
          marginBottom: '32px',
          background: 'none',
          border: 'none',
          color: base.textSecondary,
          fontSize: font.size.body,
          fontWeight: font.weight.semibold,
          fontFamily: font.family,
          cursor: 'pointer',
          alignSelf: 'center'
        }}
      >
        {c.logout}
      </button>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '24px'
        }}>
          <div style={{
            backgroundColor: base.card,
            borderRadius: radius.lg,
            padding: '24px',
            width: '100%',
            maxWidth: '320px',
            boxShadow: shadow.raised,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <h3 style={{ margin: '0 0 12px', fontSize: '18px', color: base.textPrimary, fontFamily: font.family }}>
              {c.logoutConfirm}
            </h3>
            <div style={{ display: 'flex', gap: '16px', marginTop: '24px', width: '100%' }}>
              <button 
                onClick={() => setShowLogoutModal(false)}
                style={{
                  flex: 1,
                  padding: '12px 0',
                  borderRadius: radius.pill,
                  backgroundColor: base.border,
                  border: 'none',
                  color: base.textPrimary,
                  fontSize: font.size.body,
                  fontWeight: font.weight.medium,
                  cursor: 'pointer'
                }}
              >
                {c.logoutNo}
              </button>
              <button 
                onClick={handleLogout}
                style={{
                  flex: 1,
                  padding: '12px 0',
                  borderRadius: radius.pill,
                  backgroundColor: base.brandSprout,
                  border: 'none',
                  color: '#FFF',
                  fontSize: font.size.body,
                  fontWeight: font.weight.medium,
                  cursor: 'pointer'
                }}
              >
                {c.logoutYes}
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  )
}
