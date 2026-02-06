import * as React from 'react'
import { cva } from 'class-variance-authority'
import { motion } from 'framer-motion'
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from 'lucide-react'
import { cn } from '@/util/cn'

const alertVariants = cva(
  'relative w-full rounded-xl border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground shadow-lg',
  {
    variants: {
      variant: {
        default: 'bg-background text-foreground border-border',
        destructive:
          'border-destructive/50 text-destructive dark:border-destructive bg-destructive/10 shadow-destructive/20',
        success:
          'border-success/50 text-success dark:border-success bg-success/10 shadow-success/20',
        warning:
          'border-warning/50 text-warning dark:border-warning bg-warning/10 shadow-warning/20',
        info: 'border-primary/50 text-primary dark:border-primary bg-primary/10 shadow-primary/20',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

const icons = {
  default: Info,
  destructive: AlertCircle,
  success: CheckCircle2,
  warning: AlertTriangle,
  info: Info,
}

const Alert = React.forwardRef(
  ({ className, variant, children, ...props }, ref) => {
    const Icon = icons[variant] || icons.default

    return (
      <motion.div
        ref={ref}
        role="alert"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className={cn(alertVariants({ variant }), className)}
        {...props}
      >
        <Icon className="h-5 w-5" />
        {children}
      </motion.div>
    )
  }
)
Alert.displayName = 'Alert'

const AlertTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn('mb-1 font-semibold leading-none tracking-tight', className)}
    {...props}
  />
))
AlertTitle.displayName = 'AlertTitle'

const AlertDescription = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('text-sm [&_p]:leading-relaxed', className)}
    {...props}
  />
))
AlertDescription.displayName = 'AlertDescription'

export { Alert, AlertTitle, AlertDescription }
