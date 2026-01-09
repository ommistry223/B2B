import React, { useState, useEffect } from 'react'
import Icon from '../../../components/AppIcon'
import Input from '../../../components/ui/Input'
import Select from '../../../components/ui/Select'
import Button from '../../../components/ui/Button'
import { useData } from '../../../context/DataContext'

const PaymentForm = ({ invoice, onSubmit, onCancel }) => {
  const { addPayment } = useData()
  const [formData, setFormData] = useState({
    amount: '',
    paymentDate: new Date().toISOString().split('T')[0],
    paymentMethod: '',
    referenceNumber: '',
    notes: '',
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const paymentMethods = [
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'upi', label: 'UPI' },
    { value: 'cash', label: 'Cash' },
    { value: 'cheque', label: 'Cheque' },
    { value: 'card', label: 'Card Payment' },
    { value: 'neft', label: 'NEFT' },
    { value: 'rtgs', label: 'RTGS' },
    { value: 'imps', label: 'IMPS' },
  ]

  const validateForm = () => {
    const newErrors = {}

    if (!formData?.amount || parseFloat(formData?.amount) <= 0) {
      newErrors.amount = 'Please enter a valid payment amount'
    } else if (parseFloat(formData?.amount) > invoice?.outstandingAmount) {
      newErrors.amount = `Amount cannot exceed outstanding balance of ₹${invoice?.outstandingAmount?.toLocaleString(
        'en-IN'
      )}`
    }

    if (!formData?.paymentDate) {
      newErrors.paymentDate = 'Payment date is required'
    }

    if (!formData?.paymentMethod) {
      newErrors.paymentMethod = 'Please select a payment method'
    }

    if (formData?.paymentMethod === 'cheque' && !formData?.referenceNumber) {
      newErrors.referenceNumber = 'Cheque number is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors)?.length === 0
  }

  const handleSubmit = async e => {
    e?.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    setTimeout(() => {
      // Save payment to DataContext
      addPayment({
        invoiceId: invoice?.id,
        invoiceNumber: invoice?.invoiceNumber,
        customerId: invoice?.customerId,
        customerName: invoice?.customerName,
        amount: parseFloat(formData?.amount),
        paymentDate: formData?.paymentDate,
        paymentMode: formData?.paymentMethod,
        transactionId: formData?.referenceNumber || `TXN${Date.now()}`,
        notes: formData?.notes,
      })

      onSubmit({
        ...formData,
        amount: parseFloat(formData?.amount),
        invoiceId: invoice?.id,
        invoiceNumber: invoice?.invoiceNumber,
        customerName: invoice?.customerName,
        previousOutstanding: invoice?.outstandingAmount,
        newOutstanding:
          invoice?.outstandingAmount - parseFloat(formData?.amount),
      })
      setIsSubmitting(false)
    }, 1500)
  }

  const handleAmountChange = e => {
    const value = e?.target?.value
    if (value === '' || /^\d*\.?\d{0,2}$/?.test(value)) {
      setFormData({ ...formData, amount: value })
      if (errors?.amount) {
        setErrors({ ...errors, amount: '' })
      }
    }
  }

  const setFullAmount = () => {
    setFormData({ ...formData, amount: invoice?.outstandingAmount?.toString() })
    if (errors?.amount) {
      setErrors({ ...errors, amount: '' })
    }
  }

  const remainingBalance = formData?.amount
    ? invoice?.outstandingAmount - parseFloat(formData?.amount || 0)
    : invoice?.outstandingAmount

  return (
    <div className="bg-card rounded-lg border border-border p-4 md:p-6">
      <div className="flex items-center gap-3 mb-4 md:mb-6">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-success/10 flex items-center justify-center">
          <Icon name="DollarSign" size={20} color="var(--color-success)" />
        </div>
        <div>
          <h2 className="text-lg md:text-xl font-semibold text-foreground">
            Payment Details
          </h2>
          <p className="text-sm text-muted-foreground">
            Enter payment information
          </p>
        </div>
      </div>
      <div className="bg-muted rounded-lg p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground caption mb-1">
              Invoice Number
            </p>
            <p className="text-sm font-semibold text-foreground data-text">
              {invoice?.invoiceNumber}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground caption mb-1">
              Customer
            </p>
            <p className="text-sm font-semibold text-foreground">
              {invoice?.customerName}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground caption mb-1">
              Invoice Amount
            </p>
            <p className="text-sm font-semibold text-foreground data-text">
              ₹
              {invoice?.totalAmount?.toLocaleString('en-IN', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground caption mb-1">
              Outstanding Balance
            </p>
            <p className="text-sm font-semibold text-error data-text">
              ₹
              {invoice?.outstandingAmount?.toLocaleString('en-IN', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
        <div>
          <Input
            type="text"
            label="Payment Amount"
            placeholder="0.00"
            value={formData?.amount}
            onChange={handleAmountChange}
            error={errors?.amount}
            required
            description={`Maximum: ₹${invoice?.outstandingAmount?.toLocaleString(
              'en-IN'
            )}`}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={setFullAmount}
            className="mt-2"
          >
            Pay Full Amount
          </Button>
        </div>

        <Input
          type="date"
          label="Payment Date"
          value={formData?.paymentDate}
          onChange={e =>
            setFormData({ ...formData, paymentDate: e?.target?.value })
          }
          error={errors?.paymentDate}
          required
          max={new Date()?.toISOString()?.split('T')?.[0]}
        />

        <Select
          label="Payment Method"
          placeholder="Select payment method"
          options={paymentMethods}
          value={formData?.paymentMethod}
          onChange={value => setFormData({ ...formData, paymentMethod: value })}
          error={errors?.paymentMethod}
          required
        />

        <Input
          type="text"
          label="Reference Number"
          placeholder="Transaction ID / Cheque Number"
          value={formData?.referenceNumber}
          onChange={e =>
            setFormData({ ...formData, referenceNumber: e?.target?.value })
          }
          error={errors?.referenceNumber}
          description="Optional for most payment methods, required for cheque"
        />

        <Input
          type="text"
          label="Notes"
          placeholder="Additional payment notes (optional)"
          value={formData?.notes}
          onChange={e => setFormData({ ...formData, notes: e?.target?.value })}
        />

        {formData?.amount && (
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Icon name="Calculator" size={18} color="var(--color-primary)" />
              <p className="text-sm font-semibold text-foreground">
                Payment Summary
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Payment Amount:</span>
                <span className="font-semibold text-foreground data-text">
                  ₹
                  {parseFloat(formData?.amount)?.toLocaleString('en-IN', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Remaining Balance:
                </span>
                <span
                  className={`font-semibold data-text ${
                    remainingBalance === 0 ? 'text-success' : 'text-warning'
                  }`}
                >
                  ₹
                  {remainingBalance?.toLocaleString('en-IN', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
              <div className="pt-2 border-t border-border">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-foreground">
                    New Status:
                  </span>
                  <span
                    className={`text-sm font-semibold ${
                      remainingBalance === 0 ? 'text-success' : 'text-warning'
                    }`}
                  >
                    {remainingBalance === 0 ? 'Paid' : 'Partially Paid'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            fullWidth
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="default"
            loading={isSubmitting}
            fullWidth
            iconName="Check"
            iconPosition="left"
          >
            Record Payment
          </Button>
        </div>
      </form>
    </div>
  )
}

export default PaymentForm
