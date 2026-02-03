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

  const renderCustomLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos((-midAngle * Math.PI) / 180)
    const y = cy + radius * Math.sin((-midAngle * Math.PI) / 180)

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="text-xs md:text-sm font-bold"
      >
        {`${(percent * 100)?.toFixed(0)}%`}
      </text>
    )
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
              label={renderCustomLabel}
              outerRadius={90}
              innerRadius={0}
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
