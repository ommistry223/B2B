import { motion } from 'framer-motion'
import { cn } from '@/util/cn'

function Skeleton({ className, ...props }) {
  return (
    <motion.div
      animate={{
        opacity: [0.5, 0.8, 0.5],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      className={cn(
        'rounded-lg bg-gradient-to-r from-muted via-muted-foreground/20 to-muted',
        className
      )}
      style={{
        backgroundSize: '200% 100%',
      }}
      {...props}
    />
  )
}

export { Skeleton }
