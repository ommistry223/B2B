import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import { pageTransition } from '../util/animations'

/**
 * AnimatedPageWrapper - Wraps pages with smooth transition animations
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Page content
 * @param {string} props.variant - Animation variant: 'fade' | 'slide' | 'scale' | 'none'
 * @param {Object} props.customAnimation - Custom animation config
 */
const AnimatedPageWrapper = ({
  children,
  variant = 'fade',
  customAnimation = null,
  className = '',
}) => {
  const location = useLocation()

  const animations = {
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
    },
    slide: {
      initial: { opacity: 0, x: -50 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: 50 },
      transition: { duration: 0.4, ease: [0.6, 0.05, 0.01, 0.9] },
    },
    slideUp: {
      initial: { opacity: 0, y: 50 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -50 },
      transition: { duration: 0.4, ease: [0.43, 0.13, 0.23, 0.96] },
    },
    scale: {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.95 },
      transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
    },
    scaleRotate: {
      initial: { opacity: 0, scale: 0.9, rotate: -5 },
      animate: { opacity: 1, scale: 1, rotate: 0 },
      exit: { opacity: 0, scale: 0.9, rotate: 5 },
      transition: { duration: 0.5, ease: [0.43, 0.13, 0.23, 0.96] },
    },
    none: {
      initial: {},
      animate: {},
      exit: {},
      transition: {},
    },
  }

  const selectedAnimation =
    customAnimation || animations[variant] || animations.fade

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={selectedAnimation.initial}
        animate={selectedAnimation.animate}
        exit={selectedAnimation.exit}
        transition={selectedAnimation.transition}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

export default AnimatedPageWrapper
