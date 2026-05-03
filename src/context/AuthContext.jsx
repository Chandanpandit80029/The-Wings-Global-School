import React, { createContext, useContext, useState, useEffect } from 'react'
import {
  signIn,
  logOut,
  onAuthStateChange,
  getCurrentUser,
} from '@/services/auth'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    // Get initial user
    const initUser = async () => {
      try {
        const currentUser = await getCurrentUser()
        setUser(currentUser)
        setIsAdmin(currentUser?.isAdmin || false)
      } catch (error) {
        console.error('Error getting current user:', error)
        setUser(null)
        setIsAdmin(false)
      } finally {
        setLoading(false)
      }
    }

    initUser()

    // Subscribe to auth state changes
    const unsubscribe = onAuthStateChange(async (currentUser) => {
      setUser(currentUser)
      setIsAdmin(currentUser?.isAdmin || false)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const login = async (email, password) => {
    try {
      const result = await signIn(email, password)
      setUser(result.user)
      setIsAdmin(result.isAdmin)
      return result
    } catch (error) {
      throw error
    }
  }

  const logout = async () => {
    try {
      await logOut()
      setUser(null)
      setIsAdmin(false)
    } catch (error) {
      throw error
    }
  }

  const value = {
    user,
    loading,
    isAdmin,
    isAuthenticated: !!user,
    login,
    logout,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext