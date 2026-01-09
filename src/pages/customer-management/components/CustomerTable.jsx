import React, { useState } from 'react'
import Icon from '../../../components/AppIcon'
import CustomerTableRow from './CustomerTableRow'

const CustomerTable = ({
  customers,
  selectedCustomers,
  onSelectCustomer,
  onSelectAll,
  onEdit,
  onViewDetails,
  onAdjustCredit,
  onSort,
  sortConfig,
}) => {
  const getSortIcon = column => {
    if (sortConfig?.column !== column) {
      return (
        <Icon
          name="ChevronsUpDown"
          size={16}
          color="var(--color-muted-foreground)"
        />
      )
    }
    return sortConfig?.direction === 'asc' ? (
      <Icon name="ChevronUp" size={16} color="var(--color-primary)" />
    ) : (
      <Icon name="ChevronDown" size={16} color="var(--color-primary)" />
    )
  }

  const allSelected =
    customers?.length > 0 &&
    customers?.every(c => selectedCustomers?.includes(c?.id))
  const someSelected = selectedCustomers?.length > 0 && !allSelected

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="px-4 py-3 text-left w-12">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={el => {
                    if (el) el.indeterminate = someSelected
                  }}
                  onChange={e => onSelectAll(e?.target?.checked)}
                  className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  aria-label="Select all customers"
                />
              </th>

              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => onSort('companyName')}
                  className="flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary transition-smooth"
                >
                  Company Name
                  {getSortIcon('companyName')}
                </button>
              </th>

              <th className="px-4 py-3 text-left">
                <span className="text-sm font-semibold text-foreground">
                  GST Number
                </span>
              </th>

              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => onSort('creditLimit')}
                  className="flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary transition-smooth"
                >
                  Credit Limit
                  {getSortIcon('creditLimit')}
                </button>
              </th>

              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => onSort('outstandingAmount')}
                  className="flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary transition-smooth"
                >
                  Outstanding
                  {getSortIcon('outstandingAmount')}
                </button>
              </th>

              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => onSort('riskLevel')}
                  className="flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary transition-smooth"
                >
                  Risk Score
                  {getSortIcon('riskLevel')}
                </button>
              </th>

              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => onSort('lastPaymentDate')}
                  className="flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary transition-smooth"
                >
                  Last Payment
                  {getSortIcon('lastPaymentDate')}
                </button>
              </th>

              <th className="px-4 py-3 text-left">
                <span className="text-sm font-semibold text-foreground">
                  Actions
                </span>
              </th>
            </tr>
          </thead>

          <tbody>
            {customers?.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-4 py-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <Icon
                      name="Users"
                      size={48}
                      color="var(--color-muted-foreground)"
                    />
                    <p className="mt-4 text-sm text-muted-foreground">
                      No customers found
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Try adjusting your filters
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              customers?.map(customer => (
                <CustomerTableRow
                  key={customer?.id}
                  customer={customer}
                  isSelected={selectedCustomers?.includes(customer?.id)}
                  onSelect={onSelectCustomer}
                  onEdit={onEdit}
                  onViewDetails={onViewDetails}
                  onAdjustCredit={onAdjustCredit}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default CustomerTable
