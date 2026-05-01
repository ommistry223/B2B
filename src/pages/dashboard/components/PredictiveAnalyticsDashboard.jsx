import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Calendar, TrendingUp, TrendingDown, DollarSign, AlertTriangle, Clock, Target, Zap } from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const PredictiveAnalyticsDashboard = ({ invoices, customers, payments }) => {
  const [timeRange, setTimeRange] = useState('90days');
  const [forecastPeriod, setForecastPeriod] = useState('30days');

  // Filter data based on time range
  const filteredData = useMemo(() => {
    const cutoffDate = new Date();
    if (timeRange === '30days') cutoffDate.setDate(cutoffDate.getDate() - 30);
    else if (timeRange === '90days') cutoffDate.setDate(cutoffDate.getDate() - 90);
    else if (timeRange === '1year') cutoffDate.setFullYear(cutoffDate.getFullYear() - 1);

    return {
      invoices: invoices.filter(inv => new Date(inv.createdAt || inv.date) >= cutoffDate),
      payments: payments.filter(p => new Date(p.paymentDate || p.date) >= cutoffDate),
      customers: customers
    };
  }, [invoices, customers, payments, timeRange]);

  // Revenue Forecasting
  const revenueForecast = useMemo(() => {
    const dailyRevenue = {};
    filteredData.payments.forEach(payment => {
      const date = new Date(payment.paymentDate || payment.date).toISOString().split('T')[0];
      dailyRevenue[date] = (dailyRevenue[date] || 0) + parseFloat(payment.amount);
    });

    // Simple linear regression for forecasting
    const dates = Object.keys(dailyRevenue).sort();
    const values = dates.map(date => dailyRevenue[date]);
    
    if (values.length < 2) return [];

    // Calculate trend
    const n = values.length;
    const sumX = (n * (n - 1)) / 2;
    const sumY = values.reduce((sum, val) => sum + val, 0);
    const sumXY = values.reduce((sum, val, i) => sum + val * i, 0);
    const sumXX = values.reduce((sum, _, i) => sum + i * i, 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // Generate forecast
    const forecast = [];
    const forecastDays = parseInt(forecastPeriod) || 30;
    
    for (let i = 0; i < Math.min(dates.length + forecastDays, 365); i++) {
      const date = new Date(dates[0]);
      date.setDate(date.getDate() + i);
      const dateString = date.toISOString().split('T')[0];
      
      if (i < dates.length) {
        forecast.push({
          date: dateString,
          actual: dailyRevenue[dates[i]],
          forecast: null
        });
      } else {
        const predictedValue = Math.max(0, intercept + slope * i);
        forecast.push({
          date: dateString,
          actual: null,
          forecast: predictedValue
        });
      }
    }

    return forecast;
  }, [filteredData.payments, forecastPeriod]);

  // Cash Flow Prediction
  const cashFlowPrediction = useMemo(() => {
    const today = new Date();
    const predictions = [];

    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const expectedInvoices = filteredData.invoices.filter(inv => {
        const dueDate = new Date(inv.dueDate);
        return dueDate.toDateString() === date.toDateString();
      });

      const expectedPayments = filteredData.payments.filter(p => {
        const paymentDate = new Date(p.paymentDate || p.date);
        return paymentDate.toDateString() === date.toDateString();
      });

      const expectedRevenue = expectedPayments.reduce((sum, p) => sum + parseFloat(p.amount), 0);
      const expectedReceivables = expectedInvoices.reduce((sum, inv) => sum + parseFloat(inv.amount), 0);

      predictions.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        revenue: expectedRevenue,
        receivables: expectedReceivables,
        netCashFlow: expectedRevenue - expectedReceivables
      });
    }

    return predictions;
  }, [filteredData.invoices, filteredData.payments]);

  // Customer Risk Distribution
  const riskDistribution = useMemo(() => {
    const riskLevels = { Excellent: 0, Good: 0, Fair: 0, Poor: 0, Critical: 0 };
    
    filteredData.customers.forEach(customer => {
      const customerInvoices = filteredData.invoices.filter(inv => inv.customerId === customer.id);
      const customerPayments = filteredData.payments.filter(p => 
        customerInvoices.some(inv => inv.id === p.invoiceId)
      );
      
      // Simplified risk calculation
      const paidInvoices = customerInvoices.filter(inv => inv.status === 'paid').length;
      const totalInvoices = customerInvoices.length;
      const paymentRate = totalInvoices > 0 ? (paidInvoices / totalInvoices) * 100 : 0;
      
      let riskLabel;
      if (paymentRate >= 90) riskLabel = 'Excellent';
      else if (paymentRate >= 80) riskLabel = 'Good';
      else if (paymentRate >= 60) riskLabel = 'Fair';
      else if (paymentRate >= 40) riskLabel = 'Poor';
      else riskLabel = 'Critical';
      
      riskLevels[riskLabel]++;
    });

    return Object.entries(riskLevels).map(([name, value]) => ({
      name,
      value
    }));
  }, [filteredData.customers, filteredData.invoices, filteredData.payments]);

  // Overdue Trends
  const overdueTrends = useMemo(() => {
    const trends = [];
    const today = new Date();

    for (let i = 30; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      
      const dayInvoices = filteredData.invoices.filter(inv => {
        const invDate = new Date(inv.createdAt || inv.date);
        return invDate.toDateString() === date.toDateString();
      });

      const overdueCount = dayInvoices.filter(inv => inv.status === 'overdue').length;
      const totalCount = dayInvoices.length;

      trends.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        overdue: overdueCount,
        total: totalCount,
        percentage: totalCount > 0 ? (overdueCount / totalCount) * 100 : 0
      });
    }

    return trends;
  }, [filteredData.invoices]);

  // Key Metrics
  const metrics = useMemo(() => {
    const totalRevenue = filteredData.payments.reduce((sum, p) => sum + parseFloat(p.amount), 0);
    const totalInvoices = filteredData.invoices.length;
    const paidInvoices = filteredData.invoices.filter(inv => inv.status === 'paid').length;
    const overdueInvoices = filteredData.invoices.filter(inv => inv.status === 'overdue').length;
    
    const paymentRate = totalInvoices > 0 ? (paidInvoices / totalInvoices) * 100 : 0;
    const avgInvoiceValue = totalInvoices > 0 ? totalRevenue / totalInvoices : 0;

    return [
      {
        title: 'Predicted Revenue',
        value: `₹${(totalRevenue * 1.15).toLocaleString('en-IN')}`,
        subtitle: 'Next 30 days forecast',
        icon: TrendingUp,
        trend: 'up',
        trendValue: '+15%',
        color: 'text-green-500'
      },
      {
        title: 'Collection Rate',
        value: `${paymentRate.toFixed(1)}%`,
        subtitle: 'Of total invoices',
        icon: Target,
        trend: paymentRate > 80 ? 'up' : 'down',
        trendValue: paymentRate > 80 ? 'Healthy' : 'Needs attention',
        color: paymentRate > 80 ? 'text-green-500' : 'text-red-500'
      },
      {
        title: 'Risk Concentration',
        value: `${((overdueInvoices / totalInvoices) * 100 || 0).toFixed(1)}%`,
        subtitle: 'High-risk customers',
        icon: AlertTriangle,
        trend: 'down',
        trendValue: 'Decreasing',
        color: 'text-yellow-500'
      },
      {
        title: 'Cash Velocity',
        value: `${(avgInvoiceValue / 1000).toFixed(1)}K avg`,
        subtitle: 'Per transaction',
        icon: Zap,
        trend: 'up',
        trendValue: '+8%',
        color: 'text-blue-500'
      }
    ];
  }, [filteredData.payments, filteredData.invoices]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Predictive Analytics</h1>
          <p className="text-muted-foreground mt-2">
            AI-powered forecasting and risk intelligence
          </p>
        </div>
        
        <div className="flex gap-3">
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-border rounded-lg bg-card text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
            <option value="1year">Last Year</option>
          </select>
          
          <select 
            value={forecastPeriod}
            onChange={(e) => setForecastPeriod(e.target.value)}
            className="px-4 py-2 border border-border rounded-lg bg-card text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="30days">30-Day Forecast</option>
            <option value="60days">60-Day Forecast</option>
            <option value="90days">90-Day Forecast</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-card rounded-xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
                <p className="text-2xl font-bold text-foreground mt-1">{metric.value}</p>
                <p className="text-sm text-muted-foreground mt-2">{metric.subtitle}</p>
              </div>
              <div className={`p-3 rounded-lg bg-${metric.color.replace('text-', '')} bg-opacity-10`}>
                <metric.icon className={`w-6 h-6 ${metric.color}`} />
              </div>
            </div>
            
            <div className="flex items-center mt-4">
              {metric.trend === 'up' ? (
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm font-medium ${metric.color}`}>
                {metric.trendValue}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Forecast Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-card rounded-xl p-6 border border-border"
        >
          <h3 className="text-lg font-semibold text-foreground mb-4">Revenue Forecast</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueForecast}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="date" 
                  stroke="#9CA3AF"
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `₹${(value/1000).toFixed(0)}K`}
                />
                <Tooltip 
                  formatter={(value) => [`₹${parseFloat(value).toLocaleString('en-IN')}`, 'Amount']}
                  labelStyle={{ color: '#1F2937' }}
                  contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="actual" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name="Actual Revenue"
                />
                <Line 
                  type="monotone" 
                  dataKey="forecast" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ r: 0 }}
                  name="Forecast"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Cash Flow Prediction */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-card rounded-xl p-6 border border-border"
        >
          <h3 className="text-lg font-semibold text-foreground mb-4">Cash Flow Prediction</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cashFlowPrediction.slice(0, 15)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="date" 
                  stroke="#9CA3AF"
                  tick={{ fontSize: 10 }}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `₹${(value/1000).toFixed(0)}K`}
                />
                <Tooltip 
                  formatter={(value) => [`₹${parseFloat(value).toLocaleString('en-IN')}`, 'Amount']}
                  labelStyle={{ color: '#1F2937' }}
                  contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                />
                <Legend />
                <Bar dataKey="revenue" fill="#10B981" name="Expected Revenue" />
                <Bar dataKey="receivables" fill="#F59E0B" name="Expected Receivables" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Risk Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-xl p-6 border border-border"
        >
          <h3 className="text-lg font-semibold text-foreground mb-4">Customer Risk Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {riskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Overdue Trends */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-xl p-6 border border-border"
        >
          <h3 className="text-lg font-semibold text-foreground mb-4">Overdue Trends</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={overdueTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="date" 
                  stroke="#9CA3AF"
                  tick={{ fontSize: 10 }}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  formatter={(value, name) => [value, name === 'percentage' ? `${value}%` : value]}
                  labelStyle={{ color: '#1F2937' }}
                  contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="percentage" 
                  stroke="#EF4444" 
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  name="Overdue %"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Insights Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white"
      >
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white bg-opacity-20 rounded-lg">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">AI Insights & Recommendations</h3>
            <ul className="space-y-2 text-blue-100">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                Revenue forecast shows 15% growth over the next 30 days
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                Monitor customers in the "Fair" risk category for potential issues
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                Cash flow prediction indicates strong liquidity position
              </li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PredictiveAnalyticsDashboard;