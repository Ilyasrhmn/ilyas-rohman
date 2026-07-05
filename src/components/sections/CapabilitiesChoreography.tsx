"use client";

import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { stackGroups } from "@/data/stack";
import RadialOrbitalTimeline, { TimelineItem } from "@/components/ui/radial-orbital-timeline";
import { Code2, Database, Layout, Sparkles, Box } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const timelineData: TimelineItem[] = [
  {
    id: 1,
    title: "React Ecosystem",
    date: "Current Core",
    content: "Deep expertise in React, Next.js, and modern React patterns.",
    category: "Frontend",
    icon: Code2,
    relatedIds: [2, 3],
    status: "completed",
    energy: 95,
  },
  {
    id: 2,
    title: "Styling & UI",
    date: "Aesthetics",
    content: "Building beautiful interfaces with Tailwind CSS, Shadcn UI.",
    category: "Design",
    icon: Layout,
    relatedIds: [1, 4],
    status: "completed",
    energy: 90,
  },
  {
    id: 3,
    title: "State & Data",
    date: "Architecture",
    content: "Managing complex state with Zustand, React Query.",
    category: "Architecture",
    icon: Database,
    relatedIds: [1, 5],
    status: "in-progress",
    energy: 85,
  },
  {
    id: 4,
    title: "Animation",
    date: "Motion",
    content: "Crafting fluid experiences with Framer Motion, GSAP.",
    category: "Animation",
    icon: Sparkles,
    relatedIds: [2],
    status: "in-progress",
    energy: 75,
  },
  {
    id: 5,
    title: "Backend Capable",
    date: "Fullstack",
    content: "Node.js, Express, Postgres APIs.",
    category: "Backend",
    icon: Box,
    relatedIds: [3],
    status: "pending",
    energy: 60,
  },
];

export default function CapabilitiesChoreography() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !stageRef.current) return;

    let ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1, // smooth scrub
          invalidateOnRefresh: true,
        },
      });

      // We have 4 groups. We'll give each group a 0.25 slot (0 to 0.25, 0.25 to 0.5, etc.)
      // Within each 0.25 slot:
      // - 0.00 to 0.05: fade in
      // - 0.05 to 0.20: fully visible and drifting
      // - 0.20 to 0.25: fade out
      // - 0.00 to 0.25: continuous slow drift

      // Group 01 (0 to 0.25)
      tl.to(".cap-01", { autoAlpha: 1, duration: 0.05 }, 0);
      tl.fromTo(".fe-1", { y: "30px" }, { y: "-15px", duration: 0.25, ease: "none" }, 0);
      tl.fromTo(".fe-2", { y: "-20px" }, { y: "20px", duration: 0.25, ease: "none" }, 0);
      tl.fromTo(".fe-3", { y: "40px" }, { y: "-10px", duration: 0.25, ease: "none" }, 0);
      tl.fromTo(".fe-4", { y: "-15px" }, { y: "25px", duration: 0.25, ease: "none" }, 0);
      tl.to(".cap-01", { autoAlpha: 0, duration: 0.05 }, 0.20);

      // Group 02 (0.25 to 0.50)
      tl.to(".cap-02", { autoAlpha: 1, duration: 0.05 }, 0.25);
      tl.fromTo(".mo-1", { y: "25px" }, { y: "-25px", duration: 0.25, ease: "none" }, 0.25);
      tl.fromTo(".mo-2", { y: "-30px" }, { y: "15px", duration: 0.25, ease: "none" }, 0.25);
      tl.fromTo(".mo-3", { y: "35px" }, { y: "-15px", duration: 0.25, ease: "none" }, 0.25);
      tl.fromTo(".mo-4", { y: "-20px" }, { y: "20px", duration: 0.25, ease: "none" }, 0.25);
      tl.to(".cap-02", { autoAlpha: 0, duration: 0.05 }, 0.45);

      // Group 03 (0.50 to 0.75)
      tl.to(".cap-03", { autoAlpha: 1, duration: 0.05 }, 0.50);
      tl.fromTo(".be-grid", { y: "40px", scale: 0.98 }, { y: "-20px", scale: 1.02, duration: 0.25, ease: "none" }, 0.50);
      tl.to(".cap-03", { autoAlpha: 0, duration: 0.05 }, 0.70);

      // Group 04 (0.75 to 1.0)
      tl.to(".cap-04", { autoAlpha: 1, duration: 0.05 }, 0.75);
      tl.fromTo(".td-1", { y: "30px" }, { y: "-10px", duration: 0.25, ease: "none" }, 0.75);
      tl.fromTo(".td-2", { y: "-25px" }, { y: "20px", duration: 0.25, ease: "none" }, 0.75);
      tl.fromTo(".td-3", { y: "20px" }, { y: "-30px", duration: 0.25, ease: "none" }, 0.75);
      tl.fromTo(".td-4", { y: "-15px" }, { y: "25px", duration: 0.25, ease: "none" }, 0.75);
      tl.to(".cap-04", { autoAlpha: 0, duration: 0.05 }, 0.95);

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative w-full h-[500vh] bg-[var(--world-a-surface)]">
      <div ref={stageRef} className="sticky top-0 h-[100svh] w-full overflow-hidden flex flex-col lg:flex-row items-center justify-center">
        
        {/* Left Side: Text Choreography */}
        <div className="relative w-full lg:w-1/2 h-1/2 lg:h-full flex flex-col items-center justify-center overflow-hidden">
          
          {/* GROUP 01 */}
          <div className="cap-01 absolute inset-0 flex flex-col items-center justify-center invisible opacity-0">
            <div className="absolute top-12 lg:top-32 left-8 lg:left-16 text-[var(--world-a-accent)] font-mono text-xs tracking-widest z-10">01 // {stackGroups[0]?.label}</div>
            <div className="w-full max-w-md h-full flex flex-col justify-center items-start gap-8 lg:gap-12 px-12 text-4xl lg:text-5xl font-bold font-serif text-[var(--world-a-muted)]">
              <span className="fe-1 drop-shadow-md self-start">React</span>
              <span className="fe-2 drop-shadow-md self-end text-[var(--world-a-text)]">Next.js</span>
              <span className="fe-3 drop-shadow-md self-center">Tailwind CSS</span>
              <span className="fe-4 drop-shadow-md self-start text-[var(--world-a-text)]">TypeScript</span>
            </div>
          </div>

          {/* GROUP 02 */}
          <div className="cap-02 absolute inset-0 flex flex-col items-center justify-center invisible opacity-0">
            <div className="absolute top-12 lg:top-32 left-8 lg:left-16 text-[var(--world-a-accent)] font-mono text-xs tracking-widest z-10">02 // {stackGroups[1]?.label}</div>
            <div className="w-full max-w-md h-full flex flex-col justify-center items-start gap-8 lg:gap-12 px-12 text-4xl lg:text-5xl font-bold font-serif text-[var(--world-a-muted)]">
              <span className="mo-1 drop-shadow-md self-end">GSAP</span>
              <span className="mo-2 drop-shadow-md self-start text-[var(--world-a-text)]">Lenis</span>
              <span className="mo-3 drop-shadow-md self-center">Framer Motion</span>
              <span className="mo-4 drop-shadow-md self-end text-xl lg:text-3xl text-[var(--world-a-accent)]">ScrollTrigger</span>
            </div>
          </div>

          {/* GROUP 03 */}
          <div className="cap-03 absolute inset-0 flex flex-col items-center justify-center invisible opacity-0">
            <div className="absolute top-12 lg:top-32 left-8 lg:left-16 text-[var(--world-a-accent)] font-mono text-xs tracking-widest z-10">03 // {stackGroups[2]?.label}</div>
            <div className="be-grid relative w-full grid grid-cols-2 gap-x-8 md:gap-x-16 gap-y-16 text-2xl md:text-4xl font-serif text-[var(--world-a-muted)] text-center px-8">
              <div className="border-b border-[var(--world-a-border)] pb-6 drop-shadow-md">Laravel</div>
              <div className="border-b border-[var(--world-a-border)] pb-6 text-[var(--world-a-text)] drop-shadow-md">REST API</div>
              <div className="pt-6 drop-shadow-md">MySQL</div>
              <div className="pt-6 text-[var(--world-a-text)] drop-shadow-md">Node.js</div>
              {/* Connecting line */}
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-[var(--world-a-border)] -translate-x-1/2" />
            </div>
          </div>

          {/* GROUP 04 */}
          <div className="cap-04 absolute inset-0 flex flex-col items-center justify-center invisible opacity-0">
            <div className="absolute top-12 lg:top-32 left-8 lg:left-16 text-[var(--world-a-accent)] font-mono text-xs tracking-widest z-10">04 // {stackGroups[3]?.label}</div>
            <div className="w-full max-w-md h-full flex flex-col justify-center items-start gap-8 lg:gap-12 px-12 text-4xl lg:text-5xl font-bold font-serif text-[var(--world-a-muted)]">
              <span className="td-1 drop-shadow-md self-center text-[var(--world-a-text)]">Git</span>
              <span className="td-2 drop-shadow-md self-start">GitHub</span>
              <span className="td-3 drop-shadow-md self-end text-[var(--world-a-text)]">Vercel</span>
              <span className="td-4 drop-shadow-md self-center">Netlify</span>
            </div>
          </div>
        </div>

        {/* Right Side: Orbital Timeline */}
        <div className="relative w-full lg:w-1/2 h-1/2 lg:h-full flex items-center justify-center z-50 p-4 lg:p-8">
          <RadialOrbitalTimeline timelineData={timelineData} />
        </div>

      </div>
    </section>
  );
}
