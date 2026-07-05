"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { profile } from "@/data/profile";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export function Preloader() {
    const [isLoading, setIsLoading] = useState(true);
    const reduced = useReducedMotion();

    useEffect(() => {
        const timer = setTimeout(
            () => {
                setIsLoading(false);
                document.body.style.overflow = "";
            },
            reduced ? 200 : 1200
        );

        document.body.style.overflow = "hidden";

        return () => {
            clearTimeout(timer);
            document.body.style.overflow = "";
        };
    }, [reduced]);

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    key="preloader"
                    initial={{ y: 0 }}
                    exit={{
                        y: "-100%",
                        transition: { duration: reduced ? 0.2 : 0.9, ease: [0.76, 0, 0.24, 1] },
                    }}
                    className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background pointer-events-auto"
                >
                    <motion.div
                        initial={reduced ? false : { opacity: 0, scale: 0.8, filter: "blur(10px)" }}
                        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                        exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)", transition: { duration: 0.3 } }}
                        transition={{ duration: reduced ? 0.15 : 0.6, ease: "easeOut" }}
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
            )}
        </AnimatePresence>
    );
}
