"use client";

import { motion } from "framer-motion";

export default function AboutIntro() {
  return (
    <section className="relative min-h-[120vh] w-full flex items-center justify-center px-6 md:px-12 lg:px-24 bg-[var(--world-a-surface)] z-10">
      <div className="max-w-5xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
        <motion.div 
          className="col-span-1 md:col-span-8 flex flex-col gap-6"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="text-3xl md:text-5xl lg:text-7xl font-black tracking-tighter text-[var(--world-a-text)] uppercase leading-[1.1]">
            I'm Ilyas. <br />
            <span className="text-[var(--world-a-muted)]">A builder based in Yogyakarta.</span>
          </h2>
        </motion.div>
        <motion.div 
          className="col-span-1 md:col-span-4 md:col-start-8 flex flex-col gap-8"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-xl md:text-2xl text-[var(--world-a-muted)] font-light leading-relaxed">
            I enjoy turning ideas into interactive web experiences. 
          </p>
          <div className="flex flex-col gap-2 text-sm font-mono tracking-[0.2em] uppercase text-[var(--world-a-accent)]">
            <span>Building.</span>
            <span>Learning.</span>
            <span>Exploring.</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
