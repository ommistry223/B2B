import React from 'react'
import { motion, useAnimation } from 'framer-motion'
import { useInView } from 'framer-motion'

const AnimatedProgressBar = ({
  value = 0,
  maxValue = 100,
  color = 'indigo',
  height = 'h-4',
  showPercentage = true,
  animated = true,
  className = '',
}) => {
  const ref = React.useRef(null)
  const isInView = useInView(ref, { once: true })
  const controls = useAnimation()

  const percentage = (value / maxValue) * 100

  React.useEffect(() => {
    if (isInView && animated) {
      controls.start({
        width: `${percentage}%`,
        transition: {
          duration: 1.5,
          ease: 'easeOut',
        },
      })
    }
  }, [isInView, percentage, animated, controls])

  const colorClasses = {
    indigo: 'from-indigo-500 to-purple-500',
    blue: 'from-blue-500 to-cyan-500',
    green: 'from-green-500 to-emerald-500',
    red: 'from-red-500 to-pink-500',
    yellow: 'from-yellow-500 to-orange-500',
  }

  return (
    <div ref={ref} className={`w-full ${className}`}>
      {/* Progress bar container */}
      <div
        className={`relative ${height} bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden`}
      >
        {/* Animated progress fill */}
        <motion.div
          initial={{ width: 0 }}
          animate={controls}
          className={`h-full bg-gradient-to-r ${colorClasses[color]} rounded-full relative overflow-hidden`}
        >
          {/* Shine effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{
              x: ['-100%', '200%'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear',
              repeatDelay: 1,
            }}
          />
        </motion.div>

        {/* Percentage text */}
        {showPercentage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isInView ? 1 : 0 }}
            transition={{ delay: 0.5 }}
            className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-700 dark:text-gray-300"
          >
            {Math.round(percentage)}%
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default AnimatedProgressBar
