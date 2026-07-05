"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { InfiniteRibbon } from "@/components/ui/infinite-ribbon";
import { useContact } from "@/components/layout/chrome-shell";
import Link from "next/link";

const WORDS = ["Amazing", "Interactive", "Impactful", "Innovative"];

export function Cta() {
  const open = useContact();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % WORDS.length);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="cta" className="relative flex min-h-[100vh] flex-col items-center justify-center overflow-hidden bg-background">
      
      {/* Decorative Background Atmosphere */}
      <div className="absolute inset-0 pointer-events-none mist opacity-70" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Infinite Ribbons Layer */}
      <div className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none opacity-40 mix-blend-plus-lighter z-0">
        <InfiniteRibbon
          text="NEXT.JS • REACT • TYPESCRIPT • TAILWIND • NODE • POSTGRES"
          rotation={-5}
          speed="40s"
          bgClass="bg-accent/10 border-y border-accent/20"
          textClass="text-accent-foreground/50"
        />
        <div className="h-20" />
        <InfiniteRibbon
          text="LET'S BUILD SOMETHING AMAZING"
          rotation={3}
          speed="35s"
          reverse
          bgClass="bg-foreground/5 border-y border-foreground/10"
          textClass="text-foreground/30"
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
        <span className="eyebrow block mb-8">What&apos;s Next?</span>
        <h2 className="display text-foreground leading-[1.1] mb-12">
          Let&apos;s Build Something <br className="hidden sm:block" />
          <span className="relative inline-block text-accent">
            <AnimatePresence mode="popLayout">
              <motion.span
                key={WORDS[index]}
                initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="inline-block"
              >
                {WORDS[index]}
              </motion.span>
            </AnimatePresence>
          </span>
          <br className="hidden sm:block" /> Together.
        </h2>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-12">
          <button
            onClick={open}
            className="group relative overflow-hidden rounded-full bg-foreground px-8 py-4 font-medium tracking-wide text-background transition-transform hover:scale-105 active:scale-95"
          >
            <span className="relative z-10 flex items-center gap-2">
              Start Conversation
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              >
                &rarr;
              </motion.span>
            </span>
            <div className="absolute inset-0 bg-white/20 translate-y-full transition-transform duration-300 group-hover:translate-y-0" />
          </button>
          
          <Link
            href="/projects"
            className="rounded-full border border-border bg-background px-8 py-4 font-medium tracking-wide text-foreground transition-colors hover:border-accent hover:bg-accent/10"
          >
            View All Work
          </Link>
        </div>
      </div>
    </section>
  );
}
