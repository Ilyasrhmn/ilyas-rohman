import type { Metadata } from "next";
import { projects } from "@/data/projects";
import { ProjectCard } from "@/components/projects/project-card";
import { ProjectsHero } from "@/components/projects/hero";

export const metadata: Metadata = {
  title: "Projects — Ilyas Nur Rohman",
  description: "Hackathon, campus, and in-progress projects.",
};

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-[var(--world-a-bg)]">
      <ProjectsHero />
      <div className="px-6 pb-24 sm:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 sm:grid-cols-2">
            {projects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
