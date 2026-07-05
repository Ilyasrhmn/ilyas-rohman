"use client";

import { SectionColor } from "@/components/motion/section-color";
import { ScrollReveal } from "@/components/motion/scroll-reveal";

export function About() {
  return (
    <SectionColor color="#16232B">
      <section id="about" className="section-pad px-6 sm:px-10">
        <div className="mx-auto max-w-4xl">
          <span className="eyebrow">About</span>
          <ScrollReveal className="section-title mt-6 text-foreground">
            I build interactive web experiences — and stay comfortable enough on the backend to ship a feature end to end.
          </ScrollReveal>
          <ScrollReveal className="mt-10 text-xl leading-relaxed text-foreground/85">
            Based in Yogyakarta. I work as a teaching assistant, mentoring students through frontend and web coursework — which keeps me sharp at the fundamentals. Most of what I have built comes from hackathons and campus projects, and right now a real-world marketplace connecting village producers to buyers.
          </ScrollReveal>
        </div>
      </section>
    </SectionColor>
  );
}
