/**
 * Advanced Framer Motion Animation Utilities
 * Comprehensive animation presets and configurations
 */

// ==================== PAGE TRANSITIONS ====================
export const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.4, ease: [0.43, 0.13, 0.23, 0.96] }
}

export const slideTransition = {
  initial: { opacity: 0, x: -100 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 100 },
  transition: { duration: 0.5, ease: [0.6, 0.05, 0.01, 0.9] }
}

export const fadeTransition = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.3 }
}

export const scaleTransition = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
  transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
}

// ==================== STAGGER ANIMATIONS ====================
export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
}

export const staggerFastContainer = {
  animate: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
}

export const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.43, 0.13, 0.23, 0.96]
    }
  }
}

export const staggerItemSlide = {
  initial: { opacity: 0, x: -30 },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: [0.6, 0.05, 0.01, 0.9]
    }
  }
}

export const staggerItemScale = {
  initial: { opacity: 0, scale: 0.8 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1]
    }
  }
}

// ==================== SCROLL ANIMATIONS ====================
export const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] }
}

export const fadeInDown = {
  initial: { opacity: 0, y: -60 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] }
}

export const fadeInLeft = {
  initial: { opacity: 0, x: -60 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.6, ease: [0.6, 0.05, 0.01, 0.9] }
}

export const fadeInRight = {
  initial: { opacity: 0, x: 60 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.6, ease: [0.6, 0.05, 0.01, 0.9] }
}

export const scaleIn = {
  initial: { opacity: 0, scale: 0.5 },
  whileInView: { opacity: 1, scale: 1 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] }
}

export const zoomIn = {
  initial: { opacity: 0, scale: 0.8 },
  whileInView: { opacity: 1, scale: 1 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.7, ease: [0.43, 0.13, 0.23, 0.96] }
}

// ==================== HOVER ANIMATIONS ====================
export const hoverScale = {
  whileHover: {
    scale: 1.05,
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
  },
  whileTap: { scale: 0.95 }
}

export const hoverLift = {
  whileHover: {
    y: -8,
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
  },
  whileTap: { y: -4 }
}

export const hoverGlow = {
  whileHover: {
    boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)",
    transition: { duration: 0.3 }
  }
}

export const hoverRotate = {
  whileHover: {
    rotate: 5,
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
  }
}

// ==================== CARD ANIMATIONS ====================
export const cardHover = {
  whileHover: {
    y: -10,
    scale: 1.02,
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
  }
}

export const cardTap = {
  whileTap: {
    scale: 0.98,
    transition: { duration: 0.1 }
  }
}

export const cardFloat = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
}

// ==================== BUTTON ANIMATIONS ====================
export const buttonHover = {
  whileHover: {
    scale: 1.05,
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
    transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] }
  },
  whileTap: {
    scale: 0.95,
    transition: { duration: 0.1 }
  }
}

export const buttonPulse = {
  animate: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
}

// ==================== MODAL ANIMATIONS ====================
export const modalBackdrop = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 }
}

export const modalContent = {
  initial: { opacity: 0, scale: 0.9, y: 50 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.9, y: 50 },
  transition: {
    duration: 0.3,
    ease: [0.43, 0.13, 0.23, 0.96]
  }
}

export const modalSlideUp = {
  initial: { opacity: 0, y: "100%" },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: "100%" },
  transition: {
    duration: 0.4,
    ease: [0.43, 0.13, 0.23, 0.96]
  }
}

// ==================== LOADING ANIMATIONS ====================
export const spinnerRotate = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "linear"
    }
  }
}

export const pulseAnimation = {
  animate: {
    scale: [1, 1.1, 1],
    opacity: [1, 0.8, 1],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
}

export const bounceAnimation = {
  animate: {
    y: [0, -20, 0],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      ease: "easeOut"
    }
  }
}

// ==================== TEXT ANIMATIONS ====================
export const textReveal = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] }
}

export const textSlideIn = {
  initial: { opacity: 0, x: -50 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.5, ease: [0.6, 0.05, 0.01, 0.9] }
}

export const textGradientShimmer = {
  animate: {
    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
    transition: {
      duration: 5,
      repeat: Infinity,
      ease: "linear"
    }
  }
}

// ==================== NOTIFICATION ANIMATIONS ====================
export const notificationSlideIn = {
  initial: { opacity: 0, x: 400, scale: 0.8 },
  animate: { opacity: 1, x: 0, scale: 1 },
  exit: { opacity: 0, x: 400, scale: 0.8 },
  transition: {
    duration: 0.4,
    ease: [0.43, 0.13, 0.23, 0.96]
  }
}

export const notificationBounceIn = {
  initial: { opacity: 0, scale: 0.3 },
  animate: {
    opacity: 1,
    scale: [0.3, 1.1, 0.9, 1],
    transition: {
      duration: 0.6,
      times: [0, 0.5, 0.75, 1],
      ease: "easeOut"
    }
  },
  exit: { opacity: 0, scale: 0.3 }
}

// ==================== MENU ANIMATIONS ====================
export const menuSlideDown = {
  initial: { opacity: 0, y: -20, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -20, scale: 0.95 },
  transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] }
}

export const menuItem = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.3 }
}

// ==================== ADVANCED EFFECTS ====================
export const parallaxEffect = (yOffset = 50) => ({
  initial: { y: yOffset },
  whileInView: { y: 0 },
  viewport: { once: false },
  transition: { duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }
})

export const morphShape = {
  animate: {
    borderRadius: ["30% 70% 70% 30% / 30% 30% 70% 70%",
                   "70% 30% 30% 70% / 70% 70% 30% 30%",
                   "30% 70% 70% 30% / 30% 30% 70% 70%"],
    transition: {
      duration: 8,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
}

export const liquidBlob = {
  animate: {
    borderRadius: ["60% 40% 30% 70% / 60% 30% 70% 40%",
                   "30% 60% 70% 40% / 50% 60% 30% 60%",
                   "40% 30% 60% 70% / 40% 70% 60% 30%",
                   "60% 40% 30% 70% / 60% 30% 70% 40%"],
    transition: {
      duration: 10,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
}

// ==================== UTILITY FUNCTIONS ====================
export const createStaggerVariants = (delay = 0.1) => ({
  container: {
    animate: {
      transition: {
        staggerChildren: delay
      }
    }
  },
  item: {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  }
})

export const createSlideVariants = (direction = 'left') => {
  const directions = {
    left: { x: -100 },
    right: { x: 100 },
    up: { y: -100 },
    down: { y: 100 }
  }

  return {
    initial: { opacity: 0, ...directions[direction] },
    animate: { opacity: 1, x: 0, y: 0 },
    exit: { opacity: 0, ...directions[direction] },
    transition: { duration: 0.5, ease: [0.6, 0.05, 0.01, 0.9] }
  }
}

// ==================== SPRING ANIMATIONS ====================
export const springConfig = {
  type: "spring",
  stiffness: 300,
  damping: 30
}

export const softSpring = {
  type: "spring",
  stiffness: 100,
  damping: 20
}

export const bouncySpring = {
  type: "spring",
  stiffness: 400,
  damping: 10
}

// ==================== GESTURE ANIMATIONS ====================
export const swipeAnimation = {
  drag: "x",
  dragConstraints: { left: 0, right: 0 },
  dragElastic: 0.2,
  onDragEnd: (e, { offset, velocity }) => {
    if (offset.x > 100 || velocity.x > 500) {
      // Swipe right action
      return { x: 1000 }
    } else if (offset.x < -100 || velocity.x < -500) {
      // Swipe left action
      return { x: -1000 }
    }
    return { x: 0 }
  }
}

export const dragAndDrop = {
  drag: true,
  dragMomentum: false,
  whileDrag: {
    scale: 1.1,
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2)",
    cursor: "grabbing"
  }
}

// ==================== PRESET COMBINATIONS ====================
export const heroAnimation = {
  container: staggerContainer,
  title: {
    ...textReveal,
    transition: { duration: 0.8, delay: 0.2 }
  },
  subtitle: {
    ...textReveal,
    transition: { duration: 0.8, delay: 0.4 }
  },
  cta: {
    ...buttonHover,
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay: 0.6 }
  }
}

export const featureCardAnimation = {
  ...fadeInUp,
  ...cardHover,
  ...cardTap
}

export const statsAnimation = {
  initial: { opacity: 0, scale: 0 },
  whileInView: { opacity: 1, scale: 1 },
  viewport: { once: true },
  transition: {
    duration: 0.6,
    type: "spring",
    stiffness: 100
  }
}
