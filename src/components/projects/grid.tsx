import { BlurReveal } from "@/components/effects/blur-reveal";
import { ProjectCard } from "./project-card";
import type { Project } from "@/types";

export function ProjectsGrid({ projects }: { projects: Project[] }) {
  return (
    <section className="bg-[var(--world-a-bg)] px-6 pb-24 sm:px-10">
      <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2">
        {projects.map((project, i) => (
          <BlurReveal key={project.slug} delay={(i % 2) * 0.08}>
            <ProjectCard project={project} index={i} />
          </BlurReveal>
        ))}
      </div>
    </section>
  );
}
