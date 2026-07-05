"use client";

import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { stackGroups } from "@/data/stack";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function CapabilitiesChoreography() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !stageRef.current) return;

    let ctx = gsap.context(() => {
      // Create a master timeline for the entire capabilities sequence
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      // Group 01: FRONTEND ENGINEERING (0 to 0.25)
      tl.to(".cap-01", { autoAlpha: 1, duration: 0.05 }, 0);
      tl.fromTo(".fe-react", { x: "-20vw" }, { x: "10vw", duration: 0.25 }, 0);
      tl.fromTo(".fe-next", { x: "20vw" }, { x: "-10vw", duration: 0.25 }, 0);
      tl.fromTo(".fe-ts", { x: "-10vw" }, { x: "5vw", duration: 0.25 }, 0);
      tl.to(".cap-01", { autoAlpha: 0, duration: 0.05 }, 0.25);

      // Group 02: MOTION & INTERACTION (0.25 to 0.5)
      tl.to(".cap-02", { autoAlpha: 1, duration: 0.05 }, 0.25);
      tl.fromTo(".mo-gsap", { scale: 0.8, x: "-10vw", y: "5vh" }, { scale: 1.2, x: "10vw", y: "-5vh", duration: 0.25 }, 0.25);
      tl.fromTo(".mo-lenis", { x: "15vw", y: "-10vh" }, { x: "-15vw", y: "0vh", duration: 0.25 }, 0.25);
      tl.fromTo(".mo-framer", { scale: 1.1, x: "0vw", y: "15vh" }, { scale: 0.9, x: "-5vw", y: "-15vh", duration: 0.25 }, 0.25);
      tl.to(".cap-02", { autoAlpha: 0, duration: 0.05 }, 0.5);

      // Group 03: BACKEND & INTEGRATION (0.5 to 0.75)
      tl.to(".cap-03", { autoAlpha: 1, duration: 0.05 }, 0.5);
      tl.fromTo(".be-grid", { y: "20vh", opacity: 0 }, { y: "-5vh", opacity: 1, duration: 0.15 }, 0.5);
      tl.to(".be-grid", { y: "-15vh", opacity: 0, duration: 0.1 }, 0.65);
      tl.to(".cap-03", { autoAlpha: 0, duration: 0.05 }, 0.75);

      // Group 04: TOOLS & DELIVERY (0.75 to 0.95)
      tl.to(".cap-04", { autoAlpha: 1, duration: 0.05 }, 0.75);
      tl.fromTo(".td-git", { x: "-30vw", y: "-10vh" }, { x: "100vw", y: "-20vh", duration: 0.2 }, 0.75);
      tl.fromTo(".td-github", { x: "30vw", y: "0vh" }, { x: "-100vw", y: "10vh", duration: 0.2 }, 0.75);
      tl.fromTo(".td-vercel", { x: "-20vw", y: "10vh" }, { x: "100vw", y: "20vh", duration: 0.15 }, 0.78);
      tl.fromTo(".td-netlify", { x: "20vw", y: "20vh" }, { x: "-100vw", y: "-10vh", duration: 0.15 }, 0.8);
      tl.to(".cap-04", { autoAlpha: 0, duration: 0.05 }, 0.95);

      // (0.95 to 1.0) The scene is completely empty, ready for ScrollScale

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative w-full h-[320vh] bg-[var(--world-a-surface)]">
      <div ref={stageRef} className="sticky top-0 h-[100svh] w-full overflow-hidden flex items-center justify-center">
        
        {/* GROUP 01 */}
        <div className="cap-01 absolute inset-0 flex flex-col items-center justify-center invisible opacity-0">
          <div className="absolute top-24 md:top-32 left-12 md:left-24 text-[var(--world-a-accent)] font-mono text-xs tracking-widest">01 // {stackGroups[0]?.label}</div>
          <div className="relative w-full max-w-5xl h-full flex items-center justify-center text-4xl md:text-7xl font-bold font-serif text-[var(--world-a-muted)]">
            <span className="fe-react absolute left-10 top-1/3">React</span>
            <span className="fe-next absolute right-20 top-[45%]">Next.js</span>
            <span className="fe-ts absolute left-1/3 bottom-1/4">TypeScript</span>
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[var(--world-a-text)] z-10">Tailwind CSS</span>
          </div>
        </div>

        {/* GROUP 02 */}
        <div className="cap-02 absolute inset-0 flex flex-col items-center justify-center invisible opacity-0">
          <div className="absolute top-24 md:top-32 left-12 md:left-24 text-[var(--world-a-accent)] font-mono text-xs tracking-widest">02 // {stackGroups[1]?.label}</div>
          <div className="relative w-full max-w-5xl h-full flex items-center justify-center text-4xl md:text-7xl font-bold font-serif text-[var(--world-a-muted)]">
            <span className="mo-gsap absolute left-1/4 top-1/3">GSAP</span>
            <span className="mo-lenis absolute right-1/4 top-1/4">Lenis</span>
            <span className="mo-framer absolute left-1/3 bottom-1/3 text-[var(--world-a-text)] z-10">Framer Motion</span>
            <span className="absolute bottom-16 right-24 text-sm font-mono tracking-widest text-[var(--world-a-accent)]">ScrollTrigger</span>
          </div>
        </div>

        {/* GROUP 03 */}
        <div className="cap-03 absolute inset-0 flex flex-col items-center justify-center invisible opacity-0">
          <div className="absolute top-24 md:top-32 left-12 md:left-24 text-[var(--world-a-accent)] font-mono text-xs tracking-widest">03 // {stackGroups[2]?.label}</div>
          <div className="be-grid relative w-full max-w-4xl grid grid-cols-2 gap-x-24 gap-y-12 text-3xl md:text-5xl font-serif text-[var(--world-a-muted)] text-center">
            <div className="border-b border-[var(--world-a-border)] pb-4">Laravel</div>
            <div className="border-b border-[var(--world-a-border)] pb-4 text-[var(--world-a-text)]">REST API</div>
            <div className="pt-4">MySQL</div>
            <div className="pt-4">Node.js</div>
            {/* Connecting line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-[var(--world-a-border)] -translate-x-1/2" />
          </div>
        </div>

        {/* GROUP 04 */}
        <div className="cap-04 absolute inset-0 flex flex-col items-center justify-center invisible opacity-0">
          <div className="absolute top-24 md:top-32 left-12 md:left-24 text-[var(--world-a-accent)] font-mono text-xs tracking-widest">04 // {stackGroups[3]?.label}</div>
          <div className="relative w-full max-w-5xl h-full flex items-center justify-center text-4xl md:text-6xl font-bold font-serif text-[var(--world-a-muted)]">
            <span className="td-git absolute">Git</span>
            <span className="td-github absolute">GitHub</span>
            <span className="td-vercel absolute text-[var(--world-a-text)]">Vercel</span>
            <span className="td-netlify absolute">Netlify</span>
          </div>
        </div>

      </div>
    </section>
  );
}
