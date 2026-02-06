import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const PageTransition = ({ children }) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{
          opacity: 0,
          y: 20,
          filter: 'blur(10px)',
        }}
        animate={{
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
        }}
        exit={{
          opacity: 0,
          y: -20,
          filter: 'blur(10px)',
        }}
        transition={{
          duration: 0.5,
          ease: [0.43, 0.13, 0.23, 0.96],
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

export default PageTransition
