"use client";
import React from "react";
import Image from "next/image";
import { StickyScroll } from "@/components/ui/sticky-scroll-reveal";
import { GraduationCap, BookOpen, Star, Binary, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ExperienceStickyScroll({ isLowPowerMode = false }: { isLowPowerMode?: boolean }) {
    const journeyContent = [
        {
            label: "Higher Education • Current",
            title: "Telkom University",
            description: "Information Technology major with a GPV of 3.8/4.0. Focused on AI Engineering and Systems Research. Active in multiple high-impact research laboratories and national competitions.",
            content: (
                <div className="h-full w-full flex items-center justify-center p-8 bg-black/5 dark:bg-black/5 relative group overflow-hidden border border-[var(--world-border)]">
                    {/* Background Logo */}
                    <div className="absolute inset-0">
                        <Image
                            src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1000"
                            alt="Telkom University"
                            fill
                            className="object-cover opacity-20 blur-[2px] scale-110"
                            unoptimized
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-[var(--world-bg)]/70 via-[var(--world-bg)]/50 to-[var(--world-bg)]/80" />
                    </div>

                    {/* Animated Background Element */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none">
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000012_1px,transparent_1px),linear-gradient(to_bottom,#00000012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                    </div>

                    <div className="relative z-10 flex flex-col items-center">
                        <div className="relative mb-6">
                            <GraduationCap className={cn("w-20 h-20 text-[var(--world-accent)] drop-shadow-lg", !isLowPowerMode && "animate-pulse")} />
                            <Binary className={cn("w-8 h-8 text-[var(--world-muted)] absolute -top-2 -right-2 opacity-80", !isLowPowerMode && "animate-bounce")} />
                        </div>

                        <div className="flex flex-wrap gap-2 justify-center mb-4">
                            {["GPA 3.8", "AI Researcher", "IT Major"].map(s => (
                                <span key={s} className="px-3 py-1 rounded-full text-[10px] bg-[var(--world-bg)]/50 text-[var(--world-text)] border border-[var(--world-border)] font-mono font-bold backdrop-blur-md shadow-lg">
                                    {s}
                                </span>
                            ))}
                        </div>
                        <p className="text-[10px] font-mono text-[var(--world-muted)] uppercase tracking-widest bg-black/5 px-2 py-1 rounded">Digital Innovation Hub</p>
                    </div>

                    {/* Holographic Scan Effect */}
                    {!isLowPowerMode && (
                        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[var(--world-accent)]/50 to-transparent animate-scan z-20" />
                    )}
                </div>
            ),
        },
        {
            label: "Foundation • High School",
            title: "SMAN 88 Jakarta",
            description: "Science Major (IPA). Developed strong analytical foundations in Mathematics and Physics, shaping a logical approach to problem-solving and technical engineering.",
            content: (
                <div className="h-full w-full flex items-center justify-center p-8 bg-black/5 dark:bg-black/5 relative group overflow-hidden border border-[var(--world-border)]">
                    {/* Background Logo */}
                    <div className="absolute inset-0">
                        <Image
                            src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=1000"
                            alt="SMAN 88 Jakarta"
                            fill
                            className="object-cover opacity-10 blur-sm scale-110"
                            unoptimized
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-[var(--world-bg)]/70 via-[var(--world-bg)]/50 to-[var(--world-bg)]/80" />
                    </div>

                    <div className="absolute inset-0 opacity-10 pointer-events-none">
                        <div className="absolute inset-0 bg-[radial-gradient(#00000012_1px,transparent_1px)] [background-size:16px_16px]"></div>
                    </div>

                    <div className="relative z-10 flex flex-col items-center">
                        <div className="relative mb-6">
                            <BookOpen className="w-20 h-20 text-[var(--world-accent)] drop-shadow-lg hover:rotate-6 transition-transform duration-500" />
                            <Sparkles className={cn("w-6 h-6 text-[var(--world-muted)] absolute -bottom-2 -left-2", !isLowPowerMode && "animate-pulse")} />
                        </div>

                        <div className="flex flex-wrap gap-2 justify-center mb-4">
                            {["Science Major", "Jakarta", "Foundation"].map(s => (
                                <span key={s} className="px-3 py-1 rounded-full text-[10px] bg-[var(--world-bg)]/50 text-[var(--world-text)] border border-[var(--world-border)] font-mono font-bold backdrop-blur-md shadow-lg">
                                    {s}
                                </span>
                            ))}
                        </div>
                        <p className="text-[10px] font-mono text-[var(--world-muted)] uppercase tracking-widest bg-black/5 px-2 py-1 rounded">Logical Foundation</p>
                    </div>
                </div>
            ),
        }
    ];

    return (
        <div className="w-full pb-32">
            <StickyScroll content={journeyContent} isLowPowerMode={isLowPowerMode} />
        </div>
    );
}
