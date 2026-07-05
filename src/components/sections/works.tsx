"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { getFeaturedProjects } from "@/data/projects";
import { ProjectCard } from "@/components/projects/project-card";

export function Works() {
  const featured = getFeaturedProjects();
  const building = featured.find((p) => p.status === "building");
  const rest = featured.filter((p) => p.status !== "building");

  return (
    <section id="works" className="section-pad px-6 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-end justify-between gap-4">
          <div>
            <span className="eyebrow">Selected Works</span>
            <h2 className="section-title mt-4 text-foreground">Things I&apos;ve built.</h2>
          </div>
          <Link href="/projects" className="shrink-0 text-sm text-foreground/60 transition-colors hover:text-foreground">
            See all &rarr;
          </Link>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {building && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7 }}
              className="sm:col-span-2"
            >
              <ProjectCard project={building} />
            </motion.div>
          )}
          {rest.map((p, i) => (
            <motion.div
              key={p.slug}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
            >
              <ProjectCard project={p} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
