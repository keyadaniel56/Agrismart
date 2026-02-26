import { useState, useEffect } from 'react'

// ── useOnlineStatus ────────────────────────────────────────────────────────
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  useEffect(() => {
    const on  = () => setIsOnline(true)
    const off = () => setIsOnline(false)
    window.addEventListener('online', on)
    window.addEventListener('offline', off)
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off) }
  }, [])
  return isOnline
}

// ── useOfflineQueue ────────────────────────────────────────────────────────
export function useOfflineQueue() {
  const [queue, setQueue] = useState([])

  const enqueue = (action) => {
    const item = { id: Date.now(), ...action, queuedAt: new Date().toISOString() }
    setQueue(q => [...q, item])
    // In production: persist to IndexedDB
    return item.id
  }

  const dequeue = (id) => setQueue(q => q.filter(i => i.id !== id))

  const flush = async (apiHandler) => {
    for (const item of queue) {
      try {
        await apiHandler(item)
        dequeue(item.id)
      } catch {
        break // stop on first failure, retry later
      }
    }
  }

  return { queue, enqueue, dequeue, flush, pendingCount: queue.length }
}

// ── useLocalStorage ────────────────────────────────────────────────────────
export function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key)
      return stored ? JSON.parse(stored) : initial
    } catch { return initial }
  })
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(value)) } catch {}
  }, [key, value])
  return [value, setValue]
}

// ── useDerivedFinancials ───────────────────────────────────────────────────
export function useDerivedFinancials(transactions) {
  const totalIncome  = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
  const netProfit    = totalIncome - totalExpense
  const roi          = totalExpense > 0 ? Math.round((netProfit / totalExpense) * 100) : 0
  return { totalIncome, totalExpense, netProfit, roi }
}

export { usePWAInstall } from './usePWAInstall'
export { useLocalData } from './useLocalData'
