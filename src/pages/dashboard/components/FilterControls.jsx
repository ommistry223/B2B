import React, { useState } from 'react'
import Select from '../../../components/ui/Select'
import Button from '../../../components/ui/Button'

const FilterControls = ({ onFilterChange }) => {
  const [dateRange, setDateRange] = useState('30days')
  const [customerSegment, setCustomerSegment] = useState('all')

  const dateRangeOptions = [
    { value: '7days', label: 'Last 7 Days' },
    { value: '30days', label: 'Last 30 Days' },
    { value: '90days', label: 'Last 90 Days' },
    { value: '6months', label: 'Last 6 Months' },
    { value: '1year', label: 'Last Year' },
    { value: 'custom', label: 'Custom Range' },
  ]

  const customerSegmentOptions = [
    { value: 'all', label: 'All Customers' },
    { value: 'low-risk', label: 'Low Risk' },
    { value: 'medium-risk', label: 'Medium Risk' },
    { value: 'high-risk', label: 'High Risk' },
    { value: 'top-customers', label: 'Top 10 Customers' },
    { value: 'new-customers', label: 'New Customers' },
  ]

  const handleApplyFilters = () => {
    if (onFilterChange) {
      onFilterChange({ dateRange, customerSegment })
    }
  }

  const handleResetFilters = () => {
    setDateRange('30days')
    setCustomerSegment('all')
    if (onFilterChange) {
      onFilterChange({ dateRange: '30days', customerSegment: 'all' })
    }
  }

  return (
    <div className="bg-card rounded-lg p-4 md:p-6 shadow-elevation-sm border border-border">
      <h3 className="text-base md:text-lg font-semibold text-foreground mb-4 md:mb-6">
        Filter Dashboard
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <Select
          label="Date Range"
          options={dateRangeOptions}
          value={dateRange}
          onChange={setDateRange}
          placeholder="Select date range"
        />
        <Select
          label="Customer Segment"
          options={customerSegmentOptions}
          value={customerSegment}
          onChange={setCustomerSegment}
          placeholder="Select customer segment"
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-6">
        <Button
          variant="default"
          iconName="Filter"
          iconPosition="left"
          onClick={handleApplyFilters}
          className="flex-1 sm:flex-none"
        >
          Apply Filters
        </Button>
        <Button
          variant="outline"
          iconName="RotateCcw"
          iconPosition="left"
          onClick={handleResetFilters}
          className="flex-1 sm:flex-none"
        >
          Reset
        </Button>
      </div>
    </div>
  )
}

export default FilterControls
