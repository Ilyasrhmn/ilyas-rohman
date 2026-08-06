import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/types";

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group relative block aspect-[4/3] w-full overflow-hidden rounded-2xl border border-[var(--world-a-border)] bg-[var(--world-a-surface)] transition-colors hover:border-[var(--world-a-accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
    >
      <div className="relative h-full w-full overflow-hidden">
        <Image
          src={project.image}
          alt=""
          fill
          sizes="(min-width:640px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100" />

        <div className="absolute left-5 top-5 flex items-center gap-3">
          <span className="font-mono text-xs text-white/70">
            {String(index + 1).padStart(2, "0")}
          </span>
          {project.status === "building" && (
            <span className="rounded-full bg-[var(--world-a-accent)] px-3 py-1 font-mono text-[0.6rem] uppercase tracking-widest text-[var(--world-a-bg)]">
              Currently Building
            </span>
          )}
        </div>

        <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
          <div className="flex items-center justify-between font-mono text-xs uppercase tracking-wide text-white/70">
            <span>{project.category}</span>
            <span>{project.year}</span>
          </div>
          <h3 className="mt-3 font-serif text-3xl text-white md:text-4xl">{project.title}</h3>
          <p className="mt-2 max-h-0 overflow-hidden text-sm text-white/80 transition-all duration-500 group-hover:max-h-24 md:text-base">
            {project.summary}
          </p>
        </div>
      </div>
    </Link>
  );
}
