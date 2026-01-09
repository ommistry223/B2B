import React, { useState, useMemo } from 'react'
import Header from '../../components/navigation/Header'
import QuickActionToolbar from '../../components/navigation/QuickActionToolbar'
import Icon from '../../components/AppIcon'
import Button from '../../components/ui/Button'
import CustomerFilters from './components/CustomerFilters'
import CustomerTable from './components/CustomerTable'
import CustomerMobileCard from './components/CustomerMobileCard'
import CustomerDetailModal from './components/CustomerDetailModal'
import AddCustomerModal from './components/AddCustomerModal'
import BulkActionsBar from './components/BulkActionsBar'
import { useData } from '../../context/DataContext'

const CustomerManagement = () => {
  const { customers, addCustomer } = useData()

  const [filters, setFilters] = useState({
    search: '',
    riskLevel: 'all',
    creditLimit: 'all',
    paymentStatus: 'all',
  })

  const [sortConfig, setSortConfig] = useState({
    column: 'companyName',
    direction: 'asc',
  })

  const [selectedCustomers, setSelectedCustomers] = useState([])
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }))
  }

  const handleResetFilters = () => {
    setFilters({
      search: '',
      riskLevel: 'all',
      creditLimit: 'all',
      paymentStatus: 'all',
    })
  }

  const handleSort = column => {
    setSortConfig(prev => ({
      column,
      direction:
        prev?.column === column && prev?.direction === 'asc' ? 'desc' : 'asc',
    }))
  }

  const handleSelectCustomer = (customerId, isSelected) => {
    setSelectedCustomers(prev =>
      isSelected ? [...prev, customerId] : prev?.filter(id => id !== customerId)
    )
  }

  const handleSelectAll = isSelected => {
    setSelectedCustomers(
      isSelected ? filteredAndSortedCustomers?.map(c => c?.id) : []
    )
  }

  const handleViewDetails = customer => {
    setSelectedCustomer(customer)
    setShowDetailModal(true)
  }

  const handleAddCustomer = async formData => {
    console.log('Adding customer:', formData)

    // Map form data to API format
    const customerData = {
      name: formData.companyName,
      email: formData.email,
      phone: formData.phone,
      gst: formData.gstNumber,
      address: `${formData.address || ''}, ${formData.city || ''}, ${
        formData.state || ''
      } - ${formData.pincode || ''}`.trim(),
      creditLimit: parseFloat(formData.creditLimit) || 0,
      paymentTerms: parseInt(formData.paymentTerms) || 30,
      riskScore: 'low',
    }

    const result = await addCustomer(customerData)

    if (result.success) {
      setShowAddModal(false)
      // Customer will be automatically added to the list via DataContext
    } else {
      console.error('Failed to add customer:', result.error)
      alert('Failed to add customer: ' + result.error)
    }
  }

  const handleBulkCreditUpdate = () => {
    console.log('Updating credit limit for:', selectedCustomers)
  }

  const handleBulkExport = () => {
    console.log('Exporting customers:', selectedCustomers)
  }

  const handleExportCustomers = () => {
    // Export all customers to CSV
    const headers = [
      'Company Name',
      'Contact Person',
      'Email',
      'Phone',
      'GST Number',
      'Credit Limit',
      'Outstanding',
      'Risk Level',
      'Last Payment Date',
    ]
    const csvData = filteredAndSortedCustomers?.map(c => [
      c?.companyName || c?.name || '',
      c?.contactPerson || '',
      c?.email || '',
      c?.phone || '',
      c?.gstNumber || '',
      c?.creditLimit || 0,
      c?.outstanding || c?.outstandingAmount || 0,
      c?.riskLevel || c?.riskScore || '',
      c?.lastPaymentDate || '',
    ])

    const csv = [headers, ...csvData]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `customers_${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  const filteredAndSortedCustomers = useMemo(() => {
    let filtered = [...(customers || [])]

    if (filters?.search) {
      const searchLower = filters?.search?.toLowerCase()
      filtered = filtered?.filter(
        c =>
          c?.companyName?.toLowerCase()?.includes(searchLower) ||
          c?.name?.toLowerCase()?.includes(searchLower) ||
          c?.gstNumber?.toLowerCase()?.includes(searchLower) ||
          c?.contactPerson?.toLowerCase()?.includes(searchLower)
      )
    }

    if (filters?.riskLevel !== 'all') {
      filtered = filtered?.filter(
        c => (c?.riskLevel || c?.riskScore) === filters?.riskLevel
      )
    }

    if (filters?.creditLimit !== 'all') {
      const [min, max] = filters?.creditLimit
        ?.split('-')
        ?.map(v => v?.replace('+', ''))
      filtered = filtered?.filter(c => {
        if (max) {
          return (
            c?.creditLimit >= parseInt(min) && c?.creditLimit <= parseInt(max)
          )
        }
        return c?.creditLimit >= parseInt(min)
      })
    }

    if (filters?.paymentStatus !== 'all') {
      filtered = filtered?.filter(c => {
        const outstanding = c?.outstanding || c?.outstandingAmount || 0
        const overdue = c?.overdueAmount || 0

        if (filters?.paymentStatus === 'current') {
          return outstanding > 0 && overdue === 0
        }
        if (filters?.paymentStatus === 'overdue') {
          return overdue > 0
        }
        if (filters?.paymentStatus === 'no-outstanding') {
          return outstanding === 0
        }
        return true
      })
    }

    filtered?.sort((a, b) => {
      let aValue = a?.[sortConfig?.column]
      let bValue = b?.[sortConfig?.column]

      if (sortConfig?.column === 'riskLevel') {
        const riskOrder = {
          low: 1,
          medium: 2,
          high: 3,
          Low: 1,
          Medium: 2,
          High: 3,
        }
        aValue = riskOrder?.[aValue || a?.riskScore] || 0
        bValue = riskOrder?.[bValue || b?.riskScore] || 0
      }

      if (sortConfig?.column === 'lastPaymentDate') {
        aValue = new Date(aValue || 0)?.getTime()
        bValue = new Date(bValue || 0)?.getTime()
      }

      if (typeof aValue === 'string') {
        aValue = aValue?.toLowerCase()
        bValue = (bValue || '')?.toLowerCase()
      }

      if (aValue < bValue) return sortConfig?.direction === 'asc' ? -1 : 1
      if (aValue > bValue) return sortConfig?.direction === 'asc' ? 1 : -1
      return 0
    })

    return filtered
  }, [customers, filters, sortConfig])

  const stats = useMemo(() => {
    const totalCustomers = customers?.length || 0
    const totalCreditLimit = customers?.reduce(
      (sum, c) => sum + (c?.creditLimit || 0),
      0
    )
    const totalOutstanding = customers?.reduce(
      (sum, c) => sum + (c?.outstanding || c?.outstandingAmount || 0),
      0
    )
    const highRiskCount =
      customers?.filter(c => (c?.riskLevel || c?.riskScore) === 'high')
        ?.length || 0

    return { totalCustomers, totalCreditLimit, totalOutstanding, highRiskCount }
  }, [customers])

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 pb-8 px-4 md:px-6 lg:px-8">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6 md:mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">
                Customer Management
              </h1>
              <p className="text-sm md:text-base text-muted-foreground mt-1">
                Manage credit customers, track payments, and assess risk levels
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                iconName="Download"
                iconPosition="left"
                onClick={handleExportCustomers}
                className="hidden lg:flex"
              >
                Export Data
              </Button>
              <QuickActionToolbar />
              <Button
                variant="default"
                iconName="UserPlus"
                iconPosition="left"
                onClick={() => setShowAddModal(true)}
                className="hidden lg:flex"
              >
                Add Customer
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 md:mb-8">
            <div className="bg-card rounded-lg border border-border p-4 md:p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">
                  Total Customers
                </span>
                <Icon name="Users" size={20} color="var(--color-primary)" />
              </div>
              <p className="text-2xl md:text-3xl font-bold text-foreground data-text">
                {stats?.totalCustomers}
              </p>
            </div>

            <div className="bg-card rounded-lg border border-border p-4 md:p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">
                  Total Credit Limit
                </span>
                <Icon
                  name="CreditCard"
                  size={20}
                  color="var(--color-secondary)"
                />
              </div>
              <p className="text-2xl md:text-3xl font-bold text-foreground data-text">
                ₹{(stats?.totalCreditLimit / 100000)?.toFixed(1)}L
              </p>
            </div>

            <div className="bg-card rounded-lg border border-border p-4 md:p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">
                  Total Outstanding
                </span>
                <Icon
                  name="AlertCircle"
                  size={20}
                  color="var(--color-warning)"
                />
              </div>
              <p className="text-2xl md:text-3xl font-bold text-error data-text">
                ₹{(stats?.totalOutstanding / 100000)?.toFixed(1)}L
              </p>
            </div>

            <div className="bg-card rounded-lg border border-border p-4 md:p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">
                  High Risk Customers
                </span>
                <Icon
                  name="AlertTriangle"
                  size={20}
                  color="var(--color-error)"
                />
              </div>
              <p className="text-2xl md:text-3xl font-bold text-error data-text">
                {stats?.highRiskCount}
              </p>
            </div>
          </div>

          <CustomerFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleResetFilters}
          />

          <div className="hidden lg:block">
            <CustomerTable
              customers={filteredAndSortedCustomers}
              selectedCustomers={selectedCustomers}
              onSelectCustomer={handleSelectCustomer}
              onSelectAll={handleSelectAll}
              onEdit={customer => console.log('Edit:', customer)}
              onViewDetails={handleViewDetails}
              onAdjustCredit={customer =>
                console.log('Adjust credit:', customer)
              }
              onSort={handleSort}
              sortConfig={sortConfig}
            />
          </div>

          <div className="lg:hidden grid grid-cols-1 gap-4">
            {filteredAndSortedCustomers?.map(customer => (
              <CustomerMobileCard
                key={customer?.id}
                customer={customer}
                isSelected={selectedCustomers?.includes(customer?.id)}
                onSelect={handleSelectCustomer}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>

          {filteredAndSortedCustomers?.length === 0 && (
            <div className="bg-card rounded-lg border border-border p-12 text-center">
              <Icon
                name="Search"
                size={48}
                color="var(--color-muted-foreground)"
              />
              <p className="mt-4 text-base text-muted-foreground">
                No customers found
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Try adjusting your filters or add a new customer
              </p>
              <Button
                variant="default"
                iconName="UserPlus"
                iconPosition="left"
                onClick={() => setShowAddModal(true)}
                className="mt-6"
              >
                Add Customer
              </Button>
            </div>
          )}
        </div>
      </main>
      <BulkActionsBar
        selectedCount={selectedCustomers?.length}
        onUpdateCreditLimit={handleBulkCreditUpdate}
        onExport={handleBulkExport}
        onClearSelection={() => setSelectedCustomers([])}
      />
      {showDetailModal && selectedCustomer && (
        <CustomerDetailModal
          customer={selectedCustomer}
          onClose={() => {
            setShowDetailModal(false)
            setSelectedCustomer(null)
          }}
        />
      )}
      {showAddModal && (
        <AddCustomerModal
          onClose={() => setShowAddModal(false)}
          onSave={handleAddCustomer}
        />
      )}
      <button
        onClick={() => setShowAddModal(true)}
        className="lg:hidden fixed bottom-6 right-6 z-[100] w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-elevation-lg flex items-center justify-center transition-smooth hover:shadow-elevation-xl active:scale-95"
        aria-label="Add customer"
      >
        <Icon name="Plus" size={24} color="#FFFFFF" />
      </button>
    </div>
  )
}

export default CustomerManagement
