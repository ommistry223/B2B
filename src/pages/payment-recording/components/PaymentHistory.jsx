import React from 'react'
import Icon from '../../../components/AppIcon'

const PaymentHistory = ({ payments }) => {
  const getPaymentMethodIcon = method => {
    switch (method) {
      case 'bank_transfer':
      case 'neft':
      case 'rtgs':
      case 'imps':
        return 'Building2'
      case 'upi':
        return 'Smartphone'
      case 'cash':
        return 'Banknote'
      case 'cheque':
        return 'FileText'
      case 'card':
        return 'CreditCard'
      default:
        return 'DollarSign'
    }
  }

  const getPaymentMethodLabel = method => {
    const labels = {
      bank_transfer: 'Bank Transfer',
      upi: 'UPI',
      cash: 'Cash',
      cheque: 'Cheque',
      card: 'Card Payment',
      neft: 'NEFT',
      rtgs: 'RTGS',
      imps: 'IMPS',
    }
    return labels?.[method] || method
  }

  if (!payments || payments?.length === 0) {
    return (
      <div className="bg-card rounded-lg border border-border p-4 md:p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
            <Icon name="History" size={20} color="var(--color-secondary)" />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-semibold text-foreground">
              Payment History
            </h2>
            <p className="text-sm text-muted-foreground">
              Previous payments for this invoice
            </p>
          </div>
        </div>
        <div className="text-center py-8">
          <Icon
            name="Receipt"
            size={48}
            color="var(--color-muted-foreground)"
          />
          <p className="mt-4 text-sm text-muted-foreground">
            No payment history available
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-card rounded-lg border border-border p-4 md:p-6">
      <div className="flex items-center gap-3 mb-4 md:mb-6">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
          <Icon name="History" size={20} color="var(--color-secondary)" />
        </div>
        <div>
          <h2 className="text-lg md:text-xl font-semibold text-foreground">
            Payment History
          </h2>
          <p className="text-sm text-muted-foreground">
            {payments?.length} payment{payments?.length !== 1 ? 's' : ''}{' '}
            recorded
          </p>
        </div>
      </div>
      <div className="space-y-3">
        {payments?.map((payment, index) => (
          <div
            key={payment?.id}
            className="p-4 rounded-lg border border-border hover:border-primary/50 transition-smooth"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center flex-shrink-0">
                  <Icon
                    name={getPaymentMethodIcon(payment?.method)}
                    size={18}
                    color="var(--color-success)"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-foreground">
                      {getPaymentMethodLabel(payment?.method)}
                    </span>
                    {payment?.referenceNumber && (
                      <span className="text-xs text-muted-foreground caption data-text">
                        #{payment?.referenceNumber}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground caption mb-2">
                    {payment?.date}
                  </p>
                  {payment?.notes && (
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {payment?.notes}
                    </p>
                  )}
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-base md:text-lg font-semibold text-success data-text">
                  ₹
                  {payment?.amount?.toLocaleString('en-IN', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
                <p className="text-xs text-muted-foreground caption">
                  Payment {index + 1}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-muted-foreground">
            Total Paid:
          </span>
          <span className="text-lg font-semibold text-success data-text">
            ₹
            {payments
              ?.reduce((sum, p) => sum + p?.amount, 0)
              ?.toLocaleString('en-IN', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
          </span>
        </div>
      </div>
    </div>
  )
}

export default PaymentHistory
