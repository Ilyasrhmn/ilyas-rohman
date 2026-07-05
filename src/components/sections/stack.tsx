"use client";

import { motion } from "framer-motion";
import { stackGroups } from "@/data/stack";

export function Stack() {
  return (
    <section id="stack" className="section-pad px-6 sm:px-10">
      <div className="mx-auto max-w-5xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="font-serif text-3xl text-foreground sm:text-4xl"
        >
          Stack
        </motion.h2>

        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          {stackGroups.map((group, i) => (
            <motion.div
              key={group.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="rounded-lg border border-border p-6 transition-colors hover:border-accent"
            >
              <span className="h-px w-8 bg-accent block" />
              <h3 className="mt-4 text-sm font-medium uppercase tracking-wide text-foreground">
                {group.label}
              </h3>
              <ul className="mt-4 space-y-2">
                {group.items.map((item) => (
                  <li key={item} className="text-muted-foreground">
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
