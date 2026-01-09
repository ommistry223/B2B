import React, { useState, useEffect } from 'react'
import Icon from '../../../components/AppIcon'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import Select from '../../../components/ui/Select'

const PaymentRecordModal = ({ invoice, isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    paymentAmount: '',
    paymentDate: new Date()?.toISOString()?.split('T')?.[0],
    paymentMethod: '',
    transactionId: '',
    notes: '',
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (isOpen && invoice) {
      setFormData({
        paymentAmount: invoice?.outstanding?.toString(),
        paymentDate: new Date()?.toISOString()?.split('T')?.[0],
        paymentMethod: '',
        transactionId: '',
        notes: '',
      })
      setErrors({})
    }
  }, [isOpen, invoice])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const paymentMethodOptions = [
    { value: '', label: 'Select payment method' },
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'upi', label: 'UPI' },
    { value: 'cheque', label: 'Cheque' },
    { value: 'cash', label: 'Cash' },
    { value: 'card', label: 'Card Payment' },
  ]

  const formatCurrency = amount => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    })?.format(amount)
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData?.paymentAmount || parseFloat(formData?.paymentAmount) <= 0) {
      newErrors.paymentAmount = 'Please enter a valid payment amount'
    } else if (parseFloat(formData?.paymentAmount) > invoice?.outstanding) {
      newErrors.paymentAmount =
        'Payment amount cannot exceed outstanding amount'
    }

    if (!formData?.paymentDate) {
      newErrors.paymentDate = 'Please select payment date'
    }

    if (!formData?.paymentMethod) {
      newErrors.paymentMethod = 'Please select payment method'
    }

    setErrors(newErrors)
    return Object.keys(newErrors)?.length === 0
  }

  const handleSubmit = e => {
    e?.preventDefault()
    if (validateForm()) {
      onSubmit({
        ...formData,
        invoiceId: invoice?.id,
        paymentAmount: parseFloat(formData?.paymentAmount),
      })
    }
  }

  if (!isOpen || !invoice) return null

  const remainingAmount =
    invoice?.outstanding - (parseFloat(formData?.paymentAmount) || 0)

  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="bg-card rounded-lg shadow-elevation-xl border border-border w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              Record Payment
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Invoice: {invoice?.invoiceNumber}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            iconName="X"
            iconSize={24}
            onClick={onClose}
          />
        </div>

        <div className="p-6">
          <div className="bg-muted/50 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-muted-foreground caption mb-1">
                  Customer
                </p>
                <p className="text-sm font-medium text-foreground">
                  {invoice?.customerName}
                </p>
              </div>
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
                <p className="text-sm font-semibold text-error data-text">
                  {formatCurrency(invoice?.outstanding)}
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              type="number"
              label="Payment Amount (₹)"
              placeholder="Enter payment amount"
              value={formData?.paymentAmount}
              onChange={e => handleChange('paymentAmount', e?.target?.value)}
              error={errors?.paymentAmount}
              required
              min="0"
              step="0.01"
            />

            {formData?.paymentAmount &&
              parseFloat(formData?.paymentAmount) > 0 && (
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon name="Info" size={16} color="var(--color-primary)" />
                    <span className="text-sm font-medium text-primary">
                      Payment Summary
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-muted-foreground">Paying:</span>
                      <span className="ml-2 font-semibold text-foreground data-text">
                        {formatCurrency(parseFloat(formData?.paymentAmount))}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Remaining:</span>
                      <span
                        className={`ml-2 font-semibold data-text ${
                          remainingAmount > 0 ? 'text-warning' : 'text-success'
                        }`}
                      >
                        {formatCurrency(remainingAmount)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

            <Input
              type="date"
              label="Payment Date"
              value={formData?.paymentDate}
              onChange={e => handleChange('paymentDate', e?.target?.value)}
              error={errors?.paymentDate}
              required
              max={new Date()?.toISOString()?.split('T')?.[0]}
            />

            <Select
              label="Payment Method"
              options={paymentMethodOptions}
              value={formData?.paymentMethod}
              onChange={value => handleChange('paymentMethod', value)}
              error={errors?.paymentMethod}
              required
            />

            <Input
              type="text"
              label="Transaction ID / Reference Number"
              placeholder="Enter transaction reference"
              value={formData?.transactionId}
              onChange={e => handleChange('transactionId', e?.target?.value)}
              description="Optional: Bank reference, UPI ID, or cheque number"
            />

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Notes (Optional)
              </label>
              <textarea
                value={formData?.notes}
                onChange={e => handleChange('notes', e?.target?.value)}
                placeholder="Add any additional notes about this payment..."
                rows={3}
                className="w-full px-4 py-3 bg-background border border-input rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-smooth resize-none"
              />
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                fullWidth
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="default"
                iconName="Check"
                iconPosition="left"
                fullWidth
              >
                Record Payment
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default PaymentRecordModal
