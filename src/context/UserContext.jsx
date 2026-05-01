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
    const initializeAuth = async () => {
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
        try {
          const data = await authAPI.getProfile()
          setUser(data.user)
          localStorage.setItem('user', JSON.stringify(data.user))
          setIsAuthenticated(true)
        } catch (error) {
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
        } finally {
          setIsLoading(false)
        }
      } else {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const login = async (email, password) => {
    try {
      const data = await authAPI.login(email, password)
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      setUser(data.user)
      setIsAuthenticated(true)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const register = async userData => {
    try {
      // Clear auth cache before registration
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      sessionStorage.clear()

      const data = await authAPI.register(userData)
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      setUser(data.user)
      setIsAuthenticated(true)
      return { success: true }
    } catch (error) {
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
      return { success: false, error: error.message }
    }
  }

  const changePassword = async (currentPassword, newPassword) => {
    try {
      await authAPI.changePassword(currentPassword, newPassword)
      return { success: true }
    } catch (error) {
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
