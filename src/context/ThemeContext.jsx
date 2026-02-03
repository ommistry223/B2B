import React, { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Get theme from localStorage or default to 'light'
    try {
      if (typeof window === 'undefined') return 'light'
      const savedTheme = window.localStorage.getItem('theme')
      return savedTheme || 'light'
    } catch (error) {
      return 'light'
    }
  })

  useEffect(() => {
    // Apply theme to document root
    const root = document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(theme)

    // Save to localStorage
    try {
      window.localStorage.setItem('theme', theme)
    } catch (error) {
      // Ignore storage errors in restricted environments
    }
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'))
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
