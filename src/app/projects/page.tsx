import type { Metadata } from "next";
import { projects } from "@/data/projects";
import { ProjectsHero } from "@/components/projects/hero";
import { ProjectsGrid } from "@/components/projects/grid";

export const metadata: Metadata = {
  title: "Projects — Ilyas Nur Rohman",
  description: "Hackathon, campus, and in-progress projects.",
};

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-[var(--world-a-bg)]">
      <ProjectsHero />
      <ProjectsGrid projects={projects} />
    </div>
  );
}
