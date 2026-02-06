import * as React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/util/cn'

const Separator = React.forwardRef(
  (
    { className, orientation = 'horizontal', decorative = true, ...props },
    ref
  ) => (
    <motion.div
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      initial={{
        scaleX: orientation === 'horizontal' ? 0 : 1,
        scaleY: orientation === 'vertical' ? 0 : 1,
      }}
      animate={{ scaleX: 1, scaleY: 1 }}
      transition={{ duration: 0.5 }}
      className={cn(
        'shrink-0 bg-gradient-to-r from-transparent via-border to-transparent',
        orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
        className
      )}
      {...props}
    />
  )
)
Separator.displayName = 'Separator'

export { Separator }
