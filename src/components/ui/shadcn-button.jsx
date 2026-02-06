import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva } from 'class-variance-authority'
import { motion } from 'framer-motion'
import { cn } from '@/util/cn'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden',
  {
    variants: {
      variant: {
        default:
          'bg-gradient-to-r from-primary via-primary to-secondary text-primary-foreground shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:shadow-xl',
        destructive:
          'bg-destructive text-destructive-foreground shadow-lg hover:bg-destructive/90',
        outline:
          'border-2 border-primary bg-background hover:bg-primary/10 hover:border-primary/80 shadow-sm',
        secondary:
          'bg-gradient-to-r from-secondary to-secondary/80 text-secondary-foreground shadow-lg shadow-secondary/30 hover:shadow-secondary/50',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        success:
          'bg-gradient-to-r from-success to-success/80 text-success-foreground shadow-lg shadow-success/30 hover:shadow-success/50',
        warning:
          'bg-gradient-to-r from-warning to-warning/80 text-warning-foreground shadow-lg shadow-warning/30',
      },
      size: {
        default: 'h-11 px-6 py-2',
        sm: 'h-9 rounded-lg px-4 text-xs',
        lg: 'h-12 rounded-lg px-8 text-base',
        xl: 'h-14 rounded-xl px-10 text-lg',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : motion.button

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        {...props}
      >
        {/* Shine effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full"
          animate={{
            translateX: ['0%', '200%'],
          }}
          transition={{
            repeat: Infinity,
            duration: 3,
            ease: 'linear',
            repeatDelay: 2,
          }}
        />

        {/* Content */}
        <span className="relative z-10 flex items-center gap-2">
          {children}
        </span>
      </Comp>
    )
  }
)

Button.displayName = 'Button'

export { Button, buttonVariants }
