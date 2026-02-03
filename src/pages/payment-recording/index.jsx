import React, { useState, useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Header from '../../components/navigation/Header'
import QuickActionToolbar from '../../components/navigation/QuickActionToolbar'
import InvoiceSelector from './components/InvoiceSelector'
import PaymentForm from './components/PaymentForm'
import PaymentHistory from './components/PaymentHistory'
import PaymentSuccessModal from './components/PaymentSuccessModal'
import MultiInvoiceAllocation from './components/MultiInvoiceAllocation'
import Icon from '../../components/AppIcon'
import { useData } from '../../context/DataContext'

const PaymentRecording = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { invoices, payments, getPaymentsByInvoice } = useData()
  const [selectedInvoice, setSelectedInvoice] = useState(null)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [paymentData, setPaymentData] = useState(null)
  const [showMultiAllocation, setShowMultiAllocation] = useState(false)

  const customerFilter = location.state?.customerName

  // Convert invoices to match expected format
  const mockInvoices = invoices.map(inv => {
    // Calculate actual paid amount from payment history
    const invoicePayments = getPaymentsByInvoice(inv.id)
    const totalPaid = invoicePayments.reduce(
      (sum, p) => sum + (p.amount || 0),
      0
    )
    const outstanding = inv.amount - totalPaid

    return {
      ...inv,
      totalAmount: inv.amount,
      paidAmount: totalPaid,
      outstandingAmount: outstanding > 0 ? outstanding : 0,
      dueDate: new Date(inv.dueDate).toLocaleDateString('en-GB'),
      invoiceDate: new Date(
        inv.invoiceDate || inv.createdAt
      ).toLocaleDateString('en-GB'),
      status:
        outstanding <= 0
          ? 'Paid'
          : totalPaid > 0
          ? 'Partially Paid'
          : new Date(inv.dueDate) < new Date()
          ? 'Overdue'
          : 'Unpaid',
      paymentHistory: invoicePayments.map(p => ({
        id: p.id,
        amount: p.amount,
        date: new Date(p.paymentDate).toLocaleDateString('en-GB'),
        method: p.paymentMode,
        referenceNumber: p.transactionId,
        notes: p.notes || '',
      })),
    }
  })

  const filteredInvoices = useMemo(() => {
    if (!customerFilter) return mockInvoices
    const lower = customerFilter.toLowerCase()
    return mockInvoices.filter(inv =>
      inv?.customerName?.toLowerCase()?.includes(lower)
    )
  }, [mockInvoices, customerFilter])

  const displayInvoices = customerFilter ? filteredInvoices : mockInvoices

  const handleInvoiceSelect = invoice => {
    setSelectedInvoice(invoice)
  }

  const handlePaymentSubmit = data => {
    const paymentMethodLabels = {
      bank_transfer: 'Bank Transfer',
      upi: 'UPI',
      cash: 'Cash',
      cheque: 'Cheque',
      card: 'Card Payment',
      neft: 'NEFT',
      rtgs: 'RTGS',
      imps: 'IMPS',
    }

    setPaymentData({
      ...data,
      paymentMethod:
        paymentMethodLabels?.[data?.paymentMethod] || data?.paymentMethod,
    })
    setShowSuccessModal(true)
  }

  const handleSendNotification = channels => {
    console.log('Sending notifications via:', channels)
    setTimeout(() => {
      setShowSuccessModal(false)
      setSelectedInvoice(null)
      navigate('/invoice-management')
    }, 1000)
  }

  const handleCloseSuccess = () => {
    setShowSuccessModal(false)
    setSelectedInvoice(null)
    navigate('/invoice-management')
  }

  return (
    <div className="page-shell">
      <Header />
      <main className="page-content pt-20 pb-8 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 md:mb-8">
            <div className="flex items-center gap-3 mb-4">
              <button
                onClick={() => navigate('/invoice-management')}
                className="w-10 h-10 rounded-lg border border-border hover:bg-muted transition-smooth flex items-center justify-center"
              >
                <Icon
                  name="ArrowLeft"
                  size={20}
                  color="var(--color-foreground)"
                />
              </button>
              <div>
                <h1 className="page-title">
                  Record Payment
                </h1>
                <p className="page-subtitle mt-1">
                  Record customer payments and update invoice status
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mt-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-lg border border-border">
                <Icon name="FileText" size={18} color="var(--color-primary)" />
                <span className="text-sm font-medium text-foreground">
                  {displayInvoices?.length} Outstanding Invoices
                </span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-lg border border-border">
                <Icon name="DollarSign" size={18} color="var(--color-error)" />
                <span className="text-sm font-medium text-foreground data-text">
                  ₹
                  {displayInvoices
                    ?.reduce((sum, inv) => sum + inv?.outstandingAmount, 0)
                    ?.toLocaleString('en-IN')}{' '}
                  Total Outstanding
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="lg:col-span-2 space-y-6">
              {!selectedInvoice ? (
                <InvoiceSelector
                  invoices={displayInvoices}
                  selectedInvoice={selectedInvoice}
                  onSelect={handleInvoiceSelect}
                />
              ) : showMultiAllocation ? (
                <MultiInvoiceAllocation
                  customerInvoices={displayInvoices?.filter(
                    inv => inv?.customerName === selectedInvoice?.customerName
                  )}
                  totalPayment={50000}
                  onAllocate={allocations => {
                    console.log('Allocations:', allocations)
                    setShowMultiAllocation(false)
                  }}
                  onCancel={() => setShowMultiAllocation(false)}
                />
              ) : (
                <PaymentForm
                  invoice={selectedInvoice}
                  onSubmit={handlePaymentSubmit}
                  onCancel={() => setSelectedInvoice(null)}
                />
              )}
            </div>

            <div className="space-y-6">
              {selectedInvoice && (
                <>
                  <div className="bg-card rounded-lg border border-border p-4 md:p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                        <Icon
                          name="Info"
                          size={20}
                          color="var(--color-accent)"
                        />
                      </div>
                      <div>
                        <h3 className="text-base md:text-lg font-semibold text-foreground">
                          Quick Tips
                        </h3>
                      </div>
                    </div>
                    <ul className="space-y-3 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <Icon
                          name="CheckCircle2"
                          size={16}
                          color="var(--color-success)"
                          className="flex-shrink-0 mt-0.5"
                        />
                        <span>
                          Partial payments are automatically calculated
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Icon
                          name="CheckCircle2"
                          size={16}
                          color="var(--color-success)"
                          className="flex-shrink-0 mt-0.5"
                        />
                        <span>Reference numbers help with reconciliation</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Icon
                          name="CheckCircle2"
                          size={16}
                          color="var(--color-success)"
                          className="flex-shrink-0 mt-0.5"
                        />
                        <span>Payment date cannot be in the future</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Icon
                          name="CheckCircle2"
                          size={16}
                          color="var(--color-success)"
                          className="flex-shrink-0 mt-0.5"
                        />
                        <span>
                          Notifications sent automatically after recording
                        </span>
                      </li>
                    </ul>
                  </div>

                  <PaymentHistory payments={selectedInvoice?.paymentHistory} />
                </>
              )}

              {!selectedInvoice && (
                <div className="bg-card rounded-lg border border-border p-4 md:p-6">
                  <div className="text-center py-8">
                    <Icon
                      name="MousePointerClick"
                      size={48}
                      color="var(--color-muted-foreground)"
                    />
                    <p className="mt-4 text-sm text-muted-foreground">
                      Select an invoice to record payment
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <QuickActionToolbar />
      {showSuccessModal && paymentData && (
        <PaymentSuccessModal
          paymentData={paymentData}
          onClose={handleCloseSuccess}
          onSendNotification={handleSendNotification}
        />
      )}
    </div>
  )
}

export default PaymentRecording
