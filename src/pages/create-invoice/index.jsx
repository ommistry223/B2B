import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Header from '../../components/navigation/Header'
import QuickActionToolbar from '../../components/navigation/QuickActionToolbar'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Icon from '../../components/AppIcon'
import CustomerSelector from './components/CustomerSelector'
import CreditLimitWarning from './components/CreditLimitWarning'
import LineItemTable from './components/LineItemTable'
import InvoiceSummary from './components/InvoiceSummary'
import PaymentTermsSection from './components/PaymentTermsSection'
import ReminderSettings from './components/ReminderSettings'
import OcrModal from './components/OcrModal'
import { useData } from '../../context/DataContext'

const CreateInvoice = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { customers, addInvoice, invoices, updateInvoice } = useData()
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showOcrModal, setShowOcrModal] = useState(false)

  // Check if we're editing an existing invoice
  const editInvoice = location.state?.editInvoice
  const isEditMode = !!editInvoice

  const [formData, setFormData] = useState({
    selectedCustomer: null,
    invoiceNumber: `INV-2026-${String(
      Math.floor(Math.random() * 10000)
    ).padStart(4, '0')}`,
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    paymentTerms: '30',
    gstRate: 18,
    items: [{ id: 1, description: '', quantity: 0, rate: 0 }],
    isRecurring: false,
    recurringFrequency: 'monthly',
    reminderChannels: {
      whatsapp: true,
      sms: false,
      email: true,
    },
    reminderTiming: ['before_3', 'on_due', 'after_1'],
    notes: '',
  })

  const [errors, setErrors] = useState({})

  const normalizeDateValue = value => {
    if (!value) return ''
    if (value instanceof Date) {
      return value.toISOString().split('T')[0]
    }
    const raw = String(value).trim()
    if (!raw) return ''
    if (/^\d{4}-\d{2}-\d{2}/.test(raw)) {
      return raw.slice(0, 10)
    }
    if (/^\d{2}-\d{2}-\d{4}$/.test(raw)) {
      const [day, month, year] = raw.split('-')
      return `${year}-${month}-${day}`
    }
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(raw)) {
      const [day, month, year] = raw.split('/')
      return `${year}-${month}-${day}`
    }
    if (/^\d{8}$/.test(raw)) {
      return `${raw.slice(0, 4)}-${raw.slice(4, 6)}-${raw.slice(6, 8)}`
    }
    const parsed = new Date(raw)
    if (Number.isNaN(parsed.getTime())) return ''
    return parsed.toISOString().split('T')[0]
  }

  // Initialize form data with edit invoice if in edit mode
  useEffect(() => {
    if (isEditMode && editInvoice) {
      console.log('📝 Edit mode - Invoice data:', editInvoice)
      console.log(
        '📝 Invoice ID:',
        editInvoice.id,
        'Type:',
        typeof editInvoice.id
      )
      const customer = customers.find(c => c.id === editInvoice.customerId)
      const normalizedInvoiceDate = normalizeDateValue(
        editInvoice.invoiceDate || editInvoice.createdAt?.split('T')[0]
      )
      const normalizedDueDate =
        normalizeDateValue(editInvoice.dueDate) || normalizedInvoiceDate

      setFormData({
        selectedCustomer: customer || null,
        invoiceNumber: editInvoice.invoiceNumber,
        invoiceDate: normalizedInvoiceDate,
        dueDate: normalizedDueDate,
        paymentTerms: 'custom',
        gstRate: 18,
        items: editInvoice.items || [
          { id: 1, description: '', quantity: 0, rate: 0 },
        ],
        isRecurring: false,
        recurringFrequency: 'monthly',
        reminderChannels: {
          whatsapp: true,
          sms: false,
          email: true,
        },
        reminderTiming: ['before_3', 'on_due', 'after_1'],
        notes: editInvoice.notes || '',
      })
    } else if (!isEditMode) {
      // Reset form when not in edit mode
      setFormData({
        selectedCustomer: null,
        invoiceNumber: `INV-2026-${String(
          Math.floor(Math.random() * 10000)
        ).padStart(4, '0')}`,
        invoiceDate: new Date().toISOString().split('T')[0],
        dueDate: '',
        paymentTerms: '30',
        gstRate: 18,
        items: [{ id: 1, description: '', quantity: 0, rate: 0 }],
        isRecurring: false,
        recurringFrequency: 'monthly',
        reminderChannels: {
          whatsapp: true,
          sms: false,
          email: true,
        },
        reminderTiming: ['before_3', 'on_due', 'after_1'],
        notes: '',
      })
    }
  }, [isEditMode, editInvoice?.id, customers])

  // Generate unique invoice number based on existing invoices
  useEffect(() => {
    if (!isEditMode && invoices && invoices.length > 0) {
      const latestInvoiceNum = Math.max(
        ...invoices.map(inv => {
          const match = inv.invoiceNumber.match(/INV-2026-(\d+)/)
          return match ? parseInt(match[1]) : 0
        })
      )
      setFormData(prev => ({
        ...prev,
        invoiceNumber: `INV-2026-${String(latestInvoiceNum + 1).padStart(
          4,
          '0'
        )}`,
      }))
    }
  }, [invoices])

  useEffect(() => {
    if (formData?.invoiceDate && formData?.paymentTerms !== 'custom') {
      const invoiceDate = new Date(formData.invoiceDate)
      const daysToAdd = parseInt(formData?.paymentTerms)
      const dueDate = new Date(invoiceDate)
      dueDate?.setDate(dueDate?.getDate() + daysToAdd)
      setFormData(prev => ({
        ...prev,
        dueDate: dueDate?.toISOString()?.split('T')?.[0],
      }))
    }
  }, [formData?.invoiceDate, formData?.paymentTerms])

  const gstRateOptions = [
    { value: '0', label: 'Non-GST (0%)' },
    { value: '5', label: 'GST 5%' },
    { value: '12', label: 'GST 12%' },
    { value: '18', label: 'GST 18%' },
    { value: '28', label: 'GST 28%' },
  ]

  const handleAddItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [
        ...prev?.items,
        { id: Date.now(), description: '', quantity: 0, rate: 0 },
      ],
    }))
  }

  const handleRemoveItem = index => {
    setFormData(prev => ({
      ...prev,
      items: prev?.items?.filter((_, i) => i !== index),
    }))
  }

  const handleUpdateItem = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      items: prev?.items?.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }))
  }

  const calculateInvoiceTotal = () => {
    const subtotal = formData?.items?.reduce(
      (sum, item) => sum + item?.quantity * item?.rate,
      0
    )
    const taxAmount = (subtotal * formData?.gstRate) / 100
    return subtotal + taxAmount
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData?.selectedCustomer) {
      newErrors.customer = 'Please select a customer'
    }

    if (!formData?.invoiceDate) {
      newErrors.invoiceDate = 'Invoice date is required'
    }

    if (!formData?.dueDate) {
      newErrors.dueDate = 'Due date is required'
    }

    const hasValidItems = formData?.items?.some(
      item => item?.description?.trim() && item?.quantity > 0 && item?.rate > 0
    )

    if (!hasValidItems) {
      newErrors.items = 'Please add at least one valid line item'
    }

    setErrors(newErrors)
    return Object.keys(newErrors)?.length === 0
  }

  const handleSaveDraft = async () => {
    if (!validateForm()) return

    setIsSaving(true)
    setErrors(prev => ({ ...prev, submit: '' }))

    // Create invoice object
    const invoiceData = {
      invoiceNumber: formData.invoiceNumber,
      customerId: formData.selectedCustomer.id,
      customerName: formData.selectedCustomer.name,
      amount: calculateInvoiceTotal(),
      dueDate: formData.dueDate,
      items: formData.items.filter(
        item => item.description && item.quantity > 0
      ),
      notes: formData.notes,
      status: 'pending',
    }

    let result
    if (isEditMode) {
      const invoiceId =
        typeof editInvoice.id === 'object' ? editInvoice.id?.id : editInvoice.id
      console.log('🔄 Updating invoice:', invoiceId, 'with data:', invoiceData)
      result = await updateInvoice(invoiceId, invoiceData)
    } else {
      console.log('➕ Creating new invoice:', invoiceData)
      result = await addInvoice(invoiceData)
    }

    if (!result?.success) {
      setErrors(prev => ({
        ...prev,
        submit: result?.error || 'Failed to save invoice. Please try again.',
      }))
      setIsSaving(false)
      return
    }

    setTimeout(() => {
      setIsSaving(false)
      setShowSuccessModal(true)
      setTimeout(() => {
        navigate('/invoice-management')
      }, 2000)
    }, 1500)
  }

  const handleSaveAndSend = async () => {
    if (!validateForm()) return

    setIsSaving(true)
    setErrors(prev => ({ ...prev, submit: '' }))

    // Create invoice object
    const invoiceData = {
      invoiceNumber: formData.invoiceNumber,
      customerId: formData.selectedCustomer.id,
      customerName: formData.selectedCustomer.name,
      amount: calculateInvoiceTotal(),
      dueDate: formData.dueDate,
      items: formData.items.filter(
        item => item.description && item.quantity > 0
      ),
      notes: formData.notes,
      status: 'sent',
    }

    let result
    if (isEditMode) {
      const invoiceId =
        typeof editInvoice.id === 'object' ? editInvoice.id?.id : editInvoice.id
      console.log('🔄 Updating invoice:', invoiceId, 'with data:', invoiceData)
      result = await updateInvoice(invoiceId, invoiceData)
    } else {
      console.log('➕ Creating new invoice:', invoiceData)
      result = await addInvoice(invoiceData)
    }

    if (!result?.success) {
      setErrors(prev => ({
        ...prev,
        submit: result?.error || 'Failed to save invoice. Please try again.',
      }))
      setIsSaving(false)
      return
    }

    setTimeout(() => {
      setIsSaving(false)
      setShowSuccessModal(true)
      setTimeout(() => {
        navigate('/invoice-management')
      }, 2000)
    }, 1500)
  }

  const handleOpenOcr = () => {
    setShowOcrModal(true)
  }

  return (
    <div className="page-shell">
      <Header />
      <main className="page-content pt-20 pb-8 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 md:mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    iconName="ArrowLeft"
                    iconSize={20}
                    onClick={() => navigate('/invoice-management')}
                  />
                  <h1 className="page-title">
                    {isEditMode ? 'Edit Invoice' : 'Create Invoice'}
                  </h1>
                </div>
                <p className="page-subtitle ml-12 md:ml-14">
                  {isEditMode
                    ? 'Update invoice details and save changes'
                    : 'Generate new invoice with GST compliance and automated credit validation'}
                </p>
              </div>
              <div className="flex items-center gap-2 ml-12 md:ml-0">
                <Button
                  variant="outline"
                  iconName="Scan"
                  iconPosition="left"
                  iconSize={18}
                  onClick={handleOpenOcr}
                >
                  Scan Invoice
                </Button>
                <Button
                  variant="outline"
                  iconName="Save"
                  iconPosition="left"
                  iconSize={18}
                  onClick={handleSaveDraft}
                  loading={isSaving}
                  disabled={isSaving}
                >
                  {isEditMode ? 'Update' : 'Save Draft'}
                </Button>
                <Button
                  variant="default"
                  iconName="Send"
                  iconPosition="left"
                  iconSize={18}
                  onClick={handleSaveAndSend}
                  loading={isSaving}
                  disabled={isSaving}
                >
                  {isEditMode ? 'Update & Send' : 'Save & Send'}
                </Button>
              </div>
            </div>
          </div>

          {errors?.submit && (
            <div className="mb-4 rounded-xl border border-error/20 bg-error/10 px-4 py-3 text-sm text-error">
              {errors?.submit}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-card rounded-lg shadow-elevation-sm p-4 md:p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4 md:mb-6">
                  Invoice Details
                </h2>

                <div className="space-y-4 md:space-y-6">
                  <CustomerSelector
                    customers={customers}
                    selectedCustomer={formData?.selectedCustomer}
                    onSelectCustomer={customer =>
                      setFormData(prev => ({
                        ...prev,
                        selectedCustomer: customer,
                      }))
                    }
                    error={errors?.customer}
                  />

                  {formData?.selectedCustomer && (
                    <CreditLimitWarning
                      customer={formData?.selectedCustomer}
                      invoiceAmount={calculateInvoiceTotal()}
                    />
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      type="text"
                      label="Invoice Number"
                      value={formData?.invoiceNumber}
                      onChange={e =>
                        setFormData(prev => ({
                          ...prev,
                          invoiceNumber: e?.target?.value,
                        }))
                      }
                      required
                      disabled
                    />

                    <Input
                      type="date"
                      label="Invoice Date"
                      value={formData?.invoiceDate}
                      onChange={e =>
                        setFormData(prev => ({
                          ...prev,
                          invoiceDate: e?.target?.value,
                        }))
                      }
                      error={errors?.invoiceDate}
                      required
                    />
                  </div>

                  <Select
                    label="GST Rate"
                    description="Select applicable GST rate"
                    options={gstRateOptions}
                    value={String(formData?.gstRate)}
                    onChange={value =>
                      setFormData(prev => ({
                        ...prev,
                        gstRate: parseFloat(value),
                      }))
                    }
                  />
                </div>
              </div>

              <div className="bg-card rounded-lg shadow-elevation-sm p-4 md:p-6">
                <LineItemTable
                  items={formData?.items}
                  onUpdateItem={handleUpdateItem}
                  onAddItem={handleAddItem}
                  onRemoveItem={handleRemoveItem}
                  gstRate={formData?.gstRate}
                />
                {errors?.items && (
                  <p className="mt-2 text-sm text-error">{errors?.items}</p>
                )}
              </div>

              <div className="bg-card rounded-lg shadow-elevation-sm p-4 md:p-6">
                <PaymentTermsSection
                  paymentTerms={formData?.paymentTerms}
                  onPaymentTermsChange={value =>
                    setFormData(prev => ({ ...prev, paymentTerms: value }))
                  }
                  dueDate={formData?.dueDate}
                  onDueDateChange={value =>
                    setFormData(prev => ({ ...prev, dueDate: value }))
                  }
                  isRecurring={formData?.isRecurring}
                  onRecurringChange={value =>
                    setFormData(prev => ({ ...prev, isRecurring: value }))
                  }
                  recurringFrequency={formData?.recurringFrequency}
                  onRecurringFrequencyChange={value =>
                    setFormData(prev => ({
                      ...prev,
                      recurringFrequency: value,
                    }))
                  }
                />
              </div>

              <div className="bg-card rounded-lg shadow-elevation-sm p-4 md:p-6">
                <ReminderSettings
                  reminderChannels={formData?.reminderChannels}
                  onReminderChannelsChange={(channel, value) =>
                    setFormData(prev => ({
                      ...prev,
                      reminderChannels: {
                        ...prev?.reminderChannels,
                        [channel]: value,
                      },
                    }))
                  }
                  reminderTiming={formData?.reminderTiming}
                  onReminderTimingChange={value =>
                    setFormData(prev => ({ ...prev, reminderTiming: value }))
                  }
                />
              </div>

              <div className="bg-card rounded-lg shadow-elevation-sm p-4 md:p-6">
                <h3 className="text-base font-semibold text-foreground mb-4">
                  Additional Notes
                </h3>
                <textarea
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-smooth resize-none"
                  rows="4"
                  placeholder="Add any additional notes or terms for this invoice..."
                  value={formData?.notes}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, notes: e?.target?.value }))
                  }
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-card rounded-lg shadow-elevation-sm p-4 md:p-6 sticky top-24">
                <InvoiceSummary
                  items={formData?.items}
                  gstRate={formData?.gstRate}
                />

                <div className="mt-6 pt-6 border-t border-border space-y-3">
                  <Button
                    variant="default"
                    fullWidth
                    iconName="Send"
                    iconPosition="left"
                    iconSize={18}
                    onClick={handleSaveAndSend}
                    loading={isSaving}
                    disabled={isSaving}
                  >
                    Save & Send Invoice
                  </Button>
                  <Button
                    variant="outline"
                    fullWidth
                    iconName="Save"
                    iconPosition="left"
                    iconSize={18}
                    onClick={handleSaveDraft}
                    loading={isSaving}
                    disabled={isSaving}
                  >
                    Save as Draft
                  </Button>
                  <Button
                    variant="ghost"
                    fullWidth
                    iconName="X"
                    iconPosition="left"
                    iconSize={18}
                    onClick={() => navigate('/invoice-management')}
                    disabled={isSaving}
                  >
                    Cancel
                  </Button>
                </div>
              </div>

              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <div className="flex gap-3">
                  <Icon
                    name="Lightbulb"
                    size={20}
                    color="var(--color-primary)"
                    className="flex-shrink-0 mt-0.5"
                  />
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-2">
                      Quick Tips
                    </h4>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• Double-check GST numbers for compliance</li>
                      <li>• Set payment terms based on customer history</li>
                      <li>• Enable WhatsApp reminders for faster responses</li>
                      <li>• Review credit limits before finalizing</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <QuickActionToolbar />
      {showOcrModal && (
        <OcrModal
          ocrUrl={import.meta.env.VITE_OCR_URL}
          onClose={() => setShowOcrModal(false)}
        />
      )}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="bg-card rounded-lg shadow-elevation-xl p-6 md:p-8 max-w-md w-full mx-4 animate-in fade-in zoom-in duration-300">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mb-4">
                <Icon
                  name="CheckCircle2"
                  size={32}
                  color="var(--color-success)"
                />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Invoice Created Successfully!
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Invoice {formData?.invoiceNumber} has been created and will be
                sent to {formData?.selectedCustomer?.name}
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Icon
                  name="Loader2"
                  size={16}
                  color="var(--color-muted-foreground)"
                  className="animate-spin"
                />
                <span>Redirecting to invoice management...</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CreateInvoice
