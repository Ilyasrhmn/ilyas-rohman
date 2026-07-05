"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export function SectionColor({
  color,
  className = "",
  children,
}: {
  color: string;
  className?: string;
  children: React.ReactNode;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const background = useTransform(
    scrollYProgress,
    [0, 0.35, 0.65, 1],
    ["#0E0F0E", color, color, "#0E0F0E"]
  );

  if (reduced) {
    return (
      <div ref={ref} className={className} style={{ backgroundColor: color }}>
        {children}
      </div>
    );
  }

  return (
    <motion.div ref={ref} className={className} style={{ backgroundColor: background }}>
      {children}
    </motion.div>
  );
}
