import type { Project } from "@/types";
import { ProjectCard } from "./project-card";
import { ProjectReveal } from "./project-reveal";

export function ProjectsGrid({ projects }: { projects: Project[] }) {
  return (
    <section
      aria-label="Project collection"
      className="bg-[var(--world-b-bg)] px-6 pb-24 text-[var(--world-b-text)] sm:px-10 md:pb-32"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-16 md:gap-24 lg:gap-32">
        {projects.map((project, index) => (
          <ProjectReveal key={project.slug} className="min-w-0">
            <ProjectCard project={project} reverse={index % 2 === 1} eager={index === 0} />
          </ProjectReveal>
        ))}
      </div>
    </section>
  );
}
