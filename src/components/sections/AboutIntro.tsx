"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";

const Lanyard = dynamic(() => import("../motion/Lanyard"), { ssr: false });

export default function AboutIntro() {
  return (
    <section
      id="about"
      className="relative w-full bg-[var(--world-a-bg)] z-10 overflow-hidden"
      style={{ paddingTop: "calc(var(--navbar-h, 72px) + 3rem)" }}
    >
      <div
        className="
          w-full max-w-[1440px] mx-auto
          px-6 md:px-12 lg:px-20
          grid grid-cols-1 lg:grid-cols-[minmax(300px,0.7fr)_minmax(0,1.8fr)]
          gap-0 lg:gap-12
          items-center
          min-h-[calc(100svh_-_72px)]
          pb-16
        "
      >
        {/* ── LEFT: label + connector + lanyard ── */}
        <div className="flex flex-col items-center lg:items-start order-2 lg:order-1 mt-10 lg:mt-0">

          {/* Section label */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center lg:items-start"
          >
            <span className="font-mono text-[10px] tracking-[0.22em] text-[var(--world-a-muted)] mb-1 uppercase">
              [001]
            </span>
            <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-[var(--world-a-text)] uppercase leading-none">
              ABOUT
            </h3>
          </motion.div>

          {/* Vertical connector — short, just enough to bridge label → rope */}
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            className="w-px h-10 bg-[var(--world-a-border)] mt-4 origin-top hidden lg:block"
          />

          {/* Lanyard — rope naturally continues the vertical flow */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.35 }}
            className="w-full max-w-[420px] lg:max-w-none -mt-4 lg:-mt-6"
          >
            <Lanyard />
          </motion.div>
        </div>

        {/* ── RIGHT: editorial copy ── */}
        <div className="flex flex-col justify-center order-1 lg:order-2 pt-0 lg:pt-0 pointer-events-none">
          <motion.h2
            className="
              font-light tracking-tight text-[var(--world-a-text)] uppercase
              leading-[1.02]
              max-w-[920px]
            "
            style={{ fontSize: "clamp(2.4rem, 4.2vw, 5.2rem)" }}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          >
            I enjoy building{" "}
            <em className="font-serif not-italic italic text-[var(--world-a-accent)] normal-case">
              interactive
            </em>{" "}
            web experiences where design,{" "}
            <em className="font-serif not-italic italic text-[var(--world-a-accent)] normal-case">
              motion
            </em>
            , and code work together.
          </motion.h2>

          <motion.p
            className="text-[var(--world-a-muted)] font-light leading-[1.6] max-w-[620px]"
            style={{
              fontSize: "clamp(1rem, 1.35vw, 1.25rem)",
              marginTop: "clamp(1.75rem, 3.5vw, 3.25rem)",
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
          >
            I&apos;m Ilyas, a frontend-focused developer based in Yogyakarta. I learn
            best by building, experimenting with interaction, and turning ideas into
            real digital experiences.
          </motion.p>
        </div>
      </div>
    </section>
  );
}
