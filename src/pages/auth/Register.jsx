import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { Checkbox } from '../../components/ui/Checkbox'
import Icon from '../../components/AppIcon'
import { useUser } from '../../context/UserContext'

const Register = () => {
  const { register } = useUser()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    companyName: '',
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    gstNumber: '',
    acceptTerms: false,
  })
  const [errors, setErrors] = useState({})

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.companyName) newErrors.companyName = 'Company name is required'
    if (!formData.fullName) newErrors.fullName = 'Full name is required'
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required'
    } else if (!/^[0-9]{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number'
    }
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number'
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    if (
      formData.gstNumber &&
      !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(formData.gstNumber)
    ) {
      newErrors.gstNumber = 'Please enter a valid GST number'
    }
    if (!formData.acceptTerms) newErrors.acceptTerms = 'You must accept the terms and conditions'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!validateForm()) return
    setIsLoading(true)
    try {
      const userData = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        businessName: formData.companyName,
        password: formData.password,
      }
      const result = await register(userData)
      if (result.success) {
        window.location.replace('/dashboard')
      } else {
        setErrors({ email: result.error || 'Registration failed. Please try again.' })
      }
    } catch (error) {
      setErrors({ email: 'An error occurred. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Helmet>
        <title>Create Account - CreditFlow Pro</title>
      </Helmet>
      <div className="min-h-screen flex">
        {/* Left Brand Panel — desktop only */}
        <div className="hidden lg:flex lg:w-[38%] xl:w-[35%] flex-col justify-between bg-primary p-12 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center">
              <Icon name="TrendingUp" size={20} color="#FFFFFF" />
            </div>
            <span className="text-white font-bold text-lg tracking-tight" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              CreditFlow Pro
            </span>
          </div>
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-white leading-tight mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Join thousands of B2B businesses
              </h2>
              <p className="text-white/70 text-base leading-relaxed">
                Get started in minutes. No credit card required.
              </p>
            </div>
            <div className="space-y-3">
              {[
                'AI-powered credit risk analysis',
                'Automated payment reminders',
                'Real-time cash flow tracking',
                'GST-compliant invoicing',
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                    <Icon name="Check" size={12} color="#FFFFFF" />
                  </div>
                  <span className="text-white/85 text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>
          <p className="text-white/40 text-xs">© 2024 CreditFlow Pro. All rights reserved.</p>
        </div>

        {/* Right Form Panel */}
        <div className="flex-1 bg-background overflow-y-auto">
          <div className="min-h-full flex items-start justify-center p-6 sm:p-10 py-10">
            <div className="w-full max-w-xl">
              {/* Mobile Logo */}
              <div className="flex items-center gap-2.5 mb-8 lg:hidden">
                <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
                  <Icon name="TrendingUp" size={20} color="#FFFFFF" />
                </div>
                <span className="font-bold text-lg text-foreground tracking-tight" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  CreditFlow Pro
                </span>
              </div>

              <div className="mb-7">
                <h1 className="text-2xl font-bold text-foreground mb-1.5">Create your account</h1>
                <p className="text-muted-foreground text-sm">Start managing your credit and cash flow efficiently</p>
              </div>

              <div className="bg-card rounded-xl border border-border shadow-elevation-sm p-6 md:p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Company Information */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Icon name="Building2" size={16} color="var(--color-muted-foreground)" />
                      <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Company Information</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Company Name"
                        placeholder="Your Company Pvt Ltd"
                        value={formData.companyName}
                        onChange={e => handleChange('companyName', e.target.value)}
                        error={errors.companyName}
                        required
                      />
                      <Input
                        label="GST Number (Optional)"
                        placeholder="27AABCU9603R1ZM"
                        value={formData.gstNumber}
                        onChange={e => handleChange('gstNumber', e.target.value.toUpperCase())}
                        error={errors.gstNumber}
                      />
                    </div>
                  </div>

                  {/* Personal Information */}
                  <div className="pt-2 border-t border-border">
                    <div className="flex items-center gap-2 mb-4 mt-4">
                      <Icon name="User" size={16} color="var(--color-muted-foreground)" />
                      <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Personal Information</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          label="Full Name"
                          placeholder="John Doe"
                          value={formData.fullName}
                          onChange={e => handleChange('fullName', e.target.value)}
                          error={errors.fullName}
                          required
                        />
                        <Input
                          type="tel"
                          label="Phone Number"
                          placeholder="+91 98765 43210"
                          value={formData.phone}
                          onChange={e => handleChange('phone', e.target.value)}
                          error={errors.phone}
                          required
                        />
                      </div>
                      <Input
                        type="email"
                        label="Email Address"
                        placeholder="you@company.com"
                        value={formData.email}
                        onChange={e => handleChange('email', e.target.value)}
                        error={errors.email}
                        required
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  {/* Security */}
                  <div className="pt-2 border-t border-border">
                    <div className="flex items-center gap-2 mb-4 mt-4">
                      <Icon name="Lock" size={16} color="var(--color-muted-foreground)" />
                      <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Security</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        type="password"
                        label="Password"
                        placeholder="Enter password"
                        value={formData.password}
                        onChange={e => handleChange('password', e.target.value)}
                        error={errors.password}
                        required
                        autoComplete="new-password"
                        description="8+ chars with uppercase, lowercase & number"
                      />
                      <Input
                        type="password"
                        label="Confirm Password"
                        placeholder="Confirm password"
                        value={formData.confirmPassword}
                        onChange={e => handleChange('confirmPassword', e.target.value)}
                        error={errors.confirmPassword}
                        required
                        autoComplete="new-password"
                      />
                    </div>
                  </div>

                  {/* Terms */}
                  <div className="pt-2 border-t border-border">
                    <div className="mt-4">
                      <Checkbox
                        id="acceptTerms"
                        checked={formData.acceptTerms}
                        onChange={e => handleChange('acceptTerms', e.target.checked)}
                        error={errors.acceptTerms}
                        label={
                          <span className="text-sm text-muted-foreground">
                            I agree to the{' '}
                            <Link to="/terms" className="text-primary hover:text-primary/80 font-medium">Terms of Service</Link>
                            {' '}and{' '}
                            <Link to="/privacy" className="text-primary hover:text-primary/80 font-medium">Privacy Policy</Link>
                          </span>
                        }
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    variant="default"
                    fullWidth
                    size="lg"
                    loading={isLoading}
                    disabled={isLoading}
                    iconName="UserPlus"
                    iconPosition="left"
                  >
                    Create Account
                  </Button>
                </form>
              </div>

              <p className="text-center mt-6 text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-primary hover:text-primary/80 transition-smooth">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Register
