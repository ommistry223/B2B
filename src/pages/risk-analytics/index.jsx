import React, { useState, useEffect, useMemo } from 'react'
import { Helmet } from 'react-helmet'
import Header from '../../components/navigation/Header'
import QuickActionToolbar from '../../components/navigation/QuickActionToolbar'
import RiskMetricsCard from './components/RiskMetricsCard'
import RiskDistributionChart from './components/RiskDistributionChart'
import PaymentDelayTrendChart from './components/PaymentDelayTrendChart'
import CustomerRiskTable from './components/CustomerRiskTable'
import AIInsightsPanel from './components/AIInsightsPanel'
import FilterPanel from './components/FilterPanel'
import CustomerDetailModal from './components/CustomerDetailModal'
import { useData } from '../../context/DataContext'
import { enrichInvoice } from '../../util/invoiceUtils'
import {
  generateRiskInsights,
  calculateRiskScore,
  getRiskLevel,
  calculateExpectedDelay,
} from '../../util/openaiService'

const RiskAnalytics = () => {
  const { customers, invoices, payments } = useData()
  const [filters, setFilters] = useState({
    riskLevel: 'all',
    industry: 'all',
    timePeriod: '90',
  })

  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [aiInsights, setAiInsights] = useState([])
  const [isLoadingInsights, setIsLoadingInsights] = useState(true)

  // Enrich invoices with proper status calculations
  const enrichedInvoices = useMemo(() => {
    return invoices.map(inv => enrichInvoice(inv, payments))
  }, [invoices, payments])

  // Calculate dynamic risk data for customers
  const customersData = useMemo(() => {
    return customers.map(customer => {
      const riskScore = calculateRiskScore(customer, enrichedInvoices, payments)
      const riskLevel = getRiskLevel(riskScore)
      const expectedDelay = calculateExpectedDelay(
        customer,
        enrichedInvoices,
        payments
      )

      const customerInvoices = enrichedInvoices.filter(
        inv => inv.customerId === customer.id
      )
      const overdueInvoices = customerInvoices.filter(
        i => i.status === 'overdue'
      )
      const paidInvoices = customerInvoices.filter(i => i.status === 'paid')

      const outstanding = customerInvoices
        .filter(i => i.status !== 'paid')
        .reduce((sum, i) => sum + (i.outstanding || 0), 0)

      const onTimeRate =
        customerInvoices.length > 0
          ? Math.round((paidInvoices.length / customerInvoices.length) * 100)
          : 100

      const avgDelay =
        overdueInvoices.length > 0
          ? Math.round(
              overdueInvoices.reduce((sum, i) => sum + i.daysOverdue, 0) /
                overdueInvoices.length
            )
          : 0

      return {
        id: customer.id,
        name: customer.name,
        company: customer.company || customer.name,
        riskScore,
        riskLevel,
        expectedDelay,
        outstanding,
        paymentBehavior:
          overdueInvoices.length > 0
            ? `Currently has ${overdueInvoices.length} overdue invoice(s). Average delay of ${avgDelay} days.`
            : paidInvoices.length > 0
            ? 'Good payment history. Consistently pays on time.'
            : 'New customer with limited payment history.',
        predictionConfidence: Math.min(95, 60 + customerInvoices.length * 2),
        avgDelay,
        onTimeRate,
        totalInvoices: customerInvoices.length,
        creditLimit: customer.creditLimit || 500000,
        recommendations: [
          riskLevel === 'High'
            ? 'Reduce credit limit and require advance payments'
            : 'Maintain current credit terms',
          overdueInvoices.length > 0
            ? `Follow up on ${overdueInvoices.length} overdue invoice(s)`
            : 'Send payment reminders before due date',
          riskLevel === 'Low'
            ? 'Consider increasing credit limit'
            : 'Monitor payment patterns closely',
        ],
      }
    })
  }, [customers, enrichedInvoices, payments])

  // Calculate metrics data dynamically
  const metricsData = useMemo(() => {
    const highRiskCustomers = customersData.filter(c => c.riskLevel === 'High')
    const totalOutstanding = customersData.reduce(
      (sum, c) => sum + c.outstanding,
      0
    )

    const paidInvoices = enrichedInvoices.filter(i => i.status === 'paid')
    const totalInvoices = enrichedInvoices.length
    const collectionEfficiency =
      totalInvoices > 0
        ? ((paidInvoices.length / totalInvoices) * 100).toFixed(1)
        : 0

    const badDebtPrediction =
      highRiskCustomers.reduce((sum, c) => sum + c.outstanding, 0) * 0.3

    return [
      {
        title: 'Bad Debt Prediction',
        value: `₹${(badDebtPrediction / 100000).toFixed(2)}L`,
        subtitle: 'Next 90 days forecast',
        trend: 'down',
        trendValue: '12%',
        icon: 'TrendingDown',
        iconColor: '#FFFFFF',
        bgColor: 'bg-error',
      },
      {
        title: 'Collection Efficiency',
        value: `${collectionEfficiency}%`,
        subtitle: 'Current quarter performance',
        trend: 'up',
        trendValue: '5%',
        icon: 'Target',
        iconColor: '#FFFFFF',
        bgColor: 'bg-success',
      },
      {
        title: 'Credit Exposure',
        value: `₹${(totalOutstanding / 100000).toFixed(2)}L`,
        subtitle: 'Total outstanding amount',
        trend: 'up',
        trendValue: '8%',
        icon: 'DollarSign',
        iconColor: '#FFFFFF',
        bgColor: 'bg-warning',
      },
      {
        title: 'High Risk Customers',
        value: highRiskCustomers.length.toString(),
        subtitle: 'Requiring immediate attention',
        trend: 'down',
        trendValue: '3',
        icon: 'AlertTriangle',
        iconColor: '#FFFFFF',
        bgColor: 'bg-primary',
      },
    ]
  }, [customersData, enrichedInvoices])

  // Calculate risk distribution
  const riskDistributionData = useMemo(() => {
    const lowCount = customersData.filter(c => c.riskLevel === 'Low').length
    const mediumCount = customersData.filter(
      c => c.riskLevel === 'Medium'
    ).length
    const highCount = customersData.filter(c => c.riskLevel === 'High').length
    const total = customersData.length || 1

    return [
      {
        name: 'Low',
        value: lowCount,
        percentage: Math.round((lowCount / total) * 100),
      },
      {
        name: 'Medium',
        value: mediumCount,
        percentage: Math.round((mediumCount / total) * 100),
      },
      {
        name: 'High',
        value: highCount,
        percentage: Math.round((highCount / total) * 100),
      },
    ]
  }, [customersData])

  // Calculate payment delay trends from actual data
  const paymentDelayTrendData = useMemo(() => {
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear()
    const currentMonth = currentDate.getMonth()
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    // Generate last 7 months of data
    const monthsData = []
    for (let i = 6; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12
      const year = currentMonth - i < 0 ? currentYear - 1 : currentYear
      
      // Get invoices for this month
      const monthInvoices = enrichedInvoices.filter(inv => {
        const dueDate = new Date(inv.dueDate)
        return dueDate.getMonth() === monthIndex && dueDate.getFullYear() === year
      })

      // Calculate average delay
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      let delaySum = 0
      let delayCount = 0

      monthInvoices.forEach(inv => {
        const dueDate = new Date(inv.dueDate)
        dueDate.setHours(0, 0, 0, 0)

        // Get payments for this invoice
        const invoicePayments = payments.filter(p => p.invoiceId === inv.id)
        const totalPaid = invoicePayments.reduce((sum, p) => sum + (p.amount || 0), 0)
        const outstanding = inv.amount - totalPaid

        if (outstanding <= 0 && invoicePayments.length > 0) {
          // Paid - calculate delay
          const latestPayment = invoicePayments.sort((a, b) => 
            new Date(b.paymentDate || b.date) - new Date(a.paymentDate || a.date)
          )[0]
          const paymentDate = new Date(latestPayment.paymentDate || latestPayment.date)
          paymentDate.setHours(0, 0, 0, 0)

          const delay = Math.max(0, Math.floor((paymentDate - dueDate) / (1000 * 60 * 60 * 24)))
          delaySum += delay
          delayCount++
        } else if (outstanding > 0 && dueDate < today) {
          // Overdue
          const delay = Math.floor((today - dueDate) / (1000 * 60 * 60 * 24))
          delaySum += delay
          delayCount++
        }
      })

      const avgDelay = delayCount > 0 ? Math.round(delaySum / delayCount) : 0
      
      // Simple prediction: trend analysis
      const recentAvg = monthsData.slice(-2).reduce((sum, m) => sum + m.avgDelay, 0) / Math.max(1, monthsData.length)
      const predicted = Math.round(avgDelay > 0 ? avgDelay * 1.05 : recentAvg * 1.1)

      monthsData.push({
        month: `${monthNames[monthIndex]} ${year}`,
        avgDelay,
        predicted,
      })
    }

    return monthsData
  }, [enrichedInvoices, payments])

  // Generate AI insights on mount
  useEffect(() => {
    const loadAIInsights = async () => {
      setIsLoadingInsights(true)
      try {
        const insights = await generateRiskInsights(
          customers,
          enrichedInvoices,
          payments
        )
        setAiInsights(insights)
      } catch (error) {
        console.error('Failed to load AI insights:', error)
        setAiInsights([
          {
            id: 'fallback-1',
            type: 'warning',
            title: 'AI Analysis Unavailable',
            description:
              'Unable to generate AI insights at this time. Using calculated risk metrics based on invoice and payment data.',
            confidence: 0,
            action: 'Verify API settings',
          },
        ])
      } finally {
        setIsLoadingInsights(false)
      }
    }

    if (customers.length > 0) {
      loadAIInsights()
    } else {
      setIsLoadingInsights(false)
    }
  }, [customers, enrichedInvoices, payments])

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleResetFilters = () => {
    setFilters({
      riskLevel: 'all',
      industry: 'all',
      timePeriod: '90',
    })
  }

  const handleExport = () => {
    const exportData = customersData.map(c => ({
      'Customer Name': c.name,
      Company: c.company,
      'Risk Score': c.riskScore,
      'Risk Level': c.riskLevel,
      'Expected Delay (Days)': c.expectedDelay,
      'Outstanding Amount': c.outstanding,
      'Avg Delay': c.avgDelay,
      'On Time Rate': `${c.onTimeRate}%`,
      'Total Invoices': c.totalInvoices,
      'Credit Limit': c.creditLimit,
      'Prediction Confidence': `${c.predictionConfidence}%`,
    }))

    // Convert to CSV
    const headers = Object.keys(exportData[0] || {})
    const csv = [
      headers.join(','),
      ...exportData.map(row =>
        headers
          .map(header => {
            const value = row[header]
            return typeof value === 'string' && value.includes(',')
              ? `"${value}"`
              : value
          })
          .join(',')
      ),
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `risk-analytics-${
      new Date().toISOString().split('T')[0]
    }.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleViewDetails = customer => {
    setSelectedCustomer(customer)
  }

  const handleCloseModal = () => {
    setSelectedCustomer(null)
  }

  return (
    <>
      <Helmet>
        <title>Risk Analytics - CreditFlow Pro</title>
        <meta
          name="description"
          content="Comprehensive credit risk assessment with AI-powered payment delay predictions and customer risk profiling for B2B businesses"
        />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />

        <main className="pt-20 pb-8 px-4 md:px-6 lg:px-8">
          <div className="max-w-[1440px] mx-auto">
            <div className="mb-6 md:mb-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-2">
                    Risk Analytics
                  </h1>
                  <p className="text-sm md:text-base text-muted-foreground">
                    AI-powered credit risk assessment and payment delay
                    predictions
                  </p>
                </div>
                <QuickActionToolbar />
              </div>

              <FilterPanel
                filters={filters}
                onFilterChange={handleFilterChange}
                onReset={handleResetFilters}
                onExport={handleExport}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
              {metricsData?.map((metric, index) => (
                <RiskMetricsCard key={index} {...metric} />
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
              <div className="lg:col-span-2">
                <PaymentDelayTrendChart data={paymentDelayTrendData} />
              </div>
              <div>
                <RiskDistributionChart data={riskDistributionData} />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
              <div className="lg:col-span-2">
                <CustomerRiskTable
                  customers={customersData}
                  onViewDetails={handleViewDetails}
                />
              </div>
              <div>
                <AIInsightsPanel insights={aiInsights} />
              </div>
            </div>
          </div>
        </main>

        {selectedCustomer && (
          <CustomerDetailModal
            customer={selectedCustomer}
            onClose={handleCloseModal}
          />
        )}
      </div>
    </>
  )
}

export default RiskAnalytics
