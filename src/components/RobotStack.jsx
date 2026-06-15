import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const RobotStack = () => {
  const containerRef = useRef(null);
  
  // Mouse hover tilt effect
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    // Calculate tilt angles (max 8 degrees)
    const tiltX = -(y / (rect.height / 2)) * 8;
    const tiltY = (x / (rect.width / 2)) * 8;
    
    setTilt({ x: tiltX, y: tiltY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  // Scroll rotation
  const { scrollY } = useScroll();
  const rotate = useTransform(scrollY, [0, 1000], [0, -5]);

  return (
    <div className="relative w-full max-w-sm mx-auto z-10 flex justify-center items-center">
      {/* Soft purple radial glow that pulses slowly */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[rgba(168,85,247,0.15)] blur-[80px] rounded-full animate-glow-pulse pointer-events-none" />

      {/* 3D Perspective Container */}
      <motion.div
        ref={containerRef}
        className="relative w-full flex flex-col justify-center items-center transition-transform duration-200 ease-out hover:scale-105 py-8"
        style={{
          perspective: "1000px",
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          rotate: rotate,
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Stack of 2 Robots */}
        {[0, 1].map((index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: -150 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.8, 
              delay: index * 0.3, 
              type: "spring",
              bounce: 0.5
            }}
            className="-mt-12 first:mt-0"
            style={{ zIndex: 2 - index }}
          >
            <div
              className="relative w-64 h-64 animate-float"
              style={{ animationDelay: `${index * -2}s` }}
            >
              <img 
                // We use our new generated purple-black robot asset
                src="/robot.png" 
                alt={`Robot ${index + 1}`}
                className="w-full h-full object-cover rounded-3xl shadow-2xl animate-eye-pulse"
                style={{
                  animationDelay: `${index * 0.4}s` // Independent blink delay
                }}
              />
              {/* Overlay to simulate purple eye glow if using a generic image */}
              <div className="absolute inset-0 bg-purple-500/10 rounded-3xl mix-blend-overlay animate-eye-pulse" style={{ animationDelay: `${index * 0.4}s` }} />
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default RobotStack;
