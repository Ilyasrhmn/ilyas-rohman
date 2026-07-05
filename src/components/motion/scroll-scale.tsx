"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion, useIsTouch } from "@/hooks/use-reduced-motion";

export function ScrollScale({
  text,
  className = "",
  children,
}: {
  text: string;
  className?: string;
  children?: React.ReactNode;
}) {
  const reduced = useReducedMotion();
  const isTouch = useIsTouch();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const disabled = reduced || isTouch;

  useEffect(() => {
    if (disabled) return;
    let ctx: { revert: () => void } | undefined;

    (async () => {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      if (!wrapperRef.current || !textRef.current) return;

      ctx = gsap.context(() => {
        gsap.timeline({
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: "top top",
            end: "+=100%",
            scrub: 0.5,
            pin: true,
          },
        }).fromTo(
          textRef.current,
          { scale: 1, opacity: 1 },
          { scale: 14, opacity: 0, ease: "power1.in" }
        );
      }, wrapperRef);
    })();

    return () => ctx?.revert();
  }, [disabled]);

  if (disabled) {
    return (
      <div className={`section-pad flex items-center justify-center ${className}`}>
        <div className="text-center text-4xl sm:text-6xl font-serif text-foreground">
          {text}
        </div>
        {children}
      </div>
    );
  }

  return (
    <div ref={wrapperRef} className={`relative h-[100vh] overflow-hidden ${className}`}>
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          ref={textRef}
          className="text-center text-4xl sm:text-6xl font-serif text-foreground will-change-transform"
          style={{ transformOrigin: "center center" }}
        >
          {text}
        </div>
      </div>
      {children}
    </div>
  );
}
