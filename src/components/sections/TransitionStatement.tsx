"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

export function TransitionStatement() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Fade in quickly as it enters, then fade out slowly as it leaves
  const opacity = useTransform(smoothProgress, [0.1, 0.4, 0.6, 0.9], [0, 1, 1, 0]);
  
  // Subtle scale down
  const scale = useTransform(smoothProgress, [0.1, 0.9], [1.05, 0.95]);
  
  // Parallax movement
  const y = useTransform(smoothProgress, [0, 1], ["20vh", "-20vh"]);

  return (
    <section 
      ref={containerRef} 
      className="relative flex items-center justify-center min-h-[100vh] w-full px-6 md:px-12 lg:px-24 overflow-hidden"
    >
      <motion.div 
        style={{ opacity, scale, y }}
        className="max-w-4xl text-center"
      >
        <h2 className="text-3xl md:text-5xl lg:text-7xl font-bold tracking-tight text-[var(--world-text)] mb-6">
          Creative Frontend Developer.
        </h2>
        <p className="text-xl md:text-2xl text-[var(--world-muted)] font-medium leading-relaxed">
          Building interactive and thoughtful web experiences where design, motion, and engineering work together.
        </p>
      </motion.div>
    </section>
  );
}
