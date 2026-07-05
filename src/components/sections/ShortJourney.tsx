"use client";

import { motion } from "framer-motion";

const milestones = [
  {
    title: "AI Researcher",
    subtitle: "Cyber Physical System Laboratory",
    description: "Developing complex technical solutions, architecting IoT systems, and engineering advanced ML models.",
  },
  {
    title: "Building with Others",
    subtitle: "Scalable Platforms & Teams",
    description: "Collaborating on scalable educational platforms (SNBTIn) and full-stack solutions with real impact.",
  },
  {
    title: "Now Exploring",
    subtitle: "AI Agents & Interactive Web",
    description: "Current focus on multi-agent orchestrations, local LLMs, and crafting better interactive web experiences.",
  }
];

export default function ShortJourney() {
  return (
    <section className="relative min-h-[120vh] w-full flex flex-col justify-center py-24 md:py-32 px-6 md:px-12 lg:px-24 bg-[var(--world-b-bg)] text-[var(--world-b-text)] z-10">
      <div className="max-w-4xl mx-auto w-full flex flex-col gap-16 md:gap-24 relative">
        {/* Connecting Line */}
        <div className="absolute left-[11px] md:left-[39px] top-12 bottom-12 w-px bg-[var(--world-b-border)]" />
        
        {/* Journey Header */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          className="relative z-10 bg-[var(--world-b-bg)] inline-block w-max pr-8"
        >
          <h2 className="text-sm font-mono tracking-[0.2em] uppercase text-[var(--world-b-accent)]">
            Journey / Growth
          </h2>
        </motion.div>

        {/* Milestones */}
        <div className="flex flex-col gap-24 md:gap-32 pl-12 md:pl-32">
          {milestones.map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ margin: "-20%" }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              {/* Node */}
              <div className="absolute -left-[41px] md:-left-[93px] top-2.5 md:top-4 w-2.5 h-2.5 rounded-full bg-[var(--world-b-accent)] ring-4 ring-[var(--world-b-bg)]" />
              
              <h3 className="text-3xl md:text-5xl font-serif font-bold tracking-tight mb-2 md:mb-4">
                {item.title}
              </h3>
              <span className="inline-block text-xs md:text-sm font-mono tracking-widest uppercase text-[var(--world-b-muted)] mb-4 md:mb-6">
                {item.subtitle}
              </span>
              <p className="text-lg md:text-xl text-[var(--world-b-text)] font-light leading-relaxed max-w-2xl">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
