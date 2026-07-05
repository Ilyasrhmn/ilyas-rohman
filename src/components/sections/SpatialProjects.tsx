"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Image from "next/image";
import { portfolioData } from "@/data/portfolio";
import type { ProjectItem } from "@/types/project";
import { useMediaQuery, BREAKPOINTS } from "@/hooks/use-media-query";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function SpatialProjects() {
    const isDesktop = useMediaQuery(BREAKPOINTS.lg);
    
    // Map portfolioData.projects
    const projects: ProjectItem[] = portfolioData.projects.map((p: any) => ({
        id: p.id,
        title: p.title,
        category: p.category,
        year: p.customTimeline || p.startDate || "2024",
        description: p.description,
        image: p.image || p.thumbnail || "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2000&auto=format&fit=crop",
        demo: p.demoUrl,
        repo: p.repoUrl,
        stack: p.techStack
    })).slice(0, 4); // Take top 4

    return (
        <section className="relative w-full pb-32">
            <div className="px-6 md:px-12 lg:px-24 mb-16 md:mb-32">
                <h2 className="text-sm font-mono tracking-[0.2em] uppercase text-[var(--world-accent)]">
                    [01] Selected Works
                </h2>
            </div>
            
            <div className="flex flex-col relative">
                {projects.map((project, index) => (
                    <SpatialProjectCard 
                        key={project.id} 
                        project={project} 
                        index={index} 
                        total={projects.length}
                        isDesktop={isDesktop}
                    />
                ))}
            </div>
        </section>
    );
}

function SpatialProjectCard({ project, index, total, isDesktop }: { project: ProjectItem, index: number, total: number, isDesktop: boolean }) {
    const containerRef = useRef<HTMLDivElement>(null);
    
    // Scroll progress for this specific project
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    // Parallax values
    const imageScale = useTransform(smoothProgress, [0, 1], [1, 1.15]);
    const imageY = useTransform(smoothProgress, [0, 1], ["-10%", "10%"]);
    
    // Text enters from bottom, stays, then leaves up
    const textY = useTransform(smoothProgress, [0.2, 0.5, 0.8], ["30%", "0%", "-30%"]);
    
    // Metadata fade in
    const opacity = useTransform(smoothProgress, [0.2, 0.4, 0.6, 0.8], [0, 1, 1, 0]);

    if (!isDesktop) {
        return (
            <div className="w-full px-6 mb-24 relative">
                <div className="w-full aspect-[4/3] relative rounded-lg overflow-hidden mb-6 border border-[var(--world-border)]">
                    <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <div className="flex justify-between text-xs font-mono text-[var(--world-muted)] uppercase">
                        <span>{project.category}</span>
                        <span>{project.year}</span>
                    </div>
                    <h3 className="text-3xl font-black text-[var(--world-text)] uppercase tracking-tighter">
                        {project.title}
                    </h3>
                    <p className="text-sm text-[var(--world-muted)] mt-2">
                        {project.description}
                    </p>
                </div>
            </div>
        );
    }

    // Desktop Spatial Sequence
    // Instead of a card grid, each project occupies a massive viewport area.
    // They overlap visually using negative margins.
    const isLast = index === total - 1;
    
    return (
        <div 
            ref={containerRef} 
            className={`relative w-full min-h-[120vh] flex items-center justify-center ${!isLast ? '-mb-[40vh]' : ''}`}
            style={{ zIndex: index }}
        >
            <div className="w-full max-w-[85vw] mx-auto flex items-center justify-between relative">
                
                {/* Image Block */}
                <motion.div 
                    className="w-[55%] aspect-[16/10] relative overflow-hidden rounded-xl border border-[var(--world-border)] shadow-2xl"
                    style={{ y: imageY }}
                >
                    <motion.div 
                        className="absolute inset-0 w-full h-full"
                        style={{ scale: imageScale }}
                    >
                        <Image
                            src={project.image}
                            alt={project.title}
                            fill
                            className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                        />
                    </motion.div>
                </motion.div>

                {/* Typography Block */}
                <motion.div 
                    className="w-[40%] flex flex-col justify-center"
                    style={{ y: textY, opacity }}
                >
                    <div className="flex items-center gap-4 mb-4 text-sm font-mono tracking-widest text-[var(--world-muted)] uppercase">
                        <span>0{index + 1}</span>
                        <div className="h-px w-8 bg-[var(--world-border)]" />
                        <span>{project.year}</span>
                    </div>
                    
                    <h3 className="text-5xl lg:text-7xl font-black tracking-tighter text-[var(--world-text)] uppercase mb-6 leading-[0.9]">
                        {project.title}
                    </h3>
                    
                    <p className="text-lg text-[var(--world-muted)] mb-10 leading-relaxed max-w-md">
                        {project.description}
                    </p>

                    <div className="flex items-center gap-6">
                        <Link href="/projects" className="group flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-[var(--world-accent)]">
                            <span>View Project</span>
                            <span className="p-2 rounded-full border border-[var(--world-border)] group-hover:bg-[var(--world-accent)] group-hover:text-[var(--world-bg)] transition-colors duration-300">
                                <ArrowUpRight className="w-4 h-4" />
                            </span>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
