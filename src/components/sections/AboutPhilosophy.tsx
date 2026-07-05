"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { portfolioData } from "@/data/portfolio";

export default function AboutPhilosophy() {
    const containerRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    const y1 = useTransform(smoothProgress, [0, 1], ["10vh", "-10vh"]);
    const y2 = useTransform(smoothProgress, [0, 1], ["20vh", "-20vh"]);
    const opacity = useTransform(smoothProgress, [0.1, 0.3, 0.7, 0.9], [0, 1, 1, 0]);

    return (
        <section 
            ref={containerRef} 
            className="relative w-full py-32 md:py-48 px-6 md:px-12 lg:px-24 overflow-hidden"
        >
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start justify-between gap-16 md:gap-8">
                
                <motion.div 
                    className="w-full md:w-1/3 flex flex-col gap-6"
                    style={{ y: y1, opacity }}
                >
                    <h2 className="text-sm font-mono tracking-[0.2em] uppercase text-[var(--world-accent)]">
                        [02] Philosophy
                    </h2>
                    <h3 className="text-4xl md:text-5xl font-black tracking-tighter text-[var(--world-text)] uppercase leading-[0.9]">
                        Design. <br />
                        Motion. <br />
                        Engineering.
                    </h3>
                </motion.div>

                <motion.div 
                    className="w-full md:w-1/2 flex flex-col gap-8 md:mt-24"
                    style={{ y: y2, opacity }}
                >
                    <p className="text-xl md:text-2xl text-[var(--world-muted)] font-medium leading-relaxed">
                        I believe the web should be felt, not just read. A great interface is invisible until it needs to be seen, guiding the user intuitively through motion, layout, and rhythm.
                    </p>
                    <p className="text-lg md:text-xl text-[var(--world-text)] font-light leading-relaxed">
                        My approach bridges the gap between deep technical engineering and emotional visual design. By treating animations not as decoration but as spatial language, I build environments that feel physically real. 
                        Every pixel, transition, and line of code serves a singular purpose: keeping the user engaged in a seamless narrative.
                    </p>

                    <div className="pt-8 border-t border-[var(--world-border)] flex items-center gap-4">
                        <div className="h-px w-12 bg-[var(--world-accent)]" />
                        <span className="text-xs font-mono uppercase tracking-widest text-[var(--world-accent)]">
                            {portfolioData.personal.title}
                        </span>
                    </div>
                </motion.div>

            </div>
        </section>
    );
}
