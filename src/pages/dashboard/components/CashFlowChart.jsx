import React, { useMemo } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

const CashFlowChart = ({ invoices = [], payments = [] }) => {
  const data = useMemo(() => {
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear()
    const currentMonth = currentDate.getMonth()

    // Generate last 6 months
    const monthsData = []
    for (let i = 5; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12
      const year = currentMonth - i < 0 ? currentYear - 1 : currentYear
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

      // Calculate actual inflow (payments received)
      const inflow = payments
        .filter(p => {
          const paymentDate = new Date(p.paymentDate || p.date)
          return (
            paymentDate.getMonth() === monthIndex &&
            paymentDate.getFullYear() === year
          )
        })
        .reduce((sum, p) => sum + (p.amount || 0), 0)

      // Calculate outflow (invoices due - represents expected cash out)
      const outflow = invoices
        .filter(inv => {
          const dueDate = new Date(inv.dueDate)
          return (
            dueDate.getMonth() === monthIndex &&
            dueDate.getFullYear() === year
          )
        })
        .reduce((sum, inv) => sum + (inv.amount || 0), 0) * 0.4 // 40% estimated cost

      // AI Forecast - simple trend-based projection
      const recentInflow = monthsData.slice(-3).reduce((sum, m) => sum + (m.inflow || 0), 0) / 3
      const forecast = recentInflow > 0 ? recentInflow * 1.1 : (inflow || outflow * 1.2)

      monthsData.push({
        month: monthNames[monthIndex],
        inflow: Math.round(inflow),
        outflow: Math.round(outflow),
        forecast: Math.round(forecast),
      })
    }

    return monthsData
  }, [invoices, payments])

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-elevation-md">
          <p className="text-sm font-medium text-foreground mb-2">
            {payload?.[0]?.payload?.month}
          </p>
          {payload?.map((entry, index) => (
            <p key={index} className="text-xs text-muted-foreground">
              <span style={{ color: entry?.color }}>{entry?.name}:</span> ₹
              {(entry?.value / 1000)?.toFixed(0)}K
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
          Cash Flow Forecast
        </h3>
        <p className="text-xs md:text-sm text-muted-foreground">
          6-month projection with AI predictions
        </p>
      </div>
      <div
        className="w-full h-64 md:h-80 lg:h-96"
        aria-label="Cash Flow Forecast Line Chart"
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
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
              tickFormatter={value => `₹${(value / 1000)?.toFixed(0)}K`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '12px' }} iconType="line" />
            <Line
              type="monotone"
              dataKey="inflow"
              stroke="var(--color-success)"
              strokeWidth={2}
              name="Cash Inflow"
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="outflow"
              stroke="var(--color-error)"
              strokeWidth={2}
              name="Cash Outflow"
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="forecast"
              stroke="var(--color-primary)"
              strokeWidth={2}
              strokeDasharray="5 5"
              name="AI Forecast"
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default CashFlowChart
