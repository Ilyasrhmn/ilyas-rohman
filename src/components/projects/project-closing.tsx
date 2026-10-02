"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap, registerGsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export function ProjectClosing({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const transitionRef = useRef<HTMLElement>(null);
  const surfaceRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !rootRef.current || !transitionRef.current || !surfaceRef.current) return;
    registerGsap();
    const colors = getComputedStyle(document.documentElement);
    const cream = colors.getPropertyValue("--world-b-bg").trim();
    const forest = colors.getPropertyValue("--world-a-bg").trim();
    const context = gsap.context(() => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: transitionRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });
      // Hide each title before its background loses contrast; leave a dark hold at the end.
      timeline.fromTo("[data-closing-intro]", { autoAlpha: 1, scale: 1 }, { autoAlpha: 0, scale: 1.08, duration: 0.3, ease: "power1.inOut" }, 0.08);
      timeline.fromTo(surfaceRef.current, { backgroundColor: cream }, { backgroundColor: forest, duration: 0.45, ease: "none" }, 0.2);
      timeline.fromTo("[data-closing-outro]", { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.22, ease: "power1.out" }, 0.68);
      timeline.to({}, { duration: 0.1 }, 0.9);
    }, rootRef);
    return () => context.revert();
  }, [reducedMotion]);

  return (
    <div ref={rootRef} data-project-closing>
      <section ref={transitionRef} data-detail-closing-transition data-closing-motion={reducedMotion ? "reduced" : "scroll"} className={reducedMotion ? "relative" : "relative h-[240svh]"}>
        <div ref={surfaceRef} data-closing-surface className={reducedMotion ? "relative flex items-center justify-center overflow-hidden px-6 py-24 sm:px-10" : "sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden px-6 sm:px-10"} style={{ backgroundColor: reducedMotion ? "var(--world-a-bg)" : "var(--world-b-bg)" }}>
          {!reducedMotion && (
            <h2 data-closing-intro className="text-center text-[clamp(3rem,9vw,9rem)] font-black uppercase leading-[0.9] tracking-tighter text-[var(--world-b-text)]">
              The work<br />continues.
            </h2>
          )}
          <div data-closing-outro className={`${reducedMotion ? "relative" : "invisible absolute inset-0"} flex flex-col items-center justify-center gap-6 px-6 text-center text-[var(--world-a-text)]`}>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--world-a-muted)]">There&apos;s more to explore</p>
            <h2 className="font-serif text-[clamp(3rem,8vw,8rem)] leading-[1.05] tracking-[-0.03em]">Keep exploring.</h2>
          </div>
        </div>
      </section>
      <div className="bg-[var(--world-a-bg)] text-[var(--world-a-text)]">{children}</div>
    </div>
  );
}
