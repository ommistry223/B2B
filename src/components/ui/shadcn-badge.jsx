import * as React from 'react'
import { cva } from 'class-variance-authority'
import { motion } from 'framer-motion'
import { cn } from '@/util/cn'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-primary/40',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground shadow-lg hover:bg-destructive/80',
        outline: 'text-foreground border-primary',
        success:
          'border-transparent bg-gradient-to-r from-success to-success/80 text-success-foreground shadow-lg shadow-success/20',
        warning:
          'border-transparent bg-warning text-warning-foreground shadow-md',
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
