// Pure SVG icon set — no emojis, no icon fonts
// Each icon accepts { size, color, strokeWidth } props

const Icon = ({ d, size = 20, color = 'currentColor', sw = 1.75, viewBox = '0 0 24 24', fill = 'none', ...rest }) => (
  <svg
    width={size} height={size} viewBox={viewBox}
    fill={fill} stroke={color} strokeWidth={sw}
    strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true" {...rest}
  >
    {typeof d === 'string' ? <path d={d} /> : d}
  </svg>
)

export const IconDashboard = (p) => (
  <Icon {...p} d={
    <><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></>
  } />
)

export const IconCrop = (p) => (
  <Icon {...p} d={
    <><path d="M12 22V12" /><path d="M12 12C12 7 7 4 3 5c0 5 3 8 9 7" /><path d="M12 12c0-5 5-8 9-7c0 5-3 8-9 7" /></>
  } />
)

export const IconMoney = (p) => (
  <Icon {...p} d={
    <><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" /><line x1="12" y1="12" x2="12" y2="16" /><line x1="10" y1="14" x2="14" y2="14" /></>
  } />
)

export const IconMarket = (p) => (
  <Icon {...p} d={
    <><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" /></>
  } />
)

export const IconReport = (p) => (
  <Icon {...p} d={
    <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></>
  } />
)

export const IconFlask = (p) => (
  <Icon {...p} d={
    <><path d="M9 3h6" /><path d="M10 3v6.4L5.5 18A2 2 0 0 0 7.4 21h9.2a2 2 0 0 0 1.9-2.6L14 9.4V3" /></>
  } />
)

export const IconSettings = (p) => (
  <Icon {...p} d={
    <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></>
  } />
)

export const IconBell = (p) => (
  <Icon {...p} d={
    <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></>
  } />
)

export const IconSearch = (p) => (
  <Icon {...p} d={<><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></>} />
)

export const IconPlus = (p) => (
  <Icon {...p} d={<><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></>} />
)

export const IconX = (p) => (
  <Icon {...p} d={<><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>} />
)

export const IconChevronRight = (p) => (
  <Icon {...p} d="M9 18l6-6-6-6" />
)

export const IconTrendUp = (p) => (
  <Icon {...p} d={<><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></>} />
)

export const IconTrendDown = (p) => (
  <Icon {...p} d={<><polyline points="23 18 13.5 8.5 8.5 13.5 1 6" /><polyline points="17 18 23 18 23 12" /></>} />
)

export const IconMapPin = (p) => (
  <Icon {...p} d={<><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></>} />
)

export const IconCheck = (p) => (
  <Icon {...p} d="M20 6L9 17l-5-5" />
)

export const IconCloud = (p) => (
  <Icon {...p} d={<><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" /></>} />
)

export const IconWifi = (p) => (
  <Icon {...p} d={
    <><path d="M5 12.55a11 11 0 0 1 14.08 0" /><path d="M1.42 9a16 16 0 0 1 21.16 0" /><path d="M8.53 16.11a6 6 0 0 1 6.95 0" /><line x1="12" y1="20" x2="12.01" y2="20" /></>
  } />
)

export const IconWifiOff = (p) => (
  <Icon {...p} d={
    <><line x1="1" y1="1" x2="23" y2="23" /><path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" /><path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" /><path d="M10.71 5.05A16 16 0 0 1 22.56 9" /><path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" /><path d="M8.53 16.11a6 6 0 0 1 6.95 0" /><line x1="12" y1="20" x2="12.01" y2="20" /></>
  } />
)

export const IconCalendar = (p) => (
  <Icon {...p} d={
    <><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></>
  } />
)

export const IconPackage = (p) => (
  <Icon {...p} d={
    <><line x1="16.5" y1="9.4" x2="7.5" y2="4.21" /><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></>
  } />
)

export const IconUser = (p) => (
  <Icon {...p} d={<><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>} />
)

export const IconLogOut = (p) => (
  <Icon {...p} d={<><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></>} />
)

export const IconRefresh = (p) => (
  <Icon {...p} d={
    <><polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" /></>
  } />
)
