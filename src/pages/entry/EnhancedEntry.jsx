import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import AnimatedHero3D from '../../components/AnimatedHero3D'
import AnimatedCard3D from '../../components/AnimatedCard3D'
import AnimatedButton from '../../components/ui/AnimatedButton'
import AnimatedSection, {
  AnimatedGroup,
} from '../../components/ui/AnimatedSection'
import AnimatedCounter from '../../components/ui/AnimatedCounter'
import AnimatedGradientText from '../../components/ui/AnimatedGradientText'
import FloatingActionMenu from '../../components/ui/FloatingActionMenu'
import ParticleField from '../../components/ui/ParticleField'
import {
  ArrowRight,
  Sparkles,
  TrendingUp,
  Shield,
  Zap,
  Users,
  CreditCard,
  BarChart3,
  Clock,
} from 'lucide-react'

const EnhancedEntry = () => {
  const navigate = useNavigate()

  const features = [
    {
      icon: <CreditCard size={32} />,
      title: 'Smart Invoicing',
      description:
        'Create and manage invoices with AI-powered automation and real-time tracking.',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: <BarChart3 size={32} />,
      title: 'Real-time Analytics',
      description:
        'Get instant insights with advanced 3D visualizations and predictive analytics.',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: <Shield size={32} />,
      title: 'Bank-Level Security',
      description:
        'Your data is protected with enterprise-grade encryption and compliance.',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: <Zap size={32} />,
      title: 'Lightning Fast',
      description:
        'Process payments and updates in milliseconds with optimized infrastructure.',
      color: 'from-yellow-500 to-orange-500',
    },
    {
      icon: <Users size={32} />,
      title: 'Customer Management',
      description:
        'Manage relationships with intelligent CRM and automated workflows.',
      color: 'from-indigo-500 to-purple-500',
    },
    {
      icon: <Clock size={32} />,
      title: 'Automated Reminders',
      description:
        'Never miss a payment with smart notifications and follow-up systems.',
      color: 'from-red-500 to-pink-500',
    },
  ]

  const stats = [
    {
      label: 'Active Businesses',
      value: 15000,
      suffix: '+',
      icon: <Users size={24} />,
    },
    {
      label: 'Transactions',
      value: 2500000,
      suffix: '+',
      icon: <CreditCard size={24} />,
    },
    {
      label: 'Success Rate',
      value: 99.9,
      suffix: '%',
      icon: <TrendingUp size={24} />,
    },
    { label: 'Countries', value: 45, suffix: '+', icon: <Shield size={24} /> },
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 overflow-hidden">
      {/* Floating Action Menu */}
      <FloatingActionMenu />

      {/* Background Particles */}
      <ParticleField count={40} />

      {/* Hero Section with 3D Background */}
      <AnimatedHero3D className="min-h-screen flex items-center justify-center relative">
        <div className="container mx-auto px-4 z-10">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center space-y-8"
          >
            {/* Logo or Brand */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: 'spring',
                stiffness: 200,
                damping: 20,
                delay: 0.3,
              }}
              className="inline-flex items-center gap-3 mb-4"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
                <Sparkles className="text-white" size={32} />
              </div>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                type: 'spring',
                damping: 12,
                stiffness: 100,
                delay: 0.4,
              }}
              className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight"
            >
              <AnimatedGradientText>Next-Gen B2B</AnimatedGradientText>
              <br />
              <span className="text-gray-900 dark:text-white">
                Credit Management
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed"
            >
              Transform your business with intelligent credit management,
              powered by cutting-edge AI and stunning 3D visualizations.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-wrap gap-4 justify-center items-center"
            >
              <AnimatedButton
                size="lg"
                icon={<Sparkles size={20} />}
                onClick={() => navigate('/register')}
              >
                Get Started Free
              </AnimatedButton>
              <AnimatedButton
                size="lg"
                variant="outline"
                icon={<ArrowRight size={20} />}
                onClick={() => navigate('/demo-3d')}
              >
                View Demo
              </AnimatedButton>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="pt-8"
            >
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Trusted by leading businesses worldwide
              </p>
              <div className="flex flex-wrap justify-center gap-8 items-center opacity-60">
                {[1, 2, 3, 4, 5].map(i => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.1, opacity: 1 }}
                    className="w-24 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-indigo-600 rounded-full flex justify-center">
            <motion.div
              className="w-1.5 h-3 bg-indigo-600 rounded-full mt-2"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </AnimatedHero3D>

      {/* Stats Section */}
      <AnimatedSection
        animation="fadeUp"
        className="py-24 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-900"
      >
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            className="text-4xl md:text-5xl font-bold text-center mb-16"
          >
            <AnimatedGradientText>Trusted by Thousands</AnimatedGradientText>
          </motion.h2>

          <AnimatedGroup stagger={0.15}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <AnimatedCard3D
                  key={index}
                  className="p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl"
                >
                  <div className="text-center space-y-4">
                    <motion.div
                      whileHover={{ rotate: 360, scale: 1.2 }}
                      transition={{ duration: 0.6 }}
                      className="inline-flex p-4 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 rounded-full text-indigo-600 dark:text-indigo-400"
                    >
                      {stat.icon}
                    </motion.div>
                    <div className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      <AnimatedCounter
                        value={stat.value}
                        suffix={stat.suffix}
                        duration={2.5}
                      />
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 font-medium">
                      {stat.label}
                    </p>
                  </div>
                </AnimatedCard3D>
              ))}
            </div>
          </AnimatedGroup>
        </div>
      </AnimatedSection>

      {/* Features Section */}
      <AnimatedSection animation="fadeUp" className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <AnimatedGradientText>Powerful Features</AnimatedGradientText>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Everything you need to manage your B2B credit operations
              efficiently
            </p>
          </motion.div>

          <AnimatedGroup stagger={0.1}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <AnimatedCard3D
                  key={index}
                  className="group p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    className={`inline-flex p-4 bg-gradient-to-br ${feature.color} rounded-2xl text-white mb-6 shadow-lg`}
                  >
                    {feature.icon}
                  </motion.div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </AnimatedCard3D>
              ))}
            </div>
          </AnimatedGroup>
        </div>
      </AnimatedSection>

      {/* CTA Section */}
      <AnimatedSection
        animation="scale"
        className="py-24 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 relative overflow-hidden"
      >
        {/* Animated background pattern */}
        <motion.div
          className="absolute inset-0 opacity-10"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            backgroundImage:
              'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />

        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false }}
            className="space-y-8"
          >
            <h2 className="text-4xl md:text-6xl font-bold text-white">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl md:text-2xl text-indigo-100 max-w-3xl mx-auto">
              Join thousands of businesses already using our platform to
              streamline their credit management and boost efficiency.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <AnimatedButton
                variant="secondary"
                size="lg"
                icon={<Sparkles size={20} />}
                onClick={() => navigate('/register')}
                className="bg-white text-indigo-600 hover:bg-gray-100"
              >
                Start Free Trial
              </AnimatedButton>
              <AnimatedButton
                variant="outline"
                size="lg"
                icon={<ArrowRight size={20} />}
                onClick={() => navigate('/login')}
                className="border-white text-white hover:bg-white/10"
              >
                Sign In
              </AnimatedButton>
            </div>
            <p className="text-sm text-indigo-200 pt-4">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </motion.div>
        </div>
      </AnimatedSection>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-gray-300">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">© 2026 CreditFlow Pro. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default EnhancedEntry
