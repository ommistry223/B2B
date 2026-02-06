import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, X, Sparkles, Zap, Shield, TrendingUp } from 'lucide-react'

const FloatingActionMenu = () => {
  const [isOpen, setIsOpen] = useState(false)

  const menuItems = [
    {
      icon: <Sparkles size={20} />,
      label: 'New Invoice',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: <Zap size={20} />,
      label: 'Quick Pay',
      color: 'from-yellow-500 to-orange-500',
    },
    {
      icon: <Shield size={20} />,
      label: 'Security',
      color: 'from-green-500 to-teal-500',
    },
    {
      icon: <TrendingUp size={20} />,
      label: 'Analytics',
      color: 'from-blue-500 to-indigo-500',
    },
  ]

  const containerVariants = {
    open: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
    closed: {
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
  }

  const itemVariants = {
    open: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 24,
      },
    },
    closed: {
      y: 20,
      opacity: 0,
      scale: 0.3,
      transition: {
        duration: 0.2,
      },
    },
  }

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <motion.div
        variants={containerVariants}
        initial="closed"
        animate={isOpen ? 'open' : 'closed'}
        className="flex flex-col-reverse items-end gap-4"
      >
        {/* Menu Items */}
        <AnimatePresence>
          {isOpen &&
            menuItems.map((item, index) => (
              <motion.button
                key={index}
                variants={itemVariants}
                whileHover={{
                  scale: 1.1,
                  x: -10,
                }}
                whileTap={{ scale: 0.95 }}
                className={`
                flex items-center gap-3 px-4 py-3 rounded-full
                bg-gradient-to-r ${item.color}
                text-white shadow-2xl
                hover:shadow-3xl transition-shadow
                group
              `}
              >
                <motion.span
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  {item.icon}
                </motion.span>
                <motion.span
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 'auto', opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  className="font-semibold whitespace-nowrap overflow-hidden"
                >
                  {item.label}
                </motion.span>
              </motion.button>
            ))}
        </AnimatePresence>

        {/* Main Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(!isOpen)}
          className={`
            w-16 h-16 rounded-full
            bg-gradient-to-br from-indigo-600 to-purple-600
            text-white shadow-2xl
            flex items-center justify-center
            relative overflow-hidden
          `}
        >
          {/* Animated background */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600"
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'linear',
            }}
          />

          {/* Icon */}
          <motion.div
            animate={{ rotate: isOpen ? 135 : 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="relative z-10"
          >
            {isOpen ? <X size={24} /> : <Plus size={24} />}
          </motion.div>

          {/* Ripple effect */}
          <motion.div
            className="absolute inset-0 rounded-full bg-white"
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{
              scale: [0, 2],
              opacity: [0.5, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeOut',
            }}
          />
        </motion.button>
      </motion.div>
    </div>
  )
}

export default FloatingActionMenu
