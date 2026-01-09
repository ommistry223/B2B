import React from 'react'
import Select from '../../../components/ui/Select'
import Input from '../../../components/ui/Input'
import Button from '../../../components/ui/Button'

const CustomerFilters = ({ filters, onFilterChange, onReset }) => {
  const riskLevelOptions = [
    { value: 'all', label: 'All Risk Levels' },
    { value: 'low', label: 'Low Risk' },
    { value: 'medium', label: 'Medium Risk' },
    { value: 'high', label: 'High Risk' },
  ]

  const creditLimitOptions = [
    { value: 'all', label: 'All Credit Limits' },
    { value: '0-50000', label: '₹0 - ₹50,000' },
    { value: '50000-200000', label: '₹50,000 - ₹2,00,000' },
    { value: '200000-500000', label: '₹2,00,000 - ₹5,00,000' },
    { value: '500000+', label: '₹5,00,000+' },
  ]

  const paymentStatusOptions = [
    { value: 'all', label: 'All Payment Status' },
    { value: 'current', label: 'Current' },
    { value: 'overdue', label: 'Overdue' },
    { value: 'no-outstanding', label: 'No Outstanding' },
  ]

  const hasActiveFilters =
    filters?.riskLevel !== 'all' ||
    filters?.creditLimit !== 'all' ||
    filters?.paymentStatus !== 'all' ||
    filters?.search !== ''

  return (
    <div className="bg-card rounded-lg border border-border p-4 md:p-6 mb-4 md:mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Input
          type="search"
          placeholder="Search by name, GST..."
          value={filters?.search}
          onChange={e => onFilterChange('search', e?.target?.value)}
          className="w-full"
        />

        <Select
          options={riskLevelOptions}
          value={filters?.riskLevel}
          onChange={value => onFilterChange('riskLevel', value)}
          placeholder="Filter by risk"
        />

        <Select
          options={creditLimitOptions}
          value={filters?.creditLimit}
          onChange={value => onFilterChange('creditLimit', value)}
          placeholder="Filter by credit limit"
        />

        <Select
          options={paymentStatusOptions}
          value={filters?.paymentStatus}
          onChange={value => onFilterChange('paymentStatus', value)}
          placeholder="Filter by payment status"
        />
      </div>
      {hasActiveFilters && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Active filters applied
          </p>
          <Button
            variant="ghost"
            size="sm"
            iconName="X"
            iconPosition="left"
            onClick={onReset}
          >
            Clear All Filters
          </Button>
        </div>
      )}
    </div>
  )
}

export default CustomerFilters
