import React, { useState } from 'react'
import Icon from '../../../components/AppIcon'
import Input from '../../../components/ui/Input'

const InvoiceSelector = ({ invoices, selectedInvoice, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredInvoices = invoices?.filter(
    invoice =>
      invoice?.invoiceNumber
        ?.toLowerCase()
        ?.includes(searchTerm?.toLowerCase()) ||
      invoice?.customerName?.toLowerCase()?.includes(searchTerm?.toLowerCase())
  )

  const getStatusColor = status => {
    switch (status) {
      case 'Overdue':
        return 'text-error'
      case 'Unpaid':
        return 'text-warning'
      case 'Partially Paid':
        return 'text-secondary'
      default:
        return 'text-muted-foreground'
    }
  }

  return (
    <div className="bg-card rounded-lg border border-border p-4 md:p-6">
      <div className="flex items-center gap-3 mb-4 md:mb-6">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon name="FileText" size={20} color="var(--color-primary)" />
        </div>
        <div>
          <h2 className="text-lg md:text-xl font-semibold text-foreground">
            Select Invoice
          </h2>
          <p className="text-sm text-muted-foreground">
            Choose the invoice to record payment
          </p>
        </div>
      </div>
      <Input
        type="search"
        placeholder="Search by invoice number or customer name"
        value={searchTerm}
        onChange={e => setSearchTerm(e?.target?.value)}
        className="mb-4"
      />
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredInvoices?.length === 0 ? (
          <div className="text-center py-8">
            <Icon
              name="Search"
              size={48}
              color="var(--color-muted-foreground)"
            />
            <p className="mt-4 text-sm text-muted-foreground">
              No invoices found
            </p>
          </div>
        ) : (
          filteredInvoices?.map(invoice => (
            <div
              key={invoice?.id}
              onClick={() => onSelect(invoice)}
              className={`p-4 rounded-lg border transition-smooth cursor-pointer ${
                selectedInvoice?.id === invoice?.id
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50 hover:bg-muted'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-semibold text-foreground data-text">
                      {invoice?.invoiceNumber}
                    </span>
                    <span
                      className={`text-xs font-medium ${getStatusColor(
                        invoice?.status
                      )}`}
                    >
                      {invoice?.status}
                    </span>
                  </div>
                  <p className="text-sm text-foreground mb-1">
                    {invoice?.customerName}
                  </p>
                  <p className="text-xs text-muted-foreground caption">
                    Due: {invoice?.dueDate}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-base md:text-lg font-semibold text-foreground data-text">
                    ₹
                    {invoice?.outstandingAmount?.toLocaleString('en-IN', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                  <p className="text-xs text-muted-foreground caption">
                    Outstanding
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

export default InvoiceSelector
