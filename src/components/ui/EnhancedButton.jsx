import React from 'react'
import { motion } from 'framer-motion'
import { buttonHover } from '../../util/animations'

/**
 * EnhancedButton - Button with smooth Framer Motion animations
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Button content
 * @param {string} props.variant - Button style variant
 * @param {string} props.size - Button size
 * @param {boolean} props.disabled - Disabled state
 * @param {function} props.onClick - Click handler
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.animationType - Animation type: 'scale' | 'lift' | 'glow' | 'none'
 */
const EnhancedButton = ({
  children,
  variant = 'default',
  size = 'md',
  disabled = false,
  onClick,
  className = '',
  animationType = 'scale',
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none'

  const variants = {
    default:
      'bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary',
    secondary:
      'bg-secondary text-secondary-foreground hover:bg-secondary/80 focus:ring-secondary',
    outline:
      'border border-input bg-background hover:bg-accent hover:text-accent-foreground focus:ring-primary',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
    destructive:
      'bg-destructive text-destructive-foreground hover:bg-destructive/90 focus:ring-destructive',
    link: 'text-primary underline-offset-4 hover:underline',
  }

  const sizes = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4 py-2',
    lg: 'h-11 px-6 text-lg',
    xl: 'h-14 px-8 text-xl',
  }

  const animations = {
    scale: {
      whileHover: { scale: 1.05 },
      whileTap: { scale: 0.95 },
      transition: { duration: 0.2 },
    },
    lift: {
      whileHover: { y: -4, scale: 1.02 },
      whileTap: { y: 0, scale: 0.98 },
      transition: { duration: 0.2 },
    },
    glow: {
      whileHover: {
        scale: 1.05,
        boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)',
      },
      whileTap: { scale: 0.95 },
      transition: { duration: 0.2 },
    },
    none: {},
  }

  const buttonClasses = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`

  return (
    <motion.button
      className={buttonClasses}
      disabled={disabled}
      onClick={onClick}
      {...(animations[animationType] || animations.scale)}
      {...props}
    >
      {children}
    </motion.button>
  )
}

export default EnhancedButton
