/**
 * Advanced AI Credit Scoring Engine
 * Machine Learning-powered credit risk assessment system
 */

// Weight factors for different scoring components
const SCORING_WEIGHTS = {
  paymentHistory: 0.35,
  financialStability: 0.25,
  behavioralPatterns: 0.20,
  marketConditions: 0.15,
  relationshipDepth: 0.05
};

// Risk factor thresholds
const RISK_THRESHOLDS = {
  excellent: { min: 800, max: 1000, label: 'Excellent', color: '#10B981' },
  good: { min: 700, max: 799, label: 'Good', color: '#3B82F6' },
  fair: { min: 600, max: 699, label: 'Fair', color: '#F59E0B' },
  poor: { min: 500, max: 599, label: 'Poor', color: '#EF4444' },
  critical: { min: 0, max: 499, label: 'Critical', color: '#7F1D1D' }
};

/**
 * Advanced Payment History Analysis
 * Analyzes payment patterns, trends, and consistency
 */
export const analyzePaymentHistory = (customer, invoices, payments) => {
  const customerInvoices = invoices.filter(inv => inv.customerId === customer.id);
  const customerPayments = payments.filter(p => 
    customerInvoices.some(inv => inv.id === p.invoiceId)
  );

  // Payment timeliness metrics
  const paidInvoices = customerInvoices.filter(inv => inv.status === 'paid');
  const overdueInvoices = customerInvoices.filter(inv => inv.status === 'overdue');
  
  let onTimeScore = 100;
  let consistencyScore = 100;
  let trendScore = 100;

  // Calculate on-time payment percentage
  if (paidInvoices.length > 0) {
    const onTimeCount = paidInvoices.filter(inv => {
      const invPayments = customerPayments.filter(p => p.invoiceId === inv.id);
      if (invPayments.length === 0) return false;
      
      const lastPayment = invPayments.reduce((latest, p) => 
        new Date(p.paymentDate || p.date) > new Date(latest.paymentDate || latest.date) ? p : latest
      );
      
      const dueDate = new Date(inv.dueDate);
      const paidDate = new Date(lastPayment.paymentDate || lastPayment.date);
      return paidDate <= dueDate;
    }).length;

    onTimeScore = (onTimeCount / paidInvoices.length) * 100;
  }

  // Payment consistency analysis
  if (customerPayments.length > 1) {
    const paymentAmounts = customerPayments.map(p => parseFloat(p.amount));
    const avgAmount = paymentAmounts.reduce((sum, amt) => sum + amt, 0) / paymentAmounts.length;
    const variance = paymentAmounts.reduce((sum, amt) => sum + Math.pow(amt - avgAmount, 2), 0) / paymentAmounts.length;
    const cv = Math.sqrt(variance) / avgAmount; // Coefficient of variation
    
    consistencyScore = Math.max(0, 100 - (cv * 50)); // Lower variance = higher score
  }

  // Payment trend analysis (improving/worsening)
  if (customerPayments.length > 3) {
    const sortedPayments = [...customerPayments].sort((a, b) => 
      new Date(a.paymentDate || a.date) - new Date(b.paymentDate || b.date)
    );
    
    const chunks = [];
    const chunkSize = Math.ceil(sortedPayments.length / 3);
    
    for (let i = 0; i < sortedPayments.length; i += chunkSize) {
      chunks.push(sortedPayments.slice(i, i + chunkSize));
    }
    
    if (chunks.length >= 2) {
      const avgFirstChunk = chunks[0].reduce((sum, p) => sum + parseFloat(p.amount), 0) / chunks[0].length;
      const avgLastChunk = chunks[chunks.length - 1].reduce((sum, p) => sum + parseFloat(p.amount), 0) / chunks[chunks.length - 1].length;
      
      const trend = ((avgLastChunk - avgFirstChunk) / avgFirstChunk) * 100;
      trendScore = trend >= 0 ? Math.min(100, 50 + (trend * 2)) : Math.max(0, 50 + (trend * 2));
    }
  }

  return {
    onTimePercentage: onTimeScore,
    paymentConsistency: consistencyScore,
    paymentTrend: trendScore,
    totalPayments: customerPayments.length,
    overdueCount: overdueInvoices.length,
    weightedScore: (onTimeScore * 0.5) + (consistencyScore * 0.3) + (trendScore * 0.2)
  };
};

/**
 * Financial Stability Assessment
 * Evaluates customer's financial health indicators
 */
export const assessFinancialStability = (customer, invoices) => {
  const customerInvoices = invoices.filter(inv => inv.customerId === customer.id);
  
  // Revenue metrics
  const totalRevenue = customerInvoices.reduce((sum, inv) => sum + parseFloat(inv.amount || 0), 0);
  const avgInvoiceValue = customerInvoices.length > 0 ? totalRevenue / customerInvoices.length : 0;
  
  // Volume metrics
  const monthlyInvoiceCount = customerInvoices.length > 0 ? 
    customerInvoices.length / 12 : 0; // Assuming 1 year of data
  
  // Outstanding balance analysis
  const outstandingInvoices = customerInvoices.filter(inv => inv.status !== 'paid');
  const totalOutstanding = outstandingInvoices.reduce((sum, inv) => sum + parseFloat(inv.amount || 0), 0);
  const outstandingRatio = totalRevenue > 0 ? (totalOutstanding / totalRevenue) * 100 : 0;
  
  // Business age factor (if available)
  const businessAgeYears = customer.businessStartDate ? 
    (new Date().getFullYear() - new Date(customer.businessStartDate).getFullYear()) : 2;
  
  // Calculate financial stability score
  let revenueScore = Math.min(100, (totalRevenue / 1000000) * 20); // Normalize to 1M
  let volumeScore = Math.min(100, monthlyInvoiceCount * 5); // Normalize
  let liquidityScore = Math.max(0, 100 - outstandingRatio); // Lower outstanding = better
  let maturityScore = Math.min(100, businessAgeYears * 10); // Older businesses = more stable
  
  return {
    totalRevenue,
    avgInvoiceValue,
    monthlyVolume: monthlyInvoiceCount,
    outstandingRatio,
    businessAge: businessAgeYears,
    revenueScore,
    volumeScore,
    liquidityScore,
    maturityScore,
    weightedScore: (revenueScore * 0.3) + (volumeScore * 0.2) + (liquidityScore * 0.3) + (maturityScore * 0.2)
  };
};

/**
 * Behavioral Pattern Analysis
 * Identifies customer behavior patterns and anomalies
 */
export const analyzeBehavioralPatterns = (customer, invoices, payments) => {
  const customerInvoices = invoices.filter(inv => inv.customerId === customer.id);
  const customerPayments = payments.filter(p => 
    customerInvoices.some(inv => inv.id === p.invoiceId)
  );
  
  // Payment timing patterns
  const paymentDays = customerPayments.map(p => {
    const invoice = customerInvoices.find(inv => inv.id === p.invoiceId);
    if (!invoice) return 0;
    
    const dueDate = new Date(invoice.dueDate);
    const paidDate = new Date(p.paymentDate || p.date);
    return Math.ceil((paidDate - dueDate) / (1000 * 60 * 60 * 24));
  });
  
  // Preferred payment methods
  const paymentMethods = {};
  customerPayments.forEach(p => {
    const method = p.paymentMethod || 'unknown';
    paymentMethods[method] = (paymentMethods[method] || 0) + 1;
  });
  
  // Seasonal patterns
  const monthlyPayments = Array(12).fill(0);
  customerPayments.forEach(p => {
    const month = new Date(p.paymentDate || p.date).getMonth();
    monthlyPayments[month] += parseFloat(p.amount);
  });
  
  // Calculate behavioral scores
  const avgPaymentDelay = paymentDays.length > 0 ? 
    paymentDays.reduce((sum, days) => sum + Math.max(0, days), 0) / paymentDays.length : 0;
  
  const consistencyScore = paymentDays.length > 1 ? 
    100 - (Math.abs(avgPaymentDelay) / 30 * 100) : 80; // Normalize to 30-day period
  
  const methodDiversity = Object.keys(paymentMethods).length;
  const diversityScore = Math.min(100, methodDiversity * 25); // Max 4 methods = 100
  
  const seasonalVariation = monthlyPayments.reduce((variance, amount, i, arr) => {
    const avg = arr.reduce((sum, val) => sum + val, 0) / arr.length;
    return variance + Math.pow(amount - avg, 2);
  }, 0) / monthlyPayments.length;
  
  const seasonalityScore = Math.max(0, 100 - (seasonalVariation / 100000)); // Normalize
  
  return {
    avgPaymentDelay,
    preferredMethods: Object.entries(paymentMethods)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 2)
      .map(([method]) => method),
    seasonalPattern: monthlyPayments,
    consistencyScore,
    diversityScore,
    seasonalityScore,
    weightedScore: (consistencyScore * 0.4) + (diversityScore * 0.3) + (seasonalityScore * 0.3)
  };
};

/**
 * Market Condition Adjustment
 * Adjusts scores based on industry and economic conditions
 */
export const adjustForMarketConditions = (customer, baseScore) => {
  // Industry risk factors (simplified)
  const industryRisks = {
    technology: 0.95,    // Lower risk
    healthcare: 0.90,
    manufacturing: 0.85,
    retail: 0.80,
    construction: 0.75,
    hospitality: 0.70,
    default: 0.85
  };
  
  // Economic cycle adjustment
  const economicCycle = {
    expansion: 1.05,
    peak: 1.00,
    contraction: 0.90,
    trough: 0.85
  };
  
  // Geographic risk factors
  const geoRisks = {
    tier1: 1.00,
    tier2: 0.95,
    tier3: 0.90,
    international: 0.85
  };
  
  const industryFactor = industryRisks[customer.industry?.toLowerCase()] || industryRisks.default;
  const economicFactor = economicCycle.expansion; // Assume expansion for demo
  const geoFactor = geoRisks[customer.location?.toLowerCase().includes('tier1') ? 'tier1' : 'tier2'] || 0.95;
  
  const adjustedScore = baseScore * industryFactor * economicFactor * geoFactor;
  
  return {
    adjustedScore: Math.round(adjustedScore),
    adjustments: {
      industry: { factor: industryFactor, impact: `${((industryFactor - 1) * 100).toFixed(1)}%` },
      economic: { factor: economicFactor, impact: `${((economicFactor - 1) * 100).toFixed(1)}%` },
      geographic: { factor: geoFactor, impact: `${((geoFactor - 1) * 100).toFixed(1)}%` }
    }
  };
};

/**
 * Main AI Credit Scoring Function
 * Combines all factors to produce final credit score
 */
export const calculateAdvancedCreditScore = (customer, invoices, payments) => {
  // Calculate individual component scores
  const paymentAnalysis = analyzePaymentHistory(customer, invoices, payments);
  const financialAnalysis = assessFinancialStability(customer, invoices);
  const behavioralAnalysis = analyzeBehavioralPatterns(customer, invoices, payments);
  
  // Weighted combination of all scores
  const rawScore = 
    (paymentAnalysis.weightedScore * SCORING_WEIGHTS.paymentHistory) +
    (financialAnalysis.weightedScore * SCORING_WEIGHTS.financialStability) +
    (behavioralAnalysis.weightedScore * SCORING_WEIGHTS.behavioralPatterns) +
    (85 * SCORING_WEIGHTS.marketConditions) + // Base market score
    (90 * SCORING_WEIGHTS.relationshipDepth); // Base relationship score
  
  // Apply market condition adjustments
  const { adjustedScore, adjustments } = adjustForMarketConditions(customer, rawScore);
  
  // Determine risk level
  const riskLevel = Object.values(RISK_THRESHOLDS).find(
    threshold => adjustedScore >= threshold.min && adjustedScore <= threshold.max
  ) || RISK_THRESHOLDS.fair;
  
  // Generate recommendations
  const recommendations = generateRecommendations(
    paymentAnalysis,
    financialAnalysis,
    behavioralAnalysis,
    riskLevel
  );
  
  return {
    score: adjustedScore,
    riskLevel,
    components: {
      paymentHistory: paymentAnalysis,
      financialStability: financialAnalysis,
      behavioralPatterns: behavioralAnalysis
    },
    adjustments,
    recommendations,
    timestamp: new Date().toISOString()
  };
};

/**
 * Generate Actionable Recommendations
 */
const generateRecommendations = (paymentData, financialData, behavioralData, riskLevel) => {
  const recommendations = [];
  
  // Payment history recommendations
  if (paymentData.onTimePercentage < 80) {
    recommendations.push({
      type: 'warning',
      priority: 'high',
      message: 'Improve payment timeliness - consider shorter payment terms',
      action: 'Review and tighten credit terms'
    });
  }
  
  // Financial stability recommendations
  if (financialData.outstandingRatio > 30) {
    recommendations.push({
      type: 'warning',
      priority: 'medium',
      message: 'High outstanding balance ratio indicates liquidity concerns',
      action: 'Consider reducing credit limits'
    });
  }
  
  // Behavioral recommendations
  if (behavioralData.consistencyScore < 70) {
    recommendations.push({
      type: 'info',
      priority: 'low',
      message: 'Payment patterns show variability - monitor closely',
      action: 'Set up automated payment reminders'
    });
  }
  
  // Risk-based recommendations
  if (riskLevel.label === 'Poor' || riskLevel.label === 'Critical') {
    recommendations.push({
      type: 'critical',
      priority: 'high',
      message: 'High credit risk detected - immediate action required',
      action: 'Implement enhanced monitoring and collateral requirements'
    });
  } else if (riskLevel.label === 'Excellent') {
    recommendations.push({
      type: 'success',
      priority: 'low',
      message: 'Excellent credit risk profile - consider loyalty benefits',
      action: 'Offer premium terms and incentives'
    });
  }
  
  return recommendations;
};

/**
 * Batch Score Calculation for Multiple Customers
 */
export const batchCalculateScores = (customers, invoices, payments) => {
  return customers.map(customer => ({
    customerId: customer.id,
    customerName: customer.businessName || customer.fullName,
    ...calculateAdvancedCreditScore(customer, invoices, payments)
  }));
};

/**
 * Score Trend Analysis
 */
export const analyzeScoreTrends = (customer, historicalData = []) => {
  if (historicalData.length < 2) {
    return { trend: 'insufficient_data', change: 0 };
  }
  
  const recentScore = historicalData[historicalData.length - 1]?.score || 0;
  const previousScore = historicalData[historicalData.length - 2]?.score || recentScore;
  const change = recentScore - previousScore;
  
  let trend;
  if (change > 5) trend = 'improving';
  else if (change < -5) trend = 'deteriorating';
  else trend = 'stable';
  
  return { trend, change, percentageChange: ((change / previousScore) * 100).toFixed(2) };
};

export default {
  calculateAdvancedCreditScore,
  batchCalculateScores,
  analyzeScoreTrends,
  RISK_THRESHOLDS,
  SCORING_WEIGHTS
};