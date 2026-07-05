import Link from "next/link";
import type { Metadata } from "next";
import { projects } from "@/data/projects";
import { ProjectCard } from "@/components/projects/project-card";

export const metadata: Metadata = {
  title: "Projects — Ilyas Nur Rohman",
  description: "Hackathon, campus, and in-progress projects.",
};

export default function ProjectsPage() {
  return (
    <div className="section-pad px-6 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <Link href="/#works" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
          &larr; Back to home
        </Link>

        <h1 className="mt-4 font-serif text-4xl text-foreground sm:text-5xl">Projects</h1>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </div>
    </div>
  );
}
