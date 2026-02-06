import React, { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import Button from '../../components/ui/Button'
import Icon from '../../components/AppIcon'
import { useTheme } from '../../context/ThemeContext'
import {
  AnimatedSection,
  AnimatedCard,
  AnimatedText,
  AnimatedGradientText,
  AnimatedGrid,
  FloatingElement,
  PulsingElement,
  LiquidBlob,
  CountUpNumber,
  ParallaxElement,
} from '../../components/AnimatedComponents'
import {
  staggerContainer,
  staggerItem,
  fadeInUp,
  cardHover,
  buttonHover,
} from '../../util/animations'

const Entry = () => {
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%'])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  const splineSrc =
    theme === 'dark'
      ? 'https://my.spline.design/boxeshover-iECUyZuSROMD7emJZIaihA5b/'
      : 'https://my.spline.design/boxeshover-pgo99qOZvuFdoYbDvCWD9FYM/'

  const features = [
    {
      icon: 'TrendingUp',
      title: 'AI-Powered Risk Analysis',
      description:
        'Predict payment delays with 85%+ accuracy using advanced machine learning algorithms',
      gradient: 'from-blue-500 to-purple-600',
    },
    {
      icon: 'FileText',
      title: 'GST-Compliant Invoicing',
      description:
        'Generate professional invoices with automated GST calculations and compliance',
      gradient: 'from-green-500 to-emerald-600',
    },
    {
      icon: 'DollarSign',
      title: 'Smart Cash Flow Tracking',
      description:
        'Real-time visibility into your receivables and safe cash calculations',
      gradient: 'from-amber-500 to-orange-600',
    },
    {
      icon: 'Bell',
      title: 'Automated Reminders',
      description:
        'Multi-channel payment reminders via WhatsApp, SMS, and Email',
      gradient: 'from-pink-500 to-rose-600',
    },
    {
      icon: 'Shield',
      title: 'Credit Risk Management',
      description:
        'Comprehensive risk scoring and credit limit recommendations',
      gradient: 'from-violet-500 to-purple-600',
    },
    {
      icon: 'BarChart3',
      title: 'Advanced Analytics',
      description:
        'Detailed insights into payment trends and customer behavior patterns',
      gradient: 'from-blue-500 to-cyan-600',
    },
  ]

  const stats = [
    { value: 450, suffix: 'Cr+', label: 'Credit Managed', prefix: '₹' },
    { value: 5000, suffix: '+', label: 'Active Users' },
    { value: 87, suffix: '%', label: 'Collection Rate' },
    { value: 24, suffix: '/7', label: 'Support' },
  ]

  const testimonials = [
    {
      name: 'Rajesh Sharma',
      company: 'TechStart Industries',
      image: '',
      quote:
        'CreditFlow Pro reduced our overdue invoices by 65% in just 3 months. The AI predictions are incredibly accurate!',
      rating: 5,
    },
    {
      name: 'Priya Patel',
      company: 'Global Traders Ltd',
      image: '',
      quote:
        'The automated reminders and risk analysis have transformed our credit management. Highly recommended!',
      rating: 5,
    },
    {
      name: 'Amit Kumar',
      company: 'Metro Wholesale',
      image: '',
      quote:
        'Easy to use, powerful features, and excellent support. This tool is a game-changer for B2B businesses.',
      rating: 5,
    },
  ]

  return (
    <>
      <Helmet>
        <title>CreditFlow Pro - Smart B2B Credit Management</title>
      </Helmet>
      <div className="page-shell overflow-hidden bg-gradient-to-b from-background via-muted/5 to-background">
        {/* Advanced Animated Background */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <LiquidBlob
            className="absolute -top-40 -left-40"
            size={600}
            color="bg-gradient-to-br from-blue-500/15 to-purple-600/15"
          />
          <LiquidBlob
            className="absolute -bottom-40 -right-40"
            size={700}
            color="bg-gradient-to-br from-purple-500/15 to-pink-600/15"
          />
          <FloatingElement
            yOffset={30}
            duration={6}
            className="absolute top-20 left-1/4"
          >
            <div className="w-4 h-4 rounded-full bg-primary/20 blur-sm" />
          </FloatingElement>
          <FloatingElement
            yOffset={40}
            duration={5}
            delay={1}
            className="absolute top-1/3 right-1/4"
          >
            <div className="w-6 h-6 rounded-full bg-secondary/20 blur-sm" />
          </FloatingElement>
          <FloatingElement
            yOffset={35}
            duration={7}
            delay={2}
            className="absolute bottom-1/4 left-1/3"
          >
            <div className="w-5 h-5 rounded-full bg-accent/20 blur-sm" />
          </FloatingElement>
        </div>

        {/* Navigation */}
        <motion.nav
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] }}
          className="fixed top-0 left-0 right-0 z-[1000] bg-card/70 backdrop-blur-xl border-b border-border/50 shadow-lg"
        >
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 md:h-20">
              <motion.div
                className="flex items-center gap-3"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <Icon name="TrendingUp" size={24} color="#FFFFFF" />
                </motion.div>
                <span className="text-xl font-bold text-foreground">
                  CreditFlow Pro
                </span>
              </motion.div>
              <div className="flex items-center gap-3">
                <motion.div
                  key={theme}
                  initial={{ scale: 0, rotate: -180, opacity: 0 }}
                  animate={{ scale: 1, rotate: 0, opacity: 1 }}
                  whileHover={{ scale: 1.15, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 20,
                  }}
                >
                  <motion.div
                    animate={{
                      rotate: [0, 10, -10, 10, 0],
                    }}
                    transition={{
                      duration: 0.5,
                      ease: 'easeInOut',
                    }}
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      iconName={theme === 'dark' ? 'Sun' : 'Moon'}
                      iconSize={20}
                      onClick={toggleTheme}
                      className="hidden md:flex relative overflow-hidden"
                      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                    />
                  </motion.div>
                </motion.div>
                <motion.div {...buttonHover}>
                  <Button
                    variant="ghost"
                    onClick={() => navigate('/login')}
                    className="hidden md:flex"
                  >
                    Sign In
                  </Button>
                </motion.div>
                <motion.div {...buttonHover}>
                  <Button
                    variant="default"
                    onClick={() => navigate('/register')}
                    iconName="ArrowRight"
                    iconPosition="right"
                    className="shadow-lg"
                  >
                    Get Started
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.nav>

        {/* Hero Section */}
        <section
          ref={heroRef}
          className="relative pt-32 pb-20 md:pt-40 md:pb-32 px-4 md:px-6 lg:px-8 min-h-screen flex items-center"
        >
          <div className="max-w-7xl mx-auto relative z-10 w-full">
            <motion.div
              initial="initial"
              animate="animate"
              variants={staggerContainer}
              className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-16 items-center"
            >
              <div className="text-center lg:text-left">
                <motion.div
                  variants={staggerItem}
                  whileHover={{ scale: 1.05 }}
                  className="inline-block mb-6 px-5 py-2.5 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 backdrop-blur-sm cursor-pointer group"
                >
                  <span className="text-sm font-semibold text-primary flex items-center gap-2">
                    <motion.span
                      className="w-2 h-2 rounded-full bg-primary"
                      animate={{ scale: [1, 1.3, 1], opacity: [1, 0.6, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <span className="group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-secondary transition-all">
                      New: AI-Powered Risk Prediction 2.0
                    </span>
                    <motion.div
                      initial={{ x: 0 }}
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <Icon name="Sparkles" size={14} />
                    </motion.div>
                  </span>
                </motion.div>

                <motion.h1
                  variants={staggerItem}
                  className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-foreground mb-6 leading-[1.1]"
                >
                  Transform Your B2B <br className="hidden md:block" />
                  Credit Management with{' '}
                  <AnimatedGradientText className="inline-block">
                    Smart Analytics
                  </AnimatedGradientText>
                </motion.h1>

                <AnimatedText
                  as="p"
                  variant="fadeInUp"
                  delay={0.3}
                  className="text-lg md:text-xl lg:text-2xl text-muted-foreground mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0"
                >
                  Predict payment delays, automate reminders, and optimize cash
                  flow with India's most advanced credit management platform.
                </AnimatedText>

                <motion.div
                  variants={staggerItem}
                  className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-4 mb-10"
                >
                  <motion.div {...buttonHover}>
                    <Button
                      variant="default"
                      size="xl"
                      onClick={() => navigate('/register')}
                      iconName="Rocket"
                      iconPosition="left"
                      className="shadow-2xl shadow-primary/30 bg-gradient-to-r from-primary to-blue-600 border-0"
                    >
                      Start Free Trial
                    </Button>
                  </motion.div>
                  <motion.div {...buttonHover}>
                    <Button
                      variant="outline"
                      size="xl"
                      iconName="Play"
                      iconPosition="left"
                      className="border-2 hover:bg-primary/10 hover:border-primary"
                    >
                      Watch Demo
                    </Button>
                  </motion.div>
                </motion.div>

                <motion.div
                  variants={staggerItem}
                  className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm"
                >
                  {[
                    'No credit card required',
                    '14-day free trial',
                    'Cancel anytime',
                  ].map((text, i) => (
                    <motion.div
                      key={i}
                      className="flex items-center gap-2 text-muted-foreground"
                      whileHover={{ scale: 1.05, x: 5 }}
                    >
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.2,
                        }}
                      >
                        <Icon
                          name="Check"
                          size={16}
                          className="text-green-500"
                        />
                      </motion.div>
                      <span className="font-medium">{text}</span>
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              <motion.div variants={staggerItem} className="relative">
                <motion.div
                  className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-border/50"
                  whileHover={{ scale: 1.02, rotate: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 opacity-50" />
                  <div className="relative w-full h-[350px] sm:h-[450px] lg:h-[550px]">
                    <iframe
                      key={splineSrc}
                      src={splineSrc}
                      title="CreditFlow 3D Showcase"
                      allow="autoplay; fullscreen"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  </div>
                </motion.div>
                <motion.p
                  className="mt-4 text-xs text-muted-foreground text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  ✨ Hover and explore the interactive 3D experience
                </motion.p>
              </motion.div>
            </motion.div>

            {/* Stats with CountUp Animation */}
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: '-100px' }}
              variants={staggerContainer}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-24"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  variants={staggerItem}
                  whileHover={{ y: -8, scale: 1.03 }}
                  className="relative text-center p-6 md:p-8 rounded-2xl bg-card/60 backdrop-blur-md border border-border/50 hover:border-primary/50 hover:shadow-2xl transition-all duration-300 cursor-pointer group overflow-hidden"
                >
                  <motion.div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10">
                    <div className="text-3xl md:text-5xl font-black mb-2">
                      <AnimatedGradientText>
                        {stat.prefix}
                        <CountUpNumber
                          from={0}
                          to={stat.value}
                          duration={2.5}
                        />
                        {stat.suffix}
                      </AnimatedGradientText>
                    </div>
                    <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                      {stat.label}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <AnimatedSection className="py-20 md:py-32 px-4 md:px-6 lg:px-8 relative">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <motion.div
                {...fadeInUp}
                className="inline-flex items-center gap-2 mb-4 px-5 py-2.5 rounded-full bg-primary/10 text-primary text-sm font-semibold border border-primary/20"
              >
                <Icon name="Zap" size={18} />
                <span>Powerful Features</span>
              </motion.div>
              <AnimatedText
                as="h2"
                variant="fadeInUp"
                delay={0.1}
                className="text-3xl md:text-4xl lg:text-6xl font-black text-foreground mb-6 leading-tight"
              >
                Everything You Need to{' '}
                <AnimatedGradientText>Manage Credit</AnimatedGradientText>
              </AnimatedText>
              <AnimatedText
                as="p"
                variant="fadeInUp"
                delay={0.2}
                className="text-lg md:text-xl text-muted-foreground leading-relaxed"
              >
                Powerful features designed to help you reduce bad debt, improve
                cash flow, and make smarter credit decisions.
              </AnimatedText>
            </div>

            <AnimatedGrid
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
              staggerDelay={0.08}
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -12, scale: 1.03, rotateZ: 1 }}
                  transition={{ duration: 0.3, ease: [0.43, 0.13, 0.23, 0.96] }}
                  className="relative bg-card/60 backdrop-blur-md rounded-3xl p-8 border border-border/50 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5 group overflow-hidden cursor-pointer"
                >
                  {/* Animated gradient overlay */}
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: `linear-gradient(135deg, rgba(var(--rgb-primary), 0.05), rgba(var(--rgb-secondary), 0.05))`,
                    }}
                  />

                  {/* Decorative corner glow */}
                  <div className="absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative z-10">
                    <motion.div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 shadow-xl group-hover:shadow-2xl`}
                      whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Icon name={feature.icon} size={32} color="#FFFFFF" />
                    </motion.div>
                    <h3 className="text-xl md:text-2xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed text-base">
                      {feature.description}
                    </p>
                  </div>

                  {/* Bottom accent line */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                </motion.div>
              ))}
            </AnimatedGrid>
          </div>
        </AnimatedSection>

        {/* How It Works */}
        <AnimatedSection className="py-20 md:py-32 px-4 md:px-6 lg:px-8 bg-gradient-to-b from-muted/10 via-background to-muted/10">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <AnimatedText
                as="h2"
                variant="fadeInUp"
                className="text-3xl md:text-4xl lg:text-6xl font-black text-foreground mb-6"
              >
                How It <AnimatedGradientText>Works</AnimatedGradientText>
              </AnimatedText>
              <AnimatedText
                as="p"
                variant="fadeInUp"
                delay={0.1}
                className="text-lg md:text-xl text-muted-foreground"
              >
                Get started in minutes with our simple three-step process
              </AnimatedText>
            </div>

            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: '-100px' }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16 relative"
            >
              {/* Connection line */}
              <div
                className="hidden md:block absolute top-12 left-0 right-0 h-1 bg-gradient-to-r from-primary/20 via-secondary/40 to-primary/20"
                style={{ top: '3rem' }}
              />

              {[
                {
                  step: '01',
                  icon: 'UserPlus',
                  title: 'Create Account',
                  description:
                    'Sign up in minutes and set up your company profile with GST details',
                },
                {
                  step: '02',
                  icon: 'Upload',
                  title: 'Import Data',
                  description:
                    'Upload your customer list or connect with your existing accounting software',
                },
                {
                  step: '03',
                  icon: 'Rocket',
                  title: 'Start Managing',
                  description:
                    'Create invoices, track payments, and let AI predict risks automatically',
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  variants={staggerItem}
                  className="relative text-center group"
                >
                  <FloatingElement
                    yOffset={15}
                    duration={3}
                    delay={index * 0.3}
                  >
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 360 }}
                      transition={{ duration: 0.6 }}
                      className="relative inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-secondary text-white text-3xl font-black mb-6 shadow-2xl mx-auto"
                    >
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary to-secondary blur opacity-60 group-hover:opacity-100 transition-opacity" />
                      <span className="relative z-10">{item.step}</span>
                    </motion.div>
                  </FloatingElement>

                  <motion.div
                    whileHover={{ scale: 1.15, rotate: -5 }}
                    transition={{ duration: 0.3 }}
                    className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 border-2 border-primary/20 flex items-center justify-center mx-auto mb-6"
                  >
                    <Icon
                      name={item.icon}
                      size={36}
                      color="var(--color-primary)"
                    />
                  </motion.div>

                  <h3 className="text-2xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-base">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </AnimatedSection>

        {/* Testimonials */}
        <AnimatedSection className="py-20 md:py-32 px-4 md:px-6 lg:px-8 bg-gradient-to-b from-background via-muted/20 to-background">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="inline-block mb-6 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium"
              >
                <span className="flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  >
                    <Icon name="Users" size={16} />
                  </motion.div>
                  Customer Success Stories
                </span>
              </motion.div>
              <AnimatedText
                as="h2"
                variant="fadeInUp"
                className="text-3xl md:text-4xl lg:text-6xl font-black text-foreground mb-6"
              >
                Trusted by{' '}
                <AnimatedGradientText>Leading Businesses</AnimatedGradientText>
              </AnimatedText>
              <AnimatedText
                as="p"
                variant="fadeInUp"
                delay={0.1}
                className="text-lg md:text-xl text-muted-foreground"
              >
                See what our customers say about CreditFlow Pro
              </AnimatedText>
            </div>

            <AnimatedGrid columns={3} gap={8} stagger={0.1}>
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -12, scale: 1.02 }}
                  transition={{ duration: 0.4 }}
                  className="relative bg-card/50 backdrop-blur-sm rounded-2xl p-8 border border-border hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 group overflow-hidden"
                >
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Quote icon background */}
                  <motion.div
                    initial={{ opacity: 0.05 }}
                    whileInView={{ opacity: 0.1 }}
                    transition={{ duration: 0.6 }}
                    className="absolute top-0 right-0 text-primary text-9xl font-serif leading-none pointer-events-none"
                  >
                    "
                  </motion.div>

                  {/* Corner glow */}
                  <div className="absolute top-0 left-0 w-20 h-20 bg-primary/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="relative z-10">
                    <motion.div
                      initial="initial"
                      whileInView="animate"
                      viewport={{ once: true }}
                      variants={staggerContainer}
                      className="flex gap-1 mb-6"
                    >
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <motion.div
                          key={i}
                          variants={{
                            initial: { scale: 0, rotate: -180 },
                            animate: { scale: 1, rotate: 0 },
                          }}
                          transition={{
                            delay: i * 0.1,
                            duration: 0.5,
                            type: 'spring',
                          }}
                        >
                          <Icon
                            name="Star"
                            size={20}
                            color="var(--color-warning)"
                            className="fill-current"
                          />
                        </motion.div>
                      ))}
                    </motion.div>

                    <p className="text-foreground mb-8 leading-relaxed text-lg">
                      <span className="text-primary font-serif text-2xl">
                        "
                      </span>
                      {testimonial.quote}
                      <span className="text-primary font-serif text-2xl">
                        "
                      </span>
                    </p>

                    <div className="flex items-center gap-4 pt-6 border-t border-border/50">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.3 }}
                        className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground font-bold text-lg shadow-lg"
                      >
                        {testimonial.name
                          .split(' ')
                          .map(n => n[0])
                          .join('')}
                      </motion.div>
                      <div>
                        <p className="font-bold text-foreground text-lg group-hover:text-primary transition-colors">
                          {testimonial.name}
                        </p>
                        <p className="text-sm text-muted-foreground font-medium">
                          {testimonial.company}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatedGrid>
          </div>
        </AnimatedSection>

        {/* CTA Section */}
        <AnimatedSection className="relative py-20 md:py-32 px-4 md:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative bg-gradient-to-br from-primary via-blue-600 to-secondary rounded-3xl p-8 md:p-12 lg:p-20 text-center text-white overflow-hidden shadow-2xl"
            >
              {/* Animated background patterns */}
              <div className="absolute inset-0 opacity-10">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 50,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                  className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/20 to-transparent"
                />
                <FloatingElement yOffset={20} duration={4} delay={0}>
                  <div className="absolute top-10 right-10 w-32 h-32 border-4 border-white/20 rounded-full" />
                </FloatingElement>
                <FloatingElement yOffset={30} duration={5} delay={0.5}>
                  <div className="absolute bottom-10 left-10 w-48 h-48 border-4 border-white/20 rounded-full" />
                </FloatingElement>
                <PulsingElement>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
                </PulsingElement>
              </div>

              <div className="relative z-10">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="inline-block mb-6 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30"
                >
                  <span className="text-sm font-medium flex items-center gap-2">
                    <motion.div
                      animate={{
                        rotate: [0, 15, -15, 0],
                        scale: [1, 1.2, 1.2, 1],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Icon name="Sparkles" size={16} />
                    </motion.div>
                    Limited Time Offer
                  </span>
                </motion.div>

                <AnimatedText
                  as="h2"
                  variant="fadeInUp"
                  delay={0.3}
                  className="text-3xl md:text-4xl lg:text-6xl font-bold mb-6 leading-tight"
                >
                  Ready to Transform Your Credit Management?
                </AnimatedText>

                <AnimatedText
                  as="p"
                  variant="fadeInUp"
                  delay={0.4}
                  className="text-lg md:text-xl lg:text-2xl mb-10 opacity-95 max-w-3xl mx-auto leading-relaxed"
                >
                  Join 5,000+ businesses already using CreditFlow Pro to reduce
                  bad debt and improve cash flow.
                </AnimatedText>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                  <motion.div
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant="secondary"
                      size="xl"
                      onClick={() => navigate('/register')}
                      iconName="Rocket"
                      iconPosition="left"
                      className="bg-white text-primary hover:bg-white/90 shadow-2xl hover:shadow-white/20 transition-all duration-300"
                    >
                      Start Free Trial
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant="outline"
                      size="xl"
                      className="border-2 border-white text-white hover:bg-white/20 transition-all duration-300"
                      onClick={() => navigate('/login')}
                    >
                      Sign In
                    </Button>
                  </motion.div>
                </motion.div>

                <motion.div
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true }}
                  variants={staggerContainer}
                  className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm"
                >
                  {[
                    { icon: 'Check', text: '5,000+ Happy Customers' },
                    { icon: 'Check', text: '₹450Cr+ Credit Managed' },
                    { icon: 'Check', text: '87% Collection Rate' },
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      variants={staggerItem}
                      className="flex items-center gap-2 opacity-90"
                    >
                      <motion.div
                        whileHover={{ scale: 1.3, rotate: 360 }}
                        transition={{ duration: 0.4 }}
                      >
                        <Icon name={item.icon} size={16} />
                      </motion.div>
                      <span>{item.text}</span>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          </div>
        </AnimatedSection>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="border-t border-border py-12 px-4 md:px-6 lg:px-8"
        >
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8"
            >
              {[
                {
                  title: 'Product',
                  links: ['Features', 'Pricing', 'Demo', 'API'],
                },
                {
                  title: 'Company',
                  links: ['About Us', 'Careers', 'Contact', 'Blog'],
                },
                {
                  title: 'Resources',
                  links: [
                    'Documentation',
                    'Help Center',
                    'Community',
                    'Partners',
                  ],
                },
                {
                  title: 'Legal',
                  links: [
                    'Privacy Policy',
                    'Terms of Service',
                    'Cookie Policy',
                    'GDPR',
                  ],
                },
              ].map((section, index) => (
                <motion.div key={index} variants={staggerItem}>
                  <h4 className="font-semibold text-foreground mb-4">
                    {section.title}
                  </h4>
                  <motion.ul
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                    className="space-y-2 text-sm text-muted-foreground"
                  >
                    {section.links.map((link, linkIndex) => (
                      <motion.li
                        key={linkIndex}
                        variants={staggerItem}
                        whileHover={{ x: 4, color: 'var(--color-primary)' }}
                        transition={{ duration: 0.2 }}
                        className="cursor-pointer"
                      >
                        {link}
                      </motion.li>
                    ))}
                  </motion.ul>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg"
                >
                  <Icon name="TrendingUp" size={18} color="#FFFFFF" />
                </motion.div>
                <span className="font-semibold text-foreground">
                  CreditFlow Pro
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                © 2026 CreditFlow Pro. All rights reserved.
              </p>
              <div className="flex items-center gap-4">
                {['Twitter', 'Linkedin', 'Github'].map((social, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.3, y: -4, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Icon
                      name={social}
                      size={20}
                      className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.footer>
      </div>
    </>
  )
}

export default Entry
