"use client";

import { useState, useEffect, useSyncExternalStore } from "react";
import { motion } from "framer-motion";
import { profile } from "@/data/profile";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

// Nothing ever fires this tab's visibilitychange for us to react to here -- we only need the
// snapshot value, not live updates -- so the subscription is a no-op.
function subscribeNoop() {
    return () => {};
}
function getTabHiddenSnapshot() {
    return document.visibilityState === "hidden";
}
// SSR has no document, so there's nothing to be "hidden" yet -- always false here, which is
// also what guarantees hydration matches: useSyncExternalStore renders this exact value on the
// client's first pass too, then re-renders once with the real client value right after.
function getServerTabHiddenSnapshot() {
    return false;
}

export function Preloader() {
    // Reading document.visibilityState directly (e.g. in a useState lazy initializer or a
    // synchronous useEffect setState) is unsafe here: SSR always resolves it as "not hidden"
    // (no document in Node), but the client's very first render can legitimately see it as
    // hidden (backgrounded tab, mobile OS backgrounding, prerendering) -- a real, reproducible
    // hydration mismatch (React error #418), confirmed via a clean build with
    // document.visibilityState === "hidden". useSyncExternalStore is React's dedicated
    // mechanism for exactly this class of problem: it renders getServerTabHiddenSnapshot()'s
    // value during hydration (guaranteeing a match) and only picks up the real client value in
    // a follow-up render afterward.
    const tabWasHidden = useSyncExternalStore(subscribeNoop, getTabHiddenSnapshot, getServerTabHiddenSnapshot);
    const [isLoadingState, setIsLoadingState] = useState(true);
    const [removedState, setRemovedState] = useState(false);
    const reduced = useReducedMotion();

    // Already hidden when we mounted -- nothing to cover, skip the show.
    const isLoading = isLoadingState && !tabWasHidden;
    const removed = removedState || tabWasHidden;

    useEffect(() => {
        if (!isLoading) {
            document.body.style.overflow = "";
            return;
        }

        document.body.style.overflow = "hidden";
        const timer = setTimeout(
            () => {
                setIsLoadingState(false);
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
        const timer = setTimeout(() => setRemovedState(true), reduced ? 0 : 1000);
        return () => clearTimeout(timer);
    }, [isLoading, removed, reduced]);

    // Forces a full, synchronous unmount, bypassing any animation library's
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
