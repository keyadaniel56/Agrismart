import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import styles from './Layout.module.css'
import {
  IconDashboard, IconCrop, IconMoney, IconMarket,
  IconReport, IconFlask, IconSettings, IconBell,
  IconSearch, IconWifi, IconWifiOff, IconCloud
} from './Icons'

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
          <div className={styles.farmCardName}>Kamau's Shamba</div>
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
            <button className={`${styles.iconBtn} ${styles.notifBtn}`}>
              <IconBell size={16} />
              <span className={styles.notifDot} />
            </button>
            <div className={styles.avatar}>JK</div>
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
            `${styles.navItem} ${isActive ? styles['navItem--active'] : ''}`
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
