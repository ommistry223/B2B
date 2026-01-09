import React from 'react'
import { Checkbox, CheckboxGroup } from '../../../components/ui/Checkbox'
import Select from '../../../components/ui/Select'
import Icon from '../../../components/AppIcon'

const ReminderSettings = ({
  reminderChannels,
  onReminderChannelsChange,
  reminderTiming,
  onReminderTimingChange,
}) => {
  const reminderTimingOptions = [
    { value: 'before_3', label: '3 Days Before Due Date' },
    { value: 'before_1', label: '1 Day Before Due Date' },
    { value: 'on_due', label: 'On Due Date' },
    { value: 'after_1', label: '1 Day After Due Date' },
    { value: 'after_3', label: '3 Days After Due Date' },
    { value: 'after_7', label: '7 Days After Due Date' },
  ]

  const channelConfig = {
    whatsapp: {
      icon: 'MessageCircle',
      color: 'var(--color-success)',
      label: 'WhatsApp',
      description: 'Send reminders via WhatsApp',
    },
    sms: {
      icon: 'Smartphone',
      color: 'var(--color-primary)',
      label: 'SMS',
      description: 'Send reminders via SMS',
    },
    email: {
      icon: 'Mail',
      color: 'var(--color-secondary)',
      label: 'Email',
      description: 'Send reminders via Email',
    },
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex items-center gap-2">
        <Icon name="Bell" size={20} color="var(--color-foreground)" />
        <h3 className="text-base font-semibold text-foreground">
          Automated Reminders
        </h3>
      </div>
      <CheckboxGroup
        label="Reminder Channels"
        description="Select channels for payment reminders"
      >
        {Object.entries(channelConfig)?.map(([key, config]) => (
          <div
            key={key}
            className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted transition-smooth"
          >
            <Icon
              name={config?.icon}
              size={20}
              color={config?.color}
              className="mt-0.5 flex-shrink-0"
            />
            <div className="flex-1">
              <Checkbox
                label={config?.label}
                description={config?.description}
                checked={reminderChannels?.[key]}
                onChange={e =>
                  onReminderChannelsChange(key, e?.target?.checked)
                }
              />
            </div>
          </div>
        ))}
      </CheckboxGroup>
      <Select
        label="Reminder Timing"
        description="When should reminders be sent?"
        options={reminderTimingOptions}
        value={reminderTiming}
        onChange={onReminderTimingChange}
        multiple
      />
      <div className="p-4 bg-accent/10 border border-accent rounded-lg">
        <div className="flex gap-3">
          <Icon
            name="Info"
            size={20}
            color="var(--color-accent)"
            className="flex-shrink-0 mt-0.5"
          />
          <div>
            <p className="text-sm font-medium text-foreground mb-1">
              Reminder Best Practices
            </p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• WhatsApp has the highest engagement rate in India</li>
              <li>• Send first reminder 3 days before due date</li>
              <li>• Follow up 1 day after due date if unpaid</li>
              <li>• Escalate to phone calls after 7 days overdue</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReminderSettings
