import React from 'react'

const AnimatedGradientText = ({ children, className = '' }) => {
  return (
    <span className={`text-primary font-semibold ${className}`}>
      {children}
    </span>
  )
}

export default AnimatedGradientText
