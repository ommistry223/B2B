import React, { useState } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'

const AnimatedCounter = ({
  value,
  duration = 2,
  prefix = '',
  suffix = '',
  className = '',
}) => {
  const count = useMotionValue(0)
  const rounded = useTransform(count, latest => Math.round(latest))
  const [hasAnimated, setHasAnimated] = useState(false)

  React.useEffect(() => {
    if (!hasAnimated) {
      const controls = animate(count, value, {
        duration,
        ease: 'easeOut',
        onComplete: () => setHasAnimated(true),
      })
      return controls.stop
    }
  }, [value, hasAnimated, count, duration])

  return (
    <motion.span className={className}>
      {prefix}
      <motion.span>{rounded}</motion.span>
      {suffix}
    </motion.span>
  )
}

export default AnimatedCounter
