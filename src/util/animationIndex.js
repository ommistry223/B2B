/**
 * Animation Utilities - Central Export
 * Import all animation utilities from this single file
 */

// Export all animation presets
export * from './animations'

// Re-export commonly used Framer Motion hooks and components
export { motion, AnimatePresence, useAnimation, useScroll, useTransform } from 'framer-motion'

// Export animated components
export {
  AnimatedSection,
  AnimatedDiv,
  AnimatedCard,
  AnimatedButton,
  AnimatedList,
  AnimatedListItem,
  AnimatedGrid,
  AnimatedText,
  AnimatedGradientText,
  FloatingElement,
  PulsingElement,
  RotatingElement,
  LiquidBlob,
  ParallaxElement,
  CountUpNumber,
  ScaleOnView,
  SlideUpReveal
} from '../components/AnimatedComponents'

// Export page wrapper
export { default as AnimatedPageWrapper } from '../components/AnimatedPageWrapper'

// Export enhanced button
export { default as EnhancedButton } from '../components/ui/EnhancedButton'
