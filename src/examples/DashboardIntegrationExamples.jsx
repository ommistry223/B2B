// ===================================================================
// Example: How to Integrate 3D Animations into Your Dashboard
// ===================================================================
// This file shows practical examples of integrating the new
// 3D animation components into your existing dashboard page.
// Copy and adapt these snippets as needed.
// ===================================================================

// ============= IMPORTS =============
import React from 'react'
import { motion } from 'framer-motion'
import AnimatedCard3D from '../../components/AnimatedCard3D'
import AnimatedButton from '../../components/ui/AnimatedButton'
import AnimatedSection, {
  AnimatedGroup,
} from '../../components/ui/AnimatedSection'
import AnimatedCounter from '../../components/ui/AnimatedCounter'
import AnimatedGradientText from '../../components/ui/AnimatedGradientText'
import AnimatedProgressBar from '../../components/ui/AnimatedProgressBar'
import FloatingActionMenu from '../../components/ui/FloatingActionMenu'
import { TrendingUp, CreditCard, Users, DollarSign } from 'lucide-react'

// ============= EXAMPLE 1: Stats Cards =============
// Replace your existing stat cards with animated versions

export const AnimatedStatsCards = ({ stats }) => {
  return (
    <AnimatedGroup stagger={0.15}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <AnimatedCard3D
            key={index}
            className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg">
                {stat.icon}
              </div>
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="text-sm text-green-500"
              >
                +{stat.change}%
              </motion.div>
            </div>

            <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {stat.label}
            </h3>

            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              <AnimatedCounter
                value={stat.value}
                prefix={stat.prefix}
                suffix={stat.suffix}
                duration={2}
              />
            </div>

            <AnimatedProgressBar
              value={stat.progress}
              color="indigo"
              height="h-2"
              showPercentage={false}
              className="mt-4"
            />
          </AnimatedCard3D>
        ))}
      </div>
    </AnimatedGroup>
  )
}

// Usage:
/*
const stats = [
  {
    label: 'Total Revenue',
    value: 125000,
    prefix: '$',
    change: 12,
    progress: 75,
    icon: <DollarSign className="text-white" size={24} />
  },
  {
    label: 'Active Customers',
    value: 1543,
    suffix: '+',
    change: 8,
    progress: 60,
    icon: <Users className="text-white" size={24} />
  },
  // ... more stats
]

<AnimatedStatsCards stats={stats} />
*/

// ============= EXAMPLE 2: Recent Activity List =============
// Wrap lists with AnimatedGroup for stagger effect

export const AnimatedActivityList = ({ activities }) => {
  return (
    <AnimatedSection animation="slideRight">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">
          <AnimatedGradientText>Recent Activity</AnimatedGradientText>
        </h2>

        <AnimatedGroup stagger={0.1}>
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02, x: 10 }}
                className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                  {activity.icon}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {activity.title}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {activity.description}
                  </p>
                </div>
                <span className="text-sm text-gray-500">{activity.time}</span>
              </motion.div>
            ))}
          </div>
        </AnimatedGroup>
      </div>
    </AnimatedSection>
  )
}

// ============= EXAMPLE 3: Action Buttons =============
// Replace regular buttons with animated ones

export const AnimatedActionButtons = () => {
  return (
    <div className="flex flex-wrap gap-4">
      <AnimatedButton
        variant="primary"
        size="md"
        icon={<CreditCard size={18} />}
        onClick={() => {
          /* handle click */
        }}
      >
        Create Invoice
      </AnimatedButton>

      <AnimatedButton
        variant="secondary"
        size="md"
        icon={<Users size={18} />}
        onClick={() => {
          /* handle click */
        }}
      >
        Add Customer
      </AnimatedButton>

      <AnimatedButton
        variant="outline"
        size="md"
        icon={<TrendingUp size={18} />}
        onClick={() => {
          /* handle click */
        }}
      >
        View Analytics
      </AnimatedButton>
    </div>
  )
}

// ============= EXAMPLE 4: Chart Container =============
// Wrap your charts with AnimatedCard3D

export const AnimatedChartContainer = ({ children, title }) => {
  return (
    <AnimatedSection animation="fadeUp">
      <AnimatedCard3D className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <h3 className="text-lg font-bold mb-6 text-gray-900 dark:text-white">
          {title}
        </h3>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {children}
        </motion.div>
      </AnimatedCard3D>
    </AnimatedSection>
  )
}

// Usage:
/*
<AnimatedChartContainer title="Revenue Overview">
  <YourChart />
</AnimatedChartContainer>
*/

// ============= EXAMPLE 5: Full Dashboard Layout =============
// Complete example of an animated dashboard

export const FullAnimatedDashboard = () => {
  const stats = [
    {
      label: 'Revenue',
      value: 125000,
      prefix: '$',
      change: 12,
      progress: 75,
      icon: <DollarSign />,
    },
    {
      label: 'Customers',
      value: 1543,
      suffix: '+',
      change: 8,
      progress: 60,
      icon: <Users />,
    },
    {
      label: 'Invoices',
      value: 847,
      change: 15,
      progress: 85,
      icon: <CreditCard />,
    },
    {
      label: 'Growth',
      value: 24,
      suffix: '%',
      change: 5,
      progress: 65,
      icon: <TrendingUp />,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      {/* Floating Action Menu */}
      <FloatingActionMenu />

      {/* Header */}
      <AnimatedSection animation="fadeUp">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            <AnimatedGradientText>Dashboard</AnimatedGradientText>
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome back! Here's what's happening today.
          </p>
        </div>
      </AnimatedSection>

      {/* Stats Cards */}
      <div className="mb-8">
        <AnimatedStatsCards stats={stats} />
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnimatedChartContainer title="Revenue Overview">
          {/* Your chart component */}
          <div className="h-64 flex items-center justify-center text-gray-400">
            Chart Component Here
          </div>
        </AnimatedChartContainer>

        <AnimatedSection animation="slideLeft">
          <AnimatedCard3D className="p-6 bg-white dark:bg-gray-800 rounded-xl">
            <h3 className="text-lg font-bold mb-6">Quick Actions</h3>
            <AnimatedActionButtons />
          </AnimatedCard3D>
        </AnimatedSection>
      </div>
    </div>
  )
}

// ============= EXAMPLE 6: Minimal Integration =============
// If you want to start small, just wrap existing content

export const MinimalIntegration = ({ children }) => {
  return (
    <div>
      {/* Add floating menu */}
      <FloatingActionMenu />

      {/* Wrap entire page */}
      <AnimatedSection animation="fadeUp">{children}</AnimatedSection>
    </div>
  )
}

// ============= EXAMPLE 7: Progressive Enhancement =============
// Add animations to one section at a time

export const ProgressiveEnhancement = () => {
  return (
    <div className="space-y-8">
      {/* Existing header - add gradient text */}
      <h1 className="text-4xl font-bold">
        <AnimatedGradientText>Dashboard</AnimatedGradientText>
      </h1>

      {/* Existing stats - wrap with AnimatedGroup */}
      <AnimatedGroup stagger={0.1}>
        {/* Your existing stat components */}
      </AnimatedGroup>

      {/* Existing buttons - replace with AnimatedButton */}
      <AnimatedButton onClick={() => {}}>Create Invoice</AnimatedButton>

      {/* Existing cards - wrap with AnimatedCard3D */}
      <AnimatedCard3D>{/* Your existing card content */}</AnimatedCard3D>
    </div>
  )
}

// ===================================================================
// INTEGRATION STEPS:
// ===================================================================
// 1. Start with FloatingActionMenu - easiest win
// 2. Replace buttons with AnimatedButton
// 3. Wrap stat cards with AnimatedCard3D
// 4. Add AnimatedCounter to numbers
// 5. Wrap sections with AnimatedSection
// 6. Use AnimatedGroup for lists
// 7. Add AnimatedGradientText to titles
// ===================================================================

export default {
  AnimatedStatsCards,
  AnimatedActivityList,
  AnimatedActionButtons,
  AnimatedChartContainer,
  FullAnimatedDashboard,
  MinimalIntegration,
  ProgressiveEnhancement,
}
