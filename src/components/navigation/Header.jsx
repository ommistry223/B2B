import React, { useState, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Icon from '../AppIcon'
import Button from '../ui/Button'
import MobileNavigation from './MobileNavigation'
import NotificationCenter from './NotificationCenter'
import { useUser } from '../../context/UserContext'
import { useTheme } from '../../context/ThemeContext'

const Header = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useUser()
  const { theme, toggleTheme } = useTheme()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const profileDropdownRef = useRef(null)

  // Get user initials
  const getInitials = () => {
    if (!user?.fullName) return 'U'
    return user.fullName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
  }

  const navigationItems = [
    { label: 'Dashboard', path: '/dashboard', icon: 'LayoutDashboard' },
    { label: 'Invoices', path: '/invoice-management', icon: 'FileText' },
    { label: 'Customers', path: '/customer-management', icon: 'Users' },
    { label: 'Analytics', path: '/risk-analytics', icon: 'TrendingUp' },
  ]

  const isActivePath = path => {
    if (path === '/invoice-management') {
      return (
        location?.pathname === path ||
        location?.pathname === '/create-invoice' ||
        location?.pathname === '/payment-recording'
      )
    }
    return location?.pathname === path
  }

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  useEffect(() => {
    const handleClickOutside = event => {
      if (
        profileDropdownRef?.current &&
        !profileDropdownRef?.current?.contains(event?.target)
      ) {
        setIsProfileDropdownOpen(false)
      }
    }

    const handleEscape = event => {
      if (event?.key === 'Escape') {
        setIsProfileDropdownOpen(false)
      }
    }

    if (isProfileDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isProfileDropdownOpen])

  return (
    <>
      <header className="header-nav">
        <div className="header-nav-container">
          <Link
            to="/dashboard"
            className="header-logo cursor-pointer hover:opacity-80 transition-opacity"
          >
            <div className="header-logo-icon">
              <Icon name="TrendingUp" size={24} className="text-white" />
            </div>
            <span className="header-logo-text">CreditFlow Pro</span>
          </Link>

          <nav className="header-nav-menu">
            {navigationItems?.map(item => (
              <Link
                key={item?.path}
                to={item?.path}
                className={`header-nav-item ${
                  isActivePath(item?.path) ? 'active' : ''
                }`}
              >
                {item?.label}
              </Link>
            ))}
          </nav>

          <div className="header-actions">
            <NotificationCenter />

            {/* Theme Toggle Button */}
            <Button
              variant="ghost"
              size="icon"
              iconName={theme === 'dark' ? 'Sun' : 'Moon'}
              iconSize={20}
              onClick={toggleTheme}
              className="hidden lg:flex"
              aria-label={`Switch to ${
                theme === 'dark' ? 'light' : 'dark'
              } mode`}
            />

            <Link to="/settings">
              <Button
                variant="ghost"
                size="icon"
                iconName="Settings"
                iconSize={20}
                className="hidden lg:flex"
              />
            </Link>

            {/* Profile Dropdown */}
            <div className="relative hidden lg:block" ref={profileDropdownRef}>
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground text-sm font-medium hover:opacity-90 transition-smooth"
              >
                {getInitials()}
              </button>

              {isProfileDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-popover rounded-lg shadow-elevation-xl border border-border z-[1050]">
                  <div className="p-4 border-b border-border">
                    <p className="text-sm font-medium text-foreground">
                      {user?.fullName || 'User'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {user?.email || 'user@example.com'}
                    </p>
                  </div>
                  <div className="py-2">
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-muted transition-smooth"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      <Icon name="User" size={18} />
                      My Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-muted transition-smooth"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      <Icon name="Settings" size={18} />
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-error hover:bg-muted transition-smooth"
                    >
                      <Icon name="LogOut" size={18} />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleMobileMenuToggle}
            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-muted transition-colors mobile-menu-btn"
            aria-label="Toggle mobile menu"
          >
            <Icon
              name={isMobileMenuOpen ? 'X' : 'Menu'}
              size={24}
              color="var(--color-foreground)"
            />
          </button>
        </div>
      </header>
      <MobileNavigation
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        navigationItems={navigationItems}
        isActivePath={isActivePath}
      />
    </>
  )
}

export default Header
