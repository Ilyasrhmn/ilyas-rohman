"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionTemplate } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/**
 * Wraps a section to give it a cinematic overlay/uncover exit.
 * As user scrolls past, this section scales down, fades, rounds corners,
 * revealing the NEXT section behind it.
 *
 * ponytail: currently framer-motion only. Upgrade to GSAP ScrollTrigger
 * if jank appears on low-end devices.
 */
export function SectionTransition({
  children,
  exitScale = 0.92,
  exitBorderRadius = "32px",
  exitBlur = 6,
  className = "",
}: {
  children: React.ReactNode;
  exitScale?: number;
  exitBorderRadius?: string;
  exitBlur?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["end end", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const scale = useTransform(smoothProgress, [0, 1], [1, exitScale]);
  const opacity = useTransform(smoothProgress, [0, 0.8], [1, 0]);
  const borderRadius = useTransform(
    smoothProgress,
    [0, 1],
    ["0px", exitBorderRadius]
  );
  const blur = useTransform(smoothProgress, [0, 1], [0, exitBlur]);
  const filterBlur = useMotionTemplate`blur(${blur}px)`;

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div ref={ref} className={`relative z-10 ${className}`}>
      <motion.div
        style={{
          scale,
          opacity,
          borderRadius,
          filter: filterBlur,
          willChange: "transform, opacity, border-radius",
          transformOrigin: "center center",
        }}
        className="relative overflow-hidden"
      >
        {children}
      </motion.div>
    </div>
  );
}
