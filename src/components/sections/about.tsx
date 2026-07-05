"use client";

import { motion } from "framer-motion";
import { SectionColor } from "@/components/motion/section-color";

export function About() {
  return (
    <SectionColor color="#2E4A5A">
      <section id="about" className="section-pad px-6 sm:px-10">
        <div className="mx-auto max-w-3xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="font-serif text-3xl text-foreground sm:text-4xl"
          >
            About
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-6 space-y-4 text-lg leading-relaxed text-foreground/85"
          >
            <p>
              I&apos;m a frontend engineer based in Yogyakarta, building interactive web
              experiences with an eye for motion, detail, and craft — while staying
              comfortable enough on the backend to ship a feature end to end.
            </p>
            <p>
              Alongside building, I work as a teaching assistant, helping fellow students
              work through frontend and web development coursework. Teaching keeps me
              honest about the fundamentals and sharp at explaining the &ldquo;why&rdquo;
              behind the code, not just the &ldquo;how&rdquo;.
            </p>
            <p>
              Most of what I&apos;ve built so far comes from hackathons and campus
              projects — and right now, a real-world marketplace connecting village
              producers to buyers.
            </p>
          </motion.div>
        </div>
      </section>
    </SectionColor>
  );
}
