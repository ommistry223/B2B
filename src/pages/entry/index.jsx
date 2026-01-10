import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import Button from '../../components/ui/Button'
import Icon from '../../components/AppIcon'
import { useTheme } from '../../context/ThemeContext'

const Entry = () => {
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()

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
      gradient: 'from-cyan-500 to-blue-600',
    },
  ]

  const stats = [
    { value: '₹450Cr+', label: 'Credit Managed' },
    { value: '5,000+', label: 'Active Users' },
    { value: '87%', label: 'Collection Rate' },
    { value: '24/7', label: 'Support' },
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
      <div className="min-h-screen bg-background">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 md:h-20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <Icon name="TrendingUp" size={24} color="#FFFFFF" />
                </div>
                <span className="text-xl font-bold text-foreground">
                  CreditFlow Pro
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  iconName={theme === 'dark' ? 'Sun' : 'Moon'}
                  iconSize={20}
                  onClick={toggleTheme}
                  className="hidden md:flex"
                  aria-label={`Switch to ${
                    theme === 'dark' ? 'light' : 'dark'
                  } mode`}
                />
                <Button
                  variant="ghost"
                  onClick={() => navigate('/login')}
                  className="hidden md:flex"
                >
                  Sign In
                </Button>
                <Button
                  variant="default"
                  onClick={() => navigate('/register')}
                  iconName="ArrowRight"
                  iconPosition="right"
                >
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="pt-32 pb-20 md:pt-40 md:pb-32 px-4 md:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <Icon name="Sparkles" size={16} />
                AI-Powered Credit Management
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                Transform Your B2B Credit Management with{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                  Smart Analytics
                </span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
                Predict payment delays, automate reminders, and optimize cash
                flow with India's most advanced credit management platform for
                businesses.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  variant="default"
                  size="xl"
                  onClick={() => navigate('/register')}
                  iconName="Rocket"
                  iconPosition="left"
                >
                  Start Free Trial
                </Button>
                <Button
                  variant="outline"
                  size="xl"
                  iconName="Play"
                  iconPosition="left"
                >
                  Watch Demo
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-6">
                No credit card required • 14-day free trial • Cancel anytime
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mt-20">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="text-center p-6 rounded-lg bg-card border border-border"
                >
                  <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 md:py-32 px-4 md:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
                Everything You Need to Manage Credit
              </h2>
              <p className="text-lg text-muted-foreground">
                Powerful features designed to help you reduce bad debt, improve
                cash flow, and make smarter credit decisions.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-card rounded-xl p-6 md:p-8 border border-border hover:shadow-elevation-lg transition-smooth group"
                >
                  <div
                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-5 group-hover:scale-110 transition-smooth`}
                  >
                    <Icon name={feature.icon} size={28} color="#FFFFFF" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 md:py-32 px-4 md:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
                How It Works
              </h2>
              <p className="text-lg text-muted-foreground">
                Get started in minutes with our simple three-step process
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
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
                <div key={index} className="relative text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary text-primary-foreground text-2xl font-bold mb-6">
                    {item.step}
                  </div>
                  <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                    <Icon
                      name={item.icon}
                      size={32}
                      color="var(--color-primary)"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground">{item.description}</p>
                  {index < 2 && (
                    <div className="hidden md:block absolute top-10 left-full w-full">
                      <Icon
                        name="ArrowRight"
                        size={24}
                        color="var(--color-muted-foreground)"
                        className="mx-auto"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 md:py-32 px-4 md:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
                Trusted by Leading Businesses
              </h2>
              <p className="text-lg text-muted-foreground">
                See what our customers say about CreditFlow Pro
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-card rounded-xl p-6 md:p-8 border border-border"
                >
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Icon
                        key={i}
                        name="Star"
                        size={20}
                        color="var(--color-warning)"
                        className="fill-current"
                      />
                    ))}
                  </div>
                  <p className="text-foreground mb-6 leading-relaxed">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground font-medium">
                      {testimonial.name
                        .split(' ')
                        .map(n => n[0])
                        .join('')}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        {testimonial.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.company}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 md:py-32 px-4 md:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="bg-gradient-to-br from-primary to-secondary rounded-2xl p-8 md:p-12 lg:p-16 text-center text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-grid-white/10"></div>
              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                  Ready to Transform Your Credit Management?
                </h2>
                <p className="text-lg md:text-xl mb-8 opacity-90">
                  Join 5,000+ businesses already using CreditFlow Pro to reduce
                  bad debt and improve cash flow.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button
                    variant="secondary"
                    size="xl"
                    onClick={() => navigate('/register')}
                    iconName="Rocket"
                    iconPosition="left"
                    className="bg-white text-primary hover:bg-white/90"
                  >
                    Start Free Trial
                  </Button>
                  <Button
                    variant="outline"
                    size="xl"
                    className="border-white text-white hover:bg-white/10"
                    onClick={() => navigate('/login')}
                  >
                    Sign In
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border py-12 px-4 md:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
              <div>
                <h4 className="font-semibold text-foreground mb-4">Product</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>Features</li>
                  <li>Pricing</li>
                  <li>Demo</li>
                  <li>API</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-4">Company</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>About Us</li>
                  <li>Careers</li>
                  <li>Contact</li>
                  <li>Blog</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-4">
                  Resources
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>Documentation</li>
                  <li>Help Center</li>
                  <li>Community</li>
                  <li>Partners</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-4">Legal</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>Privacy Policy</li>
                  <li>Terms of Service</li>
                  <li>Cookie Policy</li>
                  <li>GDPR</li>
                </ul>
              </div>
            </div>
            <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <Icon name="TrendingUp" size={18} color="#FFFFFF" />
                </div>
                <span className="font-semibold text-foreground">
                  CreditFlow Pro
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                © 2026 CreditFlow Pro. All rights reserved.
              </p>
              <div className="flex items-center gap-4">
                <Icon
                  name="Twitter"
                  size={20}
                  className="text-muted-foreground hover:text-foreground cursor-pointer transition-smooth"
                />
                <Icon
                  name="Linkedin"
                  size={20}
                  className="text-muted-foreground hover:text-foreground cursor-pointer transition-smooth"
                />
                <Icon
                  name="Github"
                  size={20}
                  className="text-muted-foreground hover:text-foreground cursor-pointer transition-smooth"
                />
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}

export default Entry
