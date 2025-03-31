"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LoadingAnimationProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  color?: string;
}

export function LoadingAnimation({ 
  className, 
  size = "md", 
  color = "primary" 
}: LoadingAnimationProps) {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };
  
  const colors = {
    primary: "border-primary",
    secondary: "border-secondary",
    white: "border-white",
    black: "border-black",
  };
  
  const circleVariants = {
    initial: { 
      opacity: 0,
      rotate: 0 
    },
    animate: { 
      opacity: 1,
      rotate: 360,
      transition: { 
        duration: 1.5,
        repeat: Infinity,
        ease: "linear" 
      } 
    }
  };

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <motion.div
        className={cn(
          "rounded-full border-t-2 border-b-2 border-transparent",
          sizes[size],
          color in colors ? colors[color as keyof typeof colors] : `border-${color}`
        )}
        variants={circleVariants}
        initial="initial"
        animate="animate"
      />
    </div>
  );
} 