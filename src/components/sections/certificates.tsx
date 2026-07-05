"use client";

import { motion } from "framer-motion";
import { certificates } from "@/data/certificates";
import { SectionColor } from "@/components/motion/section-color";

export function Certificates() {
  return (
    <SectionColor color="#7A5C3E">
      <section id="certificates" className="section-pad px-6 sm:px-10">
        <div className="mx-auto max-w-3xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="font-serif text-3xl text-foreground sm:text-4xl"
          >
            Learning &amp; Achievements
          </motion.h2>

          <div className="mt-10 space-y-8">
            {certificates.map((cert, i) => (
              <motion.div
                key={cert.program}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="border-b border-foreground/15 pb-8 last:border-none"
              >
                <h3 className="font-serif text-xl font-medium text-foreground">
                  {cert.program}
                </h3>
                <p className="mt-1 text-sm font-medium text-foreground/90">{cert.issuer}</p>

                <ul className="mt-3 flex flex-wrap gap-2">
                  {cert.skills.map((skill) => (
                    <li
                      key={skill}
                      className="rounded-full border border-foreground/25 px-3 py-1 text-xs text-foreground"
                    >
                      {skill}
                    </li>
                  ))}
                </ul>

                {cert.credentialUrl && (
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-block text-sm font-medium text-foreground underline underline-offset-4"
                  >
                    View Credential &rarr;
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </SectionColor>
  );
}
