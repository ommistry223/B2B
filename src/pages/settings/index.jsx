import React, { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'
import Header from '../../components/navigation/Header'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import { Checkbox } from '../../components/ui/Checkbox'
import Icon from '../../components/AppIcon'
import { useUser } from '../../context/UserContext'
import ChangePasswordModal from '../../components/modals/ChangePasswordModal'

const Settings = () => {
  const navigate = useNavigate()
  const { user, logout } = useUser()
  const [activeTab, setActiveTab] = useState('general')
  const [isSaving, setIsSaving] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  const [generalSettings, setGeneralSettings] = useState({
    companyName: user?.companyName || user?.name || '',
    gstNumber: '',
    address: '',
    phone: user?.phone || '',
    email: user?.email || '',
    website: '',
    currency: 'INR',
    timezone: 'Asia/Kolkata',
    dateFormat: 'DD/MM/YYYY',
  })

  const [invoiceSettings, setInvoiceSettings] = useState({
    invoicePrefix: 'INV',
    nextInvoiceNumber: '2026-101',
    defaultPaymentTerms: '30',
    defaultGSTRate: '18',
    showBankDetails: true,
    autoSendInvoice: false,
    includeTerms: true,
    termsText:
      'Payment due within 30 days. Late payments subject to 2% monthly interest.',
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    whatsappNotifications: true,
    invoiceCreated: true,
    paymentReceived: true,
    paymentOverdue: true,
    creditLimitExceeded: true,
    dailyDigest: false,
    weeklyReport: true,
  })

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: '30',
    passwordExpiry: '90',
    allowMultipleSessions: true,
  })

  const tabs = [
    { id: 'general', label: 'General', icon: 'Settings' },
    { id: 'invoice', label: 'Invoice', icon: 'FileText' },
    { id: 'notifications', label: 'Notifications', icon: 'Bell' },
    { id: 'security', label: 'Security', icon: 'Shield' },
    { id: 'integrations', label: 'Integrations', icon: 'Plug' },
  ]

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      setToastMessage('Settings saved successfully!')
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
    }, 1500)
  }

  const handleChangePassword = passwordData => {
    setShowPasswordModal(false)
    setToastMessage('Password changed successfully!')
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const handleSignOutAllDevices = () => {
    // In a real app, this would invalidate all sessions
    setToastMessage('Signed out from all devices successfully!')
    setShowToast(true)
    setTimeout(() => {
      setShowToast(false)
      logout()
      navigate('/login')
    }, 2000)
  }

  const handleDeleteAccount = () => {
    if (
      window.confirm(
        'Are you sure you want to delete your account? This action cannot be undone.'
      )
    ) {
      // In a real app, this would delete the account
      localStorage.clear()
      navigate('/register')
    }
  }

  const currencyOptions = [
    { value: 'INR', label: '₹ Indian Rupee (INR)' },
    { value: 'USD', label: '$ US Dollar (USD)' },
    { value: 'EUR', label: '€ Euro (EUR)' },
    { value: 'GBP', label: '£ British Pound (GBP)' },
  ]

  const timezoneOptions = [
    { value: 'Asia/Kolkata', label: 'Asia/Kolkata (IST)' },
    { value: 'America/New_York', label: 'America/New_York (EST)' },
    { value: 'Europe/London', label: 'Europe/London (GMT)' },
    { value: 'Asia/Singapore', label: 'Asia/Singapore (SGT)' },
  ]

  const paymentTermsOptions = [
    { value: '0', label: 'Immediate' },
    { value: '7', label: '7 Days' },
    { value: '15', label: '15 Days' },
    { value: '30', label: '30 Days' },
    { value: '45', label: '45 Days' },
    { value: '60', label: '60 Days' },
    { value: '90', label: '90 Days' },
  ]

  return (
    <>
      <Helmet>
        <title>Settings - CreditFlow Pro</title>
      </Helmet>
      <div className="page-shell">
        <Header />
        <main className="page-content pt-20 pb-8 px-4 md:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6 md:mb-8">
              <h1 className="page-title mb-2">Settings</h1>
              <p className="page-subtitle">
                Manage your account preferences and application settings
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Sidebar Navigation */}
              <div className="lg:col-span-1">
                <div className="bg-card rounded-lg p-2 shadow-elevation-sm border border-border">
                  <nav className="space-y-1">
                    {tabs.map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-smooth ${
                          activeTab === tab.id
                            ? 'bg-primary text-primary-foreground'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                        }`}
                      >
                        <Icon name={tab.icon} size={20} />
                        <span className="font-medium">{tab.label}</span>
                      </button>
                    ))}
                  </nav>
                </div>
              </div>

              {/* Content Area */}
              <div className="lg:col-span-3">
                <div className="bg-card rounded-lg p-6 md:p-8 shadow-elevation-sm border border-border">
                  {/* General Settings */}
                  {activeTab === 'general' && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-xl font-semibold text-foreground mb-1">
                          General Settings
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          Update your company information and preferences
                        </p>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-base font-medium text-foreground">
                          Company Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Input
                            label="Company Name"
                            placeholder="Enter your company name"
                            value={generalSettings.companyName}
                            onChange={e =>
                              setGeneralSettings({
                                ...generalSettings,
                                companyName: e.target.value,
                              })
                            }
                          />
                          <Input
                            label="GST Number"
                            placeholder="e.g., 27AABCU9603R1ZM"
                            value={generalSettings.gstNumber}
                            onChange={e =>
                              setGeneralSettings({
                                ...generalSettings,
                                gstNumber: e.target.value,
                              })
                            }
                          />
                        </div>
                        <Input
                          label="Address"
                          placeholder="Enter your business address"
                          value={generalSettings.address}
                          onChange={e =>
                            setGeneralSettings({
                              ...generalSettings,
                              address: e.target.value,
                            })
                          }
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Input
                            label="Phone"
                            placeholder="+91 98765 43210"
                            value={generalSettings.phone}
                            onChange={e =>
                              setGeneralSettings({
                                ...generalSettings,
                                phone: e.target.value,
                              })
                            }
                          />
                          <Input
                            label="Email"
                            type="email"
                            placeholder="business@company.com"
                            value={generalSettings.email}
                            onChange={e =>
                              setGeneralSettings({
                                ...generalSettings,
                                email: e.target.value,
                              })
                            }
                          />
                        </div>
                        <Input
                          label="Website"
                          placeholder="www.yourcompany.com"
                          value={generalSettings.website}
                          onChange={e =>
                            setGeneralSettings({
                              ...generalSettings,
                              website: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="space-y-4 pt-4 border-t border-border">
                        <h3 className="text-base font-medium text-foreground">
                          Regional Settings
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Select
                            label="Currency"
                            options={currencyOptions}
                            value={generalSettings.currency}
                            onChange={value =>
                              setGeneralSettings({
                                ...generalSettings,
                                currency: value,
                              })
                            }
                          />
                          <Select
                            label="Timezone"
                            options={timezoneOptions}
                            value={generalSettings.timezone}
                            onChange={value =>
                              setGeneralSettings({
                                ...generalSettings,
                                timezone: value,
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Invoice Settings */}
                  {activeTab === 'invoice' && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-xl font-semibold text-foreground mb-1">
                          Invoice Settings
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          Configure invoice defaults and preferences
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Input
                            label="Invoice Prefix"
                            value={invoiceSettings.invoicePrefix}
                            onChange={e =>
                              setInvoiceSettings({
                                ...invoiceSettings,
                                invoicePrefix: e.target.value,
                              })
                            }
                          />
                          <Input
                            label="Next Invoice Number"
                            value={invoiceSettings.nextInvoiceNumber}
                            onChange={e =>
                              setInvoiceSettings({
                                ...invoiceSettings,
                                nextInvoiceNumber: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Select
                            label="Default Payment Terms"
                            options={paymentTermsOptions}
                            value={invoiceSettings.defaultPaymentTerms}
                            onChange={value =>
                              setInvoiceSettings({
                                ...invoiceSettings,
                                defaultPaymentTerms: value,
                              })
                            }
                          />
                          <Input
                            label="Default GST Rate (%)"
                            type="number"
                            value={invoiceSettings.defaultGSTRate}
                            onChange={e =>
                              setInvoiceSettings({
                                ...invoiceSettings,
                                defaultGSTRate: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>

                      <div className="space-y-3 pt-4 border-t border-border">
                        <h3 className="text-base font-medium text-foreground">
                          Invoice Options
                        </h3>
                        <Checkbox
                          label="Show bank details on invoice"
                          checked={invoiceSettings.showBankDetails}
                          onChange={e =>
                            setInvoiceSettings({
                              ...invoiceSettings,
                              showBankDetails: e.target.checked,
                            })
                          }
                        />
                        <Checkbox
                          label="Automatically send invoice to customer"
                          checked={invoiceSettings.autoSendInvoice}
                          onChange={e =>
                            setInvoiceSettings({
                              ...invoiceSettings,
                              autoSendInvoice: e.target.checked,
                            })
                          }
                        />
                        <Checkbox
                          label="Include terms and conditions"
                          checked={invoiceSettings.includeTerms}
                          onChange={e =>
                            setInvoiceSettings({
                              ...invoiceSettings,
                              includeTerms: e.target.checked,
                            })
                          }
                        />
                      </div>
                    </div>
                  )}

                  {/* Notification Settings */}
                  {activeTab === 'notifications' && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-xl font-semibold text-foreground mb-1">
                          Notification Settings
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          Manage how you receive notifications
                        </p>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-base font-medium text-foreground">
                          Notification Channels
                        </h3>
                        <Checkbox
                          label="Email Notifications"
                          checked={notificationSettings.emailNotifications}
                          onChange={e =>
                            setNotificationSettings({
                              ...notificationSettings,
                              emailNotifications: e.target.checked,
                            })
                          }
                          description="Receive notifications via email"
                        />
                        <Checkbox
                          label="SMS Notifications"
                          checked={notificationSettings.smsNotifications}
                          onChange={e =>
                            setNotificationSettings({
                              ...notificationSettings,
                              smsNotifications: e.target.checked,
                            })
                          }
                          description="Receive notifications via SMS"
                        />
                        <Checkbox
                          label="WhatsApp Notifications"
                          checked={notificationSettings.whatsappNotifications}
                          onChange={e =>
                            setNotificationSettings({
                              ...notificationSettings,
                              whatsappNotifications: e.target.checked,
                            })
                          }
                          description="Receive notifications via WhatsApp"
                        />
                      </div>

                      <div className="space-y-4 pt-4 border-t border-border">
                        <h3 className="text-base font-medium text-foreground">
                          Event Notifications
                        </h3>
                        <Checkbox
                          label="Invoice Created"
                          checked={notificationSettings.invoiceCreated}
                          onChange={e =>
                            setNotificationSettings({
                              ...notificationSettings,
                              invoiceCreated: e.target.checked,
                            })
                          }
                        />
                        <Checkbox
                          label="Payment Received"
                          checked={notificationSettings.paymentReceived}
                          onChange={e =>
                            setNotificationSettings({
                              ...notificationSettings,
                              paymentReceived: e.target.checked,
                            })
                          }
                        />
                        <Checkbox
                          label="Payment Overdue"
                          checked={notificationSettings.paymentOverdue}
                          onChange={e =>
                            setNotificationSettings({
                              ...notificationSettings,
                              paymentOverdue: e.target.checked,
                            })
                          }
                        />
                        <Checkbox
                          label="Credit Limit Exceeded"
                          checked={notificationSettings.creditLimitExceeded}
                          onChange={e =>
                            setNotificationSettings({
                              ...notificationSettings,
                              creditLimitExceeded: e.target.checked,
                            })
                          }
                        />
                      </div>

                      <div className="space-y-4 pt-4 border-t border-border">
                        <h3 className="text-base font-medium text-foreground">
                          Reports
                        </h3>
                        <Checkbox
                          label="Daily Digest"
                          checked={notificationSettings.dailyDigest}
                          onChange={e =>
                            setNotificationSettings({
                              ...notificationSettings,
                              dailyDigest: e.target.checked,
                            })
                          }
                          description="Summary of daily activities"
                        />
                        <Checkbox
                          label="Weekly Report"
                          checked={notificationSettings.weeklyReport}
                          onChange={e =>
                            setNotificationSettings({
                              ...notificationSettings,
                              weeklyReport: e.target.checked,
                            })
                          }
                          description="Comprehensive weekly performance report"
                        />
                      </div>
                    </div>
                  )}

                  {/* Security Settings */}
                  {activeTab === 'security' && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-xl font-semibold text-foreground mb-1">
                          Security Settings
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          Manage your account security and privacy
                        </p>
                      </div>

                      <div className="space-y-4">
                        <Checkbox
                          label="Enable Two-Factor Authentication"
                          checked={securitySettings.twoFactorAuth}
                          onChange={e =>
                            setSecuritySettings({
                              ...securitySettings,
                              twoFactorAuth: e.target.checked,
                            })
                          }
                          description="Add an extra layer of security to your account"
                        />
                        <Checkbox
                          label="Allow Multiple Sessions"
                          checked={securitySettings.allowMultipleSessions}
                          onChange={e =>
                            setSecuritySettings({
                              ...securitySettings,
                              allowMultipleSessions: e.target.checked,
                            })
                          }
                          description="Allow login from multiple devices simultaneously"
                        />
                      </div>

                      <div className="space-y-4 pt-4 border-t border-border">
                        <h3 className="text-base font-medium text-foreground">
                          Password & Sessions
                        </h3>
                        <Button
                          variant="outline"
                          iconName="Key"
                          iconPosition="left"
                        >
                          Change Password
                        </Button>
                        <Button
                          variant="outline"
                          iconName="LogOut"
                          iconPosition="left"
                        >
                          Sign Out All Devices
                        </Button>
                      </div>

                      <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
                        <div className="flex gap-3">
                          <Icon
                            name="AlertTriangle"
                            size={20}
                            color="var(--color-warning)"
                          />
                          <div>
                            <h4 className="text-sm font-medium text-foreground mb-1">
                              Danger Zone
                            </h4>
                            <p className="text-sm text-muted-foreground mb-3">
                              Irreversible actions that affect your account
                            </p>
                            <Button variant="danger" size="sm">
                              Delete Account
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Integrations */}
                  {activeTab === 'integrations' && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-xl font-semibold text-foreground mb-1">
                          Integrations
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          Connect with third-party services and tools
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          {
                            name: 'WhatsApp Business',
                            icon: 'MessageSquare',
                            connected: true,
                          },
                          {
                            name: 'Google Workspace',
                            icon: 'Mail',
                            connected: false,
                          },
                          {
                            name: 'Zoho Books',
                            icon: 'BookOpen',
                            connected: false,
                          },
                          {
                            name: 'Tally ERP',
                            icon: 'Database',
                            connected: true,
                          },
                        ].map((integration, index) => (
                          <div
                            key={index}
                            className="p-4 border border-border rounded-lg hover:border-primary transition-smooth"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                  <Icon
                                    name={integration.icon}
                                    size={20}
                                    color="var(--color-primary)"
                                  />
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium text-foreground">
                                    {integration.name}
                                  </h4>
                                  <span
                                    className={`text-xs ${
                                      integration.connected
                                        ? 'text-success'
                                        : 'text-muted-foreground'
                                    }`}
                                  >
                                    {integration.connected
                                      ? 'Connected'
                                      : 'Not Connected'}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <Button
                              variant={
                                integration.connected ? 'outline' : 'default'
                              }
                              size="sm"
                              fullWidth
                            >
                              {integration.connected ? 'Disconnect' : 'Connect'}
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Save Button */}
                  <div className="flex items-center justify-end gap-3 pt-6 border-t border-border mt-6">
                    <Button variant="outline">Cancel</Button>
                    <Button
                      variant="default"
                      iconName="Save"
                      iconPosition="left"
                      onClick={handleSave}
                      loading={isSaving}
                      disabled={isSaving}
                    >
                      Save Changes
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <ChangePasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onSubmit={handleChangePassword}
      />

      {showToast && (
        <div className="fixed bottom-6 right-6 z-[1000] bg-card border border-border rounded-lg shadow-elevation-xl p-4 animate-slide-up">
          <div className="flex items-center gap-3">
            <Icon name="CheckCircle2" size={20} color="var(--color-success)" />
            <span className="text-sm font-medium text-foreground">
              {toastMessage}
            </span>
          </div>
        </div>
      )}
    </>
  )
}

export default Settings
