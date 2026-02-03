import React, { useState, useEffect } from 'react'
import Icon from '../../../components/AppIcon'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import Select from '../../../components/ui/Select'

const AddCustomerModal = ({ onClose, onSave, initialData = null, mode = 'add' }) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    gstNumber: '',
    creditLimit: '',
    paymentTerms: '30',
    address: '',
    city: '',
    state: '',
    pincode: '',
  })

  const [errors, setErrors] = useState({})
  const isEdit = mode === 'edit'

  useEffect(() => {
    if (!initialData) return

    setFormData({
      companyName: initialData?.companyName || initialData?.name || '',
      contactPerson: initialData?.contactPerson || '',
      email: initialData?.email || '',
      phone: initialData?.phone || '',
      gstNumber: initialData?.gstNumber || initialData?.gst || '',
      creditLimit:
        initialData?.creditLimit !== undefined
          ? String(initialData?.creditLimit)
          : '',
      paymentTerms:
        initialData?.paymentTerms !== undefined
          ? String(initialData?.paymentTerms)
          : '30',
      address: initialData?.address || '',
      city: initialData?.city || '',
      state: initialData?.state || '',
      pincode: initialData?.pincode || '',
    })
  }, [initialData])

  const paymentTermsOptions = [
    { value: '15', label: '15 Days' },
    { value: '30', label: '30 Days' },
    { value: '45', label: '45 Days' },
    { value: '60', label: '60 Days' },
    { value: '90', label: '90 Days' },
  ]

  const stateOptions = [
    { value: 'maharashtra', label: 'Maharashtra' },
    { value: 'gujarat', label: 'Gujarat' },
    { value: 'karnataka', label: 'Karnataka' },
    { value: 'delhi', label: 'Delhi' },
    { value: 'tamil-nadu', label: 'Tamil Nadu' },
  ]

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData?.companyName?.trim()) {
      newErrors.companyName = 'Company name is required'
    }

    if (!isEdit && !formData?.contactPerson?.trim()) {
      newErrors.contactPerson = 'Contact person is required'
    }

    if (formData?.email?.trim()) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/?.test(formData?.email)) {
        newErrors.email = 'Invalid email format'
      }
    } else if (!isEdit) {
      newErrors.email = 'Email is required'
    }

    if (formData?.phone?.trim()) {
      if (!/^[0-9]{10}$/?.test(formData?.phone?.replace(/\s/g, ''))) {
        newErrors.phone = 'Invalid phone number'
      }
    } else if (!isEdit) {
      newErrors.phone = 'Phone number is required'
    }

    if (formData?.gstNumber?.trim()) {
      if (
        !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/?.test(
          formData?.gstNumber
        )
      ) {
        newErrors.gstNumber = 'Invalid GST number format'
      }
    } else if (!isEdit) {
      newErrors.gstNumber = 'GST number is required'
    }

    if (!formData?.creditLimit && !isEdit) {
      newErrors.creditLimit = 'Credit limit is required'
    } else if (
      formData?.creditLimit &&
      parseFloat(formData?.creditLimit) < 0
    ) {
      newErrors.creditLimit = 'Credit limit must be 0 or greater'
    }

    setErrors(newErrors)
    return Object.keys(newErrors)?.length === 0
  }

  const handleSubmit = async e => {
    e?.preventDefault()
    if (validateForm()) {
      setIsSubmitting(true)
      try {
        await onSave(formData)
      } catch (error) {
        console.error('Error submitting form:', error)
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="bg-card rounded-lg shadow-elevation-xl border border-border w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Icon name="UserPlus" size={20} color="var(--color-primary)" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">
              {isEdit ? 'Edit Customer' : 'Add New Customer'}
            </h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            iconName="X"
            iconSize={20}
            onClick={onClose}
          />
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-4 md:p-6"
        >
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-4">
                Company Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Company Name"
                  type="text"
                  placeholder="Enter company name"
                  value={formData?.companyName}
                  onChange={e => handleChange('companyName', e?.target?.value)}
                  error={errors?.companyName}
                  required
                />

                <Input
                  label="GST Number"
                  type="text"
                  placeholder="22AAAAA0000A1Z5"
                  value={formData?.gstNumber}
                  onChange={e =>
                    handleChange('gstNumber', e?.target?.value?.toUpperCase())
                  }
                  error={errors?.gstNumber}
                  required
                />
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-foreground mb-4">
                Contact Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Contact Person"
                  type="text"
                  placeholder="Enter contact person name"
                  value={formData?.contactPerson}
                  onChange={e =>
                    handleChange('contactPerson', e?.target?.value)
                  }
                  error={errors?.contactPerson}
                  required
                />

                <Input
                  label="Email Address"
                  type="email"
                  placeholder="contact@company.com"
                  value={formData?.email}
                  onChange={e => handleChange('email', e?.target?.value)}
                  error={errors?.email}
                  required
                />

                <Input
                  label="Phone Number"
                  type="tel"
                  placeholder="9876543210"
                  value={formData?.phone}
                  onChange={e => handleChange('phone', e?.target?.value)}
                  error={errors?.phone}
                  required
                />
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-foreground mb-4">
                Credit Terms
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Credit Limit (₹)"
                  type="number"
                  placeholder="Enter credit limit"
                  value={formData?.creditLimit}
                  onChange={e => handleChange('creditLimit', e?.target?.value)}
                  error={errors?.creditLimit}
                  required
                />

                <Select
                  label="Payment Terms"
                  options={paymentTermsOptions}
                  value={formData?.paymentTerms}
                  onChange={value => handleChange('paymentTerms', value)}
                  required
                />
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-foreground mb-4">
                Address
              </h3>
              <div className="space-y-4">
                <Input
                  label="Street Address"
                  type="text"
                  placeholder="Enter street address"
                  value={formData?.address}
                  onChange={e => handleChange('address', e?.target?.value)}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    label="City"
                    type="text"
                    placeholder="Enter city"
                    value={formData?.city}
                    onChange={e => handleChange('city', e?.target?.value)}
                  />

                  <Select
                    label="State"
                    options={stateOptions}
                    value={formData?.state}
                    onChange={value => handleChange('state', value)}
                    placeholder="Select state"
                  />

                  <Input
                    label="Pincode"
                    type="text"
                    placeholder="400001"
                    value={formData?.pincode}
                    onChange={e => handleChange('pincode', e?.target?.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </form>

        <div className="flex items-center justify-end gap-3 p-4 md:p-6 border-t border-border">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            variant="default"
            iconName="Check"
            iconPosition="left"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : isEdit ? 'Update Customer' : 'Add Customer'}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default AddCustomerModal
