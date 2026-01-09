import React from 'react'
import Icon from '../../../components/AppIcon'
import Button from '../../../components/ui/Button'

const CustomerDetailModal = ({ customer, onClose }) => {
  if (!customer) return null

  const getRiskBadge = level => {
    const configs = {
      Low: { bg: 'bg-success/10', text: 'text-success', icon: 'CheckCircle2' },
      Medium: {
        bg: 'bg-warning/10',
        text: 'text-warning',
        icon: 'AlertCircle',
      },
      High: { bg: 'bg-error/10', text: 'text-error', icon: 'AlertTriangle' },
    }
    const config = configs?.[level]
    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium ${config?.bg} ${config?.text}`}
      >
        <Icon name={config?.icon} size={16} />
        {level}Risk
      </span>
    )
  }

  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="bg-card rounded-lg shadow-elevation-xl border border-border w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-lg font-medium text-primary">
                {customer?.name
                  ?.split(' ')
                  ?.map(n => n?.[0])
                  ?.join('')}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                {customer?.name}
              </h2>
              <p className="text-sm text-muted-foreground">
                {customer?.company}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            iconName="X"
            iconSize={20}
            onClick={onClose}
          />
        </div>

        <div
          className="p-6 overflow-y-auto"
          style={{ maxHeight: 'calc(90vh - 180px)' }}
        >
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">
                Risk Assessment
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1 caption">
                    Risk Level
                  </p>
                  <div className="mt-2">
                    {getRiskBadge(customer?.riskLevel)}
                  </div>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1 caption">
                    Risk Score
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex-1 bg-background rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          customer?.riskScore >= 70
                            ? 'bg-error'
                            : customer?.riskScore >= 40
                            ? 'bg-warning'
                            : 'bg-success'
                        }`}
                        style={{ width: `${customer?.riskScore}%` }}
                      />
                    </div>
                    <span className="text-lg font-bold text-foreground data-text">
                      {customer?.riskScore}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">
                Payment Predictions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1 caption">
                    Expected Delay
                  </p>
                  <p className="text-2xl font-bold text-foreground mt-2 data-text">
                    {customer?.expectedDelay}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">days</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1 caption">
                    Prediction Confidence
                  </p>
                  <p className="text-2xl font-bold text-foreground mt-2 data-text">
                    {customer?.predictionConfidence}%
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">accuracy</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1 caption">
                    Outstanding Amount
                  </p>
                  <p className="text-2xl font-bold text-foreground mt-2 data-text">
                    ₹{customer?.outstanding?.toLocaleString('en-IN')}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    total due
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">
                Payment Behavior Analysis
              </h3>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-foreground">
                  {customer?.paymentBehavior}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">
                Historical Performance
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-muted rounded-lg text-center">
                  <p className="text-xs text-muted-foreground mb-1 caption">
                    Avg Delay
                  </p>
                  <p className="text-xl font-bold text-foreground data-text">
                    {customer?.avgDelay}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">days</p>
                </div>
                <div className="p-4 bg-muted rounded-lg text-center">
                  <p className="text-xs text-muted-foreground mb-1 caption">
                    On-Time Rate
                  </p>
                  <p className="text-xl font-bold text-foreground data-text">
                    {customer?.onTimeRate}%
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">payments</p>
                </div>
                <div className="p-4 bg-muted rounded-lg text-center">
                  <p className="text-xs text-muted-foreground mb-1 caption">
                    Total Invoices
                  </p>
                  <p className="text-xl font-bold text-foreground data-text">
                    {customer?.totalInvoices}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">issued</p>
                </div>
                <div className="p-4 bg-muted rounded-lg text-center">
                  <p className="text-xs text-muted-foreground mb-1 caption">
                    Credit Limit
                  </p>
                  <p className="text-xl font-bold text-foreground data-text">
                    ₹{customer?.creditLimit?.toLocaleString('en-IN')}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    available
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">
                Recommended Actions
              </h3>
              <div className="space-y-2">
                {customer?.recommendations?.map((rec, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 bg-primary/5 rounded-lg border border-primary/20"
                  >
                    <Icon
                      name="Lightbulb"
                      size={18}
                      color="var(--color-primary)"
                      className="flex-shrink-0 mt-0.5"
                    />
                    <p className="text-sm text-foreground">{rec}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-border">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button
            variant="default"
            iconName="FileText"
            iconPosition="left"
            iconSize={16}
          >
            View Invoices
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CustomerDetailModal
