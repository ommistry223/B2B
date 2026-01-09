import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '../../../components/AppIcon'
import Button from '../../../components/ui/Button'
import InvoiceStatusBadge from './InvoiceStatusBadge'

const InvoiceTable = ({
  invoices,
  onRecordPayment,
  onSendReminder,
  onEdit,
}) => {
  const navigate = useNavigate()
  const [sortConfig, setSortConfig] = useState({
    key: 'dueDate',
    direction: 'asc',
  })
  const [selectedInvoices, setSelectedInvoices] = useState([])

  const handleSort = key => {
    setSortConfig({
      key,
      direction:
        sortConfig?.key === key && sortConfig?.direction === 'asc'
          ? 'desc'
          : 'asc',
    })
  }

  const sortedInvoices = [...invoices]?.sort((a, b) => {
    if (sortConfig?.key === 'amount' || sortConfig?.key === 'outstanding') {
      return sortConfig?.direction === 'asc'
        ? a?.[sortConfig?.key] - b?.[sortConfig?.key]
        : b?.[sortConfig?.key] - a?.[sortConfig?.key]
    }

    if (sortConfig?.key === 'dueDate') {
      return sortConfig?.direction === 'asc'
        ? new Date(a[sortConfig.key]) - new Date(b[sortConfig.key])
        : new Date(b[sortConfig.key]) - new Date(a[sortConfig.key])
    }

    return sortConfig?.direction === 'asc'
      ? String(a?.[sortConfig?.key])?.localeCompare(
          String(b?.[sortConfig?.key])
        )
      : String(b?.[sortConfig?.key])?.localeCompare(
          String(a?.[sortConfig?.key])
        )
  })

  const handleSelectAll = checked => {
    setSelectedInvoices(checked ? invoices?.map(inv => inv?.id) : [])
  }

  const handleSelectInvoice = (id, checked) => {
    setSelectedInvoices(prev =>
      checked ? [...prev, id] : prev?.filter(invId => invId !== id)
    )
  }

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

  const SortIcon = ({ columnKey }) => {
    if (sortConfig?.key !== columnKey) {
      return (
        <Icon
          name="ChevronsUpDown"
          size={16}
          color="var(--color-muted-foreground)"
        />
      )
    }
    return (
      <Icon
        name={sortConfig?.direction === 'asc' ? 'ChevronUp' : 'ChevronDown'}
        size={16}
        color="var(--color-primary)"
      />
    )
  }

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      {selectedInvoices?.length > 0 && (
        <div className="bg-primary/5 border-b border-border px-4 md:px-6 py-3 flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">
            {selectedInvoices?.length} invoice
            {selectedInvoices?.length > 1 ? 's' : ''} selected
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              iconName="Send"
              iconPosition="left"
              iconSize={16}
            >
              Send Reminders
            </Button>
            <Button
              variant="outline"
              size="sm"
              iconName="Download"
              iconPosition="left"
              iconSize={16}
            >
              Export
            </Button>
          </div>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="px-4 md:px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedInvoices?.length === invoices?.length}
                  onChange={e => handleSelectAll(e?.target?.checked)}
                  className="w-4 h-4 rounded border-border"
                />
              </th>
              <th
                className="px-4 md:px-6 py-3 text-left cursor-pointer hover:bg-muted/70 transition-smooth"
                onClick={() => handleSort('invoiceNumber')}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs md:text-sm font-semibold text-foreground">
                    Invoice #
                  </span>
                  <SortIcon columnKey="invoiceNumber" />
                </div>
              </th>
              <th
                className="px-4 md:px-6 py-3 text-left cursor-pointer hover:bg-muted/70 transition-smooth"
                onClick={() => handleSort('customerName')}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs md:text-sm font-semibold text-foreground">
                    Customer
                  </span>
                  <SortIcon columnKey="customerName" />
                </div>
              </th>
              <th
                className="px-4 md:px-6 py-3 text-right cursor-pointer hover:bg-muted/70 transition-smooth"
                onClick={() => handleSort('amount')}
              >
                <div className="flex items-center justify-end gap-2">
                  <span className="text-xs md:text-sm font-semibold text-foreground">
                    Amount
                  </span>
                  <SortIcon columnKey="amount" />
                </div>
              </th>
              <th
                className="px-4 md:px-6 py-3 text-right cursor-pointer hover:bg-muted/70 transition-smooth"
                onClick={() => handleSort('outstanding')}
              >
                <div className="flex items-center justify-end gap-2">
                  <span className="text-xs md:text-sm font-semibold text-foreground">
                    Outstanding
                  </span>
                  <SortIcon columnKey="outstanding" />
                </div>
              </th>
              <th
                className="px-4 md:px-6 py-3 text-left cursor-pointer hover:bg-muted/70 transition-smooth"
                onClick={() => handleSort('dueDate')}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs md:text-sm font-semibold text-foreground">
                    Due Date
                  </span>
                  <SortIcon columnKey="dueDate" />
                </div>
              </th>
              <th className="px-4 md:px-6 py-3 text-left">
                <span className="text-xs md:text-sm font-semibold text-foreground">
                  Status
                </span>
              </th>
              <th className="px-4 md:px-6 py-3 text-center">
                <span className="text-xs md:text-sm font-semibold text-foreground">
                  Actions
                </span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sortedInvoices?.map(invoice => (
              <tr
                key={invoice?.id}
                className="hover:bg-muted/30 transition-smooth"
              >
                <td className="px-4 md:px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedInvoices?.includes(invoice?.id)}
                    onChange={e =>
                      handleSelectInvoice(invoice?.id, e?.target?.checked)
                    }
                    className="w-4 h-4 rounded border-border"
                  />
                </td>
                <td className="px-4 md:px-6 py-4">
                  <span className="text-sm font-medium text-foreground data-text">
                    {invoice?.invoiceNumber}
                  </span>
                </td>
                <td className="px-4 md:px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-foreground">
                      {invoice?.customerName}
                    </span>
                    <span className="text-xs text-muted-foreground caption">
                      {invoice?.gstNumber}
                    </span>
                  </div>
                </td>
                <td className="px-4 md:px-6 py-4 text-right">
                  <span className="text-sm font-semibold text-foreground data-text">
                    {formatCurrency(invoice?.amount)}
                  </span>
                </td>
                <td className="px-4 md:px-6 py-4 text-right">
                  <span
                    className={`text-sm font-semibold data-text ${
                      invoice?.outstanding > 0 ? 'text-error' : 'text-success'
                    }`}
                  >
                    {formatCurrency(invoice?.outstanding)}
                  </span>
                </td>
                <td className="px-4 md:px-6 py-4">
                  <span className="text-sm text-foreground">
                    {formatDate(invoice?.dueDate)}
                  </span>
                </td>
                <td className="px-4 md:px-6 py-4">
                  <InvoiceStatusBadge
                    status={invoice?.status}
                    daysOverdue={invoice?.daysOverdue}
                  />
                </td>
                <td className="px-4 md:px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    {invoice?.status !== 'paid' && (
                      <Button
                        variant="ghost"
                        size="icon"
                        iconName="DollarSign"
                        iconSize={18}
                        onClick={() => onRecordPayment(invoice)}
                        title="Record Payment"
                      />
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      iconName="Send"
                      iconSize={18}
                      onClick={() => onSendReminder(invoice)}
                      title="Send Reminder"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      iconName="Edit"
                      iconSize={18}
                      onClick={() => onEdit(invoice)}
                      title="Edit Invoice"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {sortedInvoices?.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 px-4">
          <Icon
            name="FileText"
            size={48}
            color="var(--color-muted-foreground)"
          />
          <p className="mt-4 text-base font-medium text-foreground">
            No invoices found
          </p>
          <p className="mt-2 text-sm text-muted-foreground text-center">
            Try adjusting your filters or create a new invoice
          </p>
          <Button
            variant="default"
            iconName="Plus"
            iconPosition="left"
            onClick={() => navigate('/create-invoice')}
            className="mt-6"
          >
            Create Invoice
          </Button>
        </div>
      )}
    </div>
  )
}

export default InvoiceTable
