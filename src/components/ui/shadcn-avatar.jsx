import * as React from 'react'
import * as AvatarPrimitive from '@radix-ui/react-avatar'
import { motion } from 'framer-motion'
import { cn } from '@/util/cn'

const Avatar = React.forwardRef(({ className, ...props }, ref) => (
  <motion.div
    whileHover={{ scale: 1.1, rotate: 5 }}
    transition={{ type: 'spring', stiffness: 400, damping: 15 }}
  >
    <AvatarPrimitive.Root
      ref={ref}
      className={cn(
        'relative flex h-12 w-12 shrink-0 overflow-hidden rounded-full ring-2 ring-primary/20 ring-offset-2 ring-offset-background',
        className
      )}
      {...props}
    />
  </motion.div>
))
Avatar.displayName = AvatarPrimitive.Root.displayName

const AvatarImage = React.forwardRef(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn('aspect-square h-full w-full object-cover', className)}
    {...props}
  />
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = React.forwardRef(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      'flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-primary-foreground font-semibold',
      className
    )}
    {...props}
  />
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

export { Avatar, AvatarImage, AvatarFallback }
