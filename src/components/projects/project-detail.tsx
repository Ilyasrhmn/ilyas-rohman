import Image from "next/image";
import type { Project } from "@/types";

export function ProjectDetail({ project }: { project: Project }) {
  return (
    <article className="mx-auto max-w-3xl">
      <div className="flex items-center justify-between text-xs uppercase tracking-wide text-muted-foreground">
        <span>{project.category}</span>
        <span>{project.year}</span>
      </div>

      <h1 className="mt-3 font-serif text-4xl text-foreground sm:text-5xl">{project.title}</h1>

      <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-lg border border-border">
        <Image src={project.image} alt={project.title} fill className="object-cover" />
      </div>

      {project.status === "building" ? (
        <div className="mt-6 rounded-lg border border-accent bg-accent/10 px-4 py-3 text-sm text-foreground">
          Currently building — this project is in progress. Details will be added as it
          develops.
        </div>
      ) : (
        (project.demo || project.repo) && (
          <div className="mt-6 flex gap-4">
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-accent-foreground"
              >
                Live demo
              </a>
            )}
            {project.repo && (
              <a
                href={project.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-border px-5 py-2 text-sm font-medium text-foreground"
              >
                Repository
              </a>
            )}
          </div>
        )
      )}

      <p className="mt-8 text-lg leading-relaxed text-foreground/85">{project.description}</p>

      <div className="mt-8">
        <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Stack
        </h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {project.stack.map((tech) => (
            <li
              key={tech}
              className="rounded-full border border-border px-3 py-1 text-xs text-foreground"
            >
              {tech}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
