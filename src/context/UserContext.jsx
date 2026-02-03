import React, { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../services/api'

const UserContext = createContext()

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Load user data on mount
  useEffect(() => {
    const token = localStorage.getItem('token')
    const cachedUser = (() => {
      try {
        const stored = localStorage.getItem('user')
        return stored ? JSON.parse(stored) : null
      } catch {
        return null
      }
    })()

    if (cachedUser) {
      setUser(cachedUser)
    }

    if (token) {
      setIsAuthenticated(true)
      console.log('🔐 Token found, loading user profile...')
      // Verify token and get user profile
      authAPI
        .getProfile()
        .then(data => {
          console.log('✅ User profile loaded:', data.user?.email)
          setUser(data.user)
          localStorage.setItem('user', JSON.stringify(data.user))
          setIsAuthenticated(true)
        })
        .catch(error => {
          console.error('❌ Error loading user profile:', error)
          const message = (error?.message || '').toLowerCase()
          const shouldLogout =
            message.includes('invalid token') ||
            message.includes('token expired') ||
            message.includes('no token') ||
            message.includes('401')

          if (shouldLogout) {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            setUser(null)
            setIsAuthenticated(false)
          } else {
            // Keep cached user if available; token might still be valid
            setIsAuthenticated(true)
          }
        })
        .finally(() => {
          setIsLoading(false)
        })
    } else {
      console.log('ℹ️ No token found, user not authenticated')
      setIsLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    try {
      console.log('🔐 Attempting login for:', email)
      const data = await authAPI.login(email, password)
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      console.log('✅ Login successful, token saved')
      console.log('👤 User:', data.user?.email, '| ID:', data.user?.id)
      setUser(data.user)
      setIsAuthenticated(true)
      return { success: true }
    } catch (error) {
      console.error('❌ Login error:', error)
      return { success: false, error: error.message }
    }
  }

  const register = async userData => {
    try {
      console.log('📝 Attempting registration for:', userData.email)
      // Clear auth cache before registration
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      sessionStorage.clear()

      const data = await authAPI.register(userData)
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      console.log('✅ Registration successful')
      console.log('👤 New user:', data.user?.email, '| ID:', data.user?.id)
      setUser(data.user)
      setIsAuthenticated(true)
      return { success: true }
    } catch (error) {
      console.error('❌ Registration error:', error)
      return { success: false, error: error.message }
    }
  }

  const logout = () => {
    // Clear auth storage only
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    sessionStorage.clear()
    setUser(null)
    setIsAuthenticated(false)
    // Reload page to clear any cached data
    window.location.href = '/login'
  }

  const updateUser = async updatedData => {
    try {
      const data = await authAPI.updateProfile(updatedData)
      setUser(data.user)
      localStorage.setItem('user', JSON.stringify(data.user))
      return { success: true }
    } catch (error) {
      console.error('Update profile error:', error)
      return { success: false, error: error.message }
    }
  }

  const changePassword = async (currentPassword, newPassword) => {
    try {
      await authAPI.changePassword(currentPassword, newPassword)
      return { success: true }
    } catch (error) {
      console.error('Change password error:', error)
      return { success: false, error: error.message }
    }
  }

  return (
    <UserContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        updateUser,
        changePassword,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}
