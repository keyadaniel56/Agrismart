import { createContext, useContext, useState, useEffect } from 'react'

const NotificationContext = createContext()

const INITIAL_NOTIFICATIONS = [
  { id: 1, title: 'New Order', message: 'ORD-003 has been approved.', date: '2026-02-26', read: false },
  { id: 2, title: 'Harvest Reminder', message: 'Kales are ready for harvest.', date: '2026-02-24', read: true },
  { id: 3, title: 'Price Update', message: 'Maize price increased by 5%.', date: '2026-02-23', read: true },
]

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('agri_notifs')
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS
  })

  useEffect(() => {
    localStorage.setItem('agri_notifs', JSON.stringify(notifications))
  }, [notifications])

  const addNotification = (notif) => {
    setNotifications(prev => [
      { ...notif, id: Date.now(), date: new Date().toISOString().split('T')[0], read: false },
      ...prev
    ])
  }

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const clearAll = () => {
    setNotifications([])
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, markAsRead, clearAll, unreadCount }}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotifications = () => useContext(NotificationContext)
