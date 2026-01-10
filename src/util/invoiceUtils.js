/**
 * Calculate the actual status of an invoice based on dates and payments
 */
export function calculateInvoiceStatus(invoice, payments = []) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const dueDate = new Date(invoice.dueDate)
  dueDate.setHours(0, 0, 0, 0)

  // Calculate total paid from payments - ensure numbers
  const invoicePayments = payments.filter(p => p.invoiceId === invoice.id)
  const totalPaid = invoicePayments.reduce((sum, p) => {
    const amount = Number(p.amount) || 0
    return sum + amount
  }, 0)
  const invoiceAmount = Number(invoice.amount) || 0
  const outstanding = Math.max(0, invoiceAmount - totalPaid)

  // Determine status
  if (outstanding <= 0 || totalPaid >= invoiceAmount) {
    return {
      status: 'paid',
      outstanding: 0,
      isOverdue: false,
      daysOverdue: 0,
    }
  }

  if (totalPaid > 0 && outstanding > 0) {
    const isOverdue = dueDate < today
    return {
      status: isOverdue ? 'overdue' : 'partial',
      outstanding,
      isOverdue,
      daysOverdue: isOverdue ? Math.floor((today - dueDate) / (1000 * 60 * 60 * 24)) : 0,
    }
  }

  if (dueDate < today) {
    return {
      status: 'overdue',
      outstanding,
      isOverdue: true,
      daysOverdue: Math.floor((today - dueDate) / (1000 * 60 * 60 * 24)),
    }
  }

  return {
    status: 'pending',
    outstanding,
    isOverdue: false,
    daysOverdue: 0,
  }
}

/**
 * Enrich invoice with calculated fields
 */
export function enrichInvoice(invoice, payments = []) {
  const calculated = calculateInvoiceStatus(invoice, payments)

  return {
    ...invoice,
    status: calculated.status,
    outstanding: calculated.outstanding,
    isOverdue: calculated.isOverdue,
    daysOverdue: calculated.daysOverdue,
  }
}

/**
 * Get all overdue invoices
 */
export function getOverdueInvoices(invoices, payments = []) {
  return invoices
    .map(inv => enrichInvoice(inv, payments))
    .filter(inv => inv.status === 'overdue')
}

/**
 * Calculate days until due or days overdue
 */
export function getDaysUntilDue(dueDate) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const due = new Date(dueDate)
  due.setHours(0, 0, 0, 0)

  const diffTime = due - today
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  return diffDays
}

/**
 * Format overdue status text
 */
export function formatOverdueText(daysOverdue) {
  if (daysOverdue === 0) return 'Due today'
  if (daysOverdue === 1) return '1 day overdue'
  return `${daysOverdue} days overdue`
}
