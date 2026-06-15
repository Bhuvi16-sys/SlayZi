import React, { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function MagneticButton({ children, className = "", ...props }) {
  const ref = useRef(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs for high fidelity physical response
  const springSetting = { stiffness: 120, damping: 12, mass: 0.8 };
  const springX = useSpring(x, springSetting);
  const springY = useSpring(y, springSetting);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    
    // Middle of the button coordinates
    const midX = left + width / 2;
    const midY = top + height / 2;
    
    // Relative distance (limited to small offset for premium magnetic feel)
    const deltaX = clientX - midX;
    const deltaY = clientY - midY;
    
    x.set(deltaX * 0.3);
    y.set(deltaY * 0.3);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative active:scale-95 transition-transform duration-100 ease-out ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
