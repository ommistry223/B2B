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
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear()
    const currentMonth = currentDate.getMonth()

    // Generate last 6 months
    const monthsData = []
    for (let i = 5; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12
      const year = currentMonth - i < 0 ? currentYear - 1 : currentYear
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

      const monthInvoices = invoices.filter(inv => {
        const dueDate = new Date(inv.dueDate)
        return (
          dueDate.getMonth() === monthIndex && dueDate.getFullYear() === year
        )
      })

      const total = monthInvoices.length || 1
      
      // Calculate payment status
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      let onTimeCount = 0
      let delayedCount = 0
      let overdueCount = 0
      
      monthInvoices.forEach(inv => {
        const dueDate = new Date(inv.dueDate)
        dueDate.setHours(0, 0, 0, 0)
        
        // Get payments for this invoice
        const invoicePayments = payments.filter(p => p.invoiceId === inv.id)
        const totalPaid = invoicePayments.reduce((sum, p) => sum + (p.amount || 0), 0)
        const outstanding = inv.amount - totalPaid
        
        if (outstanding <= 0) {
          // Paid - check if it was on time
          const latestPayment = invoicePayments.sort((a, b) => 
            new Date(b.paymentDate || b.date) - new Date(a.paymentDate || a.date)
          )[0]
          
          if (latestPayment) {
            const paymentDate = new Date(latestPayment.paymentDate || latestPayment.date)
            paymentDate.setHours(0, 0, 0, 0)
            
            if (paymentDate <= dueDate) {
              onTimeCount++
            } else {
              delayedCount++
            }
          } else {
            onTimeCount++ // Default to on-time if no payment date
          }
        } else if (dueDate < today) {
          // Overdue
          overdueCount++
        } else {
          // Pending (not yet due) - count as on-time for now
          onTimeCount++
        }
      })

      monthsData.push({
        month: monthNames[monthIndex],
        onTime: Math.round((onTimeCount / total) * 100),
        delayed: Math.round((delayedCount / total) * 100),
        overdue: Math.round((overdueCount / total) * 100),
      })
    }

    return monthsData
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
