"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import { BlurReveal } from "@/components/effects/blur-reveal";
import TextCursor from "@/components/ui/text-cursor";

type RoadmapItem = {
    id: string;
    year: string;
    title: string;
    description: string;
    stack: string[];
};

const roadmapData: RoadmapItem[] = [
    {
        id: "01",
        year: "2023",
        title: "First Steps into Web Development",
        description: "I was first introduced to web development during high school, where I learned the fundamentals of HTML and basic CSS, gaining an understanding of how web pages are structured, styled, and rendered in the browser.",
        stack: ["HTML", "CSS"],
    },
    {
        id: "02",
        year: "2024",
        title: "Building the Foundation",
        description: "Started my journey as an Information Systems student by strengthening programming fundamentals through algorithms, object-oriented programming, databases, and hands-on academic projects. Every programming course concluded with a final project and presentation, allowing me to transform theoretical concepts into practical applications.",
        stack: ["C++", "Kotlin", "MySQL", "HTML", "CSS", "Bootstrap", "Figma"],
    },
    {
        id: "03",
        year: "2025",
        title: "Expanding My Development Skills",
        description: "Strengthened my software engineering fundamentals by building full-stack academic projects with PHP Native, MySQL, and Android Studio while exploring JavaScript and Laravel. Outside the classroom, I joined the IDCamp Scholarship Program to broaden my knowledge of modern web development beyond the university curriculum.",
        stack: ["PHP", "JavaScript", "Laravel", "Kotlin", "MySQL"],
    },
    {
        id: "04",
        year: "2026",
        title: "Beyond the Classroom",
        description: "Expanded my experience beyond the classroom through hackathons, teaching, and industry learning programs. Started building modern web applications with React and Next.js while exploring Progressive Web Apps (PWA), AI-assisted development, and modern software engineering practices. Also served as a Laboratory Teaching Assistant, mentoring students during web development practical sessions while strengthening my technical and communication skills.",
        stack: ["Teaching Assistant", "Hackathons", "React", "Next.js", "TypeScript", "PostgreSQL", "PWA"],
    },
    {
        id: "05",
        year: "Present",
        title: "The Journey Continues",
        description: "Currently participating in ASAH 2026 by Dicoding while continuously building personal projects, exploring interactive web experiences, and expanding my knowledge through workshops, competitions, and self-directed learning.",
        stack: ["ASAH 2026", "GSAP", "Framer Motion", "Lenis", "Three.js"],
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
                            A roadmap where I share the experiences I&apos;ve gained throughout my software journey and the technologies I&apos;ve learned.
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

                            {/* Entry Title */}
                            <p className="text-lg md:text-xl font-serif font-medium text-[var(--world-b-text)]">
                                {item.title}
                            </p>

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
                            "absolute top-1/2 -translate-y-1/2 font-serif font-bold text-[var(--world-b-border)]/30 select-none pointer-events-none transition-all duration-700",
                            /^\d{4}$/.test(item.year) ? "text-[8rem]" : "text-[3.5rem] uppercase tracking-tight",
                            isEven ? "-left-12" : "-right-12 text-right"
                        )}>
                            {/^\d{4}$/.test(item.year) ? item.year.slice(2) : item.year}
                        </div>

                    </div>
                </BlurReveal>
            </div>
        </div>
    )
}
