import React, { useState, useEffect, useMemo } from 'react'
import Header from '../../components/navigation/Header'
import QuickActionToolbar from '../../components/navigation/QuickActionToolbar'
import MetricCard from './components/MetricCard'
import CashFlowChart from './components/CashFlowChart'
import RiskDistributionChart from './components/RiskDistributionChart'
import PaymentTrendChart from './components/PaymentTrendChart'
import RecentActivityFeed from './components/RecentActivityFeed'
import QuickActionCard from './components/QuickActionCard'
import UpcomingPayments from './components/UpcomingPayments'
import FilterControls from './components/FilterControls'
import { useData } from '../../context/DataContext'
import { enrichInvoice } from '../../util/invoiceUtils'
import { calculateRiskScore, getRiskLevel } from '../../util/openaiService'

const Dashboard = () => {
  const {
    invoices,
    customers,
    payments,
    getTotalOutstanding,
    getOverdueInvoices,
    getTotalPaid,
  } = useData()

  const [filters, setFilters] = useState({
    dateRange: '30days',
    customerSegment: 'all',
  })

  useEffect(() => {
    document.title = 'Dashboard - CreditFlow Pro'
  }, [])

  const handleFilterChange = newFilters => {
    setFilters(newFilters)
  }

  // Enrich invoices with proper status calculations
  const enrichedInvoices = useMemo(() => {
    return invoices.map(inv => enrichInvoice(inv, payments))
  }, [invoices, payments])

  // Calculate customer risk data
  const customersWithRisk = useMemo(() => {
    return customers.map(customer => {
      const riskScore = calculateRiskScore(customer, enrichedInvoices, payments)
      const riskLevel = getRiskLevel(riskScore)
      return { ...customer, riskScore, riskLevel }
    })
  }, [customers, enrichedInvoices, payments])

  // Calculate real metrics from data
  const totalOutstanding = getTotalOutstanding()
  const overdueInvoices = getOverdueInvoices()
  const totalPaid = getTotalPaid()

  // Calculate average payment delay from actual payments
  const avgPaymentDelay = useMemo(() => {
    const paidInvoices = enrichedInvoices.filter(inv => inv.status === 'paid')
    if (paidInvoices.length === 0) return 0

    let totalDelay = 0
    let countedInvoices = 0

    paidInvoices.forEach(invoice => {
      const invoicePayments = payments.filter(p => p.invoiceId === invoice.id)
      if (invoicePayments.length > 0) {
        const lastPayment = invoicePayments.sort(
          (a, b) => new Date(b.paymentDate || b.date) - new Date(a.paymentDate || a.date)
        )[0]

        const dueDate = new Date(invoice.dueDate)
        dueDate.setHours(0, 0, 0, 0)
        const paidDate = new Date(lastPayment.paymentDate || lastPayment.date)
        paidDate.setHours(0, 0, 0, 0)
        const daysDiff = Math.floor(
          (paidDate - dueDate) / (1000 * 60 * 60 * 24)
        )

        // Count both positive delays (late) and on-time (0) payments
        totalDelay += Math.max(0, daysDiff)
        countedInvoices++
      }
    })

    return countedInvoices > 0 ? Math.round(totalDelay / countedInvoices) : 0
  }, [enrichedInvoices, payments])

  const metricsData = [
    {
      title: 'Total Outstanding',
      value: `₹${(totalOutstanding / 100000).toFixed(2)}L`,
      subtitle: `Across ${
        enrichedInvoices.filter(i => i.status !== 'paid' && (Number(i.outstanding) || 0) > 0).length
      } invoices`,
      icon: 'Wallet',
      trend: totalOutstanding > 500000 ? 'up' : 'down',
      trendValue:
        totalOutstanding > 0
          ? `${(
              (overdueInvoices.reduce((sum, i) => sum + (Number(i.outstanding) || Number(i.amount) || 0), 0) /
                totalOutstanding) *
              100
            ).toFixed(1)}% overdue`
          : '0%',
      riskLevel:
        overdueInvoices.length > 5
          ? 'high'
          : overdueInvoices.length > 2
          ? 'medium'
          : 'low',
    },
    {
      title: 'Overdue Invoices',
      value: overdueInvoices.length.toString(),
      subtitle: `₹${(
        overdueInvoices.reduce((sum, i) => sum + (Number(i.outstanding) || Number(i.amount) || 0), 0) / 100000
      ).toFixed(2)}L pending`,
      icon: 'AlertCircle',
      trend: 'down',
      trendValue:
        overdueInvoices.length > 0
          ? `${
              Math.round(overdueInvoices.reduce(
                (sum, i) => sum + (Number(i.daysOverdue) || 0),
                0
              ) /
                overdueInvoices.length)
            } days avg`
          : 'None',
      riskLevel: 'high',
    },
    {
      title: 'Safe Cash Available',
      value: `₹${(
        (totalOutstanding -
          overdueInvoices.reduce((sum, i) => sum + (Number(i.outstanding) || Number(i.amount) || 0), 0)) /
        100000
      ).toFixed(2)}L`,
      subtitle: 'After risk adjustment',
      icon: 'Shield',
      trend: 'up',
      trendValue: `${(
        (1 -
          overdueInvoices.reduce((sum, i) => sum + (Number(i.outstanding) || Number(i.amount) || 0), 0) /
            totalOutstanding) *
          100 || 0
      ).toFixed(1)}% safe`,
      riskLevel: 'low',
    },
    {
      title: 'Avg Payment Delay',
      value: avgPaymentDelay > 0 ? `${avgPaymentDelay} Days` : 'On Time',
      subtitle: 'Industry avg: 18 days',
      icon: 'Clock',
      trend: avgPaymentDelay < 18 ? 'down' : 'up',
      trendValue:
        avgPaymentDelay < 18
          ? `${18 - avgPaymentDelay} days better`
          : `${avgPaymentDelay - 18} days worse`,
      riskLevel:
        avgPaymentDelay < 10 ? 'low' : avgPaymentDelay < 20 ? 'medium' : 'high',
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 md:pt-24 px-4 md:px-6 lg:px-8 pb-8 md:pb-12 max-w-[1440px] mx-auto">
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4 md:mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-2">
                Dashboard Overview
              </h1>
              <p className="text-sm md:text-base text-muted-foreground">
                Real-time credit risk management and cash flow insights
              </p>
            </div>
            <div className="hidden lg:block">
              <QuickActionToolbar />
            </div>
          </div>

          <div className="text-xs md:text-sm text-muted-foreground caption">
            Last updated:{' '}
            {new Date()?.toLocaleString('en-IN', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          {metricsData?.map((metric, index) => (
            <MetricCard key={index} {...metric} />
          ))}
        </div>

        <div className="mb-6 md:mb-8">
          <FilterControls onFilterChange={handleFilterChange} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
          <div className="lg:col-span-2">
            <CashFlowChart invoices={enrichedInvoices} payments={payments} />
          </div>
          <div>
            <RiskDistributionChart customers={customersWithRisk} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
          <PaymentTrendChart invoices={enrichedInvoices} payments={payments} />
          <UpcomingPayments invoices={enrichedInvoices} customers={customers} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          <div className="lg:col-span-2">
            <RecentActivityFeed />
          </div>
          <div>
            <QuickActionCard />
          </div>
        </div>
      </main>
      <div className="lg:hidden">
        <QuickActionToolbar />
      </div>
    </div>
  )
}

export default Dashboard
