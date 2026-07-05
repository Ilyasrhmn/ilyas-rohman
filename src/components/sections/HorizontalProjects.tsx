"use client";

import { motion, useTransform, useScroll, useSpring } from "framer-motion";
import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { useMediaQuery, BREAKPOINTS } from "@/hooks/use-media-query";
import { BlurReveal } from "@/components/effects/blur-reveal";

interface HorizontalProjectItem {
    id: string;
    title: string;
    category: string;
    year: string;
    image: string;
}

const projectList: HorizontalProjectItem[] = [
    {
        id: "aether-media",
        title: "Aether Media",
        category: "Media Tool",
        year: "2026",
        image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2000&auto=format&fit=crop", 
    },
    {
        id: "aether-js",
        title: "Aether JS",
        category: "Library",
        year: "2026",
        image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2000&auto=format&fit=crop", 
    },
    {
        id: "file-manager",
        title: "File Manager",
        category: "Web Application",
        year: "2025",
        image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2000&auto=format&fit=crop", 
    }
];

export default function HorizontalProjects() {
    const isDesktop = useMediaQuery(BREAKPOINTS.xl);

    const targetRef = useRef<HTMLDivElement>(null);
    const horizontalContainerRef = useRef<HTMLDivElement>(null);

    const [measurements, setMeasurements] = useState({ scrollRange: 0, dynamicHeight: "auto" });

    useEffect(() => {
        if (!isDesktop) {
            const frame = requestAnimationFrame(() => {
                setMeasurements({ scrollRange: 0, dynamicHeight: "auto" });
            });
            return () => cancelAnimationFrame(frame);
        }

        const updateMeasurements = () => {
            if (horizontalContainerRef.current) {
                const totalWidth = horizontalContainerRef.current.scrollWidth;
                const viewportW = window.innerWidth;
                const range = totalWidth - viewportW;
                const safeRange = range > 0 ? range : 0;

                setMeasurements({
                    scrollRange: safeRange,
                    dynamicHeight: `${safeRange + window.innerHeight}px`,
                });
            }
        };

        updateMeasurements();

        const timeout = setTimeout(updateMeasurements, 100);
        const resizeObserver = new ResizeObserver(() => {
            requestAnimationFrame(updateMeasurements);
        });

        if (horizontalContainerRef.current) {
            resizeObserver.observe(horizontalContainerRef.current);
        }

        return () => {
            clearTimeout(timeout);
            resizeObserver.disconnect();
        };
    }, [isDesktop]);

    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start start", "end end"],
    });

    const x = useTransform(scrollYProgress, [0, 1], [0, -measurements.scrollRange]);
    const smoothX = useSpring(x, { stiffness: 400, damping: 60, restDelta: 0.5 });

    return (
        <section
            ref={targetRef}
            data-slot="projects"
            className="relative py-16 md:py-24 lg:py-32 xl:py-0"
            style={{ height: measurements.dynamicHeight }}
        >
            <div
                className={`
                    w-full 
                    ${isDesktop
                        ? "sticky top-0 h-screen flex items-center overflow-hidden"
                        : "relative flex flex-col"
                    }
                `}
            >

                {!isDesktop ? (
                    <>
                        <div className="flex flex-col gap-4 px-6 md:px-12 lg:px-24 mb-10">
                            <BlurReveal>
                                <span className="text-sm font-mono tracking-[0.2em] text-[var(--world-b-accent)]">
                                    [003]
                                </span>
                            </BlurReveal>

                            <BlurReveal>
                                <h2 className="text-3xl md:text-5xl font-black uppercase text-[var(--world-b-text)] tracking-tighter">
                                    Projects
                                </h2>
                            </BlurReveal>

                            <BlurReveal>
                                <p className="mt-4 text-[var(--world-b-muted)] text-lg font-light leading-relaxed">
                                    A collection of experiments, products, and digital artifacts forged in the void.
                                </p>
                            </BlurReveal>
                        </div>
                        <div className="flex flex-col w-full max-w-full px-6 md:px-12 lg:px-24 gap-12">
                            {projectList.map((project) => (
                                <ProjectCard
                                    key={project.id}
                                    project={project}
                                />
                            ))}
                        </div>
                    </>
                ) : (
                    <motion.div
                        ref={horizontalContainerRef}
                        style={{ x: smoothX }}
                        className="flex px-24 w-max items-center"
                    >
                        <div className="w-[60vw] xl:w-[40vw] shrink-0 flex flex-col justify-center">

                            <div className="flex flex-col gap-4 pr-12">

                                <BlurReveal>
                                    <span className="text-sm font-mono tracking-[0.2em] text-[var(--world-b-accent)] uppercase">
                                        [003]
                                    </span>
                                </BlurReveal>

                                <BlurReveal>
                                    <h2 className="text-6xl lg:text-[7rem] font-black uppercase text-[var(--world-b-text)] tracking-tighter leading-[0.85]">
                                        Projects
                                    </h2>
                                </BlurReveal>

                                <BlurReveal>
                                    <p className="mt-8 text-2xl lg:text-4xl font-light leading-tight text-[var(--world-b-text)] max-w-2xl">
                                        A collection of experiments, products, and digital artifacts forged in the void.
                                    </p>
                                </BlurReveal>

                                <BlurReveal>
                                    <div className="mt-12 flex items-center gap-4">
                                        <div className="h-px w-24 bg-[var(--world-b-border)]" />
                                        <span className="text-sm font-mono text-[var(--world-b-muted)] uppercase tracking-widest">
                                            Scroll to explore
                                        </span>
                                    </div>
                                </BlurReveal>

                            </div>

                        </div>

                        {projectList.map((project) => (
                            <ProjectCard
                                key={project.id}
                                project={project}
                            />
                        ))}

                        <div className="w-[40vw] h-[70vh] shrink-0 flex flex-col justify-center items-center">
                            <h3 className="text-[10vw] font-black tracking-tighter text-[var(--world-b-border)] uppercase">
                                End
                            </h3>
                        </div>
                    </motion.div>
                )}
            </div>
        </section>
    );
}

const ProjectCard = React.memo(function ProjectCard({ project }: { project: HorizontalProjectItem }) {
    return (
        <BlurReveal>
            <div
                className="group relative w-full xl:w-[45vw] aspect-[4/3] shrink-0 xl:mx-6 cursor-pointer"
            >
                <div className="relative w-full h-full overflow-hidden bg-muted border border-[var(--world-b-border)] transition-all duration-700 ease-out group-hover:border-[var(--world-b-text)] rounded-xl">
                    <div className="absolute inset-0 z-0">
                        <Image
                            src={project.image}
                            alt={project.title}
                            fill
                            sizes="(max-width: 1280px) 100vw, 45vw"
                            loading="lazy"
                            className="object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000 grayscale group-hover:grayscale-0"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    </div>

                    <div className="absolute inset-0 z-10 flex flex-col justify-between p-6 xl:p-12">
                        <div className="flex justify-between items-start">
                            <div className="overflow-hidden">
                                <span className="block text-xs xl:text-sm font-mono tracking-widest text-white/70 uppercase transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 delay-100">
                                    {project.category}
                                </span>
                            </div>
                            <div className="overflow-hidden">
                                <span className="block text-xs xl:text-sm font-mono text-white/70 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 delay-200">
                                    {project.year}
                                </span>
                            </div>
                        </div>

                        <h3 className="absolute bottom-6 md:bottom-8 2xl:bottom-12 left-6 md:left-8 2xl:left-12 text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tighter uppercase text-white opacity-40 group-hover:opacity-100 transition-opacity duration-500 delay-100 pointer-events-none">
                            {project.title}
                        </h3>
                    </div>

                </div>
            </div>
        </BlurReveal>
    );
});
