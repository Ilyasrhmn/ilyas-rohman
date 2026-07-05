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
    <section ref={ref} id="hero" className="relative h-screen w-full overflow-hidden">
      <motion.div style={{ y: bgY }} className="absolute inset-0 scale-110">
        <Image
          src="/hero/forest.webp"
          alt="Misty mountain forest landscape"
          fill
          priority
          sizes="100vw"
          className="object-cover object-top"
        />
      </motion.div>

      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(16,22,18,0.15) 0%, rgba(16,22,18,0.05) 25%, rgba(16,22,18,0.4) 65%, rgba(16,22,18,1) 100%)",
        }}
      />

      <div className="hero-clouds absolute inset-0 overflow-hidden opacity-40">
        <div className="hero-clouds__track--left flex h-full w-[200%]">
          <Image src="/hero/cloud1.webp" alt="" width={1600} height={900} sizes="50vw" className="h-full w-1/2 object-cover object-bottom" aria-hidden loading="eager" priority />
          <Image src="/hero/cloud1.webp" alt="" width={1600} height={900} sizes="50vw" className="h-full w-1/2 -scale-x-100 object-cover object-bottom" aria-hidden loading="eager" />
        </div>
      </div>

      <div className="mist absolute inset-0" />

      <motion.div
        style={{ 
          y: contentY, 
          opacity: contentOpacity,
          pointerEvents: useTransform(scrollYProgress, (v) => v > 0.7 ? "none" : "auto"),
          visibility: useTransform(scrollYProgress, (v) => v > 0.8 ? "hidden" : "visible")
        }}
        className="relative z-10 flex h-full flex-col justify-end px-6 pb-20 sm:px-10 sm:pb-24"
      >
        <span className="eyebrow mb-4 text-[var(--world-a-accent)]">{profile.role}</span>
        <h1 className="display max-w-[14ch] text-[var(--world-a-text)]">{profile.name}</h1>
        <p className="mt-6 max-w-xl font-serif text-xl italic text-[var(--world-a-muted)] sm:text-2xl">
          {profile.positioning}
        </p>
        <div className="mt-10 flex items-center gap-3">
          <span className="eyebrow !tracking-[0.3em] text-[var(--world-a-accent)]">Scroll</span>
          <span className="relative h-px w-12 overflow-hidden bg-[var(--world-a-border)]">
            <span className="hero-scroll-slide absolute inset-y-0 left-[-100%] w-full bg-[var(--world-a-accent)]" />
          </span>
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
