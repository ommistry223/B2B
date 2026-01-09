import React from 'react'
import Icon from '../../../components/AppIcon'

const RiskBadge = ({ level, size = 'default' }) => {
  const getRiskConfig = () => {
    switch (level?.toLowerCase()) {
      case 'low':
        return {
          color: 'var(--color-success)',
          bgColor: 'bg-success/10',
          textColor: 'text-success',
          icon: 'CheckCircle2',
          label: 'Low Risk',
        }
      case 'medium':
        return {
          color: 'var(--color-warning)',
          bgColor: 'bg-warning/10',
          textColor: 'text-warning',
          icon: 'AlertCircle',
          label: 'Medium Risk',
        }
      case 'high':
        return {
          color: 'var(--color-error)',
          bgColor: 'bg-error/10',
          textColor: 'text-error',
          icon: 'AlertTriangle',
          label: 'High Risk',
        }
      default:
        return {
          color: 'var(--color-muted-foreground)',
          bgColor: 'bg-muted',
          textColor: 'text-muted-foreground',
          icon: 'HelpCircle',
          label: 'Unknown',
        }
    }
  }

  const config = getRiskConfig()
  const iconSize = size === 'sm' ? 14 : 16
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm'
  const padding = size === 'sm' ? 'px-2 py-1' : 'px-3 py-1.5'

  return (
    <div
      className={`inline-flex items-center gap-1.5 ${config?.bgColor} ${config?.textColor} ${padding} rounded-full font-medium ${textSize}`}
    >
      <Icon name={config?.icon} size={iconSize} color={config?.color} />
      <span>{config?.label}</span>
    </div>
  )
}

export default RiskBadge
