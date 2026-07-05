"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export type StickyItem = {
  eyebrow: string;
  title: string;
  body: string;
  visual: React.ReactNode;
};

export function StickyScroll({ items }: { items: StickyItem[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start center", "end center"] });

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const idx = Math.min(items.length - 1, Math.floor(p * items.length));
    setActive(idx < 0 ? 0 : idx);
  });

  return (
    <div ref={ref} className="relative mx-auto grid max-w-6xl gap-10 lg:grid-cols-2">
      <div>
        {items.map((item, i) => (
          <div key={item.title} className="flex min-h-[70vh] flex-col justify-center">
            <span className="eyebrow">{item.eyebrow}</span>
            <motion.h3
              animate={{ opacity: reduced ? 1 : active === i ? 1 : 0.25 }}
              transition={{ duration: 0.4 }}
              className="section-title mt-3 text-foreground"
            >
              {item.title}
            </motion.h3>
            <motion.p
              animate={{ opacity: reduced ? 1 : active === i ? 1 : 0.2 }}
              transition={{ duration: 0.4 }}
              className="mt-4 max-w-md text-lg text-foreground/85"
            >
              {item.body}
            </motion.p>
            <div className="mt-6 lg:hidden">
              <div className="aspect-square w-full overflow-hidden rounded-2xl border border-border">
                {item.visual}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="hidden lg:block">
        <div className="sticky top-0 flex h-screen items-center">
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-border">
            <AnimatePresence>
              <motion.div
                key={active}
                initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.96, filter: "blur(8px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 1.04, filter: "blur(8px)" }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0"
              >
                {items[active].visual}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
