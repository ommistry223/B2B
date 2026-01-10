import React from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '../../../components/AppIcon'

const QuickActionCard = () => {
  const navigate = useNavigate()

  const quickActions = [
    {
      id: 1,
      title: 'Create Invoice',
      description: 'Generate new credit invoice',
      icon: 'FileText',
      iconColor: 'var(--color-primary)',
      bgColor: 'action-bg-primary',
      path: '/create-invoice',
    },
    {
      id: 2,
      title: 'Record Payment',
      description: 'Log customer payment',
      icon: 'DollarSign',
      iconColor: 'var(--color-success)',
      bgColor: 'action-bg-success',
      path: '/payment-recording',
    },
    {
      id: 3,
      title: 'Add Customer',
      description: 'Register new party',
      icon: 'UserPlus',
      iconColor: 'var(--color-secondary)',
      bgColor: 'action-bg-secondary',
      path: '/customer-management',
    },
    {
      id: 4,
      title: 'View Analytics',
      description: 'Check risk reports',
      icon: 'BarChart3',
      iconColor: 'var(--color-accent)',
      bgColor: 'action-bg-accent',
      path: '/risk-analytics',
    },
  ]

  return (
    <div className="bg-card rounded-lg p-4 md:p-6 shadow-elevation-sm border border-border">
      <div className="mb-4 md:mb-6">
        <h3 className="text-base md:text-lg font-semibold text-foreground mb-1">
          Quick Actions
        </h3>
        <p className="text-xs md:text-sm text-muted-foreground">
          Frequently used operations
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
        {quickActions?.map(action => (
          <button
            key={action?.id}
            onClick={() => navigate(action?.path)}
            className="flex items-start gap-3 md:gap-4 p-3 md:p-4 rounded-lg border border-border hover:border-primary hover:shadow-elevation-sm transition-smooth text-left"
          >
            <div
              className={`flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-lg ${action?.bgColor} flex items-center justify-center`}
            >
              <Icon name={action?.icon} size={20} color={action?.iconColor} />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm md:text-base font-medium text-foreground mb-1">
                {action?.title}
              </h4>
              <p className="text-xs md:text-sm text-muted-foreground">
                {action?.description}
              </p>
            </div>
            <Icon
              name="ChevronRight"
              size={16}
              color="var(--color-muted-foreground)"
              className="flex-shrink-0 mt-1"
            />
          </button>
        ))}
      </div>
    </div>
  )
}

export default QuickActionCard
