import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import styles from './Layout.module.css'
import {
  IconDashboard, IconCrop, IconMoney, IconMarket,
  IconReport, IconFlask, IconSettings, IconBell,
  IconSearch, IconWifi, IconWifiOff, IconCloud, IconUser, IconLogOut
} from './Icons'
import { useAuth } from '../contexts/AuthContext'
import { useNotifications } from '../contexts/NotificationContext'
import { Modal, Button, FormGroup, Input, Card } from './UI'

const NAV = [
  { to: '/',           label: 'Dashboard',     Icon: IconDashboard },
  { to: '/crops',      label: 'Crops',         Icon: IconCrop,    badge: 6 },
  { to: '/finance',    label: 'Finances',       Icon: IconMoney },
  { to: '/marketplace',label: 'Marketplace',   Icon: IconMarket,  badge: 3 },
  { to: '/reports',    label: 'Reports',        Icon: IconReport, section: 'tools' },
  { to: '/inputs',     label: 'Input Tracker',  Icon: IconFlask,  section: 'tools' },
  { to: '/settings',   label: 'Settings',       Icon: IconSettings, section: 'account' },
]

const PAGE_TITLES = {
  '/':            { title: 'Dashboard',        sub: 'Thursday, 26 Feb 2026' },
  '/crops':       { title: 'Crop Management',  sub: 'Track and manage your crops' },
  '/finance':     { title: 'Finances',          sub: 'Monitor income, expenses and profit' },
  '/marketplace': { title: 'Marketplace',       sub: 'Buy and sell farm produce' },
  '/reports':     { title: 'Reports',           sub: 'Monthly and yearly analytics' },
  '/inputs':      { title: 'Input Tracker',     sub: 'Seeds, fertilizers and pesticides' },
  '/settings':    { title: 'Settings',          sub: 'Account and app preferences' },
}

export default function Layout({ children, isOnline }) {
  const { pathname } = useLocation()
  const page = PAGE_TITLES[pathname] || { title: 'AgriSmart', sub: '' }
  const { user, login, logout } = useAuth()
  const { notifications, unreadCount, markAsRead } = useNotifications()

  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showNotifModal, setShowNotifModal] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)

  const [loginEmail, setLoginEmail] = useState('')
  const [loginPass, setLoginPass] = useState('')

  const handleLogin = (e) => {
    e.preventDefault()
    // Simulated login
    login({ name: 'John Kamau', email: loginEmail, initials: 'JK' })
    setShowAuthModal(false)
  }

  const mainNav    = NAV.filter(n => !n.section)
  const toolsNav   = NAV.filter(n => n.section === 'tools')
  const accountNav = NAV.filter(n => n.section === 'account')

  return (
    <div className={styles.shell}>
      {/* ── SIDEBAR (Desktop) ── */}
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <div className={styles.brandMark} />
          <div>
            <div className={styles.brandName}>AgriSmart</div>
            <div className={styles.brandSub}>Farm Intelligence</div>
          </div>
        </div>

        <div className={styles.farmCard}>
          <div className={styles.farmCardLabel}>Active Farm</div>
          <div className={styles.farmCardName}>{user ? `${user.name.split(' ')[1]}'s Shamba` : 'Guest Farm'}</div>
          <div className={styles.farmCardMeta}>Kiambu County &mdash; 12.5 acres</div>
        </div>

        <nav className={styles.nav}>
          <NavSection label="Main" items={mainNav} />
          <NavSection label="Tools" items={toolsNav} />
          <NavSection label="Account" items={accountNav} />
        </nav>

        <div className={styles.sidebarBottom}>
          <div className={styles.weather}>
            <IconCloud size={18} color="var(--rain)" />
            <div>
              <div className={styles.weatherTemp}>24 &deg;C</div>
              <div className={styles.weatherDesc}>Partly Cloudy &mdash; Rain Friday</div>
            </div>
          </div>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div className={styles.main}>
        {!isOnline && (
          <div className={styles.offlineBanner}>
            <IconWifiOff size={14} />
            Offline mode &mdash; 2 actions pending sync
          </div>
        )}

        <header className={styles.topbar}>
          <div className={styles.topbarLeft}>
            <h1 className={styles.pageTitle}>{page.title}</h1>
            <p className={styles.pageSub}>{page.sub}</p>
          </div>

          <div className={styles.searchBar}>
            <IconSearch size={14} color="var(--clay)" />
            <input placeholder="Search crops, transactions&hellip;" />
          </div>

          <div className={styles.topbarRight}>
            <div
              className={`${styles.statusIndicator} ${isOnline ? styles['statusIndicator--online'] : styles['statusIndicator--offline']}`}
              title={isOnline ? "Connected" : "Offline"}
            >
              {isOnline ? <IconWifi size={16} /> : <IconWifiOff size={16} />}
            </div>
            <button 
              className={`${styles.iconBtn} ${styles.notifBtn}`}
              onClick={() => setShowNotifModal(true)}
            >
              <IconBell size={16} />
              {unreadCount > 0 && <span className={styles.notifDot} />}
            </button>
            {user ? (
              <div className={styles.avatar} onClick={() => setShowProfileModal(true)}>
                {user.initials}
              </div>
            ) : (
              <Button size="sm" onClick={() => setShowAuthModal(true)}>Login</Button>
            )}
          </div>
        </header>

        <main className={styles.content}>
          {children}
        </main>

        {/* ── BOTTOM NAV (Mobile) ── */}
        <nav className={styles.bottomNav}>
          {mainNav.map(({ to, label, Icon }) => (
            <NavLink
              key={to} to={to} end={to === '/'}
              className={({ isActive }) =>
                `${styles.bottomNavItem} ${isActive ? styles['bottomNavItem--active'] : ''}`
              }
            >
              <Icon size={20} />
              <span>{label}</span>
            </NavLink>
          ))}
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `${styles.bottomNavItem} ${isActive ? styles['bottomNavItem--active'] : ''}`
            }
          >
            <IconSettings size={20} />
            <span>Settings</span>
          </NavLink>
        </nav>
      </div>

      {/* ── MODALS ── */}
      {showAuthModal && (
        <Modal title="Login to AgriSmart" onClose={() => setShowAuthModal(false)}>
          <form onSubmit={handleLogin}>
            <FormGroup label="Email Address">
              <Input 
                type="email" 
                placeholder="john@example.com" 
                required 
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />
            </FormGroup>
            <FormGroup label="Password">
              <Input 
                type="password" 
                placeholder="••••••••" 
                required 
                value={loginPass}
                onChange={(e) => setLoginPass(e.target.value)}
              />
            </FormGroup>
            <Button type="submit" style={{ width: '100%', marginTop: '1rem' }}>Login</Button>
          </form>
        </Modal>
      )}

      {showProfileModal && user && (
        <Modal title="User Profile" onClose={() => setShowProfileModal(false)}>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div className={styles.avatar} style={{ width: 64, height: 64, fontSize: 24, margin: '0 auto 1rem' }}>
              {user.initials}
            </div>
            <h3 style={{ margin: 0 }}>{user.name}</h3>
            <p style={{ color: 'var(--clay)', fontSize: '0.9rem' }}>{user.email}</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <Button variant="secondary" onClick={() => setShowProfileModal(false)}>
              <IconUser size={16} style={{ marginRight: 8 }} /> Edit Profile
            </Button>
            <Button variant="secondary" onClick={() => { logout(); setShowProfileModal(false); }} style={{ color: 'var(--danger)' }}>
              <IconLogOut size={16} style={{ marginRight: 8 }} /> Logout
            </Button>
          </div>
        </Modal>
      )}

      {showNotifModal && (
        <Modal title="Notifications" onClose={() => setShowNotifModal(false)}>
          {notifications.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--clay)' }}>No notifications</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {notifications.map(n => (
                <Card 
                  key={n.id} 
                  className={styles.notifCard} 
                  onClick={() => { markAsRead(n.id); }}
                  style={{ opacity: n.read ? 0.6 : 1, borderLeft: n.read ? 'none' : '4px solid var(--leaf)' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <strong>{n.title}</strong>
                    <span style={{ fontSize: '0.8rem', color: 'var(--clay)' }}>{n.date}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.9rem' }}>{n.message}</p>
                </Card>
              ))}
            </div>
          )}
        </Modal>
      )}
    </div>
  )
}

function NavSection({ label, items }) {
  return (
    <>
      <div className={styles.navLabel}>{label}</div>
      {items.map(({ to, label, Icon, badge }) => (
        <NavLink
          key={to} to={to} end={to === '/'}
          className={({ isActive }) =>
            `${styles.navItem} ${isActive ? styles['bottomNavItem--active'] : ''} ${isActive ? styles['navItem--active'] : ''}`
          }
        >
          <Icon size={17} />
          <span>{label}</span>
          {badge && <span className={styles.navBadge}>{badge}</span>}
        </NavLink>
      ))}
    </>
  )
}
