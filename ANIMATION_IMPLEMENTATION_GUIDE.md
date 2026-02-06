# Advanced Animation Implementation Guide

## Overview

This guide covers the comprehensive Framer Motion animation system implemented across the CreditFlow Pro application, including page transitions, micro-interactions, and advanced animation patterns.

## Table of Contents

1. [Animation Utilities](#animation-utilities)
2. [Animated Components](#animated-components)
3. [Page Transitions](#page-transitions)
4. [Micro-Interactions](#micro-interactions)
5. [Usage Examples](#usage-examples)
6. [Best Practices](#best-practices)

---

## Animation Utilities

### Location: `src/util/animations.js`

This file contains all animation presets and configurations using Framer Motion.

### Categories

#### 1. Page Transitions

```javascript
import {
  pageTransition,
  slideTransition,
  fadeTransition,
  scaleTransition,
} from '../util/animations'

// Example usage
;<motion.div {...pageTransition}>{/* Page content */}</motion.div>
```

**Available Transitions:**

- `pageTransition` - Smooth fade and slide up/down
- `slideTransition` - Horizontal slide animation
- `fadeTransition` - Simple fade in/out
- `scaleTransition` - Scale with fade

#### 2. Stagger Animations

Perfect for lists and grids:

```javascript
import { staggerContainer, staggerItem } from '../util/animations'

;<motion.div variants={staggerContainer}>
  {items.map((item, i) => (
    <motion.div key={i} variants={staggerItem}>
      {item}
    </motion.div>
  ))}
</motion.div>
```

**Available Stagger Variants:**

- `staggerContainer` - Parent container with stagger timing
- `staggerFastContainer` - Faster stagger (0.05s delay)
- `staggerItem` - Child item animation (fade + slide up)
- `staggerItemSlide` - Horizontal slide variant
- `staggerItemScale` - Scale variant

#### 3. Scroll Animations

Trigger animations when elements enter viewport:

```javascript
import { fadeInUp, fadeInLeft, fadeInRight, scaleIn } from '../util/animations'

;<motion.div {...fadeInUp}>Content appears when scrolling</motion.div>
```

**Available Scroll Animations:**

- `fadeInUp` - Fade in + slide from bottom
- `fadeInDown` - Fade in + slide from top
- `fadeInLeft` - Fade in + slide from left
- `fadeInRight` - Fade in + slide from right
- `scaleIn` - Fade in + scale up
- `zoomIn` - Smooth zoom effect

#### 4. Hover Animations

Interactive hover effects:

```javascript
import { hoverScale, hoverLift, hoverGlow } from '../util/animations'

;<motion.div {...hoverScale}>Hover me!</motion.div>
```

**Available Hover Effects:**

- `hoverScale` - Scale up on hover
- `hoverLift` - Lift effect (translate Y)
- `hoverGlow` - Glow shadow effect
- `hoverRotate` - Subtle rotation

#### 5. Card Animations

Specialized for card components:

```javascript
import { cardHover, cardTap, cardFloat } from '../util/animations'

;<motion.div {...cardHover} {...cardTap}>
  Card content
</motion.div>
```

#### 6. Button Animations

Enhanced button interactions:

```javascript
import { buttonHover, buttonPulse } from '../util/animations'

;<motion.button {...buttonHover}>Click me</motion.button>
```

---

## Animated Components

### Location: `src/components/AnimatedComponents.jsx`

Pre-built animated components for common use cases.

### 1. AnimatedSection

Wrapper for sections with scroll-triggered animations:

```jsx
import { AnimatedSection } from '../components/AnimatedComponents'

;<AnimatedSection className="py-20">
  <h2>Section Title</h2>
  {/* Content with stagger effect */}
</AnimatedSection>
```

### 2. AnimatedCard

Card with hover effects:

```jsx
import { AnimatedCard } from '../components/AnimatedComponents'

;<AnimatedCard hoverEffect={true} delay={0.2} className="p-6">
  Card content
</AnimatedCard>
```

### 3. AnimatedText

Text with reveal animations:

```jsx
import { AnimatedText } from '../components/AnimatedComponents'

;<AnimatedText
  as="h1"
  variant="fadeInUp"
  delay={0.1}
  className="text-4xl font-bold"
>
  Animated Heading
</AnimatedText>
```

**Variants:** `fadeInUp`, `fadeInLeft`, `slideIn`

### 4. AnimatedGradientText

Text with animated gradient shimmer:

```jsx
import { AnimatedGradientText } from '../components/AnimatedComponents'

;<AnimatedGradientText>Shimmering Text</AnimatedGradientText>
```

### 5. AnimatedList & AnimatedGrid

Lists and grids with stagger animations:

```jsx
import { AnimatedList, AnimatedGrid } from '../components/AnimatedComponents'

<AnimatedList staggerDelay={0.1}>
  {items.map(item => (
    <div key={item.id}>{item.name}</div>
  ))}
</AnimatedList>

<AnimatedGrid columns={3} staggerDelay={0.08}>
  {cards.map(card => (
    <Card key={card.id} {...card} />
  ))}
</AnimatedGrid>
```

### 6. FloatingElement

Floating animation effect:

```jsx
import { FloatingElement } from '../components/AnimatedComponents'

;<FloatingElement yOffset={20} duration={3}>
  <Icon name="Star" />
</FloatingElement>
```

### 7. LiquidBlob

Morphing blob shape for backgrounds:

```jsx
import { LiquidBlob } from '../components/AnimatedComponents'

;<LiquidBlob
  size={400}
  color="bg-gradient-to-br from-blue-500 to-purple-600"
  className="absolute top-0 left-0"
/>
```

### 8. CountUpNumber

Animated number counter:

```jsx
import { CountUpNumber } from '../components/AnimatedComponents'

;<CountUpNumber
  from={0}
  to={5000}
  duration={2}
  className="text-4xl font-bold"
/>
```

---

## Page Transitions

### Location: `src/Routes.jsx`

All routes are wrapped with Framer Motion for smooth page transitions.

### Implementation

```jsx
<AnimatePresence mode="wait">
  <motion.div
    key={location.pathname}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.4 }}
  >
    <Component />
  </motion.div>
</AnimatePresence>
```

### Custom Page Wrapper

```jsx
import AnimatedPageWrapper from '../components/AnimatedPageWrapper'

;<AnimatedPageWrapper variant="slide">
  <YourPageContent />
</AnimatedPageWrapper>
```

**Available Variants:**

- `fade` - Simple fade
- `slide` - Horizontal slide
- `slideUp` - Vertical slide
- `scale` - Scale effect
- `scaleRotate` - Scale with rotation
- `none` - No animation

---

## Micro-Interactions

### Dashboard Implementation

The dashboard includes micro-interactions on:

1. **Metric Cards**
   - Icon rotates 360° on hover
   - Card lifts up on hover
   - Background gradient appears
   - Trend arrows animate continuously

2. **Charts**
   - Scale up slightly on hover
   - Smooth loading animations

3. **Navigation**
   - Buttons scale on hover
   - Icons rotate smoothly

### Button Implementation

```jsx
import EnhancedButton from '../components/ui/EnhancedButton'

;<EnhancedButton
  variant="default"
  size="lg"
  animationType="lift"
  onClick={handleClick}
>
  Click me
</EnhancedButton>
```

**Animation Types:**

- `scale` - Scale on hover (default)
- `lift` - Lift effect
- `glow` - Glow shadow
- `none` - No animation

---

## Usage Examples

### 1. Landing Page Hero

```jsx
import { motion } from 'framer-motion'
import {
  staggerContainer,
  staggerItem,
  heroAnimation,
} from '../util/animations'

;<motion.section
  initial="initial"
  animate="animate"
  variants={staggerContainer}
  className="hero"
>
  <motion.h1 variants={staggerItem}>Welcome to CreditFlow Pro</motion.h1>
  <motion.p variants={staggerItem}>
    Transform your B2B credit management
  </motion.p>
  <motion.button variants={staggerItem}>Get Started</motion.button>
</motion.section>
```

### 2. Feature Cards Grid

```jsx
import { AnimatedGrid } from '../components/AnimatedComponents'
import { motion } from 'framer-motion'

;<AnimatedGrid columns={3} staggerDelay={0.08}>
  {features.map((feature, index) => (
    <motion.div
      key={index}
      whileHover={{ y: -10, scale: 1.02 }}
      className="feature-card"
    >
      <h3>{feature.title}</h3>
      <p>{feature.description}</p>
    </motion.div>
  ))}
</AnimatedGrid>
```

### 3. Stats Counter

```jsx
import { CountUpNumber } from '../components/AnimatedComponents'

;<div className="stats-grid">
  {stats.map((stat, i) => (
    <div key={i} className="stat">
      <CountUpNumber from={0} to={stat.value} duration={2} />
      <span>{stat.label}</span>
    </div>
  ))}
</div>
```

### 4. Modal with Animation

```jsx
import { motion, AnimatePresence } from 'framer-motion'
import { modalBackdrop, modalContent } from '../util/animations'

;<AnimatePresence>
  {isOpen && (
    <>
      <motion.div {...modalBackdrop} className="backdrop" />
      <motion.div {...modalContent} className="modal">
        <h2>Modal Title</h2>
        <p>Content</p>
      </motion.div>
    </>
  )}
</AnimatePresence>
```

### 5. Loading Spinner

```jsx
import { motion } from 'framer-motion'
import { spinnerRotate } from '../util/animations'

;<motion.div className="spinner" {...spinnerRotate}>
  <div className="spinner-ring" />
</motion.div>
```

---

## Best Practices

### 1. Performance Optimization

- **Use `will-change` sparingly** - Only for frequently animated elements
- **Limit simultaneous animations** - Stagger large lists with appropriate delays
- **Prefer transforms over position changes** - Use `translateX/Y` instead of `left/top`
- **Use `AnimatePresence` with `mode="wait"`** - Prevents layout shifts

### 2. Animation Timing

- **Page transitions:** 0.3-0.5s
- **Micro-interactions:** 0.2-0.3s
- **Hover effects:** 0.2s
- **Stagger delays:** 0.05-0.1s per item

### 3. Easing Functions

```javascript
// Custom easing
const customEasing = [0.43, 0.13, 0.23, 0.96] // Recommended
const smoothEasing = [0.6, 0.05, 0.01, 0.9] // For slides
const standardEasing = [0.4, 0, 0.2, 1] // Material design
```

### 4. Accessibility

```jsx
// Respect user preferences
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

<motion.div
  animate={prefersReducedMotion ? {} : { y: [0, -10, 0] }}
>
  Content
</motion.div>
```

### 5. Conditional Animations

```jsx
// Only animate on first render
const [hasAnimated, setHasAnimated] = useState(false)

<motion.div
  initial={hasAnimated ? false : { opacity: 0 }}
  animate={{ opacity: 1 }}
  onAnimationComplete={() => setHasAnimated(true)}
>
  Content
</motion.div>
```

---

## Advanced Techniques

### 1. Gesture-based Animations

```jsx
import { motion } from 'framer-motion'

;<motion.div
  drag="x"
  dragConstraints={{ left: -100, right: 100 }}
  dragElastic={0.2}
  whileDrag={{ scale: 1.1 }}
>
  Draggable element
</motion.div>
```

### 2. Scroll-linked Animations

```jsx
import { useScroll, useTransform, motion } from 'framer-motion'

const { scrollYProgress } = useScroll()
const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

<motion.div style={{ opacity }}>
  Fades on scroll
</motion.div>
```

### 3. SVG Path Animations

```jsx
<motion.svg>
  <motion.path
    d="M 0 0 L 100 100"
    initial={{ pathLength: 0 }}
    animate={{ pathLength: 1 }}
    transition={{ duration: 2 }}
  />
</motion.svg>
```

---

## Troubleshooting

### Issue: Animations not working

- Ensure Framer Motion is installed: `npm install framer-motion`
- Check that components are wrapped in `<motion.*>` elements
- Verify import paths are correct

### Issue: Laggy animations

- Reduce number of simultaneous animations
- Use `will-change: transform` CSS property
- Simplify animation complexity
- Check for layout thrashing

### Issue: Layout shifts

- Use `AnimatePresence` with `mode="wait"`
- Set explicit dimensions on animated elements
- Use `layout` prop for shared element transitions

---

## Resources

- [Framer Motion Documentation](https://www.framer.com/motion/)
- [Animation Best Practices](https://web.dev/animations/)
- [Performance Tips](https://www.framer.com/motion/guide-reduce-bundle-size/)

---

## Quick Reference

```jsx
// Import all utilities
import * as animations from '../util/animations'

// Import specific components
import {
  AnimatedSection,
  AnimatedCard,
  AnimatedText,
  AnimatedGradientText,
  FloatingElement,
  LiquidBlob,
  CountUpNumber,
  AnimatedList,
  AnimatedGrid,
} from '../components/AnimatedComponents'

// Import Framer Motion
import { motion, AnimatePresence } from 'framer-motion'
```

---

**Last Updated:** February 2026
**Version:** 2.0
**Author:** CreditFlow Pro Development Team
