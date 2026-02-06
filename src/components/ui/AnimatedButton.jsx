import React from 'react'
import { motion } from 'framer-motion'

const AnimatedButton = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  icon = null,
  ...props
}) => {
  const variants = {
    primary:
      'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/50',
    secondary:
      'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white shadow-lg shadow-gray-500/50',
    outline:
      'border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20',
    ghost: 'text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20',
  }

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  }

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileHover={{
        scale: 1.05,
        boxShadow: '0 20px 35px -10px rgba(99, 102, 241, 0.5)',
      }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 17,
      }}
      className={`
        relative overflow-hidden rounded-lg font-semibold
        transition-all duration-300 ease-out
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {/* Animated shine effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        animate={{
          x: ['-200%', '200%'],
        }}
        transition={{
          repeat: Infinity,
          duration: 3,
          ease: 'linear',
          repeatDelay: 2,
        }}
      />

      {/* Button content */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {icon && (
          <motion.span
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{
              repeat: Infinity,
              duration: 2,
              ease: 'easeInOut',
            }}
          >
            {icon}
          </motion.span>
        )}
        {children}
      </span>

      {/* Ripple effect */}
      <motion.div
        className="absolute inset-0 bg-white/20 rounded-full"
        initial={{ scale: 0, opacity: 1 }}
        whileTap={{ scale: 2, opacity: 0 }}
        transition={{ duration: 0.5 }}
      />
    </motion.button>
  )
}

export default AnimatedButton
