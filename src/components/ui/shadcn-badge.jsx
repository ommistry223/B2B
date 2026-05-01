import * as React from 'react'
import { cva } from 'class-variance-authority'
import { motion } from 'framer-motion'
import { cn } from '@/util/cn'

const badgeVariants = cva(
  'inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground',
        secondary:
          'bg-muted text-foreground',
        destructive:
          'bg-destructive text-destructive-foreground',
        outline: 'border border-border text-foreground',
        success:
          'bg-success text-success-foreground',
        warning:
          'bg-warning text-warning-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

function Badge({ className, variant, children, ...props }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export { Badge, badgeVariants }
