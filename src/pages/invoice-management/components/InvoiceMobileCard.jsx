import React from 'react'
import Icon from '../../../components/AppIcon'
import Button from '../../../components/ui/Button'
import InvoiceStatusBadge from './InvoiceStatusBadge'

const InvoiceMobileCard = ({
  invoice,
  onRecordPayment,
  onSendReminder,
  onEdit,
}) => {
  const formatCurrency = amount => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    })?.format(amount)
  }

  const formatDate = dateString => {
    return new Date(dateString)?.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  return (
    <div className="bg-card rounded-lg border border-border p-4 hover:shadow-elevation-md transition-smooth">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-foreground data-text">
            {invoice?.invoiceNumber}
          </h3>
          <p className="text-sm text-foreground mt-1">
            {invoice?.customerName}
          </p>
          <p className="text-xs text-muted-foreground caption mt-0.5">
            {invoice?.gstNumber}
          </p>
        </div>
        <InvoiceStatusBadge
          status={invoice?.status}
          daysOverdue={invoice?.daysOverdue}
        />
      </div>
      <div className="grid grid-cols-2 gap-3 py-3 border-t border-border">
        <div>
          <p className="text-xs text-muted-foreground caption mb-1">
            Total Amount
          </p>
          <p className="text-sm font-semibold text-foreground data-text">
            {formatCurrency(invoice?.amount)}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground caption mb-1">
            Outstanding
          </p>
          <p
            className={`text-sm font-semibold data-text ${
              invoice?.outstanding > 0 ? 'text-error' : 'text-success'
            }`}
          >
            {formatCurrency(invoice?.outstanding)}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 py-3 border-t border-border">
        <Icon name="Calendar" size={16} color="var(--color-muted-foreground)" />
        <span className="text-sm text-muted-foreground">
          Due: {formatDate(invoice?.dueDate)}
        </span>
      </div>
      <div className="flex items-center gap-2 pt-3 border-t border-border">
        {invoice?.status !== 'paid' && (
          <Button
            variant="default"
            size="sm"
            iconName="DollarSign"
            iconPosition="left"
            iconSize={16}
            onClick={() => onRecordPayment(invoice)}
            fullWidth
          >
            Record Payment
          </Button>
        )}
        <Button
          variant="outline"
          size="sm"
          iconName="Send"
          iconSize={18}
          onClick={() => onSendReminder(invoice)}
        />
        <Button
          variant="outline"
          size="sm"
          iconName="Edit"
          iconSize={18}
          onClick={() => onEdit(invoice)}
        />
      </div>
    </div>
  )
}

export default InvoiceMobileCard
