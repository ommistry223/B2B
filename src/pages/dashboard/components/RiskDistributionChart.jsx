import React, { useMemo } from 'react'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts'

const RiskDistributionChart = ({ customers = [] }) => {
  const data = useMemo(() => {
    // Handle both lowercase and capitalized risk levels
    const lowRisk = customers.filter(c => {
      const risk = (c.riskLevel || c.riskScore || 'low')
        .toString()
        .toLowerCase()
      return (
        risk === 'low' || (typeof c.riskScore === 'number' && c.riskScore < 40)
      )
    }).length

    const mediumRisk = customers.filter(c => {
      const risk = (c.riskLevel || c.riskScore || 'medium')
        .toString()
        .toLowerCase()
      return (
        risk === 'medium' ||
        (typeof c.riskScore === 'number' &&
          c.riskScore >= 40 &&
          c.riskScore < 60)
      )
    }).length

    const highRisk = customers.filter(c => {
      const risk = (c.riskLevel || c.riskScore || 'high')
        .toString()
        .toLowerCase()
      return (
        risk === 'high' ||
        (typeof c.riskScore === 'number' && c.riskScore >= 60)
      )
    }).length

    const total = customers.length || 1

    return [
      {
        name: 'Low Risk',
        value: Math.round((lowRisk / total) * 100),
        count: lowRisk,
        color: '#10b981', // green
      },
      {
        name: 'Medium Risk',
        value: Math.round((mediumRisk / total) * 100),
        count: mediumRisk,
        color: '#f59e0b', // orange
      },
      {
        name: 'High Risk',
        value: Math.round((highRisk / total) * 100),
        count: highRisk,
        color: '#ef4444', // red
      },
    ].filter(item => item.count > 0) // Only show categories with customers
  }, [customers])

  const COLORS = {
    'Low Risk': '#10b981',
    'Medium Risk': '#f59e0b',
    'High Risk': '#ef4444',
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-elevation-md">
          <p className="text-sm font-medium text-foreground mb-1">
            {payload?.[0]?.name}
          </p>
          <p className="text-xs text-muted-foreground">
            {payload?.[0]?.value}% ({payload?.[0]?.payload?.count} customers)
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
        className="text-xs md:text-sm font-semibold"
      >
        {`${(percent * 100)?.toFixed(0)}%`}
      </text>
    )
  }

  return (
    <div className="bg-card rounded-lg p-4 md:p-6 shadow-elevation-sm border border-border">
      <div className="mb-4 md:mb-6">
        <h3 className="text-base md:text-lg font-semibold text-foreground mb-1">
          Customer Risk Distribution
        </h3>
        <p className="text-xs md:text-sm text-muted-foreground">
          Current portfolio risk analysis
        </p>
      </div>
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
              wrapperStyle={{ fontSize: '12px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 md:mt-6 grid grid-cols-3 gap-2 md:gap-4">
        {data?.map((item, index) => (
          <div key={index} className="text-center">
            <div
              className="text-lg md:text-xl lg:text-2xl font-bold"
              style={{ color: COLORS?.[item?.name] }}
            >
              {item?.count}
            </div>
            <div className="text-xs md:text-sm text-muted-foreground mt-1">
              {item?.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RiskDistributionChart
