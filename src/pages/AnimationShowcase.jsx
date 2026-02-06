import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  AnimatedSection,
  AnimatedCard,
  AnimatedText,
  AnimatedGradientText,
  AnimatedGrid,
  FloatingElement,
  LiquidBlob,
  CountUpNumber,
  PulsingElement,
  ScaleOnView,
  SlideUpReveal,
} from '../components/AnimatedComponents'
import EnhancedButton from '../components/ui/EnhancedButton'
import {
  staggerContainer,
  staggerItem,
  fadeInUp,
  cardHover,
  buttonHover,
} from '../util/animations'

const AnimationShowcase = () => {
  const navigate = useNavigate()

  const exampleCards = [
    { title: 'Card 1', description: 'Animated on scroll' },
    { title: 'Card 2', description: 'Stagger effect' },
    { title: 'Card 3', description: 'Hover interactions' },
    { title: 'Card 4', description: 'Smooth transitions' },
    { title: 'Card 5', description: 'Scale animations' },
    { title: 'Card 6', description: 'Full GPU acceleration' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/10 to-background">
      {/* Background Blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <LiquidBlob
          className="absolute -top-20 -left-20"
          size={500}
          color="bg-gradient-to-br from-blue-500/10 to-purple-600/10"
        />
        <LiquidBlob
          className="absolute -bottom-20 -right-20"
          size={600}
          color="bg-gradient-to-br from-purple-500/10 to-pink-600/10"
        />
      </div>

      {/* Navigation */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border shadow-lg"
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-foreground">
              Animation Showcase
            </h1>
            <EnhancedButton
              variant="outline"
              size="md"
              animationType="scale"
              onClick={() => navigate('/')}
            >
              ← Back to Home
            </EnhancedButton>
          </div>
        </div>
      </motion.nav>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 space-y-32">
        {/* Hero Section */}
        <AnimatedSection>
          <div className="text-center space-y-6">
            <motion.div
              variants={staggerItem}
              className="inline-block px-4 py-2 rounded-full bg-primary/10 border border-primary/20"
            >
              <span className="text-sm font-medium text-primary">
                ✨ Powered by Framer Motion
              </span>
            </motion.div>

            <AnimatedText
              as="h1"
              variant="fadeInUp"
              delay={0.1}
              className="text-5xl md:text-7xl font-bold"
            >
              Advanced <AnimatedGradientText>Animations</AnimatedGradientText>
            </AnimatedText>

            <AnimatedText
              as="p"
              variant="fadeInUp"
              delay={0.2}
              className="text-xl text-muted-foreground max-w-2xl mx-auto"
            >
              Experience smooth, professional animations throughout your
              application
            </AnimatedText>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex gap-4 justify-center"
            >
              <EnhancedButton
                variant="default"
                size="lg"
                animationType="glow"
                onClick={() => navigate('/dashboard')}
              >
                View Dashboard
              </EnhancedButton>
              <EnhancedButton variant="outline" size="lg" animationType="lift">
                Learn More
              </EnhancedButton>
            </motion.div>
          </div>
        </AnimatedSection>

        {/* Stats Section */}
        <AnimatedSection>
          <div className="text-center mb-12">
            <AnimatedText as="h2" className="text-3xl font-bold mb-4">
              Animated Counters
            </AnimatedText>
            <p className="text-muted-foreground">
              Numbers that count up smoothly
            </p>
          </div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {[
              { value: 5000, suffix: '+', label: 'Happy Users' },
              { value: 99.9, suffix: '%', label: 'Uptime' },
              { value: 450, suffix: 'M+', label: 'Transactions' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                variants={staggerItem}
                whileHover={{ y: -10, scale: 1.05 }}
                className="bg-card p-8 rounded-2xl border border-border shadow-lg text-center"
              >
                <div className="text-5xl font-bold mb-2">
                  <AnimatedGradientText>
                    <CountUpNumber from={0} to={stat.value} duration={2} />
                    {stat.suffix}
                  </AnimatedGradientText>
                </div>
                <p className="text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </AnimatedSection>

        {/* Card Grid Section */}
        <AnimatedSection>
          <div className="text-center mb-12">
            <AnimatedText as="h2" className="text-3xl font-bold mb-4">
              Stagger Animations
            </AnimatedText>
            <p className="text-muted-foreground">
              Cards appear in sequence with hover effects
            </p>
          </div>

          <AnimatedGrid
            columns={3}
            staggerDelay={0.08}
            className="grid md:grid-cols-3 gap-6"
          >
            {exampleCards.map((card, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10, scale: 1.02 }}
                className="bg-card p-6 rounded-xl border border-border shadow-lg cursor-pointer"
              >
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 mb-4 flex items-center justify-center text-white font-bold text-xl">
                  {i + 1}
                </div>
                <h3 className="text-xl font-bold mb-2">{card.title}</h3>
                <p className="text-muted-foreground">{card.description}</p>
              </motion.div>
            ))}
          </AnimatedGrid>
        </AnimatedSection>

        {/* Hover Effects Section */}
        <AnimatedSection>
          <div className="text-center mb-12">
            <AnimatedText as="h2" className="text-3xl font-bold mb-4">
              Button Animations
            </AnimatedText>
            <p className="text-muted-foreground">
              Different animation types for buttons
            </p>
          </div>

          <div className="flex flex-wrap gap-4 justify-center">
            <EnhancedButton variant="default" animationType="scale">
              Scale Effect
            </EnhancedButton>
            <EnhancedButton variant="secondary" animationType="lift">
              Lift Effect
            </EnhancedButton>
            <EnhancedButton variant="outline" animationType="glow">
              Glow Effect
            </EnhancedButton>
            <EnhancedButton variant="ghost" animationType="scale">
              Ghost Button
            </EnhancedButton>
            <EnhancedButton variant="destructive" animationType="lift">
              Destructive
            </EnhancedButton>
          </div>
        </AnimatedSection>

        {/* Floating Elements Section */}
        <AnimatedSection>
          <div className="text-center mb-12">
            <AnimatedText as="h2" className="text-3xl font-bold mb-4">
              Floating Elements
            </AnimatedText>
            <p className="text-muted-foreground">
              Elements with continuous floating animation
            </p>
          </div>

          <div className="relative h-64 bg-card/50 rounded-2xl border border-border overflow-hidden">
            <FloatingElement
              yOffset={20}
              duration={2}
              className="absolute top-10 left-10"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg" />
            </FloatingElement>
            <FloatingElement
              yOffset={30}
              duration={3}
              delay={0.5}
              className="absolute top-20 right-10"
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg" />
            </FloatingElement>
            <FloatingElement
              yOffset={25}
              duration={2.5}
              delay={1}
              className="absolute bottom-10 left-1/2"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 shadow-lg" />
            </FloatingElement>

            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-2xl font-bold text-foreground">
                Floating Animation
              </p>
            </div>
          </div>
        </AnimatedSection>

        {/* Pulsing Elements */}
        <AnimatedSection>
          <div className="text-center mb-12">
            <AnimatedText as="h2" className="text-3xl font-bold mb-4">
              Pulsing Effects
            </AnimatedText>
            <p className="text-muted-foreground">
              Elements with subtle pulse animation
            </p>
          </div>

          <div className="flex gap-8 justify-center items-center">
            <PulsingElement>
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-orange-500" />
            </PulsingElement>
            <PulsingElement>
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-500" />
            </PulsingElement>
            <PulsingElement>
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-cyan-500" />
            </PulsingElement>
          </div>
        </AnimatedSection>

        {/* Scale on View */}
        <AnimatedSection>
          <div className="text-center mb-12">
            <AnimatedText as="h2" className="text-3xl font-bold mb-4">
              Scale on Scroll
            </AnimatedText>
            <p className="text-muted-foreground">
              Elements scale up when scrolling into view
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <ScaleOnView scale={1} duration={0.6}>
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-12 rounded-2xl text-white text-center">
                <h3 className="text-2xl font-bold">Scale Effect 1</h3>
                <p className="mt-2">Smooth scale animation</p>
              </div>
            </ScaleOnView>
            <ScaleOnView scale={1} duration={0.8}>
              <div className="bg-gradient-to-br from-pink-500 to-rose-600 p-12 rounded-2xl text-white text-center">
                <h3 className="text-2xl font-bold">Scale Effect 2</h3>
                <p className="mt-2">Slower scale animation</p>
              </div>
            </ScaleOnView>
          </div>
        </AnimatedSection>

        {/* Slide Up Reveal */}
        <AnimatedSection>
          <div className="text-center mb-12">
            <AnimatedText as="h2" className="text-3xl font-bold mb-4">
              Slide Up Reveal
            </AnimatedText>
            <p className="text-muted-foreground">
              Content slides up dramatically
            </p>
          </div>

          <SlideUpReveal>
            <div className="bg-card p-12 rounded-2xl border border-border shadow-2xl text-center">
              <h3 className="text-3xl font-bold mb-4">
                <AnimatedGradientText>Dramatic Entrance</AnimatedGradientText>
              </h3>
              <p className="text-xl text-muted-foreground">
                This element slides up from below with a smooth animation
              </p>
            </div>
          </SlideUpReveal>
        </AnimatedSection>

        {/* CTA Section */}
        <AnimatedSection>
          <motion.div
            {...fadeInUp}
            className="bg-gradient-to-br from-primary to-secondary p-12 md:p-16 rounded-3xl text-white text-center relative overflow-hidden"
          >
            <motion.div
              className="absolute inset-0 opacity-20"
              animate={{
                backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
              }}
              transition={{ duration: 10, repeat: Infinity }}
              style={{
                background:
                  'radial-gradient(circle, white 1px, transparent 1px)',
                backgroundSize: '50px 50px',
              }}
            />

            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Ready to Transform Your UI?
              </h2>
              <p className="text-xl mb-8 opacity-90">
                All these animations are ready to use in your application
              </p>
              <div className="flex gap-4 justify-center">
                <EnhancedButton
                  variant="secondary"
                  size="lg"
                  animationType="lift"
                  onClick={() => navigate('/dashboard')}
                >
                  View Dashboard
                </EnhancedButton>
                <EnhancedButton
                  variant="outline"
                  size="lg"
                  animationType="scale"
                  className="border-white text-white hover:bg-white/20"
                  onClick={() => navigate('/')}
                >
                  Back to Home
                </EnhancedButton>
              </div>
            </div>
          </motion.div>
        </AnimatedSection>
      </div>
    </div>
  )
}

export default AnimationShowcase
