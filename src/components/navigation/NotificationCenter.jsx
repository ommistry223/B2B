import React, { useState, useRef, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '../AppIcon'
import Button from '../ui/Button'
import { useData } from '../../context/DataContext'
import { enrichInvoice } from '../../util/invoiceUtils'

const NotificationCenter = () => {
  const navigate = useNavigate()
  const { invoices, payments, customers } = useData()
  const [isOpen, setIsOpen] = useState(false)
  const [dismissedNotifications, setDismissedNotifications] = useState(() => {
    const saved = localStorage.getItem('dismissedNotifications')
    return saved ? JSON.parse(saved) : []
  })

  const dropdownRef = useRef(null)

  // Generate dynamic notifications based on invoice data
  const notifications = useMemo(() => {
    const notifs = []
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Enrich invoices with proper status
    const enrichedInvoices = invoices.map(inv => enrichInvoice(inv, payments))

    // 1. Overdue invoices - HIGH PRIORITY
    enrichedInvoices
      .filter(inv => inv.status === 'overdue')
      .forEach(inv => {
        const notifId = `overdue-${inv.id}-${inv.daysOverdue}`
        if (!dismissedNotifications.includes(notifId)) {
          const customer = customers.find(c => c.id === inv.customerId)
          notifs.push({
            id: notifId,
            type: 'overdue',
            priority: 'high',
            title: 'Invoice Overdue',
            message: `${inv.invoiceNumber} from ${
              customer?.name || inv.customerName
            } is ${inv.daysOverdue} day${
              inv.daysOverdue > 1 ? 's' : ''
            } overdue - ₹${inv.outstanding.toLocaleString('en-IN')}`,
            timestamp: `${inv.daysOverdue} day${
              inv.daysOverdue > 1 ? 's' : ''
            } ago`,
            read: false,
            invoiceId: inv.id,
            customerId: inv.customerId,
          })
        }
      })

    // 2. Invoices due in 1-3 days - MEDIUM PRIORITY
    enrichedInvoices
      .filter(inv => inv.status === 'pending' || inv.status === 'partial')
      .forEach(inv => {
        const dueDate = new Date(inv.dueDate)
        dueDate.setHours(0, 0, 0, 0)
        const daysUntilDue = Math.ceil(
          (dueDate - today) / (1000 * 60 * 60 * 24)
        )

        if (daysUntilDue >= 0 && daysUntilDue <= 3) {
          const notifId = `due-soon-${inv.id}-${daysUntilDue}`
          if (!dismissedNotifications.includes(notifId)) {
            const customer = customers.find(c => c.id === inv.customerId)
            notifs.push({
              id: notifId,
              type: 'due-soon',
              priority: 'medium',
              title:
                daysUntilDue === 0 ? 'Invoice Due Today' : 'Invoice Due Soon',
              message: `${inv.invoiceNumber} from ${
                customer?.name || inv.customerName
              } due ${
                daysUntilDue === 0
                  ? 'today'
                  : `in ${daysUntilDue} day${daysUntilDue > 1 ? 's' : ''}`
              } - ₹${inv.outstanding.toLocaleString('en-IN')}`,
              timestamp:
                daysUntilDue === 0
                  ? 'Today'
                  : `In ${daysUntilDue} day${daysUntilDue > 1 ? 's' : ''}`,
              read: false,
              invoiceId: inv.id,
              customerId: inv.customerId,
            })
          }
        }
      })

    // 3. High risk customers - individual invoice alerts - MEDIUM PRIORITY
    customers
      .filter(c => c.riskScore === 'High')
      .forEach(customer => {
        const customerPendingInvoices = enrichedInvoices.filter(
          inv =>
            inv.customerId === customer.id &&
            (inv.status === 'pending' ||
              inv.status === 'partial' ||
              inv.status === 'overdue')
        )

        // Create separate notification for each high-risk invoice
        customerPendingInvoices.forEach(inv => {
          const dueDate = new Date(inv.dueDate)
          dueDate.setHours(0, 0, 0, 0)
          const daysUntilDue = Math.ceil(
            (dueDate - today) / (1000 * 60 * 60 * 24)
          )

          const notifId = `risk-invoice-${inv.id}-${customer.id}`

          if (!dismissedNotifications.includes(notifId)) {
            let riskMessage = ''
            if (inv.status === 'overdue') {
              riskMessage = `${inv.daysOverdue} days overdue`
            } else if (daysUntilDue <= 3) {
              riskMessage =
                daysUntilDue === 0 ? 'due today' : `due in ${daysUntilDue} days`
            } else {
              riskMessage = `due ${new Date(inv.dueDate).toLocaleDateString(
                'en-IN',
                { day: 'numeric', month: 'short' }
              )}`
            }

            notifs.push({
              id: notifId,
              type: 'risk',
              priority: 'medium',
              title: 'High Risk Customer - Action Required',
              message: `${customer.name}: ${
                inv.invoiceNumber
              } (₹${inv.outstanding.toLocaleString('en-IN')}) - ${riskMessage}`,
              timestamp: 'Risk Alert',
              read: false,
              invoiceId: inv.id,
              customerId: customer.id,
            })
          }
        })
      })

    // 4. Recent payments received - LOW PRIORITY
    payments
      .slice(-5)
      .reverse()
      .forEach(payment => {
        const paymentDate = new Date(payment.paymentDate)
        const daysSince = Math.floor(
          (today - paymentDate) / (1000 * 60 * 60 * 24)
        )

        if (daysSince <= 2) {
          const notifId = `payment-${payment.id}-${payment.paymentDate}`
          if (!dismissedNotifications.includes(notifId)) {
            notifs.push({
              id: notifId,
              type: 'payment',
              priority: 'low',
              title: 'Payment Received',
              message: `${
                payment.invoiceNumber
              } payment of ₹${payment.amount.toLocaleString(
                'en-IN'
              )} received from ${payment.customerName}`,
              timestamp:
                daysSince === 0
                  ? 'Today'
                  : daysSince === 1
                  ? 'Yesterday'
                  : `${daysSince} days ago`,
              read: false,
              paymentId: payment.id,
            })
          }
        }
      })

    // Sort by priority: high -> medium -> low, then by unread
    return notifs.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 }
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority]
      }
      return a.read === b.read ? 0 : a.read ? 1 : -1
    })
  }, [invoices, payments, customers, dismissedNotifications])

  const unreadCount = notifications.filter(n => !n.read).length

  useEffect(() => {
    const handleClickOutside = event => {
      if (
        dropdownRef?.current &&
        !dropdownRef?.current?.contains(event?.target)
      ) {
        setIsOpen(false)
      }
    }

    const handleEscape = event => {
      if (event?.key === 'Escape') {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  const handleNotificationClick = notification => {
    // Mark as read
    handleMarkAsRead(notification.id)

    // Navigate based on notification type
    if (notification.invoiceId) {
      navigate('/invoice-management')
    } else if (notification.customerId) {
      navigate('/customer-management')
    } else if (notification.type === 'payment') {
      navigate('/payment-recording')
    }

    setIsOpen(false)
  }

  const handleMarkAsRead = id => {
    const updated = [...dismissedNotifications, id]
    setDismissedNotifications(updated)
    localStorage.setItem('dismissedNotifications', JSON.stringify(updated))
  }

  const handleMarkAllAsRead = () => {
    const allIds = notifications.map(n => n.id)
    setDismissedNotifications(allIds)
    localStorage.setItem('dismissedNotifications', JSON.stringify(allIds))
  }

  const handleClearAll = () => {
    const allIds = notifications.map(n => n.id)
    setDismissedNotifications(allIds)
    localStorage.setItem('dismissedNotifications', JSON.stringify(allIds))
  }

  const getNotificationIcon = type => {
    switch (type) {
      case 'payment':
        return 'CheckCircle2'
      case 'risk':
        return 'AlertTriangle'
      case 'overdue':
        return 'AlertCircle'
      case 'due-soon':
        return 'Clock'
      case 'invoice':
        return 'FileText'
      default:
        return 'Bell'
    }
  }

  const getNotificationColor = type => {
    switch (type) {
      case 'payment':
        return 'var(--color-success)'
      case 'risk':
        return 'var(--color-warning)'
      case 'overdue':
        return 'var(--color-error)'
      case 'due-soon':
        return 'var(--color-warning)'
      case 'invoice':
        return 'var(--color-error)'
      default:
        return 'var(--color-muted-foreground)'
    }
  }

  const getNotificationBgColor = type => {
    switch (type) {
      case 'payment':
        return 'notification-success hover:bg-muted'
      case 'risk':
        return 'notification-warning hover:bg-muted'
      case 'overdue':
        return 'notification-error hover:bg-muted'
      case 'due-soon':
        return 'notification-warning hover:bg-muted'
      default:
        return 'hover:bg-muted'
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        size="icon"
        iconName="Bell"
        iconSize={20}
        onClick={() => setIsOpen(!isOpen)}
        className="relative hover:bg-muted rounded-lg transition-colors duration-200"
        aria-label="Notifications"
      >
        {unreadCount > 0 && (
          <span className="notification-badge animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Button>
      {isOpen && (
        <div className="notification-dropdown animate-fade-in">
          <div className="flex items-center justify-between p-4 border-b border-border bg-card rounded-t-lg">
            <h3 className="text-lg font-semibold text-foreground">
              Notifications {unreadCount > 0 && `(${unreadCount})`}
            </h3>
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleMarkAllAsRead}
                  className="text-xs text-muted-foreground hover:text-primary hover:bg-muted px-2 py-1 rounded"
                >
                  Mark all read
                </Button>
              )}
              {notifications.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearAll}
                  className="text-xs text-muted-foreground hover:text-error hover:bg-muted px-2 py-1 rounded"
                >
                  Clear all
                </Button>
              )}
            </div>
          </div>

          <div className="overflow-y-auto max-h-96 bg-popover rounded-b-lg">
            {notifications?.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4">
                <Icon
                  name="CheckCircle2"
                  size={48}
                  className="text-success mb-4"
                />
                <p className="text-base font-semibold text-foreground mb-1">
                  All caught up!
                </p>
                <p className="text-sm text-muted-foreground">
                  No payment risks or pending notifications
                </p>
              </div>
            ) : (
              notifications?.map(notification => (
                <div
                  key={notification?.id}
                  className={`p-4 border-b border-border cursor-pointer transition-all duration-200 hover:bg-muted ${
                    !notification?.read 
                      ? 'border-l-4 border-l-primary bg-primary/5' 
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      <div className={`p-2 rounded-full ${
                        notification?.type === 'overdue' || notification?.type === 'risk' 
                          ? 'bg-error/10' 
                          : notification?.type === 'payment' 
                            ? 'bg-success/10' 
                            : 'bg-warning/10'
                      }`}>
                        <Icon
                          name={getNotificationIcon(notification?.type)}
                          size={18}
                          className={
                            notification?.type === 'overdue' || notification?.type === 'risk' 
                              ? 'text-error' 
                              : notification?.type === 'payment' 
                                ? 'text-success' 
                                : 'text-warning'
                          }
                        />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-semibold text-foreground leading-tight">
                          {notification?.title}
                        </h4>
                        <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0">
                          {notification?.timestamp}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                        {notification?.message}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificationCenter
