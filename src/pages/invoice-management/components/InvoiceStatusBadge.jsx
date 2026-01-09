import React from 'react'
import Icon from '../../../components/AppIcon'

const InvoiceStatusBadge = ({ status, daysOverdue }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'paid':
        return {
          label: 'Paid',
          icon: 'CheckCircle2',
          bgColor: 'bg-success/10',
          textColor: 'text-success',
          iconColor: 'var(--color-success)',
        }
      case 'pending':
      case 'unpaid':
        return {
          label: 'Pending',
          icon: 'Clock',
          bgColor: 'bg-warning/10',
          textColor: 'text-warning',
          iconColor: 'var(--color-warning)',
        }
      case 'partial':
      case 'partially_paid':
        return {
          label: 'Partially Paid',
          icon: 'AlertCircle',
          bgColor: 'bg-secondary/10',
          textColor: 'text-secondary',
          iconColor: 'var(--color-secondary)',
        }
      case 'overdue':
        return {
          label: `Overdue (${daysOverdue}d)`,
          icon: 'AlertTriangle',
          bgColor: 'bg-error/10',
          textColor: 'text-error',
          iconColor: 'var(--color-error)',
        }
      default:
        return {
          label: 'Unknown',
          icon: 'HelpCircle',
          bgColor: 'bg-muted',
          textColor: 'text-muted-foreground',
          iconColor: 'var(--color-muted-foreground)',
        }
    }
  }

  const config = getStatusConfig()

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${config?.bgColor}`}
    >
      <Icon name={config?.icon} size={16} color={config?.iconColor} />
      <span className={`text-xs md:text-sm font-medium ${config?.textColor}`}>
        {config?.label}
      </span>
    </div>
  )
}

export default InvoiceStatusBadge
