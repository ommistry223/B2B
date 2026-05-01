import React from 'react';
import { motion } from 'framer-motion';

const GlowingButton = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  disabled = false, 
  onClick,
  className = '',
  ...props 
}) => {
  const baseClasses = "relative font-semibold rounded-lg transition-all duration-300 overflow-hidden";
  
  const variants = {
    primary: "bg-gradient-button text-primary-foreground shadow-lg hover:shadow-xl",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary-dark",
    accent: "bg-accent text-accent-foreground hover:bg-accent-dark",
    outline: "border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground",
    ghost: "text-foreground hover:bg-muted"
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
    xl: "px-8 py-4 text-xl"
  };
  
  const glowEffects = {
    primary: "hover:shadow-[0_0_20px_rgba(0,245,255,0.6)]",
    secondary: "hover:shadow-[0_0_20px_rgba(79,70,229,0.6)]",
    accent: "hover:shadow-[0_0_20px_rgba(139,92,246,0.6)]"
  };

  const handleClick = (e) => {
    if (!disabled && onClick) {
      onClick(e);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      className={`
        ${baseClasses}
        ${variants[variant]}
        ${sizes[size]}
        ${glowEffects[variant] || ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      onClick={handleClick}
      disabled={disabled}
      {...props}
    >
      {/* Animated background shine effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
      
      {/* Content */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
      
      {/* Glow border effect */}
      {!disabled && variant !== 'ghost' && (
        <div className={`
          absolute inset-0 rounded-lg blur-sm 
          ${variant === 'primary' ? 'bg-gradient-primary' : 
            variant === 'secondary' ? 'bg-secondary' : 'bg-accent'}
          opacity-30 -z-10
        `}></div>
      )}
    </motion.button>
  );
};

export default GlowingButton;