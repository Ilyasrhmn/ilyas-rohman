import type { Metadata } from "next";
import { projects } from "@/data/projects";
import { ProjectsHero } from "@/components/projects/hero";
import { ProjectsGrid } from "@/components/projects/grid";
import { ProjectsFooter } from "@/components/projects/footer";
import { ProjectsThreshold } from "@/components/projects/threshold";

export const metadata: Metadata = {
  title: "Projects",
  description: "Built around real needs, ideas, and practical problems.",
};

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-[var(--world-b-bg)] text-[var(--world-b-text)]">
      <ProjectsHero />
      <ProjectsGrid projects={projects} />
      <ProjectsThreshold />
      <ProjectsFooter />
    </div>
  );
}
