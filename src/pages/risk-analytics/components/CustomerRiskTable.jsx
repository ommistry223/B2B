import React, { useState } from 'react'
import Icon from '../../../components/AppIcon'
import Button from '../../../components/ui/Button'

const CustomerRiskTable = ({ customers, onViewDetails }) => {
  const [sortConfig, setSortConfig] = useState({
    key: 'riskScore',
    direction: 'desc',
  })
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const getRiskBadge = level => {
    const configs = {
      Low: { bg: 'bg-success/10', text: 'text-success', icon: 'CheckCircle2' },
      Medium: {
        bg: 'bg-warning/10',
        text: 'text-warning',
        icon: 'AlertCircle',
      },
      High: { bg: 'bg-error/10', text: 'text-error', icon: 'AlertTriangle' },
    }
    const config = configs?.[level]
    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${config?.bg} ${config?.text}`}
      >
        <Icon name={config?.icon} size={14} />
        {level}
      </span>
    )
  }

  const handleSort = key => {
    setSortConfig({
      key,
      direction:
        sortConfig?.key === key && sortConfig?.direction === 'asc'
          ? 'desc'
          : 'asc',
    })
  }

  const sortedCustomers = [...customers]?.sort((a, b) => {
    if (sortConfig?.key === 'riskScore') {
      return sortConfig?.direction === 'asc'
        ? a?.riskScore - b?.riskScore
        : b?.riskScore - a?.riskScore
    }
    if (sortConfig?.key === 'expectedDelay') {
      return sortConfig?.direction === 'asc'
        ? a?.expectedDelay - b?.expectedDelay
        : b?.expectedDelay - a?.expectedDelay
    }
    if (sortConfig?.key === 'outstanding') {
      return sortConfig?.direction === 'asc'
        ? a?.outstanding - b?.outstanding
        : b?.outstanding - a?.outstanding
    }
    return 0
  })

  const totalPages = Math.ceil(sortedCustomers?.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedCustomers = sortedCustomers?.slice(
    startIndex,
    startIndex + itemsPerPage
  )

  const SortIcon = ({ columnKey }) => {
    if (sortConfig?.key !== columnKey)
      return (
        <Icon
          name="ChevronsUpDown"
          size={16}
          color="var(--color-muted-foreground)"
        />
      )
    return (
      <Icon
        name={sortConfig?.direction === 'asc' ? 'ChevronUp' : 'ChevronDown'}
        size={16}
        color="var(--color-primary)"
      />
    )
  }

  return (
    <div className="bg-card rounded-lg shadow-elevation-sm border border-border overflow-hidden">
      <div className="p-4 md:p-6 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">
          Customer Risk Profiles
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Detailed risk assessment and payment behavior analysis
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Customer
              </th>
              <th
                className="px-4 md:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground transition-smooth"
                onClick={() => handleSort('riskScore')}
              >
                <div className="flex items-center gap-2">
                  Risk Score
                  <SortIcon columnKey="riskScore" />
                </div>
              </th>
              <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Risk Level
              </th>
              <th
                className="px-4 md:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground transition-smooth"
                onClick={() => handleSort('expectedDelay')}
              >
                <div className="flex items-center gap-2">
                  Expected Delay
                  <SortIcon columnKey="expectedDelay" />
                </div>
              </th>
              <th
                className="px-4 md:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground transition-smooth"
                onClick={() => handleSort('outstanding')}
              >
                <div className="flex items-center gap-2">
                  Outstanding
                  <SortIcon columnKey="outstanding" />
                </div>
              </th>
              <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Payment Behavior
              </th>
              <th className="px-4 md:px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paginatedCustomers?.map(customer => (
              <tr
                key={customer?.id}
                className="hover:bg-muted/50 transition-smooth"
              >
                <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-medium text-primary">
                        {customer?.name
                          ?.split(' ')
                          ?.map(n => n?.[0])
                          ?.join('')}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {customer?.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {customer?.company}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-muted rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          customer?.riskScore >= 70
                            ? 'bg-error'
                            : customer?.riskScore >= 40
                            ? 'bg-warning'
                            : 'bg-success'
                        }`}
                        style={{ width: `${customer?.riskScore}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-foreground data-text">
                      {customer?.riskScore}
                    </span>
                  </div>
                </td>
                <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                  {getRiskBadge(customer?.riskLevel)}
                </td>
                <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-foreground data-text">
                    {customer?.expectedDelay} days
                  </span>
                </td>
                <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-medium text-foreground data-text">
                    ₹{customer?.outstanding?.toLocaleString('en-IN')}
                  </span>
                </td>
                <td className="px-4 md:px-6 py-4">
                  <p className="text-sm text-foreground line-clamp-2">
                    {customer?.paymentBehavior}
                  </p>
                </td>
                <td className="px-4 md:px-6 py-4 whitespace-nowrap text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="Eye"
                    iconPosition="left"
                    iconSize={16}
                    onClick={() => onViewDetails(customer)}
                  >
                    View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-4 md:px-6 py-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          Showing {startIndex + 1} to{' '}
          {Math.min(startIndex + itemsPerPage, sortedCustomers?.length)} of{' '}
          {sortedCustomers?.length} customers
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            iconName="ChevronLeft"
            iconSize={16}
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
          >
            Previous
          </Button>
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum
              if (totalPages <= 5) {
                pageNum = i + 1
              } else if (currentPage <= 3) {
                pageNum = i + 1
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i
              } else {
                pageNum = currentPage - 2 + i
              }
              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setCurrentPage(pageNum)}
                  className="w-8 h-8"
                >
                  {pageNum}
                </Button>
              )
            })}
          </div>
          <Button
            variant="outline"
            size="sm"
            iconName="ChevronRight"
            iconPosition="right"
            iconSize={16}
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => prev + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CustomerRiskTable
