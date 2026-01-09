import React from 'react'
import Icon from '../../../components/AppIcon'

const InvoiceStats = ({ stats }) => {
  const formatCurrency = amount => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    })?.format(amount)
  }

  const statCards = [
    {
      id: 'total',
      label: 'Total Invoices',
      value: stats?.totalInvoices,
      icon: 'FileText',
      iconColor: 'var(--color-primary)',
      bgColor: 'bg-primary/10',
    },
    {
      id: 'outstanding',
      label: 'Total Outstanding',
      value: formatCurrency(stats?.totalOutstanding),
      icon: 'AlertCircle',
      iconColor: 'var(--color-warning)',
      bgColor: 'bg-warning/10',
    },
    {
      id: 'overdue',
      label: 'Overdue Invoices',
      value: stats?.overdueCount,
      icon: 'AlertTriangle',
      iconColor: 'var(--color-error)',
      bgColor: 'bg-error/10',
    },
    {
      id: 'paid',
      label: 'Paid This Month',
      value: formatCurrency(stats?.paidThisMonth),
      icon: 'CheckCircle2',
      iconColor: 'var(--color-success)',
      bgColor: 'bg-success/10',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {statCards?.map(stat => (
        <div
          key={stat?.id}
          className="bg-card rounded-lg border border-border p-4 md:p-6 hover:shadow-elevation-md transition-smooth"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs md:text-sm text-muted-foreground caption mb-2">
                {stat?.label}
              </p>
              <p className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground data-text">
                {stat?.value}
              </p>
            </div>
            <div
              className={`w-12 h-12 rounded-lg ${stat?.bgColor} flex items-center justify-center flex-shrink-0`}
            >
              <Icon name={stat?.icon} size={24} color={stat?.iconColor} />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default InvoiceStats
