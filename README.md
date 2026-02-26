# AgriSmart Frontend

Production-grade React PWA frontend for the AgriSmart farm intelligence platform.

## Tech Stack

- React 18 + React Router v6
- Vite (build tool)
- CSS Modules (scoped styles per component)
- No external UI libraries — fully custom design system

## Project Structure

```
agrismart-frontend/
├── index.html                  # HTML entry point + Google Fonts
├── vite.config.js
├── package.json
├── public/
│   ├── manifest.json           # PWA manifest
│   └── sw.js                   # Service worker (offline support)
└── src/
    ├── main.jsx                # App entry + SW registration
    ├── App.jsx                 # Router + Layout wrapper
    ├── styles/
    │   └── global.css          # Design tokens + resets + animations
    ├── utils/
    │   └── data.js             # Mock data + helpers (replace with API calls)
    ├── hooks/
    │   └── index.js            # useOnlineStatus, useOfflineQueue, useDerivedFinancials
    ├── components/
    │   ├── Icons.jsx           # SVG icon set (no emoji, no icon font)
    │   ├── UI.jsx              # Shared components: Button, Modal, Table, Tabs…
    │   ├── UI.module.css
    │   ├── Layout.jsx          # Sidebar + Topbar shell
    │   └── Layout.module.css
    └── pages/
        ├── Dashboard.jsx       # KPIs, revenue chart, crop overview
        ├── Dashboard.module.css
        ├── Crops.jsx           # Crop grid with lifecycle timeline
        ├── Crops.module.css
        ├── Finance.jsx         # Income/expense/profit + transactions
        ├── Finance.module.css
        ├── Marketplace.jsx     # Listings, my listings, orders
        ├── Marketplace.module.css
        ├── Placeholder.jsx     # Reports / Inputs / Settings stubs
        └── Placeholder.module.css
```

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

Open http://localhost:3000

## Connecting to the Go Backend

Replace the mock data in `src/utils/data.js` with API calls. Example pattern:

```js
// src/utils/api.js
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080'

const authHeader = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token')}`,
})

export const getCrops     = () => fetch(`${BASE}/api/crops`,         { headers: authHeader() }).then(r => r.json())
export const createCrop   = (body) => fetch(`${BASE}/api/crops`,     { method: 'POST', headers: authHeader(), body: JSON.stringify(body) }).then(r => r.json())
export const getSales     = () => fetch(`${BASE}/api/sales`,         { headers: authHeader() }).then(r => r.json())
export const getExpenses  = () => fetch(`${BASE}/api/expenses`,      { headers: authHeader() }).then(r => r.json())
export const getListings  = () => fetch(`${BASE}/api/marketplace`,   { headers: authHeader() }).then(r => r.json())
export const getMonthlyReport = (month, year) =>
  fetch(`${BASE}/api/reports/monthly?month=${month}&year=${year}`, { headers: authHeader() }).then(r => r.json())
```

## PWA / Offline

The service worker (`public/sw.js`) caches static assets and API responses.
Pending offline actions are queued via `useOfflineQueue` hook and synced via Background Sync API when back online.

## Design System

Design tokens are defined as CSS custom properties in `src/styles/global.css`:

| Token         | Value     | Usage                  |
|---------------|-----------|------------------------|
| `--canopy`    | `#1a3a1a` | Sidebar background     |
| `--forest`    | `#2d5a2d` | Primary buttons        |
| `--leaf`      | `#4a8c4a` | Accents, income        |
| `--lime`      | `#7ab648` | Active nav, highlights |
| `--harvest`   | `#b8860b` | Secondary CTA          |
| `--sand`      | `#c8a96e` | Expense bars           |
| `--soil`      | `#3d2b1f` | Body text              |
| `--parchment` | `#f4f1ec` | Page background        |

Fonts: **DM Serif Display** (headings) + **DM Sans** (body)
