import React, { useRef } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'

const AnimatedSection = ({
  children,
  className = '',
  animation = 'fadeUp', // fadeUp, slideRight, slideLeft, scale, rotate
  delay = 0,
  duration = 0.6,
  stagger = 0.1,
  ...props
}) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, margin: '-100px' })
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0])
  const y = useTransform(scrollYProgress, [0, 0.5, 1], [100, 0, -100])

  const animations = {
    fadeUp: {
      hidden: { opacity: 0, y: 50, filter: 'blur(10px)' },
      visible: {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        transition: {
          duration,
          delay,
          type: 'spring',
          stiffness: 100,
          damping: 15,
        },
      },
    },
    slideRight: {
      hidden: { opacity: 0, x: -100, filter: 'blur(10px)' },
      visible: {
        opacity: 1,
        x: 0,
        filter: 'blur(0px)',
        transition: { duration, delay, type: 'spring' },
      },
    },
    slideLeft: {
      hidden: { opacity: 0, x: 100, filter: 'blur(10px)' },
      visible: {
        opacity: 1,
        x: 0,
        filter: 'blur(0px)',
        transition: { duration, delay, type: 'spring' },
      },
    },
    scale: {
      hidden: { opacity: 0, scale: 0.8, filter: 'blur(10px)' },
      visible: {
        opacity: 1,
        scale: 1,
        filter: 'blur(0px)',
        transition: { duration, delay, type: 'spring' },
      },
    },
    rotate: {
      hidden: { opacity: 0, rotate: -10, scale: 0.9, filter: 'blur(10px)' },
      visible: {
        opacity: 1,
        rotate: 0,
        scale: 1,
        filter: 'blur(0px)',
        transition: { duration, delay, type: 'spring' },
      },
    },
  }

  return (
    <motion.section
      ref={ref}
      variants={animations[animation]}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      style={{ opacity }}
      className={className}
      {...props}
    >
      {children}
    </motion.section>
  )
}

// Staggered children animation
export const AnimatedGroup = ({ children, className = '', stagger = 0.1 }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, margin: '-50px' })

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: stagger,
      },
    },
  }

  const item = {
    hidden: { y: 30, opacity: 0, filter: 'blur(10px)' },
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

  return (
    <motion.div
      ref={ref}
      variants={container}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      className={className}
    >
      {React.Children.map(children, child => (
        <motion.div variants={item}>{child}</motion.div>
      ))}
    </motion.div>
  )
}

export default AnimatedSection
