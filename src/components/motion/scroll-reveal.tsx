"use client";

import { useEffect, useMemo, useRef } from "react";
import { registerGsap, gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export function splitWords(text: string): string[] {
  return text.split(/(\s+)/);
}

export function ScrollReveal({
  children,
  className = "",
  baseOpacity = 0.2,
  blur = 4,
}: {
  children: string;
  className?: string;
  baseOpacity?: number;
  blur?: number;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduced = useReducedMotion();
  const parts = useMemo(() => splitWords(children), [children]);

  useEffect(() => {
    if (reduced || !ref.current) return;
    registerGsap();
    const el = ref.current;
    const words = el.querySelectorAll<HTMLElement>(".sr-word");

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { rotate: 2, transformOrigin: "0% 50%" },
        {
          rotate: 0,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "top center", scrub: true },
        }
      );
      gsap.fromTo(
        words,
        { opacity: baseOpacity, filter: `blur(${blur}px)` },
        {
          opacity: 1,
          filter: "blur(0px)",
          ease: "power2.out",
          stagger: 0.03,
          scrollTrigger: { trigger: el, start: "top 88%", end: "top 45%", scrub: true },
        }
      );
    }, el);

    return () => ctx.revert();
  }, [reduced, baseOpacity, blur]);

  return (
    <p ref={ref} className={className}>
      {parts.map((p, i) =>
        /^\s+$/.test(p) ? (
          <span key={i}>{p}</span>
        ) : (
          <span
            key={i}
            className="sr-word inline-block"
            style={reduced ? undefined : { opacity: baseOpacity }}
          >
            {p}
          </span>
        )
      )}
    </p>
  );
}
