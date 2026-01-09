import React, { useState } from 'react'
import Icon from '../../../components/AppIcon'
import Input from '../../../components/ui/Input'
import Button from '../../../components/ui/Button'

const MultiInvoiceAllocation = ({
  customerInvoices,
  totalPayment,
  onAllocate,
  onCancel,
}) => {
  const [allocations, setAllocations] = useState(
    customerInvoices?.map(invoice => ({
      invoiceId: invoice?.id,
      invoiceNumber: invoice?.invoiceNumber,
      outstandingAmount: invoice?.outstandingAmount,
      allocatedAmount: 0,
    }))
  )

  const totalAllocated = allocations?.reduce(
    (sum, alloc) => sum + parseFloat(alloc?.allocatedAmount || 0),
    0
  )
  const remainingAmount = totalPayment - totalAllocated

  const handleAllocationChange = (invoiceId, value) => {
    if (value === '' || /^\d*\.?\d{0,2}$/?.test(value)) {
      setAllocations(
        allocations?.map(alloc =>
          alloc?.invoiceId === invoiceId
            ? { ...alloc, allocatedAmount: value }
            : alloc
        )
      )
    }
  }

  const autoAllocate = () => {
    let remaining = totalPayment
    const newAllocations = allocations?.map(alloc => {
      if (remaining <= 0) {
        return { ...alloc, allocatedAmount: 0 }
      }
      const allocated = Math.min(remaining, alloc?.outstandingAmount)
      remaining -= allocated
      return { ...alloc, allocatedAmount: allocated }
    })
    setAllocations(newAllocations)
  }

  const handleSubmit = () => {
    const validAllocations = allocations?.filter(
      alloc => parseFloat(alloc?.allocatedAmount || 0) > 0
    )
    onAllocate(validAllocations)
  }

  return (
    <div className="bg-card rounded-lg border border-border p-4 md:p-6">
      <div className="flex items-center gap-3 mb-4 md:mb-6">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
          <Icon name="Split" size={20} color="var(--color-secondary)" />
        </div>
        <div className="flex-1">
          <h2 className="text-lg md:text-xl font-semibold text-foreground">
            Allocate Payment
          </h2>
          <p className="text-sm text-muted-foreground">
            Distribute payment across multiple invoices
          </p>
        </div>
      </div>
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-muted-foreground caption mb-1">
              Total Payment
            </p>
            <p className="text-base font-semibold text-foreground data-text">
              ₹
              {totalPayment?.toLocaleString('en-IN', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground caption mb-1">
              Allocated
            </p>
            <p className="text-base font-semibold text-success data-text">
              ₹
              {totalAllocated?.toLocaleString('en-IN', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground caption mb-1">
              Remaining
            </p>
            <p
              className={`text-base font-semibold data-text ${
                remainingAmount === 0 ? 'text-success' : 'text-warning'
              }`}
            >
              ₹
              {remainingAmount?.toLocaleString('en-IN', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
        </div>
      </div>
      <div className="mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={autoAllocate}
          iconName="Zap"
          iconPosition="left"
        >
          Auto Allocate
        </Button>
      </div>
      <div className="space-y-4 max-h-96 overflow-y-auto mb-6">
        {allocations?.map(allocation => (
          <div
            key={allocation?.invoiceId}
            className="p-4 rounded-lg border border-border"
          >
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground data-text mb-1">
                  {allocation?.invoiceNumber}
                </p>
                <p className="text-xs text-muted-foreground caption">
                  Outstanding: ₹
                  {allocation?.outstandingAmount?.toLocaleString('en-IN', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
            </div>
            <Input
              type="text"
              placeholder="0.00"
              value={allocation?.allocatedAmount}
              onChange={e =>
                handleAllocationChange(allocation?.invoiceId, e?.target?.value)
              }
              description={`Max: ₹${allocation?.outstandingAmount?.toLocaleString(
                'en-IN'
              )}`}
            />
          </div>
        ))}
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <Button variant="outline" onClick={onCancel} fullWidth>
          Cancel
        </Button>
        <Button
          variant="default"
          onClick={handleSubmit}
          fullWidth
          iconName="Check"
          iconPosition="left"
          disabled={totalAllocated === 0 || remainingAmount !== 0}
        >
          Confirm Allocation
        </Button>
      </div>
    </div>
  )
}

export default MultiInvoiceAllocation
