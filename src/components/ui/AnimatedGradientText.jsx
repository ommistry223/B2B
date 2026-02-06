import React from 'react'
import { motion } from 'framer-motion'

const AnimatedGradientText = ({ children, className = '' }) => {
  return (
    <motion.span
      className={`bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent ${className}`}
      animate={{
        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
      }}
      transition={{
        duration: 5,
        repeat: Infinity,
        ease: 'linear',
      }}
      style={{
        backgroundSize: '200% 200%',
      }}
    >
      {children}
    </motion.span>
  )
}

export default AnimatedGradientText
