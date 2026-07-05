"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { profile } from "@/data/profile";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", reduced ? "0%" : "18%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", reduced ? "0%" : "-30%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, reduced ? 1 : 0]);

  return (
    <section ref={ref} id="hero" className="relative h-[210vh] w-full overflow-hidden">
      {/* Background Image: 210vh tall so it scrolls naturally */}
      <div className="absolute inset-0">
        <Image
          src="/hero/forest.webp"
          alt="Misty mountain forest landscape"
          fill
          priority
          sizes="100vw"
          className="object-cover object-top"
        />
      </div>

      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(16,22,18,0.15) 0%, rgba(16,22,18,0.05) 25%, rgba(16,22,18,0.4) 65%, rgba(16,22,18,1) 100%)",
        }}
      />

      <div className="hero-clouds absolute inset-0 overflow-hidden opacity-75">
        <div className="hero-clouds__track--left flex h-full w-[200%]">
          <Image src="/hero/cloud1.webp" alt="" width={1600} height={900} sizes="50vw" className="h-full w-1/2 object-cover object-bottom" aria-hidden loading="eager" priority />
          <Image src="/hero/cloud1.webp" alt="" width={1600} height={900} sizes="50vw" className="h-full w-1/2 -scale-x-100 object-cover object-bottom" aria-hidden loading="eager" />
        </div>
      </div>

      <div className="mist absolute inset-0" />

      {/* Sticky Content Wrapper */}
      <motion.div
        style={{ 
          opacity: contentOpacity,
          pointerEvents: useTransform(scrollYProgress, (v) => v > 0.7 ? "none" : "auto"),
          visibility: useTransform(scrollYProgress, (v) => v > 0.8 ? "hidden" : "visible")
        }}
        className="sticky top-0 z-10 grid h-screen w-full grid-rows-[1fr_auto] p-5 pt-32 sm:p-10"
      >
        {/* Center Content */}
        <div className="flex flex-col justify-center items-start pl-0 sm:pl-10 pb-10 sm:pb-20">
          <h1 className="font-serif text-[clamp(2rem,5.5vw,5rem)] font-light leading-[1.05] tracking-[-0.02em] text-[var(--nav-text)] mb-3 sm:mb-5">
            {profile.name}
          </h1>
          <p className="font-sans text-[clamp(0.5625rem,0.9vw,0.75rem)] font-light tracking-[0.2em] uppercase text-[var(--nav-muted)] leading-relaxed">
            {profile.role}
          </p>
          <p className="font-serif text-[clamp(0.875rem,1.5vw,1.25rem)] font-light italic tracking-[0.02em] text-[var(--nav-text)] opacity-80 mt-2 sm:mt-3">
            Crafting Interactive Digital Experiences
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-end pb-4 sm:pb-0">
          <div className="flex flex-col gap-1">
            <span className="font-sans text-[0.5625rem] font-light tracking-[0.2em] uppercase text-[var(--nav-muted)] opacity-80">
              © {new Date().getFullYear()}
            </span>
            <span className="font-sans text-[0.5625rem] font-light tracking-[0.2em] uppercase text-[var(--nav-muted)] opacity-80">
              Yogyakarta, Indonesia
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-sans text-[0.5625rem] font-normal tracking-[0.3em] uppercase text-[var(--nav-muted)]">
              Scroll
            </span>
            <div className="relative h-px w-10 overflow-hidden bg-[var(--nav-muted)] opacity-50">
              <span className="hero-scroll-slide absolute inset-y-0 left-[-100%] w-full bg-[var(--nav-text)]" />
            </div>
          </div>
        </div>
      </motion.div>

      <style>{`
        @keyframes cloudDriftLeft { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes scrollLineSlide { from { left: -100%; } to { left: 100%; } }
        .hero-clouds__track--left { animation: cloudDriftLeft 90s linear infinite; }
        .hero-scroll-slide { animation: scrollLineSlide 2.5s ease-in-out infinite; }
      `}</style>
    </section>
  );
}
