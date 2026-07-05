"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import { BlurReveal } from "@/components/effects/blur-reveal";
import TextCursor from "@/components/ui/text-cursor";

type RoadmapItem = {
    id: string;
    year: string;
    description: string;
    stack: string[];
};

const roadmapData: RoadmapItem[] = [
    {
        id: "01",
        year: "2022",
        description: "I first got introduced to software development in high school. I learned the fundamentals and logic of programming using C# in an object-oriented programming class.",
        stack: ["C#"],
    },
    {
        id: "02",
        year: "2023",
        description: "I started developing static and dynamic websites by learning HTML, CSS, and ASP.NET. During this period, I also learned how to use databases in my projects.",
        stack: ["HTML", "CSS", "ASP.NET", "MySQL"],
    },
    {
        id: "03",
        year: "2024",
        description: "It was my last year of high school. I significantly improved my UI development skills with CSS and continued working with ASP.NET at my internship.",
        stack: ["HTML", "CSS", "ASP.NET", "MySQL"],
    },
    {
        id: "04",
        year: "2025",
        description: "After high school, I turned to modern technologies like React, Node.js, Tailwind CSS, and MongoDB. During this period, I developed many websites and applications. Additionally, I started writing various tools in Python for my personal use.",
        stack: ["React", "Node.js", "TailwindCSS", "MongoDB"],
    },
    {
        id: "05",
        year: "2026",
        description: "I started working as an intern at PostAjans, where I focused mainly on Laravel. In addition, I develop web projects using Next.js in my free time and build various personal projects utilizing technologies like Tauri and FFmpeg.",
        stack: ["Laravel", "Next.js", "PostgreSQL"],
    },
];

export default function Roadmap() {
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start center", "end center"]
    });

    const scaleY = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    const yBackground = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

    return (
        <section ref={containerRef} className="relative overflow-hidden py-32 xl:py-48 bg-[var(--world-b-bg)] border-t border-[var(--world-b-border)]">
            {/* Interactive Text Cursor Background */}
            <div className="absolute inset-0 z-0">
                <TextCursor 
                    text="ILYAS NUR ROHMAN " 
                    spacing={60} 
                    followMouseDirection={true} 
                    randomFloat={true} 
                    exitDuration={1} 
                    removalInterval={30} 
                    maxPoints={20} 
                />
            </div>

            {/* Background Glows */}
            <div className="absolute top-1/4 left-0 w-full max-w-lg h-[500px] bg-[var(--world-b-accent)]/10 blur-[120px] rounded-full pointer-events-none -translate-x-1/2" />
            <div className="absolute bottom-1/4 right-0 w-full max-w-lg h-[500px] bg-[var(--world-b-accent)]/10 blur-[120px] rounded-full pointer-events-none translate-x-1/2 z-0" />

            {/* Background Parallax Text */}
            <motion.div
                style={{ y: yBackground }}
                className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none flex items-center justify-center opacity-5 z-0 overflow-hidden"
            >
                <div className="text-[20vw] font-black tracking-tighter uppercase whitespace-nowrap text-[var(--world-b-text)]">
                    ROADMAP
                </div>
            </motion.div>

            <div className="container mx-auto px-6 max-w-6xl relative z-10">

                {/* Section Header */}
                <div className="flex flex-col md:items-center mb-24 md:mb-40 gap-4 text-center">
                    <BlurReveal>
                        <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--world-b-accent)]">
                            [004]
                        </span>
                    </BlurReveal>

                    <BlurReveal>
                        <h2 className="text-5xl md:text-7xl font-bold font-serif text-[var(--world-b-text)]">
                            Roadmap
                        </h2>
                    </BlurReveal>

                    <BlurReveal>
                        <p className="text-lg md:text-xl mt-3 max-w-2xl font-serif text-[var(--world-b-muted)]">
                            A roadmap where I share the experiences I've gained throughout my software journey and the technologies I've learned.
                        </p>
                    </BlurReveal>
                </div>

                {/* Timeline */}
                <div className="relative">
                    {/* Background Line */}
                    <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-[var(--world-b-border)] -translate-x-1/2" />

                    {/* Animated Glow Line */}
                    <motion.div
                        style={{ scaleY, originY: 0 }}
                        className="absolute left-6 md:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[var(--world-b-accent)] via-[var(--world-b-accent)] to-transparent shadow-[0_0_15px_rgba(143,175,143,0.8)] -translate-x-1/2 z-10"
                    />

                    <div className="flex flex-col w-full gap-8 md:gap-24 relative z-20">
                        {roadmapData.map((item, index) => (
                            <TimelineNode
                                key={item.id}
                                item={item}
                                isEven={index % 2 === 0}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

const TimelineNode = ({ item, isEven }: { item: RoadmapItem, isEven: boolean }) => {
    return (
        <div className={cn("relative flex items-center justify-between w-full", isEven ? "flex-row" : "flex-row-reverse")}>
            
            {/* Empty Spacer */}
            <div className="w-[calc(50%-3rem)] hidden md:block" />

            {/* Center Dot */}
            <div className="absolute left-6 md:left-1/2 -translate-x-1/2 w-8 h-8 md:w-10 md:h-10 rounded-full border border-[var(--world-b-border)] bg-[var(--world-b-surface)] z-20 flex items-center justify-center shadow-lg group-hover:border-[var(--world-b-accent)]/50 transition-colors duration-500">
                <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-[var(--world-b-accent)] shadow-[0_0_10px_rgba(143,175,143,0.8)]" />
            </div>

            {/* Content Card */}
            <div
                className={cn(
                    "w-full md:w-[calc(50%-3rem)] pl-16 md:pl-0 relative group",
                )}
            >
                <BlurReveal>
                    <div className={cn(
                        "relative p-8 md:p-10 border border-[var(--world-b-border)] bg-[var(--world-b-surface)]/50 backdrop-blur-md overflow-hidden transition-all duration-700 ease-out",
                        "hover:bg-[var(--world-b-surface)] hover:border-[var(--world-b-accent)]/40 hover:shadow-2xl",
                        isEven ? "md:text-right" : "md:text-left"
                    )}>

                        {/* ID Number */}
                        <span className={cn(
                            "max-sm:hidden text-xs font-mono tracking-widest text-[var(--world-b-accent)] flex mb-4",
                            isEven ? "md:justify-end" : "md:justify-start"
                        )}>
                            {item.id}
                        </span>

                        <div className="flex flex-col gap-3 relative z-10">
                            {/* Year Title */}
                            <h3 className="text-4xl md:text-5xl lg:text-6xl tracking-tighter font-serif font-semibold text-[var(--world-b-text)] mt-2 group-hover:text-[var(--world-b-accent)] transition-colors duration-500">
                                {item.year}
                            </h3>

                            {/* Description */}
                            <p className="text-[var(--world-b-muted)] text-sm md:text-base leading-relaxed mt-2 max-w-sm ml-0 md:max-w-md"
                                style={{ marginLeft: isEven ? 'auto' : '0' }}>
                                {item.description}
                            </p>

                            {/* Stack Badges */}
                            <div className={cn("flex flex-wrap gap-2 mt-6", isEven ? "md:justify-end" : "justify-start")}>
                                {item.stack.map((tag: string) => (
                                    <span
                                        key={tag}
                                        className="text-[0.65rem] uppercase tracking-widest text-[var(--world-b-text)] font-mono px-3 py-1.5 rounded border border-[var(--world-b-border)] bg-[var(--world-b-bg)] shadow-sm group-hover:border-[var(--world-b-accent)]/30 transition-colors"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Background Watermark Year */}
                        <div className={cn(
                            "absolute top-1/2 -translate-y-1/2 text-[8rem] font-serif font-bold text-[var(--world-b-border)]/30 select-none pointer-events-none transition-all duration-700",
                            isEven ? "-left-12" : "-right-12 text-right"
                        )}>
                            {item.year.slice(2)}
                        </div>

                    </div>
                </BlurReveal>
            </div>
        </div>
    )
}
