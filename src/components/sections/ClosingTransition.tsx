"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ClosingTransition() {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!containerRef.current) return;

    if (reducedMotion) {
      // Short-circuit straight to the end state: dark bg, nav flipped, text gone.
      gsap.set(".closing-bg", { backgroundColor: "#101612" });
      gsap.set(".closing-text", { opacity: 0 });
      gsap.set(document.documentElement, {
        "--nav-bg": "rgba(16, 22, 18, 0.45)",
        "--nav-text": "#E8E5DA",
        "--nav-muted": "#98A39A",
        "--nav-border": "rgba(232, 229, 218, 0.08)",
        "--nav-contact-border": "#8FAF8F",
      });
      return;
    }

    const ctx = gsap.context(() => {
      // 180vh total, scaled 0.45x from the original 400vh/4-unit timeline.
      // Timeline layout (unit ≈ 100vh of scroll):
      //   0    → 0.54 : NOTHING. Journey text fully visible.
      //   0.54 → 0.99 : Journey text fades out
      //   0.9  → 1.35 : bg + nav color transition (overlaps the tail of the text fade)

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      tl.to(".closing-bg", { backgroundColor: "#101612", duration: 0.45, ease: "none" }, 0.9)
        .to(
          document.documentElement,
          {
            "--nav-bg": "rgba(16, 22, 18, 0.45)",
            "--nav-text": "#E8E5DA",
            "--nav-muted": "#98A39A",
            "--nav-border": "rgba(232, 229, 218, 0.08)",
            "--nav-contact-border": "#8FAF8F",
            duration: 0.45,
            ease: "none",
          },
          0.9
        )
        .to(
          ".closing-text",
          { scale: 1.08, opacity: 0, duration: 0.45, ease: "power1.inOut" },
          0.54
        );
    }, containerRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section ref={containerRef} className="relative w-full h-[180vh] z-10">
      <div className="sticky top-0 closing-bg h-screen w-full flex flex-col items-center justify-center bg-[var(--world-b-bg)] overflow-hidden">
        <h2 className="closing-text font-serif font-semibold tracking-tight text-5xl md:text-[7rem] lg:text-[9rem] text-[var(--world-b-text)] text-center leading-[0.85]">
          The Journey <br /> Continues
        </h2>
      </div>
    </section>
  );
}
