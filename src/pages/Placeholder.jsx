import styles from './Placeholder.module.css'
import { IconReport, IconFlask, IconSettings, IconPlus } from '../components/Icons'
import { Button } from '../components/UI'
import { usePWAInstall } from '../hooks'

const META = {
  reports:  { Icon: IconReport,   title: 'Reports',       desc: 'Monthly and annual farm reports with yield analysis, profit breakdowns, and AI-powered seasonal insights.' },
  inputs:   { Icon: IconFlask,    title: 'Input Tracker', desc: 'Track all seeds, fertilizers, pesticides and labour. Cost-per-acre analysis per crop.' },
  settings: { Icon: IconSettings, title: 'Settings',      desc: 'Manage your profile, farm details, notification preferences and offline sync settings.' },
}

export default function Placeholder({ page }) {
  const { Icon, title, desc } = META[page] || META.settings
  const { isInstallable, install } = usePWAInstall()

  return (
    <div className={styles.wrap}>
      <div className={styles.box}>
        <div className={styles.iconRing}>
          <Icon size={28} color="var(--forest)" />
        </div>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.desc}>{desc}</p>
        
        {page === 'settings' ? (
          <div className={styles.settingsActions}>
            <div className={styles.pill} style={{ marginBottom: 12 }}>Profile & Account</div>
            {isInstallable && (
              <Button variant="primary" onClick={install} style={{ width: '100%', marginBottom: 12 }}>
                Install AgriSmart App
              </Button>
            )}
            <Button variant="outline" style={{ width: '100%' }}>Edit Profile</Button>
          </div>
        ) : (
          <>
            <div className={styles.pill}>Coming in Phase 2</div>
            <Button variant="outline">Notify me when ready</Button>
          </>
        )}
      </div>
    </div>
  )
}
