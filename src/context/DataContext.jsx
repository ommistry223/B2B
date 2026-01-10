import React, { createContext, useContext, useState, useEffect } from 'react'
import { customerAPI, invoiceAPI, paymentAPI } from '../services/api'
import { useUser } from './UserContext'

const DataContext = createContext()

export const useData = () => {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}

// Initial mock data
const initialCustomers = [
  {
    id: 1,
    name: 'Acme Corporation Ltd',
    gst: '27AABCU9603R1ZX',
    creditLimit: 500000,
    outstanding: 125000,
    paymentTerms: 30,
    riskScore: 'Low',
    email: 'contact@acmecorp.com',
    phone: '+91 98765 43210',
    address: '123 Business Park, Mumbai',
  },
  {
    id: 2,
    name: 'TechStart Industries',
    gst: '29AADCT1234F1Z5',
    creditLimit: 300000,
    outstanding: 245000,
    paymentTerms: 45,
    riskScore: 'High',
    email: 'info@techstart.com',
    phone: '+91 98765 43211',
    address: '456 Tech Hub, Bangalore',
  },
  {
    id: 3,
    name: 'Global Traders Pvt Ltd',
    gst: '24AABCG5678M1ZP',
    creditLimit: 750000,
    outstanding: 320000,
    paymentTerms: 60,
    riskScore: 'Medium',
    email: 'sales@globaltraders.com',
    phone: '+91 98765 43212',
    address: '789 Trade Center, Delhi',
  },
]

const initialInvoices = [
  {
    id: 1,
    invoiceNumber: 'INV-2026-001',
    customerId: 1,
    customerName: 'Acme Corporation Ltd',
    amount: 125000,
    dueDate: '2026-02-15',
    status: 'pending',
    createdAt: '2026-01-01',
    items: [{ description: 'Product A', quantity: 10, rate: 12500 }],
  },
  {
    id: 2,
    invoiceNumber: 'INV-2026-002',
    customerId: 2,
    customerName: 'TechStart Industries',
    amount: 245000,
    dueDate: '2026-01-20',
    status: 'pending',
    createdAt: '2025-12-15',
    items: [{ description: 'Service B', quantity: 5, rate: 49000 }],
  },
]

const initialPayments = [
  {
    id: 1,
    invoiceId: 1,
    invoiceNumber: 'INV-2026-001',
    customerId: 1,
    customerName: 'Acme Corporation Ltd',
    amount: 50000,
    paymentDate: '2026-01-05',
    paymentMode: 'bank_transfer',
    transactionId: 'TXN123456',
  },
]

export const DataProvider = ({ children }) => {
  const { isAuthenticated, isLoading: userLoading } = useUser()
  const [customers, setCustomers] = useState([])
  const [invoices, setInvoices] = useState([])
  const [payments, setPayments] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Load data from backend when user is authenticated
  useEffect(() => {
    if (userLoading) return

    if (isAuthenticated) {
      loadAllData()
    } else {
      // Clear data when not authenticated
      setCustomers([])
      setInvoices([])
      setPayments([])
      setIsLoading(false)
    }
  }, [isAuthenticated, userLoading])

  const loadAllData = async () => {
    setIsLoading(true)
    try {
      const [customersData, invoicesData, paymentsData] = await Promise.all([
        customerAPI.getAll(),
        invoiceAPI.getAll(),
        paymentAPI.getAll(),
      ])

      setCustomers(customersData.customers || [])
      setInvoices(invoicesData.invoices || [])
      setPayments(paymentsData.payments || [])
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Customer operations
  const addCustomer = async customerData => {
    try {
      const data = await customerAPI.create(customerData)
      setCustomers([...customers, data.customer])
      return { success: true, customer: data.customer }
    } catch (error) {
      console.error('Error adding customer:', error)
      return { success: false, error: error.message }
    }
  }

  const updateCustomer = async (customerId, customerData) => {
    try {
      const data = await customerAPI.update(customerId, customerData)
      setCustomers(
        customers.map(c => (c.id === customerId ? data.customer : c))
      )
      return { success: true, customer: data.customer }
    } catch (error) {
      console.error('Error updating customer:', error)
      return { success: false, error: error.message }
    }
  }

  const deleteCustomer = async customerId => {
    try {
      await customerAPI.delete(customerId)
      setCustomers(customers.filter(c => c.id !== customerId))
      return { success: true }
    } catch (error) {
      console.error('Error deleting customer:', error)
      return { success: false, error: error.message }
    }
  }

  const getCustomerById = customerId => {
    return customers.find(c => c.id === customerId)
  }

  // Invoice operations
  const addInvoice = async invoiceData => {
    try {
      const data = await invoiceAPI.create(invoiceData)
      setInvoices([...invoices, data.invoice])
      // Refresh customers to get updated outstanding
      await loadAllData()
      return { success: true, invoice: data.invoice }
    } catch (error) {
      console.error('Error adding invoice:', error)
      return { success: false, error: error.message }
    }
  }

  const updateInvoice = async (invoiceId, invoiceData) => {
    try {
      const data = await invoiceAPI.update(invoiceId, invoiceData)
      setInvoices(invoices.map(i => (i.id === invoiceId ? data.invoice : i)))
      return { success: true, invoice: data.invoice }
    } catch (error) {
      console.error('Error updating invoice:', error)
      return { success: false, error: error.message }
    }
  }

  const deleteInvoice = async invoiceId => {
    try {
      await invoiceAPI.delete(invoiceId)
      setInvoices(invoices.filter(i => i.id !== invoiceId))
      // Refresh customers to get updated outstanding
      await loadAllData()
      return { success: true }
    } catch (error) {
      console.error('Error deleting invoice:', error)
      return { success: false, error: error.message }
    }
  }

  const getInvoiceById = invoiceId => {
    return invoices.find(i => i.id === invoiceId)
  }

  const getInvoicesByCustomer = customerId => {
    return invoices.filter(i => i.customerId === customerId)
  }

  // Payment operations
  const addPayment = async paymentData => {
    try {
      const data = await paymentAPI.create(paymentData)
      setPayments([...payments, data.payment])
      // Refresh all data to get updated invoice status and customer outstanding
      await loadAllData()
      return { success: true, payment: data.payment }
    } catch (error) {
      console.error('Error adding payment:', error)
      return { success: false, error: error.message }
    }
  }

  const getPaymentsByInvoice = invoiceId => {
    return payments.filter(p => p.invoiceId === invoiceId)
  }

  const getPaymentsByCustomer = customerId => {
    return payments.filter(p => p.customerId === customerId)
  }

  // Analytics calculations
  const getTotalOutstanding = () => {
    return invoices
      .filter(i => i.status !== 'paid')
      .reduce((sum, i) => sum + (Number(i.amount) || 0), 0)
  }

  const getOverdueInvoices = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    return invoices
      .filter(invoice => {
        const dueDate = new Date(invoice.dueDate)
        dueDate.setHours(0, 0, 0, 0)

        // Calculate actual outstanding
        const invoicePayments = payments.filter(p => p.invoiceId === invoice.id)
        const totalPaid = invoicePayments.reduce(
          (sum, p) => sum + (Number(p.amount) || 0),
          0
        )
        const outstanding = Number(invoice.amount) - totalPaid

        // Overdue if: has outstanding amount AND due date is in the past
        return outstanding > 0 && dueDate < today
      })
      .map(invoice => {
        const invoicePayments = payments.filter(p => p.invoiceId === invoice.id)
        const totalPaid = invoicePayments.reduce(
          (sum, p) => sum + (Number(p.amount) || 0),
          0
        )
        const outstanding = Number(invoice.amount) - totalPaid
        const dueDate = new Date(invoice.dueDate)
        dueDate.setHours(0, 0, 0, 0)
        const daysOverdue = Math.floor(
          (today - dueDate) / (1000 * 60 * 60 * 24)
        )

        return {
          ...invoice,
          outstanding,
          daysOverdue,
          status: 'overdue',
        }
      })
  }

  const getTotalPaid = () => {
    return payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0)
  }

  const getRecentActivity = (limit = 10) => {
    const activities = []

    // Add recent invoices
    invoices
      .slice(-5)
      .reverse()
      .forEach(inv => {
        activities.push({
          type: 'invoice',
          action: `Created invoice ${inv.invoiceNumber}`,
          time: inv.createdAt,
          icon: 'FileText',
        })
      })

    // Add recent payments
    payments
      .slice(-5)
      .reverse()
      .forEach(pay => {
        activities.push({
          type: 'payment',
          action: `Recorded payment from ${pay.customerName}`,
          time: pay.createdAt,
          icon: 'CheckCircle2',
        })
      })

    // Sort by time and limit
    return activities
      .sort((a, b) => new Date(b.time) - new Date(a.time))
      .slice(0, limit)
  }

  const value = {
    // Data
    customers,
    invoices,
    payments,
    isLoading,

    // Customer operations
    addCustomer,
    updateCustomer,
    deleteCustomer,
    getCustomerById,

    // Invoice operations
    addInvoice,
    updateInvoice,
    deleteInvoice,
    getInvoiceById,
    getInvoicesByCustomer,

    // Payment operations
    addPayment,
    getPaymentsByInvoice,
    getPaymentsByCustomer,

    // Analytics
    getTotalOutstanding,
    getOverdueInvoices,
    getTotalPaid,
    getRecentActivity,
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}
