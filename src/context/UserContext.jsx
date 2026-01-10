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

    if (token) {
      // Verify token and get user profile
      authAPI
        .getProfile()
        .then(data => {
          setUser(data.user)
          setIsAuthenticated(true)
        })
        .catch(error => {
          console.error('Error loading user profile:', error)
          localStorage.removeItem('token')
          setUser(null)
          setIsAuthenticated(false)
        })
        .finally(() => {
          setIsLoading(false)
        })
    } else {
      setIsLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    try {
      const data = await authAPI.login(email, password)
      localStorage.setItem('token', data.token)
      setUser(data.user)
      setIsAuthenticated(true)
      return { success: true }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: error.message }
    }
  }

  const register = async userData => {
    try {
      // Clear any existing tokens before registration
      localStorage.clear()
      sessionStorage.clear()
      
      const data = await authAPI.register(userData)
      localStorage.setItem('token', data.token)
      setUser(data.user)
      setIsAuthenticated(true)
      return { success: true }
    } catch (error) {
      console.error('Registration error:', error)
      return { success: false, error: error.message }
    }
  }

  const logout = () => {
    // Clear all localStorage items
    localStorage.clear()
    // Clear session storage as well
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
