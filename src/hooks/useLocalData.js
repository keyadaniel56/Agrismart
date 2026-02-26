import { useState, useEffect } from 'react'
import * as db from '../utils/db'

export function useLocalData(storeName) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const refresh = async () => {
    try {
      setLoading(true)
      const result = await db.getAll(storeName)
      setData(result)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [storeName])

  const add = async (newItem) => {
    try {
      await db.add(storeName, newItem)
      await refresh()
    } catch (err) {
      console.error(`Failed to add to ${storeName}:`, err)
      throw err
    }
  }

  const update = async (item) => {
    try {
      await db.put(storeName, item)
      await refresh()
    } catch (err) {
      console.error(`Failed to update ${storeName}:`, err)
      throw err
    }
  }

  return { data, loading, error, add, update, refresh }
}
