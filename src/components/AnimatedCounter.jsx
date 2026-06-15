import React, { useEffect, useState, useRef } from "react";
import { useInView } from "framer-motion";

export default function AnimatedCounter({ value, duration = 1.5, suffix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;

    // Remove any letters/symbols (like +, ,) to get the numeric end value
    const numericStr = String(value).replace(/[^0-9]/g, "");
    const end = parseInt(numericStr, 10);
    
    if (isNaN(end)) {
      setCount(value);
      return;
    }

    const startTime = performance.now();
    let animationFrameId;

    const updateCount = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      
      // Easing function: easeOutQuad
      const easedProgress = progress * (2 - progress);
      const currentValue = Math.floor(easedProgress * end);
      
      setCount(currentValue);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(updateCount);
      } else {
        setCount(end);
      }
    };

    animationFrameId = requestAnimationFrame(updateCount);

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [isInView, value, duration]);

  const formatNumber = (num) => {
    return num.toLocaleString();
  };

  return (
    <span ref={ref} className="font-display font-bold">
      {isInView ? `${formatNumber(count)}${suffix}` : `0${suffix}`}
    </span>
  );
}
