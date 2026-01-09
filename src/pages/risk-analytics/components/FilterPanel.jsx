import React from 'react'
import Select from '../../../components/ui/Select'
import Button from '../../../components/ui/Button'

const FilterPanel = ({ filters, onFilterChange, onReset, onExport }) => {
  const riskLevelOptions = [
    { value: 'all', label: 'All Risk Levels' },
    { value: 'low', label: 'Low Risk' },
    { value: 'medium', label: 'Medium Risk' },
    { value: 'high', label: 'High Risk' },
  ]

  const industryOptions = [
    { value: 'all', label: 'All Industries' },
    { value: 'manufacturing', label: 'Manufacturing' },
    { value: 'retail', label: 'Retail' },
    { value: 'technology', label: 'Technology' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'construction', label: 'Construction' },
  ]

  const timePeriodOptions = [
    { value: '30', label: 'Last 30 Days' },
    { value: '60', label: 'Last 60 Days' },
    { value: '90', label: 'Last 90 Days' },
    { value: '180', label: 'Last 6 Months' },
    { value: '365', label: 'Last Year' },
  ]

  return (
    <div className="bg-card rounded-lg p-4 md:p-6 shadow-elevation-sm border border-border">
      <div className="flex flex-col lg:flex-row items-start lg:items-end gap-4">
        <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select
            label="Risk Level"
            options={riskLevelOptions}
            value={filters?.riskLevel}
            onChange={value => onFilterChange('riskLevel', value)}
          />

          <Select
            label="Industry"
            options={industryOptions}
            value={filters?.industry}
            onChange={value => onFilterChange('industry', value)}
          />

          <Select
            label="Time Period"
            options={timePeriodOptions}
            value={filters?.timePeriod}
            onChange={value => onFilterChange('timePeriod', value)}
          />
        </div>

        <div className="flex items-center gap-2 w-full lg:w-auto">
          <Button
            variant="outline"
            iconName="RotateCcw"
            iconPosition="left"
            iconSize={16}
            onClick={onReset}
            className="flex-1 lg:flex-none"
          >
            Reset
          </Button>
          <Button
            variant="default"
            iconName="Download"
            iconPosition="left"
            iconSize={16}
            onClick={onExport}
            className="flex-1 lg:flex-none"
          >
            Export
          </Button>
        </div>
      </div>
    </div>
  )
}

export default FilterPanel
