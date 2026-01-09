import React from 'react'
import Select from '../../../components/ui/Select'
import Input from '../../../components/ui/Input'
import { Checkbox } from '../../../components/ui/Checkbox'

const PaymentTermsSection = ({
  paymentTerms,
  onPaymentTermsChange,
  dueDate,
  onDueDateChange,
  isRecurring,
  onRecurringChange,
  recurringFrequency,
  onRecurringFrequencyChange,
}) => {
  const paymentTermsOptions = [
    { value: '0', label: 'Immediate Payment' },
    { value: '7', label: 'Net 7 Days' },
    { value: '15', label: 'Net 15 Days' },
    { value: '30', label: 'Net 30 Days' },
    { value: '45', label: 'Net 45 Days' },
    { value: '60', label: 'Net 60 Days' },
    { value: '90', label: 'Net 90 Days' },
    { value: 'custom', label: 'Custom Terms' },
  ]

  const recurringFrequencyOptions = [
    { value: 'weekly', label: 'Weekly' },
    { value: 'biweekly', label: 'Bi-weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'yearly', label: 'Yearly' },
  ]

  return (
    <div className="space-y-4 md:space-y-6">
      <h3 className="text-base font-semibold text-foreground">Payment Terms</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Payment Terms"
          description="Select standard payment terms"
          options={paymentTermsOptions}
          value={paymentTerms}
          onChange={onPaymentTermsChange}
        />

        <Input
          type="date"
          label="Due Date"
          description="Invoice payment due date"
          value={dueDate}
          onChange={e => onDueDateChange(e?.target?.value)}
          required
        />
      </div>
      <div className="p-4 bg-muted rounded-lg space-y-4">
        <Checkbox
          label="Recurring Invoice"
          description="Set up automatic recurring invoices"
          checked={isRecurring}
          onChange={e => onRecurringChange(e?.target?.checked)}
        />

        {isRecurring && (
          <div className="pl-8 pt-2">
            <Select
              label="Frequency"
              description="How often should this invoice recur?"
              options={recurringFrequencyOptions}
              value={recurringFrequency}
              onChange={onRecurringFrequencyChange}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default PaymentTermsSection
