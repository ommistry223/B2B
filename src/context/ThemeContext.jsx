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

  // Set initial theme on mount
  useEffect(() => {
    const root = document.documentElement
    const initialTheme = theme
    root.classList.remove('light', 'dark')
    root.classList.add(initialTheme)
  }, [])

  useEffect(() => {
    // Apply theme to document root
    const root = document.documentElement

    // Add transition class before changing theme
    root.style.transition = 'background-color 0.3s ease, color 0.3s ease'

    // Small delay to ensure smooth transition
    setTimeout(() => {
      root.classList.remove('light', 'dark')
      root.classList.add(theme)

      // Save to localStorage
      try {
        window.localStorage.setItem('theme', theme)
      } catch (error) {
        // Ignore storage errors in restricted environments
      }

      // Remove transition after a short delay
      setTimeout(() => {
        root.style.transition = ''
      }, 300)
    }, 10)
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
