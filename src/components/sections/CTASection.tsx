"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { GooeyText } from "@/components/ui/gooey-text-morphing";
import { useContact } from "@/components/layout/chrome-shell";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export default function CTASection() {
    const sectionRef = useRef<HTMLElement>(null);
    const openContact = useContact();

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
        <section ref={sectionRef} className="relative py-24 lg:py-32 overflow-hidden bg-[var(--world-a-bg)]">
            <div className="max-w-[1600px] mx-auto relative z-10 px-6 md:px-12 lg:px-24 text-center cta-content text-[var(--world-a-text)]">
                <div className="mb-8">
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-semibold tracking-tight leading-tight">
                        Got an idea? Let&apos;s build
                    </h2>
                    <div className="h-[64px] md:h-[80px] lg:h-[96px] w-full flex items-center justify-center">
                        <GooeyText
                            texts={["it.", "something real.", "an interface.", "a system."]}
                            morphTime={1.2}
                            cooldownTime={1.5}
                            textClassName="text-4xl md:text-5xl lg:text-6xl font-bold font-serif tracking-tighter text-[var(--world-a-accent)]"
                        />
                    </div>
                </div>

                <p className="text-lg text-[var(--world-a-muted)] max-w-xl mx-auto mb-14">
                    I build things end-to-end, interface down to database, and I&apos;d rather show you than pitch you.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                        type="button"
                        onClick={openContact}
                        className="inline-flex min-h-[44px] items-center justify-center gap-2 border border-[var(--world-a-accent)] px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] text-[var(--world-a-accent)] transition-opacity hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                    >
                        Start a project
                    </button>
                    <Link
                        href="/projects"
                        className="inline-flex min-h-[44px] items-center justify-center gap-2 border border-[var(--world-a-border)] px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] text-[var(--world-a-text)] transition-opacity hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                    >
                        View my work
                    </Link>
                </div>
            </div>
        </section>
    );
}
