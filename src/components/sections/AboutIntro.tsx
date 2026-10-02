"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useInViewport } from "@/hooks/use-in-viewport";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const Lanyard = dynamic(() => import("../motion/Lanyard"), { ssr: false });

export default function AboutIntro() {
  const lanyardRef = useRef<HTMLDivElement>(null);
  // Hold the 3D chunk back until the section is close, since it is ~3.3MB of JS.
  const nearViewport = useInViewport(lanyardRef, { rootMargin: "600px" });
  const reducedMotion = useReducedMotion();
  const [lanyardReady, setLanyardReady] = useState(false);

  // Warm the 3D module and its assets after the initial page load. The poster
  // covers the remaining WebGL/physics setup when someone scrolls here quickly.
  useEffect(() => {
    if (reducedMotion) return;
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    const warm = () => {
      void import("../motion/Lanyard");
    };

    let idleId: number | undefined;
    let delayId: number | undefined;

    const scheduleWarm = () => {
      delayId = window.setTimeout(() => {
        if (w.requestIdleCallback) {
          // The timeout is a floor, not a target: if the main thread never goes idle the
          // warm-up still runs rather than being starved forever.
          idleId = w.requestIdleCallback(warm, { timeout: 2000 });
        } else {
          warm();
        }
      }, 1200);
    };

    if (document.readyState === "complete") {
      scheduleWarm();
    } else {
      window.addEventListener("load", scheduleWarm, { once: true });
    }

    return () => {
      window.removeEventListener("load", scheduleWarm);
      if (delayId !== undefined) window.clearTimeout(delayId);
      if (idleId !== undefined) w.cancelIdleCallback?.(idleId);
    };
  }, [reducedMotion]);
  // Once mounted, stay mounted: unmounting/remounting tears down and rebuilds the WebGL
  // context on every pass through the 600px window, which is far more expensive than the
  // frameloop pause Lanyard already does internally while off-screen. Adjusting state
  // during render (not in an effect) is React's documented pattern for latching a value
  // from a previous render: https://react.dev/reference/react/useState#storing-information-from-previous-renders
  const [hasBeenNear, setHasBeenNear] = useState(false);
  if (nearViewport && !hasBeenNear) {
    setHasBeenNear(true);
  }

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
            <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-[var(--world-a-text)] uppercase leading-none">
              ABOUT
            </h3>
          </motion.div>

          {/* Vertical connector, short: just enough to bridge label → rope */}
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            className="w-px h-10 bg-[var(--world-a-border)] mt-4 origin-top hidden lg:block"
          />

          {/* Lanyard: rope naturally continues the vertical flow */}
          <div
            ref={lanyardRef}
            className="relative w-full max-w-[420px] lg:max-w-none mt-8 lg:-mt-6 h-[480px] lg:h-[560px]"
          >
            {hasBeenNear && !reducedMotion && <Lanyard onReady={() => setLanyardReady(true)} />}
            <Image
              src="/assets/lanyard/card-poster.webp"
              alt="Ilyas Nur Rohman's orange ID card hanging from a black lanyard"
              fill
              sizes="(min-width: 1024px) 35vw, (min-width: 640px) 420px, 100vw"
              loading="eager"
              className={`pointer-events-none object-cover ${lanyardReady && !reducedMotion ? "opacity-0" : "opacity-100"}`}
            />
          </div>
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
