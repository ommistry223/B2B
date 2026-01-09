import React from 'react'
import Icon from '../../../components/AppIcon'
import Button from '../../../components/ui/Button'
import RiskBadge from './RiskBadge'

const CustomerTableRow = ({
  customer,
  isSelected,
  onSelect,
  onEdit,
  onViewDetails,
  onAdjustCredit,
}) => {
  const formatCurrency = amount => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    })?.format(amount)
  }

  const formatDate = dateString => {
    const date = new Date(dateString)
    return date?.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  const getCreditUtilization = () => {
    if (customer?.creditLimit === 0) return 0
    return Math.round(
      (customer?.outstandingAmount / customer?.creditLimit) * 100
    )
  }

  const utilization = getCreditUtilization()
  const isOverUtilized = utilization > 90

  return (
    <tr className="border-b border-border hover:bg-muted/50 transition-smooth">
      <td className="px-4 py-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={e => onSelect(customer?.id, e?.target?.checked)}
          className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2"
          aria-label={`Select ${customer?.companyName}`}
        />
      </td>
      <td className="px-4 py-4">
        <div className="flex flex-col">
          <button
            onClick={() => onViewDetails(customer)}
            className="text-sm font-medium text-foreground hover:text-primary transition-smooth text-left"
          >
            {customer?.companyName}
          </button>
          <span className="text-xs text-muted-foreground mt-0.5">
            {customer?.contactPerson}
          </span>
        </div>
      </td>
      <td className="px-4 py-4">
        <span className="text-sm text-foreground data-text">
          {customer?.gstNumber}
        </span>
      </td>
      <td className="px-4 py-4">
        <div className="flex flex-col">
          <span className="text-sm font-medium text-foreground data-text">
            {formatCurrency(customer?.creditLimit)}
          </span>
          {isOverUtilized && (
            <span className="text-xs text-error mt-0.5 flex items-center gap-1">
              <Icon name="AlertTriangle" size={12} color="var(--color-error)" />
              {utilization}% utilized
            </span>
          )}
        </div>
      </td>
      <td className="px-4 py-4">
        <div className="flex flex-col">
          <span
            className={`text-sm font-medium data-text ${
              customer?.outstandingAmount > 0 ? 'text-error' : 'text-success'
            }`}
          >
            {formatCurrency(customer?.outstandingAmount)}
          </span>
          {customer?.overdueAmount > 0 && (
            <span className="text-xs text-error mt-0.5">
              ₹{customer?.overdueAmount?.toLocaleString('en-IN')} overdue
            </span>
          )}
        </div>
      </td>
      <td className="px-4 py-4">
        <RiskBadge level={customer?.riskLevel} size="sm" />
      </td>
      <td className="px-4 py-4">
        <span className="text-sm text-muted-foreground">
          {formatDate(customer?.lastPaymentDate)}
        </span>
      </td>
      <td className="px-4 py-4">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            iconName="Eye"
            iconSize={16}
            onClick={() => onViewDetails(customer)}
            className="h-8 w-8"
          />
          <Button
            variant="ghost"
            size="icon"
            iconName="Edit"
            iconSize={16}
            onClick={() => onEdit(customer)}
            className="h-8 w-8"
          />
          <Button
            variant="ghost"
            size="icon"
            iconName="DollarSign"
            iconSize={16}
            onClick={() => onAdjustCredit(customer)}
            className="h-8 w-8"
          />
        </div>
      </td>
    </tr>
  )
}

export default CustomerTableRow
