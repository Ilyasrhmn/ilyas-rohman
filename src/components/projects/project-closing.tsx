"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { gsap, registerGsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export function ProjectClosing({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const bridgeRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !rootRef.current || !bridgeRef.current) return;
    registerGsap();
    const colors = getComputedStyle(document.documentElement);
    const cream = colors.getPropertyValue("--world-b-bg").trim();
    const forest = colors.getPropertyValue("--world-a-bg").trim();
    const context = gsap.context(() => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top bottom",
          end: "top 45%",
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });
      // The color morph stays in the empty bridge; text always sits on forest.
      timeline.fromTo(bridgeRef.current, { "--closing-mix": cream }, { "--closing-mix": forest, duration: 1, ease: "none" }, 0);
      timeline.fromTo("[data-closing-preview]", { y: 24, scale: 0.98 }, { y: 0, scale: 1, duration: 1, ease: "none" }, 0);
    }, rootRef);
    return () => context.revert();
  }, [reducedMotion]);

  return (
    <div ref={rootRef} data-project-closing>
      <div
        ref={bridgeRef}
        aria-hidden
        className="pointer-events-none h-24 sm:h-32 lg:h-40"
        style={{
          "--closing-mix": "var(--world-a-bg)",
          backgroundImage: "linear-gradient(to bottom, var(--world-b-bg) 0%, var(--closing-mix) 58%, var(--world-a-bg) 100%)",
        } as CSSProperties}
      />
      <div className="bg-[var(--world-a-bg)] text-[var(--world-a-text)]">{children}</div>
    </div>
  );
}
