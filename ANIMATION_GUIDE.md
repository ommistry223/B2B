# Advanced 3D Animation System - Usage Guide

## 🎨 Components Overview

### 1. **Spline3DBackground**

Theme-aware 3D background that switches between black and white models.

```jsx
import Spline3DBackground from '../components/Spline3DBackground'

;<Spline3DBackground
  className="w-full h-screen"
  enableParallax={true} // Scroll-based movement
  enableMouseFollow={true} // Mouse tracking
  showLoadingAnimation={true} // Loading state
/>
```

**Features:**

- Auto-switches models based on theme (dark/light)
- Parallax scrolling effect
- Mouse-follow 3D rotation
- Smooth theme transitions
- Loading animation with blur effect
- Gradient overlays for depth

---

### 2. **AnimatedHero3D**

Full hero section with 3D background and animated content.

```jsx
import AnimatedHero3D from '../components/AnimatedHero3D'

;<AnimatedHero3D className="min-h-screen">
  <h1>Your Content</h1>
  <p>Amazing animations</p>
</AnimatedHero3D>
```

**Features:**

- Integrated 3D background
- Parallax scroll effects
- Staggered children animations
- Floating particle effects
- Scale and rotate on scroll

---

### 3. **AnimatedCard3D**

Interactive 3D card with tilt effect.

```jsx
import AnimatedCard3D from '../components/AnimatedCard3D'

;<AnimatedCard3D
  enableTilt={true}
  glowEffect={true}
  scaleOnHover={true}
  className="p-6 bg-white rounded-lg"
>
  <div>Card content</div>
</AnimatedCard3D>
```

**Features:**

- 3D tilt based on mouse position
- Dynamic lighting effect
- Glow on hover
- Scale animation
- Reflection effect

---

### 4. **AnimatedButton**

Premium button with multiple effects.

```jsx
import AnimatedButton from '../components/ui/AnimatedButton'
import { Sparkles } from 'lucide-react'

;<AnimatedButton
  variant="primary" // primary, secondary, outline, ghost
  size="lg" // sm, md, lg
  icon={<Sparkles />}
  onClick={() => {}}
>
  Click Me
</AnimatedButton>
```

**Features:**

- Shine animation
- Scale on hover/tap
- Ripple effect on click
- Icon rotation
- Multiple variants

---

### 5. **AnimatedSection**

Scroll-triggered section animations.

```jsx
import AnimatedSection from '../components/ui/AnimatedSection'

;<AnimatedSection
  animation="fadeUp" // fadeUp, slideRight, slideLeft, scale, rotate
  delay={0.2}
  duration={0.6}
>
  <div>Content</div>
</AnimatedSection>
```

**Features:**

- Multiple animation types
- Scroll-based visibility
- Blur effects
- Spring physics
- Customizable timing

---

### 6. **AnimatedGroup**

Staggered children animations.

```jsx
import { AnimatedGroup } from '../components/ui/AnimatedSection'

;<AnimatedGroup stagger={0.15}>
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</AnimatedGroup>
```

---

### 7. **AnimatedCounter**

Animated number counting.

```jsx
import AnimatedCounter from '../components/ui/AnimatedCounter'

;<AnimatedCounter
  value={15000}
  duration={2}
  prefix="$"
  suffix="+"
  className="text-4xl"
/>
```

---

### 8. **AnimatedGradientText**

Flowing gradient text effect.

```jsx
import AnimatedGradientText from '../components/ui/AnimatedGradientText'

;<h1>
  <AnimatedGradientText>Amazing Title</AnimatedGradientText>
</h1>
```

---

### 9. **PageTransition**

Smooth page transitions.

```jsx
import PageTransition from '../components/ui/PageTransition'

;<PageTransition>
  <YourPage />
</PageTransition>
```

---

## 🚀 Complete Example

```jsx
import React from 'react'
import AnimatedHero3D from '../components/AnimatedHero3D'
import AnimatedCard3D from '../components/AnimatedCard3D'
import AnimatedButton from '../components/ui/AnimatedButton'
import AnimatedSection, {
  AnimatedGroup,
} from '../components/ui/AnimatedSection'
import AnimatedGradientText from '../components/ui/AnimatedGradientText'
import { Sparkles } from 'lucide-react'

function MyPage() {
  return (
    <div>
      {/* Hero with 3D Background */}
      <AnimatedHero3D className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-6">
          <h1 className="text-6xl font-bold">
            <AnimatedGradientText>Welcome to the Future</AnimatedGradientText>
          </h1>
          <AnimatedButton size="lg" icon={<Sparkles />}>
            Get Started
          </AnimatedButton>
        </div>
      </AnimatedHero3D>

      {/* Features Section */}
      <AnimatedSection animation="fadeUp" className="py-20">
        <AnimatedGroup stagger={0.2}>
          <div className="grid grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <AnimatedCard3D key={i} className="p-6 bg-white rounded-lg">
                <h3>Feature {i}</h3>
                <p>Description</p>
              </AnimatedCard3D>
            ))}
          </div>
        </AnimatedGroup>
      </AnimatedSection>
    </div>
  )
}
```

---

## ⚙️ Advanced Customization

### Custom Animation Variants

```jsx
const customVariants = {
  hidden: { opacity: 0, rotate: -90, scale: 0 },
  visible: {
    opacity: 1,
    rotate: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 100 }
  }
}

<motion.div variants={customVariants}>
  Content
</motion.div>
```

### Scroll-based Animations

```jsx
import { useScroll, useTransform } from 'framer-motion'

const { scrollYProgress } = useScroll()
const opacity = useTransform(scrollYProgress, [0, 1], [1, 0])
const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8])
```

### Mouse-based 3D Effects

```jsx
const x = useMotionValue(0)
const y = useMotionValue(0)
const rotateX = useTransform(y, [-0.5, 0.5], ['12deg', '-12deg'])
const rotateY = useTransform(x, [-0.5, 0.5], ['-12deg', '12deg'])
```

---

## 🎯 Best Practices

1. **Performance**: Use `once: true` in `useInView` for animations that should only play once
2. **Accessibility**: Always provide fallbacks for reduced motion preferences
3. **Loading**: Show loading states for 3D models to improve UX
4. **Theme**: Leverage the theme system for consistent dark/light mode
5. **Stagger**: Use stagger effects for lists and groups (0.1-0.2s recommended)

---

## 🎨 Theme Integration

The 3D backgrounds automatically switch based on your theme:

- **Dark Theme**: Black 3D model
- **Light Theme**: White 3D model

Toggle theme anywhere:

```jsx
import { useTheme } from '../context/ThemeContext'

const { theme, toggleTheme } = useTheme()
```

---

## 📱 Responsive Design

All components are mobile-responsive:

- 3D effects reduce on mobile for performance
- Touch interactions supported
- Adaptive sizing and spacing

---

## 🔧 Troubleshooting

**3D model not loading?**

- Check internet connection (models are hosted on Spline)
- Verify iframe URLs are correct
- Check browser console for errors

**Animations laggy?**

- Reduce `enableParallax` and `enableMouseFollow`
- Disable blur effects on low-end devices
- Use `once: true` for scroll animations

**Theme not switching?**

- Ensure ThemeProvider wraps your app
- Check localStorage permissions
- Clear browser cache

---

## 🎓 Learn More

- [Framer Motion Docs](https://www.framer.com/motion/)
- [Spline Design](https://spline.design/)
- [React Spring](https://www.react-spring.dev/)
