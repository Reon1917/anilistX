"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button, ButtonProps } from "@/components/ui/button";
import { forwardRef } from "react";

type AnimatedButtonProps = Omit<ButtonProps, "asChild"> & {
  ripple?: boolean;
};

/**
 * AnimatedButton - A button with animation effects
 * Note: This component cannot be used with asChild prop
 * For such cases, use the standard Button component
 */
export const AnimatedButton = forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ className, children, ripple = true, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        className={cn("relative overflow-hidden", className)}
        {...props}
      >
        <span className="relative z-10">{children}</span>
        {ripple && (
          <motion.div
            className="ripple-effect"
            initial={{ opacity: 0 }}
            whileTap={{
              opacity: 1,
              scale: 4,
              transition: { duration: 0.5 },
            }}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: 5,
              height: 5,
              borderRadius: "50%",
              backgroundColor: "rgba(255, 255, 255, 0.3)",
              transform: "translate(-50%, -50%)",
              pointerEvents: "none",
              zIndex: 0,
            }}
          />
        )}
      </Button>
    );
  }
);

AnimatedButton.displayName = "AnimatedButton"; 