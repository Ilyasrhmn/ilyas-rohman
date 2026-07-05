"use client";

import { motion } from "framer-motion";
import { GraduationCap, Users, Hammer, BookOpen } from "lucide-react";
import { journey } from "@/data/journey";
import type { JourneyKind } from "@/types";

const KIND_ICON: Record<JourneyKind, typeof GraduationCap> = {
  education: GraduationCap,
  teaching: Users,
  building: Hammer,
  learning: BookOpen,
};

export function Journey() {
  return (
    <section id="journey" className="section-pad px-6 sm:px-10">
      <div className="mx-auto max-w-3xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="font-serif text-3xl text-foreground sm:text-4xl"
        >
          Journey
        </motion.h2>

        <div className="relative mt-12 space-y-10 border-l border-border pl-8">
          {journey.map((item, i) => {
            const Icon = KIND_ICON[item.kind];
            return (
              <motion.div
                key={`${item.year}-${item.title}`}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="relative"
              >
                <span className="absolute -left-[2.6rem] flex h-8 w-8 items-center justify-center rounded-full border border-accent bg-background text-accent">
                  <Icon size={16} />
                </span>
                <span className="text-xs uppercase tracking-wide text-muted-foreground">
                  {item.year}
                  {item.org ? ` · ${item.org}` : ""}
                </span>
                <h3 className="mt-1 font-serif text-xl text-foreground">{item.title}</h3>
                <p className="mt-1 text-muted-foreground">{item.detail}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
