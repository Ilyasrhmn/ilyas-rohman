import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/types";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group relative block h-full w-full overflow-hidden rounded-2xl border border-border bg-card transition-colors hover:border-accent"
    >
      <div className="relative h-full w-full overflow-hidden">
        <Image
          src={project.image}
          alt={project.title}
          fill
          sizes="(min-width:640px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100" />
        {project.status === "building" && (
          <span className="eyebrow absolute left-5 top-5 rounded-full bg-accent px-3 py-1 !text-[0.6rem] !tracking-widest !text-accent-foreground backdrop-blur-md">
            Currently Building
          </span>
        )}
        <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
          <div className="flex items-center justify-between text-xs uppercase tracking-wide text-foreground/70">
            <span>{project.category}</span>
            <span>{project.year}</span>
          </div>
          <h3 className="mt-3 font-serif text-3xl md:text-4xl text-foreground">{project.title}</h3>
          <p className="mt-2 max-h-0 overflow-hidden text-sm md:text-base text-foreground/80 transition-all duration-500 group-hover:max-h-24">
            {project.summary}
          </p>
        </div>
      </div>
    </Link>
  );
}
