"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface RippleEffectProps {
  children: ReactNode;
  className?: string;
  color?: string;
}

export function RippleEffect({ children, className, color = "rgba(255, 255, 255, 0.3)" }: RippleEffectProps) {
  return (
    <div className={`relative overflow-hidden ${className || ''}`}>
      {children}
      <motion.div
        className="ripple-effect absolute"
        initial={{ opacity: 0 }}
        whileTap={{
          opacity: 1,
          scale: 4,
          transition: { duration: 0.5 },
        }}
        style={{
          top: "50%",
          left: "50%",
          width: 5,
          height: 5,
          borderRadius: "50%",
          backgroundColor: color,
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
    </div>
  );
} 