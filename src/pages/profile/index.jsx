import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'
import Header from '../../components/navigation/Header'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Icon from '../../components/AppIcon'
import { useUser } from '../../context/UserContext'
import { useData } from '../../context/DataContext'
import ChangePasswordModal from '../../components/modals/ChangePasswordModal'

const Profile = () => {
  const navigate = useNavigate()
  const { user, updateUser } = useUser()
  const { invoices, payments, customers } = useData()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('personal')
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    phone: '',
    designation: '',
    department: '',
    bio: '',
    avatar: '',
  })

  const [companyData, setCompanyData] = useState({
    companyName: '',
    gstNumber: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    country: '',
  })

  const [bankDetails, setBankDetails] = useState({
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    accountType: '',
    branch: '',
  })

  // Load user data when component mounts or user changes
  useEffect(() => {
    if (user) {
      setProfileData({
        fullName: user.fullName || '',
        email: user.email || '',
        phone: user.phone || '',
        designation: user.designation || '',
        department: user.department || '',
        bio: user.bio || '',
        avatar: user.avatar || '',
      })
      setCompanyData({
        companyName: user.companyName || '',
        gstNumber: user.gstNumber || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        pincode: user.pincode || '',
        country: user.country || 'India',
      })
      setBankDetails({
        bankName: user.bankName || '',
        accountNumber: user.accountNumber || '',
        ifscCode: user.ifscCode || '',
        accountType: user.accountType || 'Current',
        branch: user.branch || '',
      })
    }
  }, [user])

  const stats = [
    {
      label: 'Invoices Created',
      value: invoices.length.toString(),
      icon: 'FileText',
      color: 'var(--color-primary)',
      bgColor: 'bg-primary/10',
    },
    {
      label: 'Payments Recorded',
      value: payments.length.toString(),
      icon: 'DollarSign',
      color: 'var(--color-success)',
      bgColor: 'bg-success/10',
    },
    {
      label: 'Customers Managed',
      value: customers.length.toString(),
      icon: 'Users',
      color: 'var(--color-secondary)',
      bgColor: 'bg-secondary/10',
    },
    {
      label: 'Total Revenue',
      value: `₹${(
        invoices
          .filter(i => i.status === 'paid')
          .reduce((sum, i) => sum + i.amount, 0) / 100000
      ).toFixed(1)}L`,
      icon: 'TrendingUp',
      color: 'var(--color-accent)',
      bgColor: 'bg-accent/10',
    },
  ]

  const recentActivity = [
    {
      action: 'Created invoice INV-2026-045',
      time: '2 hours ago',
      icon: 'FileText',
    },
    {
      action: 'Recorded payment from Global Traders',
      time: '5 hours ago',
      icon: 'CheckCircle2',
    },
    {
      action: 'Updated customer credit limit',
      time: '1 day ago',
      icon: 'Edit',
    },
    {
      action: 'Generated monthly report',
      time: '2 days ago',
      icon: 'BarChart3',
    },
  ]

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => {
      // Update user context with new data
      updateUser({
        ...profileData,
        ...companyData,
        ...bankDetails,
      })
      setIsSaving(false)
      setIsEditing(false)
      setToastMessage('Profile updated successfully!')
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
    }, 1500)
  }

  const handleChangePassword = passwordData => {
    // Validate current password and update to new password
    if (user && user.password === passwordData.currentPassword) {
      // Update user with new password
      updateUser({ password: passwordData.newPassword })
      setShowPasswordModal(false)
      setToastMessage('Password changed successfully!')
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
    } else {
      // Show error for incorrect current password
      setShowPasswordModal(false)
      setToastMessage('Current password is incorrect!')
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
    }
  }

  const handleDownloadData = () => {
    const userData = {
      profile: { ...user },
      invoices: invoices,
      payments: payments,
      customers: customers,
      exportDate: new Date().toISOString(),
    }

    const dataStr = JSON.stringify(userData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `creditflow-data-${
      new Date().toISOString().split('T')[0]
    }.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    setToastMessage('Data exported successfully!')
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const handleAccountSettings = () => {
    navigate('/settings')
  }

  const handleAvatarChange = e => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileData({ ...profileData, avatar: reader.result })
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <>
      <Helmet>
        <title>Profile - CreditFlow Pro</title>
      </Helmet>
      <div className="page-shell">
        <Header />
        <main className="page-content pt-20 pb-8 px-4 md:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Profile Header */}
            <div className="bg-card rounded-lg p-6 md:p-8 shadow-elevation-sm border border-border mb-6">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground text-3xl md:text-4xl font-bold shadow-elevation-md">
                    {profileData.avatar ? (
                      <img
                        src={profileData.avatar}
                        alt="Profile"
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      profileData.fullName
                        .split(' ')
                        .map(n => n[0])
                        .join('')
                    )}
                  </div>
                  {isEditing && (
                    <label className="absolute bottom-0 right-0 w-10 h-10 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-smooth shadow-elevation-md">
                      <Icon
                        name="Camera"
                        size={18}
                        className="text-primary-foreground"
                      />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarChange}
                      />
                    </label>
                  )}
                </div>

                {/* User Info */}
                <div className="flex-1">
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-1">
                    {profileData.fullName}
                  </h1>
                  <p className="text-muted-foreground mb-2">
                    {profileData.designation} • {profileData.department}
                  </p>
                  <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Icon name="Mail" size={16} />
                      {profileData.email}
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon name="Phone" size={16} />
                      {profileData.phone}
                    </div>
                  </div>
                </div>

                {/* Edit Button */}
                <div className="w-full md:w-auto flex gap-2">
                  {isEditing ? (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                        disabled={isSaving}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="default"
                        iconName="Save"
                        iconPosition="left"
                        onClick={handleSave}
                        loading={isSaving}
                        disabled={isSaving}
                      >
                        Save
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="default"
                      iconName="Edit"
                      iconPosition="left"
                      onClick={() => setIsEditing(true)}
                    >
                      Edit Profile
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-card rounded-lg p-4 md:p-6 shadow-elevation-sm border border-border"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}
                    >
                      <Icon name={stat.icon} size={24} color={stat.color} />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-foreground mb-1">
                    {stat.value}
                  </p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Details */}
              <div className="lg:col-span-2">
                <div className="bg-card rounded-lg shadow-elevation-sm border border-border">
                  {/* Tabs */}
                  <div className="border-b border-border">
                    <div className="flex gap-1 p-2">
                      {[
                        { id: 'personal', label: 'Personal Info' },
                        { id: 'company', label: 'Company' },
                        { id: 'bank', label: 'Bank Details' },
                      ].map(tab => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-smooth ${
                            activeTab === tab.id
                              ? 'bg-primary text-primary-foreground'
                              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tab Content */}
                  <div className="p-6">
                    {activeTab === 'personal' && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-foreground mb-4">
                          Personal Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Input
                            label="Full Name"
                            value={profileData.fullName}
                            onChange={e =>
                              setProfileData({
                                ...profileData,
                                fullName: e.target.value,
                              })
                            }
                            disabled={!isEditing}
                          />
                          <Input
                            label="Email"
                            type="email"
                            value={profileData.email}
                            onChange={e =>
                              setProfileData({
                                ...profileData,
                                email: e.target.value,
                              })
                            }
                            disabled={!isEditing}
                          />
                          <Input
                            label="Phone"
                            value={profileData.phone}
                            onChange={e =>
                              setProfileData({
                                ...profileData,
                                phone: e.target.value,
                              })
                            }
                            disabled={!isEditing}
                          />
                          <Input
                            label="Designation"
                            value={profileData.designation}
                            onChange={e =>
                              setProfileData({
                                ...profileData,
                                designation: e.target.value,
                              })
                            }
                            disabled={!isEditing}
                          />
                        </div>
                        <Input
                          label="Department"
                          value={profileData.department}
                          onChange={e =>
                            setProfileData({
                              ...profileData,
                              department: e.target.value,
                            })
                          }
                          disabled={!isEditing}
                        />
                        <div>
                          <label className="text-sm font-medium text-foreground block mb-2">
                            Bio
                          </label>
                          <textarea
                            value={profileData.bio}
                            onChange={e =>
                              setProfileData({
                                ...profileData,
                                bio: e.target.value,
                              })
                            }
                            disabled={!isEditing}
                            rows={4}
                            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                          />
                        </div>
                      </div>
                    )}

                    {activeTab === 'company' && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-foreground mb-4">
                          Company Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Input
                            label="Company Name"
                            value={companyData.companyName}
                            onChange={e =>
                              setCompanyData({
                                ...companyData,
                                companyName: e.target.value,
                              })
                            }
                            disabled={!isEditing}
                          />
                          <Input
                            label="GST Number"
                            value={companyData.gstNumber}
                            onChange={e =>
                              setCompanyData({
                                ...companyData,
                                gstNumber: e.target.value,
                              })
                            }
                            disabled={!isEditing}
                          />
                        </div>
                        <Input
                          label="Address"
                          value={companyData.address}
                          onChange={e =>
                            setCompanyData({
                              ...companyData,
                              address: e.target.value,
                            })
                          }
                          disabled={!isEditing}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <Input
                            label="City"
                            value={companyData.city}
                            onChange={e =>
                              setCompanyData({
                                ...companyData,
                                city: e.target.value,
                              })
                            }
                            disabled={!isEditing}
                          />
                          <Input
                            label="State"
                            value={companyData.state}
                            onChange={e =>
                              setCompanyData({
                                ...companyData,
                                state: e.target.value,
                              })
                            }
                            disabled={!isEditing}
                          />
                          <Input
                            label="Pincode"
                            value={companyData.pincode}
                            onChange={e =>
                              setCompanyData({
                                ...companyData,
                                pincode: e.target.value,
                              })
                            }
                            disabled={!isEditing}
                          />
                        </div>
                      </div>
                    )}

                    {activeTab === 'bank' && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-foreground mb-4">
                          Bank Account Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Input
                            label="Bank Name"
                            value={bankDetails.bankName}
                            onChange={e =>
                              setBankDetails({
                                ...bankDetails,
                                bankName: e.target.value,
                              })
                            }
                            disabled={!isEditing}
                          />
                          <Input
                            label="Account Type"
                            value={bankDetails.accountType}
                            onChange={e =>
                              setBankDetails({
                                ...bankDetails,
                                accountType: e.target.value,
                              })
                            }
                            disabled={!isEditing}
                          />
                          <Input
                            label="Account Number"
                            value={bankDetails.accountNumber}
                            onChange={e =>
                              setBankDetails({
                                ...bankDetails,
                                accountNumber: e.target.value,
                              })
                            }
                            disabled={!isEditing}
                          />
                          <Input
                            label="IFSC Code"
                            value={bankDetails.ifscCode}
                            onChange={e =>
                              setBankDetails({
                                ...bankDetails,
                                ifscCode: e.target.value,
                              })
                            }
                            disabled={!isEditing}
                          />
                        </div>
                        <Input
                          label="Branch"
                          value={bankDetails.branch}
                          onChange={e =>
                            setBankDetails({
                              ...bankDetails,
                              branch: e.target.value,
                            })
                          }
                          disabled={!isEditing}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Recent Activity */}
                <div className="bg-card rounded-lg p-6 shadow-elevation-sm border border-border">
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Icon name="Activity" size={20} />
                    Recent Activity
                  </h3>
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Icon
                            name={activity.icon}
                            size={16}
                            color="var(--color-primary)"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-foreground">
                            {activity.action}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {activity.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-card rounded-lg p-6 shadow-elevation-sm border border-border">
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    Quick Actions
                  </h3>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      fullWidth
                      iconName="Key"
                      iconPosition="left"
                      size="sm"
                      onClick={() => setShowPasswordModal(true)}
                    >
                      Change Password
                    </Button>
                    <Button
                      variant="outline"
                      fullWidth
                      iconName="Download"
                      iconPosition="left"
                      size="sm"
                      onClick={handleDownloadData}
                    >
                      Download Data
                    </Button>
                    <Button
                      variant="outline"
                      fullWidth
                      iconName="Settings"
                      iconPosition="left"
                      size="sm"
                      onClick={handleAccountSettings}
                    >
                      Account Settings
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

export default Profile
