import React from 'react'
import Icon from '../../../components/AppIcon'

const CreditLimitWarning = ({ customer, invoiceAmount }) => {
  if (!customer || invoiceAmount === 0) return null

  const utilizationPercentage =
    ((customer?.outstanding + invoiceAmount) / customer?.creditLimit) * 100
  const remainingLimit =
    customer?.creditLimit - customer?.outstanding - invoiceAmount

  const getRiskLevel = () => {
    if (utilizationPercentage >= 100) return 'critical'
    if (utilizationPercentage >= 80) return 'high'
    if (utilizationPercentage >= 60) return 'medium'
    return 'low'
  }

  const riskLevel = getRiskLevel()

  const riskConfig = {
    critical: {
      bgColor: 'bg-error/10',
      borderColor: 'border-error',
      textColor: 'text-error',
      icon: 'AlertTriangle',
      iconColor: 'var(--color-error)',
      title: 'Credit Limit Exceeded',
      message:
        "This invoice will exceed the customer's credit limit. Consider requesting advance payment or reducing the invoice amount.",
    },
    high: {
      bgColor: 'bg-warning/10',
      borderColor: 'border-warning',
      textColor: 'text-warning',
      icon: 'AlertCircle',
      iconColor: 'var(--color-warning)',
      title: 'High Credit Utilization',
      message:
        'Customer is approaching their credit limit. Monitor payment behavior closely.',
    },
    medium: {
      bgColor: 'bg-accent/10',
      borderColor: 'border-accent',
      textColor: 'text-accent',
      icon: 'Info',
      iconColor: 'var(--color-accent)',
      title: 'Moderate Credit Usage',
      message:
        'Customer has moderate credit utilization. Ensure timely payment follow-ups.',
    },
    low: {
      bgColor: 'bg-success/10',
      borderColor: 'border-success',
      textColor: 'text-success',
      icon: 'CheckCircle2',
      iconColor: 'var(--color-success)',
      title: 'Healthy Credit Status',
      message: 'Customer has sufficient credit limit available.',
    },
  }

  const config = riskConfig?.[riskLevel]

  return (
    <div
      className={`p-4 rounded-lg border ${config?.bgColor} ${config?.borderColor}`}
    >
      <div className="flex gap-3">
        <Icon
          name={config?.icon}
          size={20}
          color={config?.iconColor}
          className="flex-shrink-0 mt-0.5"
        />
        <div className="flex-1">
          <h4 className={`text-sm font-semibold ${config?.textColor} mb-1`}>
            {config?.title}
          </h4>
          <p className="text-sm text-muted-foreground mb-3">
            {config?.message}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Credit Limit</p>
              <p className="text-sm font-semibold text-foreground data-text">
                ₹{customer?.creditLimit?.toLocaleString('en-IN')}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">
                Current Outstanding
              </p>
              <p className="text-sm font-semibold text-foreground data-text">
                ₹{customer?.outstanding?.toLocaleString('en-IN')}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">
                Remaining After Invoice
              </p>
              <p
                className={`text-sm font-semibold data-text ${
                  remainingLimit < 0 ? 'text-error' : 'text-foreground'
                }`}
              >
                ₹{remainingLimit?.toLocaleString('en-IN')}
              </p>
            </div>
          </div>

          <div className="mt-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-muted-foreground">
                Credit Utilization
              </span>
              <span className={`text-xs font-semibold ${config?.textColor}`}>
                {utilizationPercentage?.toFixed(1)}%
              </span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  riskLevel === 'critical'
                    ? 'bg-error'
                    : riskLevel === 'high'
                    ? 'bg-warning'
                    : riskLevel === 'medium'
                    ? 'bg-accent'
                    : 'bg-success'
                }`}
                style={{ width: `${Math.min(utilizationPercentage, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreditLimitWarning
