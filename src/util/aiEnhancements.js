// AI-Powered Enhancements for CreditFlow Pro
import { callOpenAI } from './openaiService'

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions'

/**
 * Call OpenAI API
 */
async function callOpenAI(messages, options = {}) {
  const {
    model = 'gpt-3.5-turbo',
    temperature = 0.7,
    max_tokens = 500,
  } = options

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens,
      }),
    })

    if (!response.ok) {
      throw new Error('OpenAI API request failed')
    }

    const data = await response.json()
    return data.choices[0].message.content
  } catch (error) {
    console.error('OpenAI API Error:', error)
    return null
  }
}

/**
 * Generate AI-powered payment reminder message
 */
export async function generatePaymentReminder(invoice, customer) {
  const daysOverdue = invoice.daysOverdue || 0
  const dueDate = new Date(invoice.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

  const prompt = `Generate a professional but friendly payment reminder message for:

Customer: ${customer.name}
Invoice: ${invoice.invoiceNumber}
Amount Due: ₹${invoice.outstanding.toLocaleString('en-IN')}
Due Date: ${dueDate}
${daysOverdue > 0 ? `Days Overdue: ${daysOverdue}` : 'Due Soon'}

The message should be:
- Professional yet warm
- Brief (2-3 sentences)
- Include a clear call to action
- Maintain good customer relations

Return only the message text, no extra formatting.`

  try {
    const message = await callOpenAI([
      {
        role: 'system',
        content: 'You are a professional accounts receivable specialist who writes polite, effective payment reminders.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ])

    return message || `Dear ${customer.name}, this is a friendly reminder that invoice ${invoice.invoiceNumber} for ₹${invoice.outstanding.toLocaleString('en-IN')} ${daysOverdue > 0 ? `is ${daysOverdue} days overdue` : `is due on ${dueDate}`}. Please process the payment at your earliest convenience.`
  } catch (error) {
    return `Dear ${customer.name}, this is a friendly reminder that invoice ${invoice.invoiceNumber} for ₹${invoice.outstanding.toLocaleString('en-IN')} ${daysOverdue > 0 ? `is ${daysOverdue} days overdue` : `is due on ${dueDate}`}. Please process the payment at your earliest convenience.`
  }
}

/**
 * Generate AI insights for customer payment behavior
 */
export async function generateCustomerInsights(customer, invoices, payments) {
  const customerInvoices = invoices.filter(inv => inv.customerId === customer.id)
  const paidCount = customerInvoices.filter(i => i.status === 'paid').length
  const overdueCount = customerInvoices.filter(i => i.status === 'overdue').length
  const totalOutstanding = customerInvoices
    .filter(i => i.status !== 'paid')
    .reduce((sum, i) => sum + (i.outstanding || 0), 0)

  const prompt = `Analyze this customer's payment behavior and provide actionable insights:

Customer: ${customer.name}
Total Invoices: ${customerInvoices.length}
Paid Invoices: ${paidCount}
Overdue Invoices: ${overdueCount}
Total Outstanding: ₹${totalOutstanding.toLocaleString('en-IN')}
Credit Limit: ₹${(customer.creditLimit || 0).toLocaleString('en-IN')}

Provide:
1. One brief payment behavior summary (1 sentence)
2. Risk assessment (Low/Medium/High) with reason
3. One specific action recommendation

Format as JSON: {
  "behavior": "string",
  "risk": "Low|Medium|High",
  "reason": "string",
  "action": "string"
}`

  try {
    const response = await callOpenAI([
      {
        role: 'system',
        content: 'You are a financial analyst providing concise customer payment insights.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ])

    const jsonMatch = response?.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }

    return null
  } catch (error) {
    return null
  }
}

/**
 * Predict next payment date using AI
 */
export async function predictPaymentDate(invoice, customer, paymentHistory) {
  const avgPaymentDelay = paymentHistory.length > 0
    ? paymentHistory.reduce((sum, p) => sum + (p.daysLate || 0), 0) / paymentHistory.length
    : 0

  const prompt = `Based on payment history, predict when this invoice will likely be paid:

Customer: ${customer.name}
Invoice Due Date: ${invoice.dueDate}
Average Payment Delay: ${Math.round(avgPaymentDelay)} days
Recent Payment Pattern: ${paymentHistory.length > 0 ? 'Has payment history' : 'New customer'}
Risk Score: ${customer.riskScore || 'Medium'}

Provide a realistic prediction with:
1. Expected payment date
2. Confidence level (0-100%)
3. Brief reason

Format as JSON: {
  "predictedDate": "YYYY-MM-DD",
  "confidence": number,
  "reason": "string"
}`

  try {
    const response = await callOpenAI([
      {
        role: 'system',
        content: 'You are a payment forecasting AI analyzing payment patterns.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ])

    const jsonMatch = response?.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }

    return null
  } catch (error) {
    return null
  }
}

/**
 * Generate smart collection strategy
 */
export async function generateCollectionStrategy(overdueInvoices, customer) {
  const totalOverdue = overdueInvoices.reduce((sum, inv) => sum + inv.outstanding, 0)
  const maxDaysOverdue = Math.max(...overdueInvoices.map(inv => inv.daysOverdue || 0))

  const prompt = `Generate a collection strategy for:

Customer: ${customer.name}
Number of Overdue Invoices: ${overdueInvoices.length}
Total Overdue Amount: ₹${totalOverdue.toLocaleString('en-IN')}
Maximum Days Overdue: ${maxDaysOverdue}
Customer Risk: ${customer.riskScore || 'Medium'}

Provide a prioritized action plan with 3-4 specific steps.
Keep each step brief and actionable.

Return as JSON array: [
  {"step": 1, "action": "string", "priority": "High|Medium|Low"},
  ...
]`

  try {
    const response = await callOpenAI([
      {
        role: 'system',
        content: 'You are a collections specialist providing strategic action plans.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ])

    const jsonMatch = response?.match(/\[[\s\S]*\]/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }

    return [
      { step: 1, action: 'Send immediate payment reminder via email', priority: 'High' },
      { step: 2, action: 'Follow up with phone call within 24 hours', priority: 'High' },
      { step: 3, action: 'Offer payment plan if needed', priority: 'Medium' },
      { step: 4, action: 'Consider credit limit reduction', priority: 'Medium' },
    ]
  } catch (error) {
    return [
      { step: 1, action: 'Send immediate payment reminder via email', priority: 'High' },
      { step: 2, action: 'Follow up with phone call within 24 hours', priority: 'High' },
      { step: 3, action: 'Offer payment plan if needed', priority: 'Medium' },
    ]
  }
}

/**
 * Generate invoice description using AI
 */
export async function generateInvoiceDescription(items, customerName) {
  const itemsList = items.map(item => `${item.quantity}x ${item.description} @ ₹${item.rate}`).join(', ')

  const prompt = `Generate a professional invoice description for:
Customer: ${customerName}
Items: ${itemsList}

Create a brief, professional description (1-2 sentences) suitable for an invoice.`

  try {
    const description = await callOpenAI([
      {
        role: 'system',
        content: 'You are writing professional invoice descriptions.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ])

    return description || `Invoice for services/products provided to ${customerName}`
  } catch (error) {
    return `Invoice for services/products provided to ${customerName}`
  }
}

/**
 * Suggest optimal credit limit using AI
 */
export async function suggestCreditLimit(customer, paymentHistory, currentOutstanding) {
  const prompt = `Suggest an optimal credit limit for this customer:

Customer: ${customer.name}
Current Credit Limit: ₹${(customer.creditLimit || 0).toLocaleString('en-IN')}
Current Outstanding: ₹${currentOutstanding.toLocaleString('en-IN')}
Payment History: ${paymentHistory.length} transactions
Risk Score: ${customer.riskScore || 'Medium'}
Industry: ${customer.industry || 'General'}

Provide:
1. Suggested credit limit
2. Brief justification
3. Risk mitigation notes

Format as JSON: {
  "suggestedLimit": number,
  "justification": "string",
  "riskNotes": "string"
}`

  try {
    const response = await callOpenAI([
      {
        role: 'system',
        content: 'You are a credit risk analyst suggesting appropriate credit limits.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ])

    const jsonMatch = response?.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }

    return null
  } catch (error) {
    return null
  }
}
