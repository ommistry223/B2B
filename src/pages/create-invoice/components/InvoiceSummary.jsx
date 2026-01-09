import React from 'react'

const InvoiceSummary = ({ items, gstRate }) => {
  const calculateSubtotal = () => {
    return items?.reduce((sum, item) => sum + item?.quantity * item?.rate, 0)
  }

  const subtotal = calculateSubtotal()
  const taxAmount = (subtotal * gstRate) / 100
  const total = subtotal + taxAmount

  return (
    <div className="bg-muted rounded-lg p-4 md:p-6 space-y-3">
      <h3 className="text-base font-semibold text-foreground mb-4">
        Invoice Summary
      </h3>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Subtotal</span>
          <span className="text-sm font-medium text-foreground data-text">
            ₹
            {subtotal?.toLocaleString('en-IN', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            GST ({gstRate}%)
          </span>
          <span className="text-sm font-medium text-foreground data-text">
            ₹
            {taxAmount?.toLocaleString('en-IN', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>

        <div className="pt-3 border-t border-border">
          <div className="flex items-center justify-between">
            <span className="text-base font-semibold text-foreground">
              Total Amount
            </span>
            <span className="text-lg md:text-xl font-bold text-primary data-text">
              ₹
              {total?.toLocaleString('en-IN', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
        </div>
      </div>
      <div className="pt-3 border-t border-border">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Total Items</p>
            <p className="text-sm font-semibold text-foreground data-text">
              {items?.length}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Total Quantity</p>
            <p className="text-sm font-semibold text-foreground data-text">
              {items
                ?.reduce((sum, item) => sum + item?.quantity, 0)
                ?.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InvoiceSummary
