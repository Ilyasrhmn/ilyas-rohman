"use client";

import { useEffect, useMemo, useRef } from "react";
import { gsap, ScrollTrigger, registerGsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { certificates } from "@/data/certificates";
import { groupByTrack } from "./data";

// Same turbulence texture as the global .backdrop-grain, scoped locally so it can fade
// in with the scrub instead of always being on.
const GRAIN_BG =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

export function AchievementsThreshold() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const watermarkRef = useRef<HTMLDivElement>(null);
  const grainRef = useRef<HTMLDivElement>(null);
  const manifestRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const groups = useMemo(() => groupByTrack(certificates), []);

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
      document.body.setAttribute("data-nav-theme", "world-a");
      return;
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
      if (manifestRef.current) {
        tl.fromTo(
          manifestRef.current.children,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: "none" },
          0.35
        );
      }

      ScrollTrigger.create({
        trigger: wrapperRef.current,
        start: "center center",
        onEnter: () => document.body.setAttribute("data-nav-theme", "world-a"),
        onLeaveBack: () => document.body.setAttribute("data-nav-theme", "world-b"),
      });
    }, wrapperRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section ref={wrapperRef} className={reducedMotion ? "relative" : "relative h-[220vh]"}>
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

        <div className="relative z-10 mx-auto flex max-w-md flex-col items-center gap-6 px-6 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.2em] opacity-80 sm:text-sm">
            Everything below is the full list, ordered by track.
          </p>

          <div
            ref={manifestRef}
            className="flex w-full max-w-xs flex-col divide-y divide-current divide-opacity-10"
          >
            {groups.map((group) => (
              <div
                key={group.track}
                className="flex items-center justify-between py-2 font-mono text-[11px] uppercase tracking-wide opacity-60"
                style={reducedMotion ? undefined : { opacity: 0 }}
              >
                <span>{group.track}</span>
                <span>{String(group.certs.length).padStart(2, "0")}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
