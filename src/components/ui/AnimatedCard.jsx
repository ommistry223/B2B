import React from 'react';
import { motion } from 'framer-motion';

const AnimatedCard = ({ 
  children, 
  className = '',
  hoverEffect = true,
  glow = false,
  borderGlow = false,
  ...props 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={hoverEffect ? { 
        y: -5,
        transition: { duration: 0.2 }
      } : {}}
      className={`
        relative bg-card rounded-xl border border-border p-6
        shadow-lg backdrop-blur-sm
        transition-all duration-300
        ${glow ? 'shadow-[0_0_30px_rgba(0,245,255,0.1)]' : ''}
        ${borderGlow ? 'border-primary shadow-[0_0_15px_rgba(0,245,255,0.3)]' : ''}
        ${className}
      `}
      {...props}
    >
      {/* Animated corner accents */}
      <div className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 border-primary rounded-tl-lg"></div>
      <div className="absolute top-0 right-0 w-3 h-3 border-r-2 border-t-2 border-secondary rounded-tr-lg"></div>
      <div className="absolute bottom-0 left-0 w-3 h-3 border-l-2 border-b-2 border-accent rounded-bl-lg"></div>
      <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-primary rounded-br-lg"></div>
      
      {/* Subtle grid pattern background */}
      <div className="absolute inset-0 opacity-5 pointer-events-none"
           style={{
             backgroundImage: `
               linear-gradient(rgba(0,245,255,0.1) 1px, transparent 1px),
               linear-gradient(90deg, rgba(0,245,255,0.1) 1px, transparent 1px)
             `,
             backgroundSize: '20px 20px'
           }}>
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Hover glow effect */}
      {hoverEffect && (
        <motion.div 
          className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"
          initial={false}
        />
      )}
    </motion.div>
  );
};

export default AnimatedCard;