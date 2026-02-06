import React, { useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

const AnimatedCard3D = ({
  children,
  className = '',
  enableTilt = true,
  glowEffect = true,
  scaleOnHover = true,
}) => {
  const ref = useRef(null)
  const [isHovered, setIsHovered] = useState(false)

  // Mouse position tracking
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // Smooth spring animations
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 })
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 })

  // 3D rotation based on mouse position
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['12deg', '-12deg'])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-12deg', '12deg'])

  // Lighting effect based on mouse position
  const lightX = useTransform(mouseXSpring, [-0.5, 0.5], ['0%', '100%'])
  const lightY = useTransform(mouseYSpring, [-0.5, 0.5], ['0%', '100%'])

  const handleMouseMove = e => {
    if (!ref.current || !enableTilt) return

    const rect = ref.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    const xPct = mouseX / width - 0.5
    const yPct = mouseY / height - 0.5

    x.set(xPct)
    y.set(yPct)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: enableTilt ? rotateX : 0,
        rotateY: enableTilt ? rotateY : 0,
        transformStyle: 'preserve-3d',
      }}
      animate={{
        scale: scaleOnHover && isHovered ? 1.05 : 1,
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 25,
      }}
      className={`relative ${className}`}
    >
      {/* Glow effect */}
      {glowEffect && (
        <motion.div
          style={{
            background: `radial-gradient(circle at ${lightX} ${lightY}, rgba(99, 102, 241, 0.3), transparent 70%)`,
          }}
          animate={{
            opacity: isHovered ? 1 : 0,
          }}
          className="absolute inset-0 rounded-lg pointer-events-none"
        />
      )}

      {/* Card content */}
      <motion.div
        style={{
          transform: 'translateZ(50px)',
        }}
        className="relative z-10"
      >
        {children}
      </motion.div>

      {/* Reflection effect */}
      <motion.div
        style={{
          background: `linear-gradient(135deg,
            rgba(255,255,255,0) 0%,
            rgba(255,255,255,${isHovered ? '0.1' : '0'}) 50%,
            rgba(255,255,255,0) 100%)`,
          transform: `translate(${mouseXSpring}, ${mouseYSpring})`,
        }}
        className="absolute inset-0 rounded-lg pointer-events-none"
      />
    </motion.div>
  )
}

export default AnimatedCard3D
