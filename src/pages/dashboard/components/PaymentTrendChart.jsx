import React, { useMemo } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

const PaymentTrendChart = ({ invoices = [], payments = [] }) => {
  const data = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear()
    const currentMonth = currentDate.getMonth()

    return months.map((month, index) => {
      const monthIndex = (currentMonth + index - 5 + 12) % 12
      const year = monthIndex > currentMonth ? currentYear - 1 : currentYear

      const monthInvoices = invoices.filter(inv => {
        const dueDate = new Date(inv.dueDate)
        return (
          dueDate.getMonth() === monthIndex && dueDate.getFullYear() === year
        )
      })

      const total = monthInvoices.length || 1
      const onTime = monthInvoices.filter(
        inv => inv.status === 'paid' && inv.daysOverdue === 0
      ).length
      const delayed = monthInvoices.filter(
        inv =>
          (inv.status === 'paid' && inv.daysOverdue > 0) ||
          inv.status === 'partial'
      ).length
      const overdue = monthInvoices.filter(
        inv => inv.status === 'overdue'
      ).length

      return {
        month,
        onTime: Math.round((onTime / total) * 100),
        delayed: Math.round((delayed / total) * 100),
        overdue: Math.round((overdue / total) * 100),
      }
    })
  }, [invoices, payments])

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-elevation-md">
          <p className="text-sm font-medium text-foreground mb-2">{label}</p>
          {payload?.map((entry, index) => (
            <p key={index} className="text-xs text-muted-foreground">
              <span style={{ color: entry?.color }}>{entry?.name}:</span>{' '}
              {entry?.value}%
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="bg-card rounded-lg p-4 md:p-6 shadow-elevation-sm border border-border">
      <div className="mb-4 md:mb-6">
        <h3 className="text-base md:text-lg font-semibold text-foreground mb-1">
          Payment Trend Analysis
        </h3>
        <p className="text-xs md:text-sm text-muted-foreground">
          6-month payment behavior patterns
        </p>
      </div>
      <div
        className="w-full h-64 md:h-80 lg:h-96"
        aria-label="Payment Trend Analysis Bar Chart"
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis
              dataKey="month"
              stroke="var(--color-muted-foreground)"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke="var(--color-muted-foreground)"
              style={{ fontSize: '12px' }}
              tickFormatter={value => `${value}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Bar
              dataKey="onTime"
              fill="var(--color-success)"
              name="On Time"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="delayed"
              fill="var(--color-warning)"
              name="Delayed"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="overdue"
              fill="var(--color-error)"
              name="Overdue"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default PaymentTrendChart
