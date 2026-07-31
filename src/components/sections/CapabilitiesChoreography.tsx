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

// Fixed 12-column anchors, reused by every group so the scatter reads as rhythm, not noise.
const COLUMN_STARTS = [1, 5, 3, 6, 2];

export default function CapabilitiesChoreography() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !stageRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      stackGroups.forEach((_, i) => {
        const slot = i * 0.25;
        const group = `.cap-0${i + 1}`;
        tl.to(group, { autoAlpha: 1, duration: 0.05 }, slot);
        tl.fromTo(
          `${group} .cap-word`,
          { y: (i: number) => (i % 2 ? -22 : 28) },
          {
            y: (i: number) => (i % 2 ? 22 : -28),
            duration: 0.25,
            ease: "none",
          },
          slot
        );
        tl.to(group, { autoAlpha: 0, duration: 0.05 }, slot + 0.2);
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative w-full h-[500vh] bg-[var(--world-a-surface)]">
      <div ref={stageRef} className="sticky top-0 h-[100svh] w-full overflow-hidden flex flex-col lg:flex-row items-center justify-center">

        {/* Left Side: Text Choreography */}
        <div className="relative w-full lg:w-1/2 h-1/2 lg:h-full flex flex-col items-center justify-center overflow-hidden">
          {stackGroups.map((group, gi) => (
            <div
              key={group.label}
              className={`cap-0${gi + 1} absolute inset-0 flex flex-col items-center justify-center invisible opacity-0`}
            >
              <div className="absolute top-12 lg:top-32 left-8 lg:left-16 text-[var(--world-a-accent)] font-mono text-xs tracking-widest z-10">
                0{gi + 1} // {group.label}
              </div>
              <div className="grid w-full max-w-xl grid-cols-12 gap-y-8 lg:gap-y-10 px-8 lg:px-12 font-serif font-bold text-3xl lg:text-5xl text-[var(--world-a-muted)]">
                {group.items.map((item, i) => (
                  <span
                    key={item}
                    className={`cap-word col-end-13 whitespace-nowrap drop-shadow-md ${
                      i % 2 ? "text-[var(--world-a-text)]" : ""
                    }`}
                    style={{ gridColumnStart: COLUMN_STARTS[i % COLUMN_STARTS.length] }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Right Side: Orbital Timeline */}
        <div className="relative w-full lg:w-1/2 h-1/2 lg:h-full flex items-center justify-center z-50 p-4 lg:p-8">
          <RadialOrbitalTimeline timelineData={timelineData} />
        </div>

      </div>
    </section>
  );
}
