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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="flex items-end justify-between gap-4"
        >
          <h2 className="font-serif text-3xl text-foreground sm:text-4xl">Selected Works</h2>
          <Link
            href="/projects"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            See all work &rarr;
          </Link>
        </motion.div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {building && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="sm:col-span-2"
            >
              <ProjectCard project={building} />
            </motion.div>
          )}

          {rest.map((project, i) => (
            <motion.div
              key={project.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
