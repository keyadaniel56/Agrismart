import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './styles/global.css'
import { seedDB } from './utils/db'
import { CROPS, TRANSACTIONS, LISTINGS, ORDERS } from './utils/data'

// Seed initial data
seedDB({
  crops: CROPS,
  transactions: TRANSACTIONS,
  listings: LISTINGS,
  orders: ORDERS
}).catch(console.error)

// Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => {
        console.log('[SW] Registered:', reg.scope)
        // If the service worker is updated, it takes control immediately
        reg.onupdatefound = () => {
          const installingWorker = reg.installing;
          installingWorker.onstatechange = () => {
            if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('[SW] New version available, please refresh.');
            }
          };
        };
      })
      .catch((err) => console.warn('[SW] Registration failed:', err))
  })
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
