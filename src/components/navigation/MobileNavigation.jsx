import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Icon from '../AppIcon'
import Button from '../ui/Button'
import { useUser } from '../../context/UserContext'
import { useTheme } from '../../context/ThemeContext'

const MobileNavigation = ({
  isOpen,
  onClose,
  navigationItems,
  isActivePath,
}) => {
  const navigate = useNavigate()
  const { user, logout } = useUser()
  const { theme, toggleTheme } = useTheme()

  // Get user initials
  const getInitials = () => {
    if (!user?.fullName) return 'U'
    return user.fullName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
  }

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = e => {
      if (e?.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  const handleLogout = () => {
    logout()
    onClose()
    navigate('/login')
  }

  if (!isOpen) return null

  return (
    <div className="mobile-nav-overlay">
      <div className="mobile-nav-container">
        <div className="mobile-nav-header">
          <Link to="/dashboard" onClick={onClose} className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
            <div className="header-logo-icon">
              <Icon name="TrendingUp" size={24} color="#FFFFFF" />
            </div>
            <span className="header-logo-text">CreditFlow Pro</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            iconName="X"
            iconSize={24}
            onClick={onClose}
          />
        </div>

        {/* User Profile Section */}
        <div className="px-4 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-medium">
              {getInitials()}
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                {user?.fullName || 'User'}
              </p>
              <p className="text-xs text-muted-foreground">
                {user?.designation || 'Welcome'}
              </p>
            </div>
          </div>
        </div>

        <nav className="mobile-nav-menu">
          {navigationItems?.map(item => (
            <Link
              key={item?.path}
              to={item?.path}
              className={`mobile-nav-item ${
                isActivePath(item?.path) ? 'active' : ''
              }`}
              onClick={onClose}
            >
              <Icon name={item?.icon} size={20} />
              <span>{item?.label}</span>
            </Link>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-border">
          <Link to="/profile" className="mobile-nav-item" onClick={onClose}>
            <Icon name="User" size={20} />
            <span>My Profile</span>
          </Link>
          <Link to="/settings" className="mobile-nav-item" onClick={onClose}>
            <Icon name="Settings" size={20} />
            <span>Settings</span>
          </Link>
          <button onClick={toggleTheme} className="mobile-nav-item w-full">
            <Icon name={theme === 'dark' ? 'Sun' : 'Moon'} size={20} />
            <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
          <button
            onClick={handleLogout}
            className="mobile-nav-item w-full text-error"
          >
            <Icon name="LogOut" size={20} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default MobileNavigation
