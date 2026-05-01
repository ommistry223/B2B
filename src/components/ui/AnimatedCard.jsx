import React from "react";
import { motion } from "framer-motion";

const AnimatedCard = ({
  children,
  className = "",
  hoverEffect = true,
  glow = false,
  borderGlow = false,
  ...props
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      whileHover={
        hoverEffect
          ? {
              y: -2,
              transition: { duration: 0.15 },
            }
          : {}
      }
      className={`
        relative bg-card rounded-xl border border-border p-6
        shadow-elevation-sm
        transition-shadow duration-200
        ${glow ? "shadow-elevation-md" : ""}
        ${borderGlow ? "border-primary/30 shadow-elevation-md" : ""}
        ${className}
      `}
      {...props}
    >
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};

export default AnimatedCard;
