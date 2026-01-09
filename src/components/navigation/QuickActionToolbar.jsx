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
      <div className="hidden lg:flex items-center gap-2">
        {quickActions?.map(action => (
          <Button
            key={action?.id}
            variant={action?.variant}
            iconName={action?.icon}
            iconPosition="left"
            iconSize={18}
            onClick={() => handleActionClick(action?.path)}
            className="transition-smooth"
          >
            {action?.label}
          </Button>
        ))}
      </div>
      <div className="lg:hidden fixed bottom-6 right-6 z-[100]">
        {isExpanded && (
          <div className="absolute bottom-16 right-0 flex flex-col gap-3 mb-2">
            {quickActions?.map(action => (
              <button
                key={action?.id}
                onClick={() => handleActionClick(action?.path)}
                className="flex items-center gap-3 px-4 py-3 bg-card text-foreground rounded-full shadow-elevation-lg transition-smooth hover:shadow-elevation-xl"
                style={{ minWidth: '200px' }}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    action?.variant === 'default'
                      ? 'bg-primary'
                      : 'bg-secondary'
                  }`}
                >
                  <Icon name={action?.icon} size={20} color="#FFFFFF" />
                </div>
                <span className="text-sm font-medium">{action?.label}</span>
              </button>
            ))}
          </div>
        )}

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-elevation-lg flex items-center justify-center transition-smooth hover:shadow-elevation-xl active:scale-95"
        >
          <Icon name={isExpanded ? 'X' : 'Plus'} size={24} color="#FFFFFF" />
        </button>
      </div>
    </>
  )
}

export default QuickActionToolbar
