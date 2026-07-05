"use client";

import { motion } from "framer-motion";
import { GooeyText } from "@/components/ui/gooey-text-morphing";

export default function Manifesto() {
  return (
    <section className="relative w-full flex flex-col items-center justify-start pt-[20vh] pb-32 px-6 md:px-12 lg:px-24 bg-transparent text-[var(--world-b-text)] z-10 overflow-hidden -mt-[40vh] md:-mt-[60vh]">
      
      <div className="max-w-5xl mx-auto w-full flex flex-col items-center text-center gap-6 relative z-10">
        
        {/* Intro Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-xl md:text-3xl font-serif text-[var(--world-b-muted)] italic tracking-wide">
            I don't just write code. I engineer
          </h2>
        </motion.div>

        {/* Gooey Text Morphing */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3 }}
          className="h-[120px] md:h-[200px] w-full flex items-center justify-center my-4"
        >
          <GooeyText
            texts={["Experiences.", "Interfaces.", "Solutions.", "Aesthetics."]}
            morphTime={1.2}
            cooldownTime={1.5}
            textClassName="text-6xl md:text-8xl lg:text-[8rem] font-bold font-serif text-[var(--world-b-accent)] tracking-tighter"
          />
        </motion.div>

        {/* Conclusion Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <p className="text-lg md:text-2xl font-light text-[var(--world-b-muted)] max-w-2xl leading-relaxed">
            Merging precise logic with stunning design to build software that actually matters.
          </p>
        </motion.div>

      </div>
    </section>
  );
}
