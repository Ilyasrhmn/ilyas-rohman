"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { RevealLink } from "@/components/layout/route-reveal";
import { useContact } from "@/components/layout/chrome-shell";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ClosingTransition() {
  const containerRef = useRef<HTMLDivElement>(null);
  const openContact = useContact();

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      tl.to(".closing-bg", { backgroundColor: "#101612", duration: 0.8, ease: "none" }, 0.4)

        // Nav colors, same window as bg
        .to(
          document.documentElement,
          {
            "--nav-bg": "rgba(16, 22, 18, 0.45)",
            "--nav-text": "#E8E5DA",
            "--nav-muted": "#98A39A",
            "--nav-border": "rgba(232, 229, 218, 0.08)",
            "--nav-contact-border": "#8FAF8F",
            duration: 0.8,
            ease: "none",
          },
          0.4
        )

        .to(
          ".closing-text",
          { scale: 1.08, opacity: 0, duration: 0.8, ease: "power1.inOut" },
          0.3
        )

        .fromTo(
          ".closing-dark-text",
          { autoAlpha: 0, y: 30 },
          { autoAlpha: 1, y: 0, duration: 0.65, ease: "power1.out" },
          1.2
        )
        .to(".closing-dark-text", { duration: 0.35 }, 1.85);
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative w-full h-[260svh] z-10">
      <div className="sticky top-0 closing-bg h-screen w-full flex flex-col items-center justify-center bg-[var(--world-b-bg)] overflow-hidden">

        <h2 className="closing-text text-5xl md:text-[7rem] lg:text-[9rem] font-black uppercase tracking-tighter text-[var(--world-b-text)] text-center leading-[0.85]">
          The Journey <br /> Continues
        </h2>

        <div className="closing-dark-text invisible absolute inset-0 flex flex-col items-center justify-center gap-8 px-6 text-center pointer-events-none">
          <h2 className="text-xl md:text-3xl font-mono tracking-widest text-[var(--world-a-muted)] uppercase">
            Ready to build?
          </h2>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button
              type="button"
              onClick={openContact}
              className="pointer-events-auto inline-flex min-h-[44px] items-center justify-center gap-2 border border-[var(--world-a-accent)] px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] text-[var(--world-a-accent)] transition-opacity hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              Start a project
            </button>
            <RevealLink
              href="/projects"
              className="pointer-events-auto inline-flex min-h-[44px] items-center justify-center gap-2 border border-[var(--world-a-border)] px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] text-[var(--world-a-text)] transition-opacity hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              View my work
            </RevealLink>
          </div>
        </div>
      </div>
    </section>
  );
}
