import styles from './UI.module.css'
import { IconX } from './Icons'

// ─── BUTTON ───────────────────────────────────────────────────────────────────
export function Button({ variant = 'primary', size = 'md', children, className = '', ...props }) {
  return (
    <button
      className={`${styles.btn} ${styles[`btn--${variant}`]} ${styles[`btn--${size}`]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

// ─── BADGE ────────────────────────────────────────────────────────────────────
export function Badge({ variant = 'default', children }) {
  return <span className={`${styles.badge} ${styles[`badge--${variant}`]}`}>{children}</span>
}

// ─── CARD ─────────────────────────────────────────────────────────────────────
export function Card({ children, className = '', onClick }) {
  return (
    <div className={`${styles.card} ${onClick ? styles['card--clickable'] : ''} ${className}`} onClick={onClick}>
      {children}
    </div>
  )
}

// ─── PANEL ────────────────────────────────────────────────────────────────────
export function Panel({ children, className = '' }) {
  return <div className={`${styles.panel} ${className}`}>{children}</div>
}

export function PanelHeader({ title, action, onAction }) {
  return (
    <div className={styles.panelHeader}>
      <h2 className={styles.panelTitle}>{title}</h2>
      {action && (
        <button className={styles.panelAction} onClick={onAction}>{action}</button>
      )}
    </div>
  )
}

// ─── MODAL ────────────────────────────────────────────────────────────────────
export function Modal({ title, onClose, children, width = 480 }) {
  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal} style={{ maxWidth: width }}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{title}</h2>
          <button className={styles.modalClose} onClick={onClose} aria-label="Close">
            <IconX size={16} />
          </button>
        </div>
        <div className={styles.modalBody}>{children}</div>
      </div>
    </div>
  )
}

// ─── FORM ELEMENTS ────────────────────────────────────────────────────────────
export function FormGroup({ label, children }) {
  return (
    <div className={styles.formGroup}>
      <label className={styles.formLabel}>{label}</label>
      {children}
    </div>
  )
}

export function Input({ ...props }) {
  return <input className={styles.input} {...props} />
}

export function Select({ children, ...props }) {
  return <select className={styles.select} {...props}>{children}</select>
}

export function FormRow({ children }) {
  return <div className={styles.formRow}>{children}</div>
}

// ─── STAT CARD ────────────────────────────────────────────────────────────────
export function StatCard({ label, value, sub, trend, accentColor }) {
  return (
    <div className={styles.statCard} style={{ '--accent': accentColor }}>
      <div className={styles.statLabel}>{label}</div>
      <div className={styles.statValue}>{value}</div>
      {(sub || trend) && (
        <div className={`${styles.statSub} ${trend === 'up' ? styles['statSub--up'] : trend === 'down' ? styles['statSub--down'] : ''}`}>
          {sub}
        </div>
      )}
      <div className={styles.statAccent} />
    </div>
  )
}

// ─── EMPTY STATE ──────────────────────────────────────────────────────────────
export function EmptyState({ title, description, action }) {
  return (
    <div className={styles.empty}>
      <div className={styles.emptyIcon} />
      <div className={styles.emptyTitle}>{title}</div>
      <p className={styles.emptyDesc}>{description}</p>
      {action}
    </div>
  )
}

// ─── PROGRESS BAR ─────────────────────────────────────────────────────────────
export function ProgressBar({ value, max, color = 'var(--leaf)' }) {
  const pct = Math.min(100, Math.round((value / max) * 100))
  return (
    <div className={styles.progressTrack}>
      <div className={styles.progressFill} style={{ width: `${pct}%`, background: color }} />
    </div>
  )
}

// ─── TABLE ────────────────────────────────────────────────────────────────────
export function Table({ headers, children }) {
  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            {headers.map((h) => <th key={h}>{h}</th>)}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  )
}

// ─── TABS ─────────────────────────────────────────────────────────────────────
export function Tabs({ tabs, active, onChange }) {
  return (
    <div className={styles.tabs}>
      {tabs.map((t) => (
        <button
          key={t.value}
          className={`${styles.tab} ${active === t.value ? styles['tab--active'] : ''}`}
          onClick={() => onChange(t.value)}
        >
          {t.label}
          {t.count != null && <span className={styles.tabCount}>{t.count}</span>}
        </button>
      ))}
    </div>
  )
}
