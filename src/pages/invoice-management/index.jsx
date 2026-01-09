import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import Header from '../../components/navigation/Header'
import QuickActionToolbar from '../../components/navigation/QuickActionToolbar'
import Icon from '../../components/AppIcon'
import Button from '../../components/ui/Button'
import InvoiceStats from './components/InvoiceStats'
import InvoiceFilters from './components/InvoiceFilters'
import InvoiceTable from './components/InvoiceTable'
import InvoiceMobileCard from './components/InvoiceMobileCard'
import PaymentRecordModal from './components/PaymentRecordModal'
import { useData } from '../../context/DataContext'

const InvoiceManagement = () => {
  const navigate = useNavigate()
  const {
    invoices: allInvoices,
    payments,
    getOverdueInvoices,
    getPaymentsByInvoice,
    addPayment,
  } = useData()
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 1024)
  const [selectedInvoice, setSelectedInvoice] = useState(null)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [showSuccessToast, setShowSuccessToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  // Map invoices to include calculated fields
  const invoices = allInvoices.map(inv => {
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Reset time for accurate date comparison
    const dueDate = new Date(inv.dueDate)
    dueDate.setHours(0, 0, 0, 0)

    // Calculate actual paid amount from payment history
    const invoicePayments = getPaymentsByInvoice(inv.id)
    const totalPaid = invoicePayments.reduce(
      (sum, p) => sum + (p.amount || 0),
      0
    )
    const outstanding = inv.amount - totalPaid

    // Calculate if overdue based on actual dates and payment status
    const isOverdue = outstanding > 0 && dueDate < today
    const daysOverdue = isOverdue
      ? Math.floor((today - dueDate) / (1000 * 60 * 60 * 24))
      : 0

    // Determine status based on payments and dates
    let status = inv.status
    if (outstanding <= 0) {
      status = 'paid'
    } else if (totalPaid > 0 && outstanding > 0) {
      status = 'partial'
    } else if (isOverdue) {
      status = 'overdue'
    } else if (outstanding > 0 && !isOverdue) {
      status = 'pending'
    }

    return {
      ...inv,
      outstanding: outstanding > 0 ? outstanding : 0,
      daysOverdue,
      status,
      createdDate: inv.createdAt?.split('T')[0] || inv.invoiceDate,
      gstNumber: '', // You can store this with customer data if needed
    }
  })

  const [filteredInvoices, setFilteredInvoices] = useState(invoices)

  useEffect(() => {
    setFilteredInvoices(invoices)
  }, [allInvoices])

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 1024)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const stats = {
    totalInvoices: invoices?.length || 0,
    totalOutstanding: invoices?.reduce(
      (sum, inv) => sum + (inv?.outstanding || 0),
      0
    ),
    overdueCount:
      invoices?.filter(inv => inv?.status === 'overdue')?.length || 0,
    paidThisMonth: (() => {
      const currentMonth = new Date().getMonth()
      const currentYear = new Date().getFullYear()

      // Calculate total payments made this month
      const paymentsThisMonth = payments?.filter(payment => {
        const paymentDate = new Date(payment.paymentDate)
        return (
          paymentDate.getMonth() === currentMonth &&
          paymentDate.getFullYear() === currentYear
        )
      })

      return (
        paymentsThisMonth?.reduce(
          (sum, payment) => sum + (payment.amount || 0),
          0
        ) || 0
      )
    })(),
  }

  const handleFilterChange = filters => {
    let filtered = [...invoices]

    if (filters?.search) {
      const searchLower = filters?.search?.toLowerCase()
      filtered = filtered?.filter(
        inv =>
          inv?.invoiceNumber?.toLowerCase()?.includes(searchLower) ||
          inv?.customerName?.toLowerCase()?.includes(searchLower)
      )
    }

    if (filters?.status) {
      filtered = filtered?.filter(inv => inv?.status === filters?.status)
    }

    if (filters?.customer) {
      filtered = filtered?.filter(
        inv =>
          inv?.customerName?.toLowerCase()?.replace(/\s+/g, '_') ===
          filters?.customer
      )
    }

    if (filters?.dateFrom) {
      filtered = filtered?.filter(
        inv => new Date(inv.dueDate) >= new Date(filters.dateFrom)
      )
    }

    if (filters?.dateTo) {
      filtered = filtered?.filter(
        inv => new Date(inv.dueDate) <= new Date(filters.dateTo)
      )
    }

    if (filters?.amountMin) {
      filtered = filtered?.filter(
        inv => inv?.amount >= parseFloat(filters?.amountMin)
      )
    }

    if (filters?.amountMax) {
      filtered = filtered?.filter(
        inv => inv?.amount <= parseFloat(filters?.amountMax)
      )
    }

    setFilteredInvoices(filtered)
  }

  const handleResetFilters = () => {
    setFilteredInvoices(invoices)
  }

  const handleRecordPayment = invoice => {
    setSelectedInvoice(invoice)
    setIsPaymentModalOpen(true)
  }

  const handlePaymentSubmit = paymentData => {
    // Save payment to DataContext
    const payment = {
      invoiceId: paymentData.invoiceId,
      amount: paymentData.paymentAmount,
      paymentDate: paymentData.paymentDate,
      paymentMode: paymentData.paymentMethod,
      transactionId: paymentData.transactionId || '',
      notes: paymentData.notes || '',
    }

    addPayment(payment)

    setIsPaymentModalOpen(false)
    setSelectedInvoice(null)

    setToastMessage(
      `Payment of ₹${paymentData?.paymentAmount?.toLocaleString(
        'en-IN'
      )} recorded successfully`
    )
    setShowSuccessToast(true)
    setTimeout(() => setShowSuccessToast(false), 3000)
  }

  const handleSendReminder = invoice => {
    setToastMessage(
      `Reminder sent to ${invoice?.customerName} for ${invoice?.invoiceNumber}`
    )
    setShowSuccessToast(true)
    setTimeout(() => setShowSuccessToast(false), 3000)
  }

  const handleEdit = invoice => {
    navigate('/create-invoice', { state: { editInvoice: invoice } })
  }

  const handleExport = () => {
    const exportData = filteredInvoices.map(inv => ({
      'Invoice Number': inv.invoiceNumber,
      Customer: inv.customerName,
      Amount: inv.amount,
      Outstanding: inv.outstanding,
      'Due Date': inv.dueDate,
      Status: inv.status,
      'Days Overdue': inv.daysOverdue,
      'Created Date': inv.createdDate,
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
    ].join('\\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `invoices-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    setToastMessage('Invoice data exported successfully')
    setShowSuccessToast(true)
    setTimeout(() => setShowSuccessToast(false), 3000)
  }

  return (
    <>
      <Helmet>
        <title>Invoice Management - CreditFlow Pro</title>
        <meta
          name="description"
          content="Manage and track all your business invoices with comprehensive status monitoring and payment recording"
        />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />

        <main className="pt-20 pb-24 lg:pb-8">
          <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6 md:mb-8">
              <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">
                  Invoice Management
                </h1>
                <p className="text-sm md:text-base text-muted-foreground mt-2">
                  Track and manage all your business invoices in one place
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  iconName="Download"
                  iconPosition="left"
                  iconSize={18}
                  onClick={handleExport}
                  className="hidden lg:flex"
                >
                  Export Data
                </Button>
                <Button
                  variant="default"
                  iconName="Plus"
                  iconPosition="left"
                  iconSize={18}
                  onClick={() => navigate('/create-invoice')}
                  className="hidden lg:flex"
                >
                  Create Invoice
                </Button>
              </div>
            </div>

            <div className="space-y-6 md:space-y-8">
              <InvoiceStats stats={stats} />

              <InvoiceFilters
                onFilterChange={handleFilterChange}
                onReset={handleResetFilters}
              />

              {isMobileView ? (
                <div className="space-y-4">
                  {filteredInvoices?.map(invoice => (
                    <InvoiceMobileCard
                      key={invoice?.id}
                      invoice={invoice}
                      onRecordPayment={handleRecordPayment}
                      onSendReminder={handleSendReminder}
                      onEdit={handleEdit}
                    />
                  ))}
                  {filteredInvoices?.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 px-4 bg-card rounded-lg border border-border">
                      <Icon
                        name="FileText"
                        size={48}
                        color="var(--color-muted-foreground)"
                      />
                      <p className="mt-4 text-base font-medium text-foreground">
                        No invoices found
                      </p>
                      <p className="mt-2 text-sm text-muted-foreground text-center">
                        Try adjusting your filters or create a new invoice
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <InvoiceTable
                  invoices={filteredInvoices}
                  onRecordPayment={handleRecordPayment}
                  onSendReminder={handleSendReminder}
                  onEdit={handleEdit}
                />
              )}
            </div>
          </div>
        </main>

        <QuickActionToolbar />

        <PaymentRecordModal
          invoice={selectedInvoice}
          isOpen={isPaymentModalOpen}
          onClose={() => {
            setIsPaymentModalOpen(false)
            setSelectedInvoice(null)
          }}
          onSubmit={handlePaymentSubmit}
        />

        {showSuccessToast && (
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-[1300] animate-in fade-in slide-in-from-bottom-4">
            <div className="bg-success text-success-foreground px-6 py-3 rounded-lg shadow-elevation-xl flex items-center gap-3">
              <Icon name="CheckCircle2" size={20} color="#FFFFFF" />
              <span className="text-sm font-medium">{toastMessage}</span>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default InvoiceManagement
