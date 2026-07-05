"use client";

import { useRef } from "react";
import { SectionColor } from "@/components/motion/section-color";
import { ScrollReveal } from "@/components/motion/scroll-reveal";

export function About() {
  return (
    <SectionColor color="#16232B">
      <section id="about" className="relative h-[200vh]">
        <div className="sticky top-0 h-screen w-full flex items-center justify-center px-6 sm:px-10 overflow-hidden">
          <div className="mx-auto w-full max-w-6xl grid lg:grid-cols-12 gap-12 lg:gap-8 relative">
            
            {/* Pinned left column */}
            <div className="lg:col-span-5 h-full flex flex-col justify-center">
              <span className="eyebrow">About</span>
              <h2 className="section-title mt-6 text-foreground max-w-md">
                I build interactive web experiences — and stay comfortable enough on the backend to ship a feature end to end.
              </h2>
            </div>

            {/* Scrolling right column content */}
            <div className="lg:col-span-7 h-full flex flex-col justify-center">
              <ScrollReveal className="text-xl md:text-3xl font-serif italic leading-relaxed text-foreground/85">
                Based in Yogyakarta. I work as a teaching assistant, mentoring students through frontend and web coursework — which keeps me sharp at the fundamentals. Most of what I have built comes from hackathons and campus projects, and right now a real-world marketplace connecting village producers to buyers.
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>
    </SectionColor>
  );
}
