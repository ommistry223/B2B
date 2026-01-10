import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../ui/Button'
import Icon from '../AppIcon'

const QuickActionToolbar = () => {
  const navigate = useNavigate()
  const [isExpanded, setIsExpanded] = useState(false)

  const quickActions = [
    {
      id: 'create-invoice',
      label: 'Create Invoice',
      icon: 'Plus',
      path: '/create-invoice',
      variant: 'default',
    },
    {
      id: 'record-payment',
      label: 'Record Payment',
      icon: 'DollarSign',
      path: '/payment-recording',
      variant: 'secondary',
    },
  ]

  const handleActionClick = path => {
    navigate(path)
    setIsExpanded(false)
  }

  return (
    <>
      {/* Desktop Actions - Inline */}
      <div className="hidden lg:flex items-center gap-3">
        {quickActions?.map(action => (
          <Button
            key={action?.id}
            variant={action?.variant}
            iconName={action?.icon}
            iconPosition="left"
            iconSize={18}
            onClick={() => handleActionClick(action?.path)}
            className="shadow-sm hover:shadow-md transition-all duration-200"
          >
            {action?.label}
          </Button>
        ))}
      </div>

      {/* Mobile Floating Action Button */}
      <div className="lg:hidden fixed bottom-4 right-4 z-50">
        {isExpanded && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/20 backdrop-blur-sm -z-10"
              onClick={() => setIsExpanded(false)}
            />

            {/* Action Buttons */}
            <div className="absolute bottom-16 right-0 flex flex-col gap-2 mb-3 animate-slide-up">
              {quickActions?.map((action, index) => (
                <button
                  key={action?.id}
                  onClick={() => handleActionClick(action?.path)}
                  className="flex items-center justify-end gap-3 group animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <span className="bg-card text-foreground px-4 py-2 rounded-lg shadow-lg text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    {action?.label}
                  </span>
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 text-primary-foreground ${
                      action?.variant === 'default'
                        ? 'bg-gradient-to-br from-primary to-blue-600'
                        : 'bg-gradient-to-br from-purple-500 to-purple-700'
                    }`}
                  >
                    <Icon name={action?.icon} size={20} />
                  </div>
                </button>
              ))}
            </div>
          </>
        )}

        {/* Main FAB */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:shadow-xl active:scale-95 ${
            isExpanded
              ? 'bg-error text-error-foreground rotate-45'
              : 'bg-gradient-to-br from-primary to-blue-600 text-primary-foreground'
          }`}
        >
          <Icon name="Plus" size={28} />
        </button>
      </div>
    </>
  )
}

export default QuickActionToolbar
