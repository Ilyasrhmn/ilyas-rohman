"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap, ScrollTrigger, registerGsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useContact } from "@/components/layout/chrome-shell";
import { cn } from "@/lib/utils";

export function AchievementsClosing() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const openContact = useContact();

  useEffect(() => {
    registerGsap();
    if (!wrapperRef.current || !stickyRef.current) return;

    const cs = getComputedStyle(document.documentElement);
    const aBg = cs.getPropertyValue("--world-a-bg").trim();
    const bBg = cs.getPropertyValue("--world-b-bg").trim();
    const aText = cs.getPropertyValue("--world-a-text").trim();
    const bText = cs.getPropertyValue("--world-b-text").trim();

    if (reducedMotion) {
      gsap.set(stickyRef.current, { backgroundColor: bBg, color: bText });
      document.body.setAttribute("data-nav-theme", "world-b");
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        stickyRef.current,
        { backgroundColor: aBg, color: aText },
        {
          backgroundColor: bBg,
          color: bText,
          ease: "none",
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: "top bottom",
            end: "bottom bottom",
            scrub: 1,
            invalidateOnRefresh: true,
          },
        }
      );

      ScrollTrigger.create({
        trigger: wrapperRef.current,
        start: "center center",
        onEnter: () => document.body.setAttribute("data-nav-theme", "world-b"),
        onLeaveBack: () => document.body.setAttribute("data-nav-theme", "world-a"),
      });
    }, wrapperRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section ref={wrapperRef} className={reducedMotion ? "relative" : "relative h-[100vh]"}>
      <div
        ref={stickyRef}
        className={cn(
          "flex flex-col items-center justify-center gap-8 px-6 text-center sm:px-10",
          reducedMotion ? "py-24 md:py-32" : "sticky top-0 h-screen"
        )}
      >
        <p className="font-serif text-3xl md:text-5xl" style={{ color: "inherit" }}>
          That&apos;s the whole shelf.
        </p>
        <p className="max-w-[55ch] font-serif text-base opacity-80 md:text-lg" style={{ color: "inherit" }}>
          Certificates are a floor, not a ceiling. If you want to see what I built on top of
          them, the work is one click away.
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 border px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] transition-opacity hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ color: "inherit", borderColor: "currentColor" }}
          >
            See the work →
          </Link>
          <button
            type="button"
            onClick={openContact}
            className="inline-flex items-center gap-2 px-2 py-3 font-mono text-xs uppercase tracking-[0.2em] underline underline-offset-4 transition-opacity hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ color: "inherit" }}
          >
            Start a conversation
          </button>
        </div>
      </div>
    </section>
  );
}
