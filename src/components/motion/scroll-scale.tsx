"use client";

import { useEffect, useRef } from "react";
import { registerGsap, gsap } from "@/lib/gsap";
import { useReducedMotion, useIsTouch } from "@/hooks/use-reduced-motion";

export function ScrollScale({
  text,
  panelColor = "#0A0B0A",
  className = "",
}: {
  text: string;
  panelColor?: string;
  className?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const touch = useIsTouch();
  const disabled = reduced || touch;

  useEffect(() => {
    if (disabled || !wrapRef.current) return;
    registerGsap();
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapRef.current,
          start: "top top",
          end: "+=140%",
          scrub: 0.5,
          pin: true,
        },
      });
      tl.fromTo(panelRef.current, { opacity: 0 }, { opacity: 1, ease: "none" }, 0);
      tl.fromTo(
        textRef.current,
        { scale: 1, opacity: 1 },
        { scale: 14, opacity: 0, ease: "power1.in" },
        0
      );
    }, wrapRef);
    return () => ctx.revert();
  }, [disabled]);

  if (disabled) {
    return (
      <div
        className={`section-pad flex items-center justify-center ${className}`}
        style={{ backgroundColor: panelColor }}
      >
        <div className="display text-center text-foreground">{text}</div>
      </div>
    );
  }

  return (
    <div ref={wrapRef} className={`relative h-screen overflow-hidden ${className}`}>
      <div
        ref={panelRef}
        className="absolute inset-0"
        style={{ backgroundColor: panelColor, opacity: 0 }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          ref={textRef}
          className="display text-center text-foreground will-change-transform"
          style={{ transformOrigin: "center" }}
        >
          {text}
        </div>
      </div>
    </div>
  );
}
