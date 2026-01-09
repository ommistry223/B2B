import React from 'react'
import Icon from '../../../components/AppIcon'

const AIInsightsPanel = ({ insights }) => {
  const getInsightIcon = type => {
    const icons = {
      prediction: 'Brain',
      recommendation: 'Lightbulb',
      warning: 'AlertTriangle',
      success: 'CheckCircle2',
    }
    return icons?.[type] || 'Info'
  }

  const getInsightColor = type => {
    const colors = {
      prediction: 'var(--color-primary)',
      recommendation: 'var(--color-secondary)',
      warning: 'var(--color-warning)',
      success: 'var(--color-success)',
    }
    return colors?.[type] || 'var(--color-muted-foreground)'
  }

  const getInsightBg = type => {
    const backgrounds = {
      prediction: 'bg-primary/10',
      recommendation: 'bg-secondary/10',
      warning: 'bg-warning/10',
      success: 'bg-success/10',
    }
    return backgrounds?.[type] || 'bg-muted'
  }

  return (
    <div className="bg-card rounded-lg p-4 md:p-6 shadow-elevation-sm border border-border">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon name="Sparkles" size={20} color="var(--color-primary)" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            AI-Powered Insights
          </h3>
          <p className="text-xs text-muted-foreground caption">
            Real-time predictions and recommendations
          </p>
        </div>
      </div>
      <div className="space-y-4">
        {insights?.map(insight => (
          <div
            key={insight?.id}
            className={`p-4 rounded-lg border border-border ${getInsightBg(
              insight?.type
            )} transition-smooth hover:shadow-elevation-sm`}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-1">
                <Icon
                  name={getInsightIcon(insight?.type)}
                  size={20}
                  color={getInsightColor(insight?.type)}
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-foreground mb-1">
                  {insight?.title}
                </h4>
                <p className="text-sm text-muted-foreground mb-3">
                  {insight?.description}
                </p>

                {insight?.confidence && (
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs text-muted-foreground caption">
                      Confidence:
                    </span>
                    <div className="flex-1 max-w-32 bg-muted rounded-full h-1.5">
                      <div
                        className="h-1.5 rounded-full bg-primary"
                        style={{ width: `${insight?.confidence}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-foreground data-text">
                      {insight?.confidence}%
                    </span>
                  </div>
                )}

                {insight?.action && (
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
                    <Icon
                      name="ArrowRight"
                      size={14}
                      color="var(--color-primary)"
                    />
                    <span className="text-xs font-medium text-primary">
                      {insight?.action}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AIInsightsPanel
