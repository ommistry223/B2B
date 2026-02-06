# How to Use the Advanced Animation System

## Quick Start Guide

Your entire application now has access to a comprehensive animation system built with Framer Motion. Here's how to use it in your pages and components.

## Basic Usage

### 1. Import Animation Utilities

```jsx
// Import animation presets
import {
  staggerContainer,
  staggerItem,
  fadeInUp,
  cardHover,
} from '@/util/animations'

// Import animated components
import {
  AnimatedSection,
  AnimatedCard,
  AnimatedText,
  AnimatedGradientText,
  FloatingElement,
  CountUpNumber,
} from '@/components/AnimatedComponents'

// Import from centralized index
import {
  AnimatedSection,
  staggerContainer,
  fadeInUp,
} from '@/util/animationIndex'
```

### 2. Wrap Sections with AnimatedSection

```jsx
<AnimatedSection className="py-20">
  <h2>Your Content</h2>
  {/* Content automatically fades in when scrolled into view */}
</AnimatedSection>
```

### 3. Add Stagger Animations

```jsx
<motion.div
  initial="initial"
  whileInView="animate"
  viewport={{ once: true }}
  variants={staggerContainer}
>
  {items.map((item, index) => (
    <motion.div key={index} variants={staggerItem}>
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

### 4. Use Animated Text

```jsx
<AnimatedText
  as="h1"
  variant="fadeInUp"
  delay={0.2}
  className="text-4xl font-bold"
>
  Your Heading
</AnimatedText>

<AnimatedGradientText>Highlighted Text</AnimatedGradientText>
```

### 5. Add Floating Elements

```jsx
<FloatingElement yOffset={20} duration={3} delay={0}>
  <div className="w-16 h-16 bg-primary rounded-full" />
</FloatingElement>
```

### 6. Animated Numbers

```jsx
<CountUpNumber value={1000} duration={2} prefix="$" suffix="+" />
```

## Available Animation Presets

### Page Transitions

```jsx
import { pageTransition } from '@/util/animations'

;<motion.div {...pageTransition}>{/* Page content */}</motion.div>
```

### Card Animations

```jsx
import { cardHover } from '@/util/animations'

;<motion.div whileHover={cardHover.whileHover}>{/* Card content */}</motion.div>
```

### Button Animations

```jsx
import { buttonHover } from '@/util/animations'

;<motion.button whileHover={buttonHover.whileHover}>Click Me</motion.button>
```

### Scroll Reveal

```jsx
import { scrollReveal } from '@/util/animations'

;<motion.div {...scrollReveal}>{/* Content reveals on scroll */}</motion.div>
```

## Advanced Techniques

### 1. Custom Hover Effects

```jsx
<motion.div
  whileHover={{
    scale: 1.05,
    y: -8,
    rotate: 2,
  }}
  transition={{
    duration: 0.3,
    type: 'spring',
    stiffness: 300,
  }}
>
  Your content
</motion.div>
```

### 2. Sequential Reveals

```jsx
<motion.div
  initial="initial"
  whileInView="animate"
  viewport={{ once: true }}
  variants={{
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  }}
>
  {items.map((item, i) => (
    <motion.div
      key={i}
      variants={{
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
      }}
    >
      {item}
    </motion.div>
  ))}
</motion.div>
```

### 3. Layout Animations

```jsx
<motion.div
  layout
  transition={{
    layout: { duration: 0.3 },
  }}
>
  {/* Content that changes size/position */}
</motion.div>
```

### 4. Exit Animations

```jsx
import { AnimatePresence } from 'framer-motion'

;<AnimatePresence mode="wait">
  {show && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      Content
    </motion.div>
  )}
</AnimatePresence>
```

### 5. Scroll-Based Animations

```jsx
import { useScroll, useTransform } from 'framer-motion'

function Component() {
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], [0, -100])

  return <motion.div style={{ y }}>Parallax content</motion.div>
}
```

## Animation Patterns

### Pattern 1: Hero Section

```jsx
<AnimatedSection>
  <motion.div initial="initial" animate="animate" variants={staggerContainer}>
    <motion.h1 variants={staggerItem}>
      <AnimatedGradientText>Hero Title</AnimatedGradientText>
    </motion.h1>
    <motion.p variants={staggerItem}>Description text</motion.p>
    <motion.div variants={staggerItem}>
      <Button>CTA Button</Button>
    </motion.div>
  </motion.div>
</AnimatedSection>
```

### Pattern 2: Feature Grid

```jsx
<AnimatedGrid columns={3} gap={8} stagger={0.1}>
  {features.map((feature, index) => (
    <motion.div
      key={index}
      whileHover={{
        y: -12,
        scale: 1.03,
        rotateZ: 1,
      }}
      className="feature-card"
    >
      <FloatingElement delay={index * 0.2}>
        <Icon name={feature.icon} />
      </FloatingElement>
      <h3>{feature.title}</h3>
      <p>{feature.description}</p>
    </motion.div>
  ))}
</AnimatedGrid>
```

### Pattern 3: Stats Counter

```jsx
<div className="stats-container">
  {stats.map((stat, index) => (
    <AnimatedCard key={index} delay={index * 0.1}>
      <CountUpNumber
        value={stat.value}
        duration={2}
        prefix={stat.prefix}
        suffix={stat.suffix}
      />
      <p>{stat.label}</p>
    </AnimatedCard>
  ))}
</div>
```

### Pattern 4: Testimonial Carousel

```jsx
<AnimatePresence mode="wait">
  <motion.div
    key={currentTestimonial}
    initial={{ opacity: 0, x: 100 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -100 }}
    transition={{ duration: 0.5 }}
  >
    <TestimonialCard data={testimonials[currentTestimonial]} />
  </motion.div>
</AnimatePresence>
```

## Customization Guide

### Adjusting Animation Speed

```jsx
// Slower animation
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 1.5 }}
>

// Faster animation
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.3 }}
>
```

### Changing Animation Type

```jsx
// Spring (bouncy)
transition={{ type: "spring", stiffness: 300 }}

// Tween (smooth)
transition={{ type: "tween", ease: "easeInOut" }}

// Inertia (decelerating)
transition={{ type: "inertia", velocity: 50 }}
```

### Custom Delays

```jsx
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ delay: 0.5 }}
>
```

### Custom Stagger

```jsx
<motion.div
  variants={{
    animate: {
      transition: {
        staggerChildren: 0.2, // Change this value
        delayChildren: 0.3
      }
    }
  }}
>
```

## Performance Tips

1. **Use `will-change` sparingly** - Framer Motion handles this automatically
2. **Prefer transforms over position** - Use x, y instead of left, top
3. **Use `layout` prop cautiously** - Can be expensive on complex layouts
4. **Set `viewport={{ once: true }}`** - Prevents re-triggering on scroll
5. **Avoid animating many elements** - Limit to visible viewport
6. **Use `layoutId` for shared element transitions** - Smooth morphing between states

## Common Issues & Solutions

### Issue: Animations not triggering

**Solution**: Make sure parent has `initial` and `whileInView` props

### Issue: Stagger not working

**Solution**: Both parent and children need `variants` prop

### Issue: Janky animations

**Solution**: Use transform properties (x, y, scale) instead of width, height

### Issue: Animations triggering multiple times

**Solution**: Add `viewport={{ once: true }}`

### Issue: Scroll animations not visible

**Solution**: Adjust viewport margin: `viewport={{ margin: "-100px" }}`

## Animation Checklist

When creating a new page, consider adding:

- [ ] Page transition wrapper
- [ ] Scroll reveal for sections
- [ ] Stagger animations for lists/grids
- [ ] Hover effects on interactive elements
- [ ] Loading states with skeleton animations
- [ ] Exit animations for modals/overlays
- [ ] Micro-interactions on buttons
- [ ] Smooth scroll behavior

## Resources

- **Framer Motion Docs**: https://www.framer.com/motion/
- **Animation Presets**: `src/util/animations.js`
- **Animated Components**: `src/components/AnimatedComponents.jsx`
- **Live Examples**: Navigate to `/animations` in your app
- **Showcase Page**: `src/pages/AnimationShowcase.jsx`

## Examples in Your App

### Already Implemented

- ✅ **Entry Page** - Full landing page with all animation types
- ✅ **Dashboard** - Stagger animations and card effects
- ✅ **Routes** - Page transitions on navigation
- ✅ **MetricCard** - Icon and trend animations

### To Implement (Suggestions)

- Customer Management - Stagger list animations
- Invoice Management - Smooth form transitions
- Payment Recording - Interactive step animations
- Risk Analytics - Chart reveal animations
- Settings - Tab switching animations

---

**Remember**: Good animations enhance UX without being distracting. Use subtle motions (100-300ms) for most interactions, and save dramatic effects (500ms+) for major transitions.
