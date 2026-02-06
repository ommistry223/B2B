import React from 'react'
import { motion } from 'framer-motion'
import AnimatedHero3D, { textVariants } from '../components/AnimatedHero3D'
import AnimatedCard3D from '../components/AnimatedCard3D'
import AnimatedButton from '../components/ui/AnimatedButton'
import AnimatedSection, {
  AnimatedGroup,
} from '../components/ui/AnimatedSection'
import AnimatedCounter from '../components/ui/AnimatedCounter'
import AnimatedGradientText from '../components/ui/AnimatedGradientText'
import FloatingActionMenu from '../components/ui/FloatingActionMenu'
import ParticleField from '../components/ui/ParticleField'
import AnimatedProgressBar from '../components/ui/AnimatedProgressBar'
import { ArrowRight, Zap, Shield, TrendingUp, Sparkles } from 'lucide-react'

const Demo3DPage = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Floating Action Menu */}
      <FloatingActionMenu />

      {/* Particle Background */}
      <ParticleField count={30} />

      {/* Hero Section with 3D Background */}
      <AnimatedHero3D className="min-h-screen flex items-center justify-center relative">
        <div className="container mx-auto px-4 z-10">
          <motion.div
            variants={textVariants}
            initial="hidden"
            animate="visible"
            className="text-center space-y-8"
          >
            <motion.h1
              className="text-6xl md:text-8xl font-bold"
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                type: 'spring',
                damping: 12,
                stiffness: 100,
                delay: 0.2,
              }}
            >
              <AnimatedGradientText>Next-Gen B2B</AnimatedGradientText>
              <br />
              <span className="text-gray-900 dark:text-white">
                Credit Management
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
            >
              Experience the future of financial management with stunning 3D
              visuals and seamless animations
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-4 justify-center"
            >
              <AnimatedButton size="lg" icon={<Sparkles size={20} />}>
                Get Started
              </AnimatedButton>
              <AnimatedButton
                size="lg"
                variant="outline"
                icon={<ArrowRight size={20} />}
              >
                Learn More
              </AnimatedButton>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
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
        className="py-20 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-900"
      >
        <div className="container mx-auto px-4">
          <AnimatedGroup stagger={0.2}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                {
                  label: 'Active Users',
                  value: 15000,
                  suffix: '+',
                  icon: <TrendingUp />,
                },
                {
                  label: 'Transactions',
                  value: 1200000,
                  suffix: '+',
                  icon: <Zap />,
                },
                {
                  label: 'Success Rate',
                  value: 99,
                  suffix: '%',
                  icon: <Shield />,
                },
                {
                  label: 'Countries',
                  value: 45,
                  suffix: '+',
                  icon: <Sparkles />,
                },
              ].map((stat, index) => (
                <AnimatedCard3D
                  key={index}
                  className="p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl"
                >
                  <div className="text-center space-y-4">
                    <motion.div
                      className="inline-flex p-4 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 rounded-full text-indigo-600 dark:text-indigo-400"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      {stat.icon}
                    </motion.div>
                    <div className="text-5xl font-bold text-gray-900 dark:text-white">
                      <AnimatedCounter
                        value={stat.value}
                        suffix={stat.suffix}
                        duration={2.5}
                      />
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 font-medium">
                      {stat.label}
                    </p>
                    <AnimatedProgressBar
                      value={stat.value > 100 ? 100 : stat.value}
                      color="indigo"
                      height="h-2"
                      showPercentage={false}
                      className="mt-2"
                    />
                  </div>
                </AnimatedCard3D>
              ))}
            </div>
          </AnimatedGroup>
        </div>
      </AnimatedSection>

      {/* Features Section */}
      <AnimatedSection animation="slideRight" className="py-20">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            className="text-5xl font-bold text-center mb-16"
          >
            <AnimatedGradientText>Powerful Features</AnimatedGradientText>
          </motion.h2>

          <AnimatedGroup stagger={0.15}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: 'Real-time Analytics',
                  description:
                    'Track your financial data with advanced 3D visualizations and real-time updates.',
                  icon: <TrendingUp size={32} />,
                },
                {
                  title: 'Secure Payments',
                  description:
                    'Bank-level encryption and security measures to protect your transactions.',
                  icon: <Shield size={32} />,
                },
                {
                  title: 'Lightning Fast',
                  description:
                    'Optimized performance with instant loading and smooth animations.',
                  icon: <Zap size={32} />,
                },
              ].map((feature, index) => (
                <AnimatedCard3D
                  key={index}
                  className="p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="inline-flex p-4 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl text-white mb-6"
                  >
                    {feature.icon}
                  </motion.div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
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
        className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600"
      >
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false }}
            className="space-y-8"
          >
            <h2 className="text-5xl font-bold text-white">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
              Join thousands of businesses already using our platform to manage
              their finances.
            </p>
            <AnimatedButton
              variant="secondary"
              size="lg"
              icon={<Sparkles size={20} />}
              className="bg-white text-indigo-600 hover:bg-gray-100"
            >
              Start Free Trial
            </AnimatedButton>
          </motion.div>
        </div>
      </AnimatedSection>
    </div>
  )
}

export default Demo3DPage
