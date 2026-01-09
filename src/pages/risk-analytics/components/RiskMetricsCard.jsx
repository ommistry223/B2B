import React from 'react'
import Icon from '../../../components/AppIcon'

const RiskMetricsCard = ({
  title,
  value,
  subtitle,
  trend,
  trendValue,
  icon,
  iconColor,
  bgColor,
}) => {
  const isPositiveTrend = trend === 'up'

  return (
    <div className="bg-card rounded-lg p-4 md:p-6 shadow-elevation-sm border border-border transition-smooth hover:shadow-elevation-md">
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-12 h-12 rounded-lg flex items-center justify-center ${bgColor}`}
        >
          <Icon name={icon} size={24} color={iconColor} />
        </div>
        {trendValue && (
          <div
            className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
              isPositiveTrend
                ? 'bg-success/10 text-success'
                : 'bg-error/10 text-error'
            }`}
          >
            <Icon
              name={isPositiveTrend ? 'TrendingUp' : 'TrendingDown'}
              size={14}
            />
            <span>{trendValue}</span>
          </div>
        )}
      </div>

      <h3 className="text-sm text-muted-foreground mb-2">{title}</h3>
      <p className="text-2xl md:text-3xl font-bold text-foreground mb-1 data-text">
        {value}
      </p>
      {subtitle && (
        <p className="text-xs text-muted-foreground caption">{subtitle}</p>
      )}
    </div>
  )
}

export default RiskMetricsCard
