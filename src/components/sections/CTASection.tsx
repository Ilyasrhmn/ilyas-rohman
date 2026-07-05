"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { Mail, Layers } from "lucide-react";
import { InfiniteRibbon } from "@/components/ui/infinite-ribbon";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export default function CTASection() {
    const sectionRef = useRef<HTMLElement>(null);
    const words = ["Amazing", "Innovative", "Intelligent", "Creative"];
    const [currentWord, setCurrentWord] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentWord((prev) => (prev + 1) % words.length);
        }, 2500);
        return () => clearInterval(interval);
    }, [words.length]);

    useEffect(() => {
        if (!sectionRef.current) return;

        const ctx = gsap.context(() => {
            gsap.fromTo('.cta-content',
                { y: 80, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 70%',
                    },
                }
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="relative py-12 lg:py-16 overflow-hidden bg-[var(--world-a-bg)]">
            <div className="relative flex h-[300px] w-full items-center justify-center overflow-hidden pointer-events-none mb-10">
                <InfiniteRibbon 
                    rotation={6} 
                    bgClass="bg-[var(--world-a-surface)] z-10 py-5 border-y border-[var(--world-a-border)] shadow-xl absolute top-1/2 left-0 -translate-y-[120%]" 
                    textClass="text-[var(--world-a-muted)] font-mono tracking-tighter"
                    text="// SCALABLE ARCHITECTURE // PREDICTIVE AI // DATA ENGINEERING // CLOUD NATIVE //"
                />
                <InfiniteRibbon 
                    rotation={-6} 
                    reverse={true} 
                    bgClass="bg-[var(--world-a-border)] z-20 py-5 border-y border-[var(--world-a-border)] shadow-2xl absolute top-1/2 left-0 translate-y-[20%]" 
                    textClass="text-[var(--world-a-accent)] font-bold tracking-widest uppercase"
                    text="AVAILABLE FOR OPPORTUNITIES • READY TO BUILD •"
                />
            </div>

            <div className="max-w-[1600px] mx-auto relative z-10 px-6 md:px-12 lg:px-24 text-center cta-content text-[var(--world-a-text)]">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-12">
                    Let's build something
                    <br />
                    <span className="inline-grid place-items-center text-[var(--world-a-accent)]">
                        {/* Invisible longest word ensures the container NEVER changes width/height */}
                        <span className="col-start-1 row-start-1 invisible pointer-events-none mx-2">
                            {words.reduce((a, b) => a.length > b.length ? a : b, "")}
                        </span>
                        <AnimatePresence>
                            <motion.span
                                key={words[currentWord]}
                                initial={{ y: 50, opacity: 0, rotateX: -90 }}
                                animate={{ y: 0, opacity: 1, rotateX: 0 }}
                                exit={{ y: -50, opacity: 0, rotateX: 90 }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                                className="col-start-1 row-start-1 inline-block mx-2"
                            >
                                {words[currentWord]}
                            </motion.span>
                        </AnimatePresence>
                    </span>
                    <span className="whitespace-nowrap">together.</span>
                </h2>

                <p className="text-xl text-[var(--world-a-muted)] max-w-2xl mx-auto mb-16">
                    Have an idea in mind? Let's turn it into reality with scalable architecture and intelligent systems.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link href="/contact" className="bg-[var(--world-a-accent)] text-[var(--world-a-bg)] rounded-full text-lg px-10 py-5 inline-flex items-center gap-3 font-semibold shadow-xl hover:opacity-90 transition-opacity">
                            <Mail className="w-5 h-5" />
                            <span>Start a project</span>
                        </Link>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link href="/resume" className="border-2 border-[var(--world-a-accent)] text-[var(--world-a-accent)] rounded-full text-lg px-10 py-5 inline-flex items-center gap-3 font-semibold hover:bg-[var(--world-a-accent)]/10 transition-colors">
                            <Layers className="w-5 h-5" />
                            <span>View my work</span>
                        </Link>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
