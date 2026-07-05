"use client";

import { motion } from "framer-motion";
import { stackGroups } from "@/data/stack";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export function Stack() {
  const reduced = useReducedMotion();

  // Create different entrance directions for each card
  const getDirection = (index: number) => {
    if (reduced) return { x: 0, y: 0 };
    if (index === 0) return { x: -40, y: 0 }; // from left
    if (index === 1) return { x: 0, y: 40 };  // from bottom
    if (index === 2) return { x: 40, y: 0 };  // from right
    return { x: 0, y: 40 }; // fallback
  };

  return (
    <section id="stack" className="section-pad px-6 sm:px-10 perspective-deep">
      <div className="mx-auto max-w-5xl preserve-3d">
        <span className="eyebrow">Stack</span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="section-title mt-4 text-foreground"
        >
          How I think, grouped.
        </motion.h2>

        <div className="mt-12 grid gap-8 sm:grid-cols-3 preserve-3d">
          {stackGroups.map((group, i) => {
            const dir = getDirection(i);
            return (
              <motion.div
                key={group.label}
                initial={{ opacity: 0, x: dir.x, y: dir.y, rotateX: 0, rotateY: 0 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                whileHover={!reduced ? { y: -8, rotateX: 2, scale: 1.02 } : {}}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="glass-card rounded-2xl p-8"
              >
                <span className="h-px w-8 bg-accent block" />
                <h3 className="mt-6 text-sm font-bold uppercase tracking-widest text-foreground">
                  {group.label}
                </h3>
                <ul className="mt-6 space-y-3">
                  {group.items.map((item) => (
                    <li key={item} className="text-foreground/80 font-medium">
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
