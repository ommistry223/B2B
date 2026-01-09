// OpenAI Service for AI-powered insights and analysis

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions'

/**
 * Call OpenAI API with retry logic
 */
async function callOpenAI(messages, options = {}) {
  const {
    model = 'gpt-3.5-turbo',
    temperature = 0.7,
    max_tokens = 1000,
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
      const error = await response.json()
      throw new Error(error.error?.message || 'OpenAI API request failed')
    }

    const data = await response.json()
    return data.choices[0].message.content
  } catch (error) {
    console.error('OpenAI API Error:', error)
    throw error
  }
}

/**
 * Analyze customer payment behavior and predict risk
 */
export async function analyzeCustomerRisk(customer, invoices, payments) {
  const customerInvoices = invoices.filter(inv => inv.customerId === customer.id)
  const customerPayments = payments.filter(pay => pay.customerId === customer.id)

  const prompt = `Analyze this customer's payment behavior and provide a risk assessment:

Customer: ${customer.name}
Company: ${customer.company || 'N/A'}
Total Invoices: ${customerInvoices.length}
Outstanding Amount: ₹${customer.creditLimit || 0}

Invoice Summary:
- Paid: ${customerInvoices.filter(i => i.status === 'paid').length}
- Pending: ${customerInvoices.filter(i => i.status === 'pending').length}
- Overdue: ${customerInvoices.filter(i => i.status === 'overdue').length}

Recent Payment History:
${customerPayments.slice(-5).map(p => `- ₹${p.amount} on ${p.date}`).join('\n')}

Please provide:
1. Risk Score (0-100, higher = more risk)
2. Risk Level (Low/Medium/High)
3. Expected Payment Delay (in days)
4. Payment Behavior Analysis (2-3 sentences)
5. 3 Specific Recommendations

Return as JSON: {
  "riskScore": number,
  "riskLevel": "Low|Medium|High",
  "expectedDelay": number,
  "paymentBehavior": "string",
  "confidence": number,
  "recommendations": ["string", "string", "string"]
}`

  try {
    const response = await callOpenAI([
      {
        role: 'system',
        content:
          'You are a financial risk analyst specializing in B2B credit management. Provide accurate, actionable insights based on payment data.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ])

    // Parse JSON response
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }

    throw new Error('Invalid response format from OpenAI')
  } catch (error) {
    console.error('Error analyzing customer risk:', error)
    // Return fallback analysis
    return {
      riskScore: 50,
      riskLevel: 'Medium',
      expectedDelay: 10,
      paymentBehavior: 'Unable to analyze at this time. Please try again.',
      confidence: 50,
      recommendations: [
        'Monitor payment patterns closely',
        'Review credit terms regularly',
        'Maintain regular communication',
      ],
    }
  }
}

/**
 * Generate AI insights for risk analytics dashboard
 */
export async function generateRiskInsights(customers, invoices, payments) {
  const highRiskCount = customers.filter(c => (c.riskScore || 50) > 60).length
  const totalOutstanding = invoices
    .filter(i => i.status !== 'paid')
    .reduce((sum, i) => sum + (i.amount || 0), 0)
  const overdueCount = invoices.filter(i => i.status === 'overdue').length

  const prompt = `Analyze this B2B accounts receivable data and provide AI insights:

Total Customers: ${customers.length}
High Risk Customers: ${highRiskCount}
Total Outstanding: ₹${totalOutstanding}
Overdue Invoices: ${overdueCount}
Collection Rate: ${((payments.length / invoices.length) * 100).toFixed(1)}%

Provide 4-5 AI insights as JSON array with this structure:
[{
  "id": "unique_id",
  "type": "prediction|recommendation|warning|success",
  "title": "Brief title",
  "description": "Detailed insight (2-3 sentences)",
  "confidence": number (0-100),
  "action": "Recommended action"
}]

Focus on:
- Payment delay forecasts
- Collection efficiency improvements
- Credit exposure alerts
- Risk mitigation strategies`

  try {
    const response = await callOpenAI([
      {
        role: 'system',
        content:
          'You are a financial AI assistant providing actionable insights for credit management.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ])

    const jsonMatch = response.match(/\[[\s\S]*\]/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }

    throw new Error('Invalid response format')
  } catch (error) {
    console.error('Error generating insights:', error)
    return [
      {
        id: 'default-1',
        type: 'prediction',
        title: 'Payment Delay Forecast',
        description:
          'AI analysis is temporarily unavailable. Please check your API connection.',
        confidence: 50,
        action: 'Review system settings',
      },
    ]
  }
}

/**
 * Calculate risk score based on payment history
 */
export function calculateRiskScore(customer, invoices, payments) {
  const customerInvoices = invoices.filter(inv => inv.customerId === customer.id)

  if (customerInvoices.length === 0) return 50 // Neutral for new customers

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Calculate actual overdue and paid invoices based on dates
  let overdueCount = 0
  let paidCount = 0
  let totalOutstanding = 0

  customerInvoices.forEach(inv => {
    const dueDate = new Date(inv.dueDate)
    dueDate.setHours(0, 0, 0, 0)

    // Get payments for this invoice
    const invoicePayments = payments.filter(p => p.invoiceId === inv.id)
    const totalPaid = invoicePayments.reduce((sum, p) => sum + (p.amount || 0), 0)
    const outstanding = inv.amount - totalPaid

    if (outstanding <= 0) {
      paidCount++
    } else {
      totalOutstanding += outstanding
      // Only count as overdue if due date is in the past
      if (dueDate < today) {
        overdueCount++
      }
    }
  })

  const totalCount = customerInvoices.length

  // Calculate on-time payment rate
  const onTimeRate = paidCount / totalCount

  // Calculate overdue ratio
  const overdueRatio = overdueCount / totalCount

  // Risk score formula (0-100, higher = more risk)
  let riskScore = 50 // Start neutral
  riskScore += overdueRatio * 50 // Up to +50 for overdue invoices
  riskScore -= onTimeRate * 30 // Up to -30 for on-time payments

  // Outstanding amount factor
  if (totalOutstanding > 500000) riskScore += 10
  else if (totalOutstanding > 300000) riskScore += 5

  // Clamp between 0-100
  return Math.max(0, Math.min(100, Math.round(riskScore)))
}

/**
 * Determine risk level from score
 */
export function getRiskLevel(score) {
  if (score >= 60) return 'High'
  if (score >= 40) return 'Medium'
  return 'Low'
}

/**
 * Calculate expected delay based on payment history
 */
export function calculateExpectedDelay(customer, invoices, payments) {
  const customerInvoices = invoices.filter(inv => inv.customerId === customer.id)

  if (customerInvoices.length === 0) return 7 // Default 7 days for new customers

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  let overdueCount = 0
  let totalDelayDays = 0

  customerInvoices.forEach(inv => {
    const dueDate = new Date(inv.dueDate)
    dueDate.setHours(0, 0, 0, 0)

    // Get payments for this invoice
    const invoicePayments = payments.filter(p => p.invoiceId === inv.id)
    const totalPaid = invoicePayments.reduce((sum, p) => sum + (p.amount || 0), 0)
    const outstanding = inv.amount - totalPaid

    // Only count as overdue if due date is in the past and not fully paid
    if (outstanding > 0 && dueDate < today) {
      overdueCount++
      const daysOverdue = Math.floor((today - dueDate) / (1000 * 60 * 60 * 24))
      totalDelayDays += daysOverdue
    }
  })

  if (overdueCount === 0) return 0 // No delays

  // Return average delay
  return Math.round(totalDelayDays / overdueCount)
}
