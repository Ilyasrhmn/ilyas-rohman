"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { profile } from "@/data/profile";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

export function Hero() {
  const reduced = useReducedMotion();

  return (
    <section id="hero" className="relative h-screen w-full overflow-hidden">
      {/* Background forest image */}
      <div className="absolute inset-0">
        <Image
          src="/hero/forest.webp"
          alt="Misty mountain forest landscape"
          fill
          priority
          className="object-cover object-top"
        />
      </div>

      {/* Dark gradient overlay, heavier toward bottom */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(11,11,11,0.15) 0%, rgba(11,11,11,0.05) 25%, rgba(11,11,11,0.35) 65%, rgba(14,15,14,0.95) 100%)",
        }}
      />

      {/* Cloud drift layers */}
      <div className="hero-clouds hero-clouds--back absolute inset-0 overflow-hidden opacity-45">
        <div className="hero-clouds__track hero-clouds__track--left flex h-full w-[200%]">
          <Image src="/hero/cloud1.webp" alt="" width={1600} height={900} className="h-full w-1/2 object-cover object-bottom" aria-hidden />
          <Image src="/hero/cloud1.webp" alt="" width={1600} height={900} className="h-full w-1/2 object-cover object-bottom -scale-x-100" aria-hidden />
        </div>
      </div>
      <div className="hero-clouds hero-clouds--front absolute inset-0 overflow-hidden opacity-35 blur-[2px]">
        <div className="hero-clouds__track hero-clouds__track--right flex h-full w-[200%]">
          <Image src="/hero/cloud2.webp" alt="" width={1600} height={900} className="h-full w-1/2 object-cover object-bottom" aria-hidden />
          <Image src="/hero/cloud2.webp" alt="" width={1600} height={900} className="h-full w-1/2 object-cover object-bottom -scale-x-100" aria-hidden />
        </div>
      </div>

      {/* Mist wash */}
      <div className="mist absolute inset-0" />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col justify-end px-6 pb-20 sm:px-10 sm:pb-24">
        <motion.h1
          initial={reduced ? false : "hidden"}
          animate="show"
          variants={fadeUp}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="font-serif text-4xl font-light tracking-tight text-foreground sm:text-6xl lg:text-7xl"
        >
          {profile.name}
        </motion.h1>

        <motion.p
          initial={reduced ? false : "hidden"}
          animate="show"
          variants={fadeUp}
          transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
          className="mt-4 max-w-xl font-serif text-lg italic text-muted-foreground sm:text-xl"
        >
          {profile.positioning}
        </motion.p>

        <motion.div
          initial={reduced ? false : "hidden"}
          animate="show"
          variants={fadeUp}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="mt-10 flex items-center gap-3"
        >
          <span className="text-[0.65rem] uppercase tracking-[0.3em] text-muted-foreground">
            Scroll
          </span>
          <span className="relative h-px w-10 overflow-hidden bg-white/20">
            <span className="hero-scroll-slide absolute inset-y-0 left-[-100%] w-full bg-accent" />
          </span>
        </motion.div>
      </div>

      <style>{`
        @keyframes cloudDriftLeft {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes cloudDriftRight {
          from { transform: translateX(-50%); }
          to { transform: translateX(0); }
        }
        @keyframes scrollLineSlide {
          from { left: -100%; }
          to { left: 100%; }
        }
        .hero-clouds__track--left { animation: cloudDriftLeft 90s linear infinite; }
        .hero-clouds__track--right { animation: cloudDriftRight 120s linear infinite; }
        .hero-scroll-slide { animation: scrollLineSlide 2.5s ease-in-out infinite; }
      `}</style>
    </section>
  );
}
