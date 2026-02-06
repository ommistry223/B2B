import React from 'react'
import { motion } from 'framer-motion'
import Icon from '../../../components/AppIcon'

const MetricCard = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendValue,
  riskLevel,
}) => {
  const getRiskColor = () => {
    switch (riskLevel) {
      case 'low':
        return 'text-success'
      case 'medium':
        return 'text-warning'
      case 'high':
        return 'text-error'
      default:
        return 'text-foreground'
    }
  }

  const getTrendColor = () => {
    return trend === 'up' ? 'text-success' : 'text-error'
  }

  return (
    <div className="bg-card rounded-lg p-4 md:p-6 shadow-elevation-sm hover:shadow-elevation-md transition-all duration-300 border border-border hover:border-primary/30 group cursor-pointer overflow-hidden relative">
      {/* Animated background gradient on hover */}
      <motion.div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3 md:mb-4">
          <div className="flex-1 min-w-0">
            <motion.p
              className="text-xs md:text-sm text-muted-foreground mb-1 md:mb-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {title}
            </motion.p>
            <motion.h3
              className={`text-xl md:text-2xl lg:text-3xl font-bold ${getRiskColor()} group-hover:scale-105 transition-transform duration-300`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              {value}
            </motion.h3>
            {subtitle && (
              <motion.p
                className="text-xs md:text-sm text-muted-foreground mt-1 md:mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {subtitle}
              </motion.p>
            )}
          </div>
          <motion.div
            className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-lg metric-icon-bg flex items-center justify-center"
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
          >
            <Icon
              name={icon}
              size={20}
              color="var(--color-primary)"
              className="md:w-6 md:h-6 lg:w-7 lg:h-7"
            />
          </motion.div>
        </div>
        {trendValue && (
          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <motion.div
              animate={{
                y: trend === 'up' ? [-2, 0] : [0, 2],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
            >
              <Icon
                name={trend === 'up' ? 'TrendingUp' : 'TrendingDown'}
                size={16}
                color={
                  trend === 'up' ? 'var(--color-success)' : 'var(--color-error)'
                }
              />
            </motion.div>
            <span
              className={`text-xs md:text-sm font-medium ${getTrendColor()}`}
            >
              {trendValue}
            </span>
            <span className="text-xs md:text-sm text-muted-foreground">
              vs last month
            </span>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default MetricCard
