import React from 'react'
import Icon from '../../../components/AppIcon'
import Button from '../../../components/ui/Button'
import RiskBadge from './RiskBadge'

const CustomerMobileCard = ({
  customer,
  isSelected,
  onSelect,
  onViewDetails,
}) => {
  const formatCurrency = amount => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    })?.format(amount)
  }

  const getCreditUtilization = () => {
    if (customer?.creditLimit === 0) return 0
    return Math.round(
      (customer?.outstandingAmount / customer?.creditLimit) * 100
    )
  }

  const utilization = getCreditUtilization()

  return (
    <div className="bg-card rounded-lg border border-border p-4 transition-smooth hover:shadow-elevation-md">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={e => onSelect(customer?.id, e?.target?.checked)}
            className="mt-1 w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2"
            aria-label={`Select ${customer?.companyName}`}
          />
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-foreground truncate">
              {customer?.companyName}
            </h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              {customer?.contactPerson}
            </p>
          </div>
        </div>
        <RiskBadge level={customer?.riskLevel} size="sm" />
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">GST Number</span>
          <span className="text-foreground font-medium data-text">
            {customer?.gstNumber}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Credit Limit</span>
          <span className="text-foreground font-medium data-text">
            {formatCurrency(customer?.creditLimit)}
          </span>
        </div>

        <div>
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-muted-foreground">Outstanding</span>
            <span
              className={`font-medium data-text ${
                customer?.outstandingAmount > 0 ? 'text-error' : 'text-success'
              }`}
            >
              {formatCurrency(customer?.outstandingAmount)}
            </span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full transition-smooth ${
                utilization > 90
                  ? 'bg-error'
                  : utilization > 70
                  ? 'bg-warning'
                  : 'bg-success'
              }`}
              style={{ width: `${Math.min(utilization, 100)}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {utilization}% utilized
          </p>
        </div>

        {customer?.overdueAmount > 0 && (
          <div className="flex items-center gap-2 px-3 py-2 bg-error/10 rounded-lg">
            <Icon name="AlertTriangle" size={14} color="var(--color-error)" />
            <span className="text-xs text-error font-medium">
              ₹{customer?.overdueAmount?.toLocaleString('en-IN')} overdue
            </span>
          </div>
        )}
      </div>
      <div className="mt-4 pt-4 border-t border-border">
        <Button
          variant="outline"
          fullWidth
          iconName="Eye"
          iconPosition="left"
          onClick={() => onViewDetails(customer)}
        >
          View Details
        </Button>
      </div>
    </div>
  )
}

export default CustomerMobileCard
