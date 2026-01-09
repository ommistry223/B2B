import React, { useState, useRef, useEffect } from 'react'
import Icon from '../../../components/AppIcon'
import Input from '../../../components/ui/Input'

const CustomerSelector = ({
  customers,
  selectedCustomer,
  onSelectCustomer,
  error,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = event => {
      if (
        dropdownRef?.current &&
        !dropdownRef?.current?.contains(event?.target)
      ) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const filteredCustomers = customers?.filter(
    customer =>
      customer?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
      customer?.gst?.toLowerCase()?.includes(searchQuery?.toLowerCase())
  )

  const handleSelectCustomer = customer => {
    onSelectCustomer(customer)
    setIsOpen(false)
    setSearchQuery('')
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-medium text-foreground mb-2">
        Customer <span className="text-error">*</span>
      </label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-4 py-3 bg-card border rounded-lg transition-smooth ${
          error ? 'border-error' : 'border-border hover:border-primary'
        }`}
      >
        <div className="flex items-center gap-3">
          {selectedCustomer ? (
            <>
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-semibold text-primary">
                  {selectedCustomer?.name?.charAt(0)}
                </span>
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-foreground">
                  {selectedCustomer?.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  GST: {selectedCustomer?.gst}
                </p>
              </div>
            </>
          ) : (
            <span className="text-sm text-muted-foreground">
              Select a customer
            </span>
          )}
        </div>
        <Icon
          name={isOpen ? 'ChevronUp' : 'ChevronDown'}
          size={20}
          color="var(--color-muted-foreground)"
        />
      </button>
      {error && <p className="mt-1 text-xs text-error">{error}</p>}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-popover border border-border rounded-lg shadow-elevation-xl">
          <div className="p-3 border-b border-border">
            <Input
              type="search"
              placeholder="Search by name or GST..."
              value={searchQuery}
              onChange={e => setSearchQuery(e?.target?.value)}
              className="w-full"
            />
          </div>
          <div className="max-h-64 overflow-y-auto">
            {filteredCustomers?.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No customers found
              </div>
            ) : (
              filteredCustomers?.map(customer => (
                <button
                  key={customer?.id}
                  type="button"
                  onClick={() => handleSelectCustomer(customer)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted transition-smooth text-left"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-semibold text-primary">
                      {customer?.name?.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      {customer?.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      GST: {customer?.gst}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs text-muted-foreground">
                      Credit Limit
                    </p>
                    <p className="text-sm font-medium text-foreground data-text">
                      ₹{customer?.creditLimit?.toLocaleString('en-IN')}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default CustomerSelector
