import React from 'react'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts'

const RiskDistributionChart = ({ data }) => {
  const COLORS = {
    Low: '#059669',
    Medium: '#D97706',
    High: '#DC2626',
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-elevation-md">
          <p className="text-sm font-medium text-foreground">
            {payload?.[0]?.name}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {payload?.[0]?.value} customers ({payload?.[0]?.payload?.percentage}
            %)
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="bg-card rounded-lg p-4 md:p-6 shadow-elevation-sm border border-border">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        Risk Distribution
      </h3>
      <div
        className="w-full h-64 md:h-80"
        aria-label="Customer Risk Distribution Pie Chart"
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percentage }) => `${name}: ${percentage}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data?.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS?.[entry?.name]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={value => (
                <span className="text-sm text-foreground">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default RiskDistributionChart
