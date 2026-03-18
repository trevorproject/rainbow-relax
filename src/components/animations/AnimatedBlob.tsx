import React from "react";
import { motion } from "framer-motion";

type MotionSpanProps = React.ComponentProps<typeof motion.span>;

const AnimatedBlob = React.forwardRef<HTMLSpanElement, MotionSpanProps>(
  ({ style, className, ...props }, ref) => (
    <motion.span
      ref={ref}
      style={{ willChange: "transform, opacity", ...style }}
      {...props}
      className={`fixed top-1/2 left-1/2 h-[25vw] w-[25vw] rounded-full bg-gradient-to-br from-[var(--gradient-1-1)] to-[var(--gradient-1-2)] overflow-hidden ${className ?? ""}`}
    />
  )
);

AnimatedBlob.displayName = "AnimatedBlob";

export default AnimatedBlob;
