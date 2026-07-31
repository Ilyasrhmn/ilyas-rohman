"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { profile } from "@/data/profile";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

// Already hidden when we mount (opened in a background tab) — nothing to cover, skip the show.
function isTabHidden() {
    return typeof document !== "undefined" && document.visibilityState === "hidden";
}

export function Preloader() {
    const [isLoading, setIsLoading] = useState(() => !isTabHidden());
    // ponytail: hard fallback so a paused-rAF background tab can't leave the overlay stuck forever
    const [removed, setRemoved] = useState(isTabHidden);
    const reduced = useReducedMotion();

    useEffect(() => {
        if (!isLoading) {
            document.body.style.overflow = "";
            return;
        }

        document.body.style.overflow = "hidden";
        const timer = setTimeout(
            () => {
                setIsLoading(false);
                document.body.style.overflow = "";
            },
            reduced ? 200 : 1200
        );

        return () => {
            clearTimeout(timer);
            document.body.style.overflow = "";
        };
    }, [isLoading, reduced]);

    // Timer-driven unmount fallback, independent of whether the exit tween ever runs
    // (rAF-based tweens never advance in a hidden tab, so we can't rely on "on complete").
    useEffect(() => {
        if (isLoading || removed) return;
        const timer = setTimeout(() => setRemoved(true), reduced ? 0 : 1000);
        return () => clearTimeout(timer);
    }, [isLoading, removed, reduced]);

    // Forces a full, synchronous unmount — bypassing any animation library's
    // deferred-exit machinery, which is exactly what leaves the overlay stuck.
    if (removed) return null;

    return (
        <motion.div
            initial={{ y: 0 }}
            animate={{ y: isLoading ? 0 : "-100%" }}
            transition={{ duration: reduced ? 0.2 : 0.9, ease: [0.76, 0, 0.24, 1] }}
            className={cn(
                "fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background",
                isLoading ? "pointer-events-auto" : "pointer-events-none"
            )}
        >
            <motion.div
                initial={reduced ? false : { opacity: 0, scale: 0.8, filter: "blur(10px)" }}
                animate={
                    isLoading
                        ? { opacity: 1, scale: 1, filter: "blur(0px)" }
                        : { opacity: 0, scale: 0.9, filter: "blur(10px)" }
                }
                transition={{ duration: isLoading ? (reduced ? 0.15 : 0.6) : 0.3, ease: "easeOut" }}
                className="relative z-10 flex flex-col items-center gap-6"
            >
                <span className="font-serif text-xl tracking-wide text-foreground">
                    {profile.name}
                </span>
                <div className="relative h-px w-40 overflow-hidden bg-border">
                    <motion.div
                        className="absolute inset-y-0 left-0 bg-accent"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: reduced ? 0.2 : 1, ease: [0.65, 0, 0.35, 1] }}
                    />
                </div>
            </motion.div>
        </motion.div>
    );
}
