import React from 'react'
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
    <div className="bg-card rounded-lg p-4 md:p-6 shadow-elevation-sm hover:shadow-elevation-md transition-smooth border border-border">
      <div className="flex items-start justify-between mb-3 md:mb-4">
        <div className="flex-1 min-w-0">
          <p className="text-xs md:text-sm text-muted-foreground mb-1 md:mb-2">
            {title}
          </p>
          <h3
            className={`text-xl md:text-2xl lg:text-3xl font-bold ${getRiskColor()}`}
          >
            {value}
          </h3>
          {subtitle && (
            <p className="text-xs md:text-sm text-muted-foreground mt-1 md:mt-2">
              {subtitle}
            </p>
          )}
        </div>
        <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon
            name={icon}
            size={20}
            color="var(--color-primary)"
            className="md:w-6 md:h-6 lg:w-7 lg:h-7"
          />
        </div>
      </div>
      {trendValue && (
        <div className="flex items-center gap-2">
          <Icon
            name={trend === 'up' ? 'TrendingUp' : 'TrendingDown'}
            size={16}
            color={
              trend === 'up' ? 'var(--color-success)' : 'var(--color-error)'
            }
          />
          <span className={`text-xs md:text-sm font-medium ${getTrendColor()}`}>
            {trendValue}
          </span>
          <span className="text-xs md:text-sm text-muted-foreground">
            vs last month
          </span>
        </div>
      )}
    </div>
  )
}

export default MetricCard
