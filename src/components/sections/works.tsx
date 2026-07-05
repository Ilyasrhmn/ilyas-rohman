"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { getFeaturedProjects } from "@/data/projects";
import { ProjectCard } from "@/components/projects/project-card";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export function Works() {
  const containerRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const featured = getFeaturedProjects();

  // The container will be e.g. 500vh tall to allow for horizontal scrolling
  // We track the scroll progress of this section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Shift the gallery horizontally.
  // 100% - total width so it stops at the end. We estimate width by vh to vw mapping.
  // We have N projects. Let's say we shift -((N-1) * 85vw + padding).
  // Actually, standard trick is to map to a percentage of the flex container that exceeds 100vw.
  const xShift = useTransform(smoothProgress, [0, 1], ["0%", "-100%"]);

  if (reduced) {
    return (
      <section id="works" className="section-pad px-6 sm:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-end justify-between gap-4">
            <div>
              <span className="eyebrow">Selected Works</span>
              <h2 className="section-title mt-4 text-foreground">Things I&apos;ve built.</h2>
            </div>
            <Link href="/projects" className="shrink-0 text-sm text-foreground/60 transition-colors hover:text-foreground">
              See all &rarr;
            </Link>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {featured.map((p) => (
              <div key={p.slug} className="h-[50vh]">
                <ProjectCard project={p} />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Horizontal scroll for desktop/normal viewing
  return (
    <section ref={containerRef} id="works" className="relative h-[600vh] bg-background">
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center">
        
        {/* Pinned Header Info */}
        <div className="absolute top-12 left-6 sm:left-10 z-20 pointer-events-none mix-blend-difference">
          <span className="eyebrow text-white/70">Selected Works</span>
          <h2 className="section-title mt-2 text-white">Things I&apos;ve built.</h2>
        </div>
        
        <div className="absolute top-12 right-6 sm:right-10 z-20 mix-blend-difference">
          <Link href="/projects" className="text-sm font-medium uppercase tracking-widest text-white/70 hover:text-white transition-colors">
            See all &rarr;
          </Link>
        </div>

        {/* Scrolling Gallery Container */}
        <motion.div
          style={{ x: xShift }}
          className="flex items-center gap-6 px-6 sm:px-10 pr-[30vw] h-full"
        >
          {featured.map((p, i) => (
            <div
              key={p.slug}
              // The cards are large horizontal slabs
              className="relative h-[65vh] w-[85vw] md:h-[70vh] md:w-[65vw] lg:w-[45vw] shrink-0"
            >
              {/* Decorative Numbering */}
              <div className="absolute -top-10 left-0 text-7xl font-serif italic text-foreground/10 select-none z-0">
                0{i + 1}
              </div>
              <ProjectCard project={p} />
            </div>
          ))}
          
          {/* Spacer block at the end so the last card doesn't hug the right edge */}
          <div className="w-[10vw] shrink-0" />
        </motion.div>
      </div>
    </section>
  );
}
