"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, registerGsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { RevealLink } from "@/components/layout/route-reveal";
import { useContact } from "@/components/layout/chrome-shell";

// Same turbulence texture as the global .backdrop-grain, scoped locally so it can fade
// in with the scrub instead of always being on.
const GRAIN_BG =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

export function AchievementsThreshold() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const watermarkRef = useRef<HTMLDivElement>(null);
  const grainRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const openContact = useContact();

  useEffect(() => {
    registerGsap();
    if (!wrapperRef.current || !stickyRef.current) return;

    const cs = getComputedStyle(document.documentElement);
    const bBg = cs.getPropertyValue("--world-b-bg").trim();
    const aBg = cs.getPropertyValue("--world-a-bg").trim();
    const bText = cs.getPropertyValue("--world-b-text").trim();
    const aText = cs.getPropertyValue("--world-a-text").trim();

    if (reducedMotion) {
      gsap.set(stickyRef.current, { backgroundColor: aBg, color: aText });
      const syncNavTheme = () => {
        if (!wrapperRef.current) return;
        document.body.setAttribute(
          "data-nav-theme",
          wrapperRef.current.getBoundingClientRect().top < window.innerHeight * 0.5 ? "world-a" : "world-b"
        );
      };
      syncNavTheme();
      window.addEventListener("scroll", syncNavTheme, { passive: true });
      return () => window.removeEventListener("scroll", syncNavTheme);
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.5,
          invalidateOnRefresh: true,
        },
      });

      tl.fromTo(
        stickyRef.current,
        { backgroundColor: bBg, color: bText },
        { backgroundColor: aBg, color: aText, duration: 1, ease: "none" },
        0
      );

      if (watermarkRef.current) {
        tl.fromTo(
          watermarkRef.current,
          { yPercent: -15 },
          { yPercent: 15, duration: 1, ease: "none" },
          0
        );
      }
      if (grainRef.current) {
        tl.fromTo(
          grainRef.current,
          { opacity: 0 },
          { opacity: 0.05, duration: 1, ease: "none" },
          0
        );
      }
      ScrollTrigger.create({
        trigger: wrapperRef.current,
        start: "top -50%",
        onEnter: () => document.body.setAttribute("data-nav-theme", "world-a"),
        onLeaveBack: () => document.body.setAttribute("data-nav-theme", "world-b"),
      });
    }, wrapperRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section ref={wrapperRef} data-achievements-threshold className={reducedMotion ? "relative" : "relative h-[220vh]"}>
      <div
        ref={stickyRef}
        className={
          reducedMotion
            ? "relative flex items-center justify-center overflow-hidden py-24"
            : "sticky top-0 flex h-screen items-center justify-center overflow-hidden"
        }
      >
        <div
          ref={watermarkRef}
          aria-hidden
          className="pointer-events-none absolute inset-0 flex select-none items-center justify-center"
        >
          <span className="whitespace-nowrap font-serif text-[24vw] leading-none opacity-[0.06]">
            ARCHIVE
          </span>
        </div>

        <div
          ref={grainRef}
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: GRAIN_BG,
            backgroundSize: "160px 160px",
            opacity: reducedMotion ? 0.04 : 0,
          }}
        />

        <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center gap-8 px-6 text-center sm:px-10">
          <h2 className="font-serif text-3xl md:text-5xl">That&apos;s the whole shelf.</h2>
          <p className="max-w-[55ch] font-serif text-base opacity-75 md:text-lg">
            Certificates are a floor, not a ceiling. If you want to see what I built on top of them, the work is one click away.
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
            <RevealLink href="/projects" className="inline-flex min-h-[44px] items-center gap-2 border border-current px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] transition-opacity hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">
              See the work →
            </RevealLink>
            <button type="button" onClick={openContact} className="inline-flex min-h-[44px] items-center gap-2 px-2 py-3 font-mono text-xs uppercase tracking-[0.2em] underline underline-offset-4 transition-opacity hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">
              Start a conversation
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
