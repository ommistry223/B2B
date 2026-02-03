import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { Checkbox } from '../../components/ui/Checkbox'
import Icon from '../../components/AppIcon'
import { useUser } from '../../context/UserContext'

const Register = () => {
  const navigate = useNavigate()
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

    if (!formData.companyName) {
      newErrors.companyName = 'Company name is required'
    }

    if (!formData.fullName) {
      newErrors.fullName = 'Full name is required'
    }

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
      newErrors.password =
        'Password must contain uppercase, lowercase, and number'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    if (
      formData.gstNumber &&
      !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(
        formData.gstNumber
      )
    ) {
      newErrors.gstNumber = 'Please enter a valid GST number'
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the terms and conditions'
    }

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
        navigate('/dashboard')
      } else {
        setErrors({
          email: result.error || 'Registration failed. Please try again.',
        })
      }
    } catch (error) {
      setErrors({
        email: 'An error occurred. Please try again.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Helmet>
        <title>Create Account - CreditFlow Pro</title>
      </Helmet>
      <div className="page-shell flex items-center justify-center p-4 py-12">
        <div className="page-content w-full max-w-2xl">
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-secondary mb-4">
              <Icon name="TrendingUp" size={32} color="#FFFFFF" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Create Your Account
            </h1>
            <p className="text-muted-foreground">
              Start managing your credit and cash flow efficiently
            </p>
          </div>

          {/* Registration Card */}
          <div className="bg-card rounded-lg p-6 md:p-8 shadow-elevation-lg border border-border">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Company Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Icon name="Building2" size={20} />
                  Company Information
                </h3>
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
                    onChange={e =>
                      handleChange('gstNumber', e.target.value.toUpperCase())
                    }
                    error={errors.gstNumber}
                  />
                </div>
              </div>

              {/* Personal Information */}
              <div className="space-y-4 pt-4 border-t border-border">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Icon name="User" size={20} />
                  Personal Information
                </h3>
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

              {/* Security */}
              <div className="space-y-4 pt-4 border-t border-border">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Icon name="Lock" size={20} />
                  Security
                </h3>
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
                    description="Must be 8+ characters with uppercase, lowercase, and number"
                  />
                  <Input
                    type="password"
                    label="Confirm Password"
                    placeholder="Confirm password"
                    value={formData.confirmPassword}
                    onChange={e =>
                      handleChange('confirmPassword', e.target.value)
                    }
                    error={errors.confirmPassword}
                    required
                    autoComplete="new-password"
                  />
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="pt-4 border-t border-border">
                <Checkbox
                  id="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={e => handleChange('acceptTerms', e.target.checked)}
                  error={errors.acceptTerms}
                  label={
                    <span className="text-sm">
                      I agree to the{' '}
                      <Link
                        to="/terms"
                        className="text-primary hover:text-primary/80 font-medium"
                      >
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link
                        to="/privacy"
                        className="text-primary hover:text-primary/80 font-medium"
                      >
                        Privacy Policy
                      </Link>
                    </span>
                  }
                />
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

            {/* Features */}
            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground mb-3">
                What you'll get:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  'AI-powered credit risk analysis',
                  'Automated payment reminders',
                  'Real-time cash flow tracking',
                  'GST-compliant invoicing',
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Icon
                      name="CheckCircle2"
                      size={16}
                      color="var(--color-success)"
                    />
                    <span className="text-sm text-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sign In Link */}
          <p className="text-center mt-6 text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium text-primary hover:text-primary/80 transition-smooth"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </>
  )
}

export default Register
