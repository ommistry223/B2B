import React, { useState } from 'react'
import Icon from '../../../components/AppIcon'
import Button from '../../../components/ui/Button'
import { Checkbox } from '../../../components/ui/Checkbox'

const PaymentSuccessModal = ({ paymentData, onClose, onSendNotification }) => {
  const [notificationChannels, setNotificationChannels] = useState({
    whatsapp: true,
    sms: false,
    email: false,
  })

  const [isSending, setIsSending] = useState(false)

  const handleSendNotification = async () => {
    setIsSending(true)

    setTimeout(() => {
      onSendNotification(notificationChannels)
      setIsSending(false)
    }, 1500)
  }

  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="bg-card rounded-lg shadow-elevation-xl border border-border w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-success/10 flex items-center justify-center mb-4">
              <Icon
                name="CheckCircle2"
                size={32}
                color="var(--color-success)"
              />
            </div>
            <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-2">
              Payment Recorded Successfully!
            </h2>
            <p className="text-sm text-muted-foreground">
              Payment has been recorded and invoice status updated
            </p>
          </div>

          <div className="bg-muted rounded-lg p-4 mb-6 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Invoice Number:
              </span>
              <span className="text-sm font-semibold text-foreground data-text">
                {paymentData?.invoiceNumber}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Customer:</span>
              <span className="text-sm font-semibold text-foreground">
                {paymentData?.customerName}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Payment Amount:
              </span>
              <span className="text-base font-semibold text-success data-text">
                ₹
                {paymentData?.amount?.toLocaleString('en-IN', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Payment Method:
              </span>
              <span className="text-sm font-semibold text-foreground">
                {paymentData?.paymentMethod}
              </span>
            </div>
            {paymentData?.referenceNumber && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Reference:
                </span>
                <span className="text-sm font-semibold text-foreground data-text">
                  {paymentData?.referenceNumber}
                </span>
              </div>
            )}
            <div className="pt-3 border-t border-border">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">
                  Remaining Balance:
                </span>
                <span
                  className={`text-base font-semibold data-text ${
                    paymentData?.newOutstanding === 0
                      ? 'text-success'
                      : 'text-warning'
                  }`}
                >
                  ₹
                  {paymentData?.newOutstanding?.toLocaleString('en-IN', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm font-medium text-muted-foreground">
                  Invoice Status:
                </span>
                <span
                  className={`text-sm font-semibold ${
                    paymentData?.newOutstanding === 0
                      ? 'text-success'
                      : 'text-warning'
                  }`}
                >
                  {paymentData?.newOutstanding === 0
                    ? 'Paid'
                    : 'Partially Paid'}
                </span>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-sm font-medium text-foreground mb-3">
              Send payment confirmation to customer:
            </p>
            <div className="space-y-3">
              <Checkbox
                label="WhatsApp"
                description="Instant notification via WhatsApp"
                checked={notificationChannels?.whatsapp}
                onChange={e =>
                  setNotificationChannels({
                    ...notificationChannels,
                    whatsapp: e?.target?.checked,
                  })
                }
              />
              <Checkbox
                label="SMS"
                description="Text message notification"
                checked={notificationChannels?.sms}
                onChange={e =>
                  setNotificationChannels({
                    ...notificationChannels,
                    sms: e?.target?.checked,
                  })
                }
              />
              <Checkbox
                label="Email"
                description="Detailed email with payment receipt"
                checked={notificationChannels?.email}
                onChange={e =>
                  setNotificationChannels({
                    ...notificationChannels,
                    email: e?.target?.checked,
                  })
                }
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              fullWidth
              disabled={isSending}
            >
              Close
            </Button>
            <Button
              variant="default"
              onClick={handleSendNotification}
              loading={isSending}
              fullWidth
              iconName="Send"
              iconPosition="left"
              disabled={
                !notificationChannels?.whatsapp &&
                !notificationChannels?.sms &&
                !notificationChannels?.email
              }
            >
              Send Notification
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentSuccessModal
