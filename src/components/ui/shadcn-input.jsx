import * as React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/util/cn'

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  const [isFocused, setIsFocused] = React.useState(false)

  return (
    <div className="relative">
      <motion.input
        type={type}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={cn(
          'flex h-11 w-full rounded-lg border-2 border-input bg-background px-4 py-2 text-sm',
          'ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium',
          'placeholder:text-muted-foreground',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'focus-visible:border-primary transition-all duration-300',
          'disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />

      {/* Animated border glow */}
      <motion.div
        className="absolute inset-0 rounded-lg pointer-events-none"
        animate={{
          boxShadow: isFocused
            ? '0 0 0 2px rgba(99, 102, 241, 0.3)'
            : '0 0 0 0px rgba(99, 102, 241, 0)',
        }}
        transition={{ duration: 0.3 }}
      />
    </div>
  )
})
Input.displayName = 'Input'

export { Input }
