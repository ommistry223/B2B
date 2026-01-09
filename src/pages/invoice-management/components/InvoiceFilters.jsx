import React, { useState } from 'react'

import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import Select from '../../../components/ui/Select'

const InvoiceFilters = ({ onFilterChange, onReset }) => {
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    dateFrom: '',
    dateTo: '',
    amountMin: '',
    amountMax: '',
    customer: '',
  })

  const [isExpanded, setIsExpanded] = useState(false)

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'unpaid', label: 'Unpaid' },
    { value: 'paid', label: 'Paid' },
    { value: 'partially_paid', label: 'Partially Paid' },
    { value: 'overdue', label: 'Overdue' },
  ]

  const customerOptions = [
    { value: '', label: 'All Customers' },
    { value: 'acme_corp', label: 'Acme Corporation' },
    { value: 'techstart_ltd', label: 'TechStart Ltd' },
    { value: 'global_traders', label: 'Global Traders' },
    { value: 'metro_wholesale', label: 'Metro Wholesale' },
    { value: 'prime_distributors', label: 'Prime Distributors' },
  ]

  const handleFilterChange = (field, value) => {
    const updatedFilters = { ...filters, [field]: value }
    setFilters(updatedFilters)
    onFilterChange(updatedFilters)
  }

  const handleReset = () => {
    const resetFilters = {
      search: '',
      status: '',
      dateFrom: '',
      dateTo: '',
      amountMin: '',
      amountMax: '',
      customer: '',
    }
    setFilters(resetFilters)
    onReset()
  }

  const activeFilterCount = Object.values(filters)?.filter(
    v => v !== ''
  )?.length

  return (
    <div className="bg-card rounded-lg border border-border p-4 md:p-6">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        <div className="flex-1">
          <Input
            type="search"
            placeholder="Search by invoice number or customer name..."
            value={filters?.search}
            onChange={e => handleFilterChange('search', e?.target?.value)}
            className="w-full"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            iconName={isExpanded ? 'ChevronUp' : 'ChevronDown'}
            iconPosition="right"
            onClick={() => setIsExpanded(!isExpanded)}
            className="whitespace-nowrap"
          >
            Advanced Filters
            {activeFilterCount > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-primary text-primary-foreground text-xs rounded-full">
                {activeFilterCount}
              </span>
            )}
          </Button>

          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              iconName="X"
              iconSize={18}
              onClick={handleReset}
              className="text-muted-foreground"
            >
              Clear
            </Button>
          )}
        </div>
      </div>
      {isExpanded && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Select
            label="Status"
            options={statusOptions}
            value={filters?.status}
            onChange={value => handleFilterChange('status', value)}
          />

          <Select
            label="Customer"
            options={customerOptions}
            value={filters?.customer}
            onChange={value => handleFilterChange('customer', value)}
            searchable
          />

          <Input
            type="date"
            label="From Date"
            value={filters?.dateFrom}
            onChange={e => handleFilterChange('dateFrom', e?.target?.value)}
          />

          <Input
            type="date"
            label="To Date"
            value={filters?.dateTo}
            onChange={e => handleFilterChange('dateTo', e?.target?.value)}
          />

          <Input
            type="number"
            label="Min Amount (₹)"
            placeholder="0"
            value={filters?.amountMin}
            onChange={e => handleFilterChange('amountMin', e?.target?.value)}
          />

          <Input
            type="number"
            label="Max Amount (₹)"
            placeholder="1000000"
            value={filters?.amountMax}
            onChange={e => handleFilterChange('amountMax', e?.target?.value)}
          />
        </div>
      )}
    </div>
  )
}

export default InvoiceFilters
