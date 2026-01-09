import React from 'react'
import Icon from '../../../components/AppIcon'
import { useData } from '../../../context/DataContext'

const RecentActivityFeed = () => {
  const { getRecentActivity } = useData()
  const activities = getRecentActivity(10).map((activity, index) => ({
    id: index + 1,
    type: activity.type,
    title: activity.type === 'invoice' ? 'Invoice Created' : 'Payment Received',
    description: activity.action,
    timestamp: getTimeAgo(activity.time),
    icon: activity.icon,
    iconColor:
      activity.type === 'payment'
        ? 'var(--color-success)'
        : 'var(--color-primary)',
    bgColor: activity.type === 'payment' ? 'bg-success/10' : 'bg-primary/10',
  }))

  function getTimeAgo(dateString) {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now - date
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 60) return `${minutes} minutes ago`
    if (hours < 24) return `${hours} hours ago`
    return `${days} days ago`
  }

  return (
    <div className="bg-card rounded-lg p-4 md:p-6 shadow-elevation-sm border border-border">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <div>
          <h3 className="text-base md:text-lg font-semibold text-foreground mb-1">
            Recent Activities
          </h3>
          <p className="text-xs md:text-sm text-muted-foreground">
            Real-time business updates
          </p>
        </div>
        <button className="text-xs md:text-sm text-primary hover:text-primary/80 font-medium transition-smooth">
          View All
        </button>
      </div>
      <div className="space-y-3 md:space-y-4 max-h-96 md:max-h-[500px] overflow-y-auto">
        {activities?.map(activity => (
          <div
            key={activity?.id}
            className="flex gap-3 md:gap-4 p-3 md:p-4 rounded-lg hover:bg-muted transition-smooth cursor-pointer"
          >
            <div
              className={`flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-lg ${activity?.bgColor} flex items-center justify-center`}
            >
              <Icon
                name={activity?.icon}
                size={20}
                color={activity?.iconColor}
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm md:text-base font-medium text-foreground mb-1">
                {activity?.title}
              </h4>
              <p className="text-xs md:text-sm text-muted-foreground line-clamp-2 mb-2">
                {activity?.description}
              </p>
              <p className="text-xs text-muted-foreground caption">
                {activity?.timestamp}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RecentActivityFeed
