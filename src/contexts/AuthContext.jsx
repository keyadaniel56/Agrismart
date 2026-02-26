import { createContext, useContext, useState, useEffect } from 'react'
import * as db from '../utils/db'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedUser = localStorage.getItem('agri_user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    const foundUser = await db.get('users', email)
    if (foundUser && foundUser.password === password) {
      const { password, ...userWithoutPassword } = foundUser
      setUser(userWithoutPassword)
      localStorage.setItem('agri_user', JSON.stringify(userWithoutPassword))
      return { success: true }
    }
    return { success: false, message: 'Invalid email or password' }
  }

  const register = async (userData) => {
    const existing = await db.get('users', userData.email)
    if (existing) {
      return { success: false, message: 'User already exists' }
    }
    
    // Save to DB
    await db.put('users', userData)
    
    // Log in automatically
    const { password, ...userWithoutPassword } = userData
    setUser(userWithoutPassword)
    localStorage.setItem('agri_user', JSON.stringify(userWithoutPassword))
    return { success: true }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('agri_user')
  }

  const updateProfile = async (updates) => {
    if (!user) return
    const fullUser = await db.get('users', user.email)
    const updatedUser = { ...fullUser, ...updates }
    await db.put('users', updatedUser)
    
    const { password, ...userWithoutPassword } = updatedUser
    setUser(userWithoutPassword)
    localStorage.setItem('agri_user', JSON.stringify(userWithoutPassword))
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateProfile, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
