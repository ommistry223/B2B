import React, { useRef } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import Spline3DBackground from './Spline3DBackground'

const AnimatedHero3D = ({ children, className = '' }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, margin: '-100px' })
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.2])
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 5])

  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.15,
      },
    },
  }

  // Text animation variants
  const itemVariants = {
    hidden: {
      y: 40,
      opacity: 0,
      filter: 'blur(10px)',
    },
    visible: {
      y: 0,
      opacity: 1,
      filter: 'blur(0px)',
      transition: {
        type: 'spring',
        damping: 15,
        stiffness: 100,
      },
    },
  }

  // Floating animation
  const floatingVariants = {
    animate: {
      y: [0, -20, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  }

  return (
    <div ref={ref} className={`relative ${className}`}>
      {/* 3D Background with advanced effects */}
      <motion.div style={{ scale, rotate }} className="absolute inset-0 z-0">
        <Spline3DBackground
          className="w-full h-full"
          enableParallax={true}
          enableMouseFollow={true}
          showLoadingAnimation={true}
        />
      </motion.div>

      {/* Content overlay with animations */}
      <div className="relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="relative"
        >
          {children}
        </motion.div>
      </div>

      {/* Animated particles/orbs */}
      <div className="absolute inset-0 z-5 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            variants={floatingVariants}
            animate="animate"
            transition={{
              delay: i * 0.5,
              duration: 3 + i,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 backdrop-blur-sm"
            style={{
              width: `${60 + i * 20}px`,
              height: `${60 + i * 20}px`,
              left: `${10 + i * 15}%`,
              top: `${20 + i * 10}%`,
            }}
          />
        ))}
      </div>
    </div>
  )
}

// Export variants for use in child components
export { AnimatedHero3D }
export const textVariants = {
  hidden: { y: 40, opacity: 0, filter: 'blur(10px)' },
  visible: {
    y: 0,
    opacity: 1,
    filter: 'blur(0px)',
    transition: {
      type: 'spring',
      damping: 15,
      stiffness: 100,
    },
  },
}

export default AnimatedHero3D
