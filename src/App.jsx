import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard   from './pages/Dashboard'
import Crops       from './pages/Crops'
import Finance     from './pages/Finance'
import Marketplace from './pages/Marketplace'
import Placeholder from './pages/Placeholder'

export default function App() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  useEffect(() => {
    const handleOnline  = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online',  handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online',  handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return (
    <Layout isOnline={isOnline}>
      <Routes>
        <Route path="/"            element={<Dashboard />} />
        <Route path="/crops"       element={<Crops />} />
        <Route path="/finance"     element={<Finance />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/reports"     element={<Placeholder page="reports" />} />
        <Route path="/inputs"      element={<Placeholder page="inputs" />} />
        <Route path="/settings"    element={<Placeholder page="settings" />} />
        <Route path="*"            element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}
