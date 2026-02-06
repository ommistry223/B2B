import React from 'react'
import { motion } from 'framer-motion'
import {
  staggerContainer,
  staggerItem,
  fadeInUp,
  fadeInLeft,
  fadeInRight,
  scaleIn,
  hoverLift,
} from '../util/animations'

/**
 * AnimatedSection - Wrapper for sections with scroll-triggered animations
 */
export const AnimatedSection = ({
  children,
  className = '',
  delay = 0,
  ...props
}) => (
  <motion.section
    initial="initial"
    whileInView="animate"
    viewport={{ once: true, margin: '-100px' }}
    variants={staggerContainer}
    className={className}
    {...props}
  >
    {children}
  </motion.section>
)

/**
 * AnimatedDiv - Generic animated div with scroll trigger
 */
export const AnimatedDiv = ({
  children,
  variant = 'fadeInUp',
  className = '',
  delay = 0,
  ...props
}) => {
  const variants = {
    fadeInUp,
    fadeInLeft,
    fadeInRight,
    scaleIn,
    staggerItem,
  }

  const animation = variants[variant] || fadeInUp
  const animationWithDelay = {
    ...animation,
    transition: { ...animation.transition, delay },
  }

  return (
    <motion.div {...animationWithDelay} className={className} {...props}>
      {children}
    </motion.div>
  )
}

/**
 * AnimatedCard - Card component with hover effects
 */
export const AnimatedCard = ({
  children,
  className = '',
  hoverEffect = true,
  delay = 0,
  ...props
}) => (
  <motion.div
    {...fadeInUp}
    transition={{ ...fadeInUp.transition, delay }}
    whileHover={
      hoverEffect
        ? {
            y: -10,
            scale: 1.02,
            transition: { duration: 0.3 },
          }
        : {}
    }
    whileTap={hoverEffect ? { scale: 0.98 } : {}}
    className={className}
    {...props}
  >
    {children}
  </motion.div>
)

/**
 * AnimatedButton - Button with smooth animations
 */
export const AnimatedButton = ({
  children,
  className = '',
  variant = 'default',
  ...props
}) => {
  const variants = {
    default: {
      whileHover: { scale: 1.05 },
      whileTap: { scale: 0.95 },
      transition: { duration: 0.2 },
    },
    lift: {
      whileHover: { y: -5, scale: 1.03 },
      whileTap: { y: 0, scale: 0.97 },
      transition: { duration: 0.2 },
    },
    glow: {
      whileHover: {
        scale: 1.05,
        boxShadow: '0 0 25px rgba(59, 130, 246, 0.6)',
      },
      whileTap: { scale: 0.95 },
      transition: { duration: 0.2 },
    },
  }

  return (
    <motion.button {...variants[variant]} className={className} {...props}>
      {children}
    </motion.button>
  )
}

/**
 * AnimatedList - List with stagger effect
 */
export const AnimatedList = ({
  children,
  className = '',
  staggerDelay = 0.1,
  ...props
}) => {
  const containerVariants = {
    animate: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.2,
      },
    },
  }

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={containerVariants}
      className={className}
      {...props}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div key={index} variants={staggerItem}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  )
}

/**
 * AnimatedListItem - Individual list item with animation
 */
export const AnimatedListItem = ({
  children,
  className = '',
  index = 0,
  ...props
}) => (
  <motion.div variants={staggerItem} className={className} {...props}>
    {children}
  </motion.div>
)

/**
 * AnimatedGrid - Grid with stagger effect
 */
export const AnimatedGrid = ({
  children,
  className = '',
  columns = 3,
  staggerDelay = 0.08,
  ...props
}) => {
  const containerVariants = {
    animate: {
      transition: {
        staggerChildren: staggerDelay,
      },
    },
  }

  return (
    <motion.div
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: '-50px' }}
      variants={containerVariants}
      className={className}
      {...props}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div key={index} variants={staggerItem}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  )
}

/**
 * AnimatedText - Text with reveal animation
 */
export const AnimatedText = ({
  children,
  className = '',
  variant = 'fadeInUp',
  delay = 0,
  as = 'p',
  ...props
}) => {
  const Component = motion[as]

  const animations = {
    fadeInUp: {
      initial: { opacity: 0, y: 20 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true },
      transition: { duration: 0.6, delay },
    },
    fadeInLeft: {
      initial: { opacity: 0, x: -30 },
      whileInView: { opacity: 1, x: 0 },
      viewport: { once: true },
      transition: { duration: 0.6, delay },
    },
    slideIn: {
      initial: { opacity: 0, x: -50 },
      whileInView: { opacity: 1, x: 0 },
      viewport: { once: true },
      transition: { duration: 0.8, delay },
    },
  }

  return (
    <Component
      {...(animations[variant] || animations.fadeInUp)}
      className={className}
      {...props}
    >
      {children}
    </Component>
  )
}

/**
 * AnimatedGradientText - Text with gradient shimmer effect
 */
export const AnimatedGradientText = ({
  children,
  className = '',
  ...props
}) => (
  <motion.span
    className={`bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent bg-[length:200%_auto] ${className}`}
    animate={{
      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
    }}
    transition={{
      duration: 5,
      repeat: Infinity,
      ease: 'linear',
    }}
    {...props}
  >
    {children}
  </motion.span>
)

/**
 * FloatingElement - Element with floating animation
 */
export const FloatingElement = ({
  children,
  className = '',
  yOffset = 20,
  duration = 3,
  delay = 0,
  ...props
}) => (
  <motion.div
    animate={{
      y: [0, -yOffset, 0],
    }}
    transition={{
      duration,
      delay,
      repeat: Infinity,
      ease: 'easeInOut',
    }}
    className={className}
    {...props}
  >
    {children}
  </motion.div>
)

/**
 * PulsingElement - Element with pulse animation
 */
export const PulsingElement = ({ children, className = '', ...props }) => (
  <motion.div
    animate={{
      scale: [1, 1.05, 1],
      opacity: [1, 0.8, 1],
    }}
    transition={{
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    }}
    className={className}
    {...props}
  >
    {children}
  </motion.div>
)

/**
 * RotatingElement - Element with rotation animation
 */
export const RotatingElement = ({
  children,
  className = '',
  duration = 20,
  ...props
}) => (
  <motion.div
    animate={{
      rotate: 360,
    }}
    transition={{
      duration,
      repeat: Infinity,
      ease: 'linear',
    }}
    className={className}
    {...props}
  >
    {children}
  </motion.div>
)

/**
 * LiquidBlob - Morphing blob shape
 */
export const LiquidBlob = ({
  className = '',
  size = 400,
  color = 'bg-gradient-to-br from-blue-500 to-purple-600',
  ...props
}) => (
  <motion.div
    className={`${color} ${className}`}
    style={{
      width: size,
      height: size,
      position: 'absolute',
      filter: 'blur(40px)',
      opacity: 0.5,
    }}
    animate={{
      borderRadius: [
        '60% 40% 30% 70% / 60% 30% 70% 40%',
        '30% 60% 70% 40% / 50% 60% 30% 60%',
        '40% 30% 60% 70% / 40% 70% 60% 30%',
        '60% 40% 30% 70% / 60% 30% 70% 40%',
      ],
    }}
    transition={{
      duration: 10,
      repeat: Infinity,
      ease: 'easeInOut',
    }}
    {...props}
  />
)

/**
 * ParallaxElement - Simple parallax effect
 */
export const ParallaxElement = ({
  children,
  className = '',
  offset = 50,
  ...props
}) => (
  <motion.div
    initial={{ y: offset }}
    whileInView={{ y: 0 }}
    viewport={{ once: false }}
    transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }}
    className={className}
    {...props}
  >
    {children}
  </motion.div>
)

/**
 * CountUpNumber - Animated number counter
 */
export const CountUpNumber = ({
  from = 0,
  to,
  duration = 2,
  className = '',
  ...props
}) => {
  const [count, setCount] = React.useState(from)

  return (
    <motion.span
      className={className}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      onViewportEnter={() => {
        const controls = {
          from,
          to,
          duration: duration * 1000,
        }

        let startTime = null
        const animate = currentTime => {
          if (!startTime) startTime = currentTime
          const progress = Math.min(
            (currentTime - startTime) / controls.duration,
            1
          )
          const currentCount = Math.floor(
            progress * (controls.to - controls.from) + controls.from
          )
          setCount(currentCount)

          if (progress < 1) {
            requestAnimationFrame(animate)
          }
        }
        requestAnimationFrame(animate)
      }}
      {...props}
    >
      {count}
    </motion.span>
  )
}

/**
 * ScaleOnView - Element that scales when in view
 */
export const ScaleOnView = ({
  children,
  className = '',
  scale = 1,
  duration = 0.6,
  ...props
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.5 }}
    whileInView={{ opacity: 1, scale }}
    viewport={{ once: true, margin: '-50px' }}
    transition={{ duration, ease: [0.43, 0.13, 0.23, 0.96] }}
    className={className}
    {...props}
  >
    {children}
  </motion.div>
)

/**
 * SlideUpReveal - Content that slides up and reveals
 */
export const SlideUpReveal = ({
  children,
  className = '',
  delay = 0,
  ...props
}) => (
  <motion.div
    initial={{ opacity: 0, y: 100 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-100px' }}
    transition={{ duration: 0.8, delay, ease: [0.43, 0.13, 0.23, 0.96] }}
    className={className}
    {...props}
  >
    {children}
  </motion.div>
)
