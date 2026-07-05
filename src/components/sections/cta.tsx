"use client";

import { motion } from "framer-motion";
import { useContact } from "@/components/layout/chrome-shell";
import { profile } from "@/data/profile";

export function Cta() {
  const openContact = useContact();

  return (
    <section className="section-pad px-6 sm:px-10">
      <div className="mx-auto max-w-3xl text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="display text-foreground"
        >
          Let&apos;s build.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-4 text-muted-foreground"
        >
          {profile.email}
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          onClick={openContact}
          className="mt-8 cursor-pointer rounded-full bg-accent px-8 py-3 text-sm font-medium uppercase tracking-wide text-accent-foreground transition-opacity hover:opacity-90"
        >
          Get in touch
        </motion.button>
      </div>
    </section>
  );
}
