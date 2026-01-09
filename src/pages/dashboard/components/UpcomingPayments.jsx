import React, { useMemo } from 'react'
import Icon from '../../../components/AppIcon'

const UpcomingPayments = ({ invoices = [], customers = [] }) => {
  const upcomingPayments = useMemo(() => {
    const today = new Date()
    const thirtyDaysFromNow = new Date(
      today.getTime() + 30 * 24 * 60 * 60 * 1000
    )

    return invoices
      .filter(inv => {
        if (inv.status === 'paid') return false
        const dueDate = new Date(inv.dueDate)
        return dueDate >= today && dueDate <= thirtyDaysFromNow
      })
      .map(inv => {
        const customer = customers.find(c => c.id === inv.customerId)
        const dueDate = new Date(inv.dueDate)
        const daysUntilDue = Math.ceil(
          (dueDate - today) / (1000 * 60 * 60 * 24)
        )

        // Calculate risk based on days until due and customer history
        let riskLevel = 'low'
        let delayProbability = 15

        if (daysUntilDue <= 3) {
          riskLevel = 'high'
          delayProbability = 75
        } else if (daysUntilDue <= 7) {
          riskLevel = 'medium'
          delayProbability = 45
        }

        // Adjust based on invoice amount
        if (inv.amount > 150000) {
          if (riskLevel === 'low') riskLevel = 'medium'
          delayProbability += 15
        }

        return {
          id: inv.id,
          customerName: customer?.name || 'Unknown Customer',
          invoiceNumber: inv.invoiceNumber,
          amount: inv.outstanding || inv.amount,
          dueDate: inv.dueDate,
          daysUntilDue,
          riskLevel,
          delayProbability: Math.min(95, delayProbability),
        }
      })
      .sort((a, b) => a.daysUntilDue - b.daysUntilDue)
      .slice(0, 5) // Show top 5 upcoming payments
  }, [invoices, customers])

  const getRiskBadge = riskLevel => {
    const styles = {
      low: 'bg-success/10 text-success',
      medium: 'bg-warning/10 text-warning',
      high: 'bg-error/10 text-error',
    }
    return styles?.[riskLevel] || styles?.low
  }

  const formatCurrency = amount => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    })?.format(amount)
  }

  return (
    <div className="bg-card rounded-lg p-4 md:p-6 shadow-elevation-sm border border-border">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <div>
          <h3 className="text-base md:text-lg font-semibold text-foreground mb-1">
            Upcoming Payments
          </h3>
          <p className="text-xs md:text-sm text-muted-foreground">
            Next 30 days expected collections
          </p>
        </div>
        <Icon name="Calendar" size={20} color="var(--color-primary)" />
      </div>
      <div className="space-y-3 md:space-y-4">
        {upcomingPayments.length === 0 ? (
          <div className="text-center py-8">
            <Icon
              name="Calendar"
              size={48}
              color="var(--color-muted-foreground)"
            />
            <p className="text-sm text-muted-foreground mt-4">
              No upcoming payments in the next 30 days
            </p>
          </div>
        ) : (
          upcomingPayments?.map(payment => (
            <div
              key={payment?.id}
              className="p-3 md:p-4 rounded-lg border border-border hover:border-primary transition-smooth"
            >
              <div className="flex items-start justify-between mb-2 md:mb-3">
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm md:text-base font-medium text-foreground mb-1">
                    {payment?.customerName}
                  </h4>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    {payment?.invoiceNumber}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${getRiskBadge(
                    payment?.riskLevel
                  )}`}
                >
                  {payment?.riskLevel?.toUpperCase()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg md:text-xl font-bold text-foreground">
                    {formatCurrency(payment?.amount)}
                  </p>
                  <p className="text-xs md:text-sm text-muted-foreground mt-1">
                    Due in {payment?.daysUntilDue} days
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 justify-end">
                    <Icon
                      name="AlertTriangle"
                      size={14}
                      color="var(--color-warning)"
                    />
                    <span className="text-xs md:text-sm font-medium text-warning">
                      {payment?.delayProbability}%
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Delay risk
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default UpcomingPayments
