import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/types";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group block overflow-hidden rounded-lg border border-border bg-card transition-colors hover:border-accent"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {project.status === "building" && (
          <span className="absolute left-3 top-3 rounded-full bg-accent px-3 py-1 text-[0.65rem] font-medium uppercase tracking-wide text-accent-foreground">
            Currently Building
          </span>
        )}
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between text-xs uppercase tracking-wide text-muted-foreground">
          <span>{project.category}</span>
          <span>{project.year}</span>
        </div>
        <h3 className="mt-2 font-serif text-xl text-foreground">{project.title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{project.summary}</p>
      </div>
    </Link>
  );
}
