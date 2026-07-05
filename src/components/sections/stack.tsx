"use client";

import { motion } from "framer-motion";
import { stackGroups } from "@/data/stack";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { Code2, Database, Layout, Sparkles, Box } from "lucide-react";
import RadialOrbitalTimeline, { TimelineItem } from "@/components/ui/radial-orbital-timeline";

const timelineData: TimelineItem[] = [
  {
    id: 1,
    title: "React Ecosystem",
    date: "Current Core",
    content: "Deep expertise in React, Next.js, and modern React patterns. Building scalable frontend architectures.",
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
    content: "Building beautiful interfaces with Tailwind CSS, Shadcn UI, and custom CSS.",
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
    content: "Managing complex state with Zustand, React Query, and GraphQL.",
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
    content: "Crafting fluid experiences with Framer Motion, GSAP, and Three.js.",
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
    content: "Node.js, Express, Postgres. Building robust APIs for frontend consumption.",
    category: "Backend",
    icon: Box,
    relatedIds: [3],
    status: "pending",
    energy: 60,
  },
];

export function Stack() {
  const reduced = useReducedMotion();

  // Create different entrance directions for each card
  const getDirection = (index: number) => {
    if (reduced) return { x: 0, y: 0 };
    if (index === 0) return { x: -40, y: 0 }; // from left
    if (index === 1) return { x: 0, y: 40 };  // from bottom
    if (index === 2) return { x: 40, y: 0 };  // from right
    return { x: 0, y: 40 }; // fallback
  };

  return (
    <section id="stack" className="section-pad px-6 sm:px-10 perspective-deep relative z-10 bg-[var(--world-a-bg)]">
      <div className="mx-auto max-w-7xl preserve-3d">
        
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-8 items-center">
          {/* Left Column: Existing Stack Groups */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center">
            <span className="eyebrow">Stack</span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="section-title mt-4 text-[var(--world-a-text)]"
            >
              How I think, grouped.
            </motion.h2>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 preserve-3d">
              {stackGroups.map((group, i) => {
                const dir = getDirection(i);
                return (
                  <motion.div
                    key={group.label}
                    initial={{ opacity: 0, x: dir.x, y: dir.y, rotateX: 0, rotateY: 0 }}
                    whileInView={{ opacity: 1, x: 0, y: 0 }}
                    whileHover={!reduced ? { y: -8, rotateX: 2, scale: 1.02 } : {}}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                    className="glass-card rounded-2xl p-6 border border-[var(--world-a-border)] bg-[var(--world-a-surface)]/30 backdrop-blur-md"
                  >
                    <span className="h-px w-8 bg-[var(--world-a-accent)] block" />
                    <h3 className="mt-6 text-sm font-bold uppercase tracking-widest text-[var(--world-a-text)]">
                      {group.label}
                    </h3>
                    <ul className="mt-4 space-y-2">
                      {group.items.map((item) => (
                        <li key={item} className="text-[var(--world-a-muted)] font-medium text-sm">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Orbital Timeline */}
          <div className="w-full lg:w-1/2 h-[600px] sm:h-[700px] flex items-center justify-center relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, delay: 0.2 }}
              className="w-full h-full"
            >
              <RadialOrbitalTimeline timelineData={timelineData} />
            </motion.div>
          </div>
        </div>
        
      </div>
    </section>
  );
}
