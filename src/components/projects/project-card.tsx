import Image from "next/image";
import type { Project } from "@/types";
import { RevealLink } from "@/components/layout/route-reveal";

export function ProjectCard({
  project,
  reverse = false,
  eager = false,
}: {
  project: Project;
  reverse?: boolean;
  eager?: boolean;
}) {
  return (
    <article data-project-card>
      <RevealLink
        href={`/projects/${project.slug}`}
        className={[
          "group grid min-w-0 items-center gap-7 text-[var(--world-b-text)] md:gap-10 lg:gap-14",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-8",
          reverse
            ? "lg:grid-cols-[minmax(0,1fr)_minmax(0,1.65fr)]"
            : "lg:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)]",
        ].join(" ")}
      >
        <div
          data-project-image
          className={[
            "relative aspect-video min-w-0 overflow-hidden bg-[var(--world-b-surface)] ring-1 ring-[var(--world-b-border)]",
            reverse ? "lg:order-2" : "",
          ].join(" ")}
        >
          <Image
            src={project.image}
            alt=""
            fill
            loading={eager ? "eager" : "lazy"}
            sizes="(min-width: 1280px) 690px, (min-width: 1024px) 58vw, (min-width: 640px) calc(100vw - 80px), calc(100vw - 48px)"
            className="object-contain motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-out motion-safe:group-hover:scale-[1.025]"
          />
        </div>
        <div className={["min-w-0", reverse ? "lg:order-1" : ""].join(" ")}>
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2 font-mono text-xs uppercase tracking-[0.12em] text-[var(--world-b-muted)]">
            <span className="min-w-0 break-words">{project.category}</span>
            <span>{project.year}</span>
            {project.status === "building" && (
              <span className="text-[var(--world-b-accent)]">In progress</span>
            )}
          </div>
          <h2 className="mt-4 break-words font-serif text-4xl leading-[1.05] md:text-5xl">
            {project.title}
          </h2>
          <p className="mt-5 max-w-[45ch] break-words text-base leading-relaxed text-[var(--world-b-muted)] md:text-lg">
            {project.summary}
          </p>
          <span className="mt-6 inline-flex min-h-11 items-center gap-3 font-mono text-xs uppercase tracking-[0.16em] text-[var(--world-b-accent)]">
            View project
            <span aria-hidden className="motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:translate-x-1">
              →
            </span>
          </span>
        </div>
      </RevealLink>
    </article>
  );
}
