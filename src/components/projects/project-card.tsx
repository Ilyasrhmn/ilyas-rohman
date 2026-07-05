import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/types";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group relative block overflow-hidden rounded-lg border border-border bg-card transition-colors hover:border-accent"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={project.image}
          alt={project.title}
          fill
          sizes="(min-width:640px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-70" />
        {project.status === "building" && (
          <span className="eyebrow absolute left-4 top-4 rounded-full bg-accent px-3 py-1 !text-[0.6rem] !tracking-widest !text-accent-foreground">
            Currently Building
          </span>
        )}
        <div className="absolute inset-x-0 bottom-0 p-5">
          <div className="flex items-center justify-between text-xs uppercase tracking-wide text-foreground/70">
            <span>{project.category}</span>
            <span>{project.year}</span>
          </div>
          <h3 className="mt-2 font-serif text-2xl text-foreground">{project.title}</h3>
          <p className="mt-1 max-h-0 overflow-hidden text-sm text-foreground/80 transition-all duration-500 group-hover:max-h-24">
            {project.summary}
          </p>
        </div>
      </div>
    </Link>
  );
}
