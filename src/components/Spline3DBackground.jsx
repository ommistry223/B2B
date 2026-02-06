import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'

const Spline3DBackground = ({
  className = '',
  enableParallax = true,
  enableMouseFollow = true,
  showLoadingAnimation = true,
}) => {
  const { theme } = useTheme()
  const [isLoaded, setIsLoaded] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const { scrollY } = useScroll()

  // Parallax effect based on scroll
  const y = useTransform(scrollY, [0, 1000], [0, -200])
  const opacity = useTransform(scrollY, [0, 300, 600], [1, 0.8, 0.4])

  // Spline URLs based on theme
  const splineUrl =
    theme === 'dark'
      ? 'https://my.spline.design/boxeshover-iECUyZuSROMD7emJZIaihA5b/'
      : 'https://my.spline.design/boxeshover-pgo99qOZvuFdoYbDvCWD9FYM/'

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!enableMouseFollow) return

    const handleMouseMove = e => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2
      const y = (e.clientY / window.innerHeight - 0.5) * 2
      setMousePosition({ x, y })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [enableMouseFollow])

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <AnimatePresence mode="wait">
        {showLoadingAnimation && !isLoaded && (
          <motion.div
            key="loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-sm"
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="w-16 h-16 border-4 border-t-indigo-500 border-r-purple-500 border-b-pink-500 border-l-transparent rounded-full"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        key={theme}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.05 }}
        transition={{
          duration: 0.8,
          ease: [0.43, 0.13, 0.23, 0.96],
        }}
        style={{
          y: enableParallax ? y : 0,
          opacity: enableParallax ? opacity : 1,
          x: enableMouseFollow ? mousePosition.x * 20 : 0,
          rotateX: enableMouseFollow ? mousePosition.y * 5 : 0,
          rotateY: enableMouseFollow ? mousePosition.x * 5 : 0,
        }}
        className="relative w-full h-full"
      >
        <motion.iframe
          src={splineUrl}
          onLoad={() => setIsLoaded(true)}
          initial={{ filter: 'blur(20px)' }}
          animate={{ filter: isLoaded ? 'blur(0px)' : 'blur(20px)' }}
          transition={{ duration: 0.6 }}
          className="w-full h-full border-none"
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
          }}
          title="3D Background Animation"
        />
      </motion.div>

      {/* Gradient overlays for depth */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ delay: 0.5 }}
        className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none"
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ delay: 0.7 }}
        className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-transparent to-purple-500/10 pointer-events-none"
      />
    </div>
  )
}

export default Spline3DBackground
