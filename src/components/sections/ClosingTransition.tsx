"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ClosingTransition() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // 400vh total = 4 units. 1 unit ≈ 100vh of scroll.
      // Timeline layout:
      //   0   → 2.0  : NOTHING. Journey text fully visible, page just sits there.
      //   2.0 → 3.0  : bg + nav color transition (slow, 1 unit of scroll to complete)
      //   2.2 → 3.2  : Journey text fades out (slow, overlaps color change)
      //   3.3 → 4.0  : "Ready to build?" fades in (after journey fully gone)

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      // Bg darkens — starts at 2.0, takes 1 full unit of scroll to complete
      tl.to(".closing-bg", { backgroundColor: "#101612", duration: 1.0, ease: "none" }, 2.0)

        // Nav colors — same window as bg
        .to(
          document.documentElement,
          {
            "--nav-bg": "rgba(16, 22, 18, 0.45)",
            "--nav-text": "#E8E5DA",
            "--nav-muted": "#98A39A",
            "--nav-border": "rgba(232, 229, 218, 0.08)",
            "--nav-contact-border": "#8FAF8F",
            duration: 1.0,
            ease: "none",
          },
          2.0
        )

        // 1.2 → 2.6 : "The Journey Continues" fades out
        .to(
          ".closing-text",
          { scale: 1.08, opacity: 0, duration: 1.4, ease: "power1.inOut" },
          1.2
        )

        // 1.2 → 2.6 : "Ready to build?" cross-fades IN at same time — no empty screen
        .fromTo(
          ".closing-dark-text",
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 1.4, ease: "power1.inOut" },
          1.2
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative w-full h-[400vh] z-10">
      <div className="sticky top-0 closing-bg h-screen w-full flex flex-col items-center justify-center bg-[var(--world-b-bg)] overflow-hidden">

        <h2 className="closing-text text-5xl md:text-[7rem] lg:text-[9rem] font-black uppercase tracking-tighter text-[var(--world-b-text)] text-center leading-[0.85]">
          The Journey <br /> Continues
        </h2>

        <div className="closing-dark-text absolute inset-0 flex items-center justify-center pointer-events-none opacity-0">
          <h2 className="text-xl md:text-3xl font-mono tracking-widest text-[var(--world-a-muted)] uppercase text-center mt-12">
            Ready to build?
          </h2>
        </div>
      </div>
    </section>
  );
}
