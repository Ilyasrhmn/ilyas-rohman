"use client";

import { GraduationCap, Users, Hammer, BookOpen } from "lucide-react";
import { journey } from "@/data/journey";
import type { JourneyKind } from "@/types";
import { StickyScroll, type StickyItem } from "@/components/motion/sticky-scroll";

const ICON: Record<JourneyKind, typeof GraduationCap> = {
  education: GraduationCap,
  teaching: Users,
  building: Hammer,
  learning: BookOpen,
};

const TINT: Record<JourneyKind, string> = {
  education: "from-emerald-900/60",
  teaching: "from-sky-900/60",
  building: "from-amber-900/60",
  learning: "from-violet-900/60",
};

export function Journey() {
  const items: StickyItem[] = journey.map((j) => {
    const Icon = ICON[j.kind];
    return {
      eyebrow: `${j.year}${j.org ? ` · ${j.org}` : ""}`,
      title: j.title,
      body: j.detail,
      visual: (
        <div className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${TINT[j.kind]} to-black/70`}>
          <Icon className="h-24 w-24 text-foreground/80" strokeWidth={1} />
        </div>
      ),
    };
  });

  return (
    <section id="journey" className="section-pad px-6 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <span className="eyebrow">Journey</span>
        <h2 className="section-title mt-4 mb-10 text-foreground">Growth, in order.</h2>
      </div>
      <StickyScroll items={items} />
    </section>
  );
}
