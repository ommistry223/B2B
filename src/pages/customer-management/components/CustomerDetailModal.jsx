import React, { useState } from 'react'
import Icon from '../../../components/AppIcon'
import Button from '../../../components/ui/Button'
import RiskBadge from './RiskBadge'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts'

const CustomerDetailModal = ({ customer, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview')

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

  const paymentHistory = [
    {
      id: 1,
      invoiceNumber: 'INV-2026-045',
      amount: 125000,
      date: '2026-01-05',
      status: 'Paid',
      daysToPayment: 28,
    },
    {
      id: 2,
      invoiceNumber: 'INV-2025-312',
      amount: 98000,
      date: '2025-12-20',
      status: 'Paid',
      daysToPayment: 35,
    },
    {
      id: 3,
      invoiceNumber: 'INV-2025-289',
      amount: 156000,
      date: '2025-11-28',
      status: 'Paid',
      daysToPayment: 42,
    },
    {
      id: 4,
      invoiceNumber: 'INV-2025-245',
      amount: 87500,
      date: '2025-10-15',
      status: 'Paid',
      daysToPayment: 30,
    },
    {
      id: 5,
      invoiceNumber: 'INV-2025-198',
      amount: 134000,
      date: '2025-09-22',
      status: 'Paid',
      daysToPayment: 38,
    },
  ]

  const paymentTrendData = [
    { month: 'Sep', avgDelay: 38, amount: 134000 },
    { month: 'Oct', avgDelay: 30, amount: 87500 },
    { month: 'Nov', avgDelay: 42, amount: 156000 },
    { month: 'Dec', avgDelay: 35, amount: 98000 },
    { month: 'Jan', avgDelay: 28, amount: 125000 },
  ]

  const creditUtilizationData = [
    { month: 'Sep', utilization: 67 },
    { month: 'Oct', utilization: 44 },
    { month: 'Nov', utilization: 78 },
    { month: 'Dec', utilization: 49 },
    { month: 'Jan', utilization: 62 },
  ]

  const getCreditUtilization = () => {
    if (customer?.creditLimit === 0) return 0
    return Math.round(
      (customer?.outstandingAmount / customer?.creditLimit) * 100
    )
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'LayoutDashboard' },
    { id: 'payment-history', label: 'Payment History', icon: 'History' },
    { id: 'analytics', label: 'Analytics', icon: 'TrendingUp' },
  ]

  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="bg-card rounded-lg shadow-elevation-xl border border-border w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Icon name="Building2" size={24} color="var(--color-primary)" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                {customer?.companyName}
              </h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                {customer?.contactPerson}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            iconName="X"
            iconSize={20}
            onClick={onClose}
          />
        </div>

        <div className="border-b border-border px-4 md:px-6">
          <div className="flex gap-2 overflow-x-auto">
            {tabs?.map(tab => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-smooth whitespace-nowrap ${
                  activeTab === tab?.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon name={tab?.icon} size={16} />
                {tab?.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">
                      Credit Limit
                    </span>
                    <Icon
                      name="CreditCard"
                      size={16}
                      color="var(--color-muted-foreground)"
                    />
                  </div>
                  <p className="text-2xl font-semibold text-foreground data-text">
                    {formatCurrency(customer?.creditLimit)}
                  </p>
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                      <span>Utilization</span>
                      <span className="font-medium">
                        {getCreditUtilization()}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-smooth ${
                          getCreditUtilization() > 90
                            ? 'bg-error'
                            : getCreditUtilization() > 70
                            ? 'bg-warning'
                            : 'bg-success'
                        }`}
                        style={{
                          width: `${Math.min(getCreditUtilization(), 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">
                      Outstanding Amount
                    </span>
                    <Icon
                      name="AlertCircle"
                      size={16}
                      color="var(--color-muted-foreground)"
                    />
                  </div>
                  <p className="text-2xl font-semibold text-error data-text">
                    {formatCurrency(customer?.outstandingAmount)}
                  </p>
                  {customer?.overdueAmount > 0 && (
                    <p className="text-sm text-error mt-2">
                      ₹{customer?.overdueAmount?.toLocaleString('en-IN')}{' '}
                      overdue
                    </p>
                  )}
                </div>

                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">
                      Risk Assessment
                    </span>
                    <Icon
                      name="Shield"
                      size={16}
                      color="var(--color-muted-foreground)"
                    />
                  </div>
                  <RiskBadge level={customer?.riskLevel} />
                  <p className="text-xs text-muted-foreground mt-2">
                    Based on payment behavior and credit utilization
                  </p>
                </div>

                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">
                      Average Payment Delay
                    </span>
                    <Icon
                      name="Clock"
                      size={16}
                      color="var(--color-muted-foreground)"
                    />
                  </div>
                  <p className="text-2xl font-semibold text-foreground data-text">
                    34 days
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Last payment: {formatDate(customer?.lastPaymentDate)}
                  </p>
                </div>
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-foreground mb-3">
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center gap-3">
                    <Icon
                      name="User"
                      size={16}
                      color="var(--color-muted-foreground)"
                    />
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Contact Person
                      </p>
                      <p className="text-sm text-foreground">
                        {customer?.contactPerson}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Icon
                      name="Phone"
                      size={16}
                      color="var(--color-muted-foreground)"
                    />
                    <div>
                      <p className="text-xs text-muted-foreground">Phone</p>
                      <p className="text-sm text-foreground data-text">
                        +91 98765 43210
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Icon
                      name="Mail"
                      size={16}
                      color="var(--color-muted-foreground)"
                    />
                    <div>
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="text-sm text-foreground">
                        contact@
                        {customer?.companyName
                          ?.toLowerCase()
                          ?.replace(/\s+/g, '')}
                        .com
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Icon
                      name="FileText"
                      size={16}
                      color="var(--color-muted-foreground)"
                    />
                    <div>
                      <p className="text-xs text-muted-foreground">
                        GST Number
                      </p>
                      <p className="text-sm text-foreground data-text">
                        {customer?.gstNumber}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'payment-history' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-foreground">
                  Recent Payments
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Download"
                  iconPosition="left"
                >
                  Export
                </Button>
              </div>

              <div className="bg-muted/50 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted border-b border-border">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-foreground">
                          Invoice
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-foreground">
                          Amount
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-foreground">
                          Payment Date
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-foreground">
                          Days to Pay
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-foreground">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {paymentHistory?.map(payment => (
                        <tr
                          key={payment?.id}
                          className="border-b border-border"
                        >
                          <td className="px-4 py-3 text-sm text-foreground data-text">
                            {payment?.invoiceNumber}
                          </td>
                          <td className="px-4 py-3 text-sm font-medium text-foreground data-text">
                            {formatCurrency(payment?.amount)}
                          </td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">
                            {formatDate(payment?.date)}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`text-sm font-medium ${
                                payment?.daysToPayment > 35
                                  ? 'text-error'
                                  : payment?.daysToPayment > 25
                                  ? 'text-warning'
                                  : 'text-success'
                              }`}
                            >
                              {payment?.daysToPayment} days
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-success/10 text-success text-xs font-medium rounded-full">
                              <Icon
                                name="CheckCircle2"
                                size={12}
                                color="var(--color-success)"
                              />
                              {payment?.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="bg-muted/50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-foreground mb-4">
                  Payment Delay Trend
                </h3>
                <div
                  className="w-full h-64"
                  aria-label="Payment delay trend line chart"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={paymentTrendData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="var(--color-border)"
                      />
                      <XAxis
                        dataKey="month"
                        stroke="var(--color-muted-foreground)"
                        style={{ fontSize: '12px' }}
                      />
                      <YAxis
                        stroke="var(--color-muted-foreground)"
                        style={{ fontSize: '12px' }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'var(--color-popover)',
                          border: '1px solid var(--color-border)',
                          borderRadius: '8px',
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="avgDelay"
                        stroke="var(--color-primary)"
                        strokeWidth={2}
                        name="Avg Delay (days)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-foreground mb-4">
                  Credit Utilization Trend
                </h3>
                <div
                  className="w-full h-64"
                  aria-label="Credit utilization bar chart"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={creditUtilizationData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="var(--color-border)"
                      />
                      <XAxis
                        dataKey="month"
                        stroke="var(--color-muted-foreground)"
                        style={{ fontSize: '12px' }}
                      />
                      <YAxis
                        stroke="var(--color-muted-foreground)"
                        style={{ fontSize: '12px' }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'var(--color-popover)',
                          border: '1px solid var(--color-border)',
                          borderRadius: '8px',
                        }}
                      />
                      <Bar
                        dataKey="utilization"
                        fill="var(--color-secondary)"
                        name="Utilization %"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon
                      name="TrendingUp"
                      size={16}
                      color="var(--color-success)"
                    />
                    <span className="text-xs text-muted-foreground">
                      Payment Frequency
                    </span>
                  </div>
                  <p className="text-xl font-semibold text-foreground data-text">
                    5 payments
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Last 6 months
                  </p>
                </div>

                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon
                      name="DollarSign"
                      size={16}
                      color="var(--color-primary)"
                    />
                    <span className="text-xs text-muted-foreground">
                      Total Paid
                    </span>
                  </div>
                  <p className="text-xl font-semibold text-foreground data-text">
                    ₹6,00,500
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Last 6 months
                  </p>
                </div>

                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon
                      name="Percent"
                      size={16}
                      color="var(--color-warning)"
                    />
                    <span className="text-xs text-muted-foreground">
                      On-time Rate
                    </span>
                  </div>
                  <p className="text-xl font-semibold text-foreground data-text">
                    60%
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    3 of 5 on time
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 p-4 md:p-6 border-t border-border">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button variant="default" iconName="Edit" iconPosition="left">
            Edit Customer
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CustomerDetailModal
