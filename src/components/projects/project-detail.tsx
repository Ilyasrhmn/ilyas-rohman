import Image from "next/image";
import { RevealLink } from "@/components/layout/route-reveal";
import { ProjectReveal } from "./project-reveal";
import type { Project } from "@/types";

const labelClass = "font-mono text-xs uppercase tracking-[0.16em] text-[var(--world-b-muted)]";
const linkClass = "group inline-flex min-h-11 items-center justify-between gap-8 border-b border-[var(--world-b-border)] py-3 font-mono text-xs uppercase tracking-[0.12em] transition-colors hover:text-[var(--world-b-accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4";

export function ProjectDetail({ project }: { project: Project }) {
  return (
    <article className="mx-auto max-w-6xl px-6 pb-20 pt-32 text-[var(--world-b-text)] sm:px-10 md:pb-28 md:pt-44 xl:px-0">
      <ProjectReveal>
        <RevealLink
          href="/projects"
          direction="back"
          className="inline-flex min-h-11 items-center gap-3 font-mono text-xs uppercase tracking-[0.16em] text-[var(--world-b-muted)] transition-colors hover:text-[var(--world-b-accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
        >
          <span aria-hidden>←</span> All projects
        </RevealLink>
      </ProjectReveal>

      <header className="mb-12 mt-8 grid min-w-0 gap-10 md:mb-16 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] lg:items-end lg:gap-20">
        <ProjectReveal delay={0.08} className="min-w-0">
          <h1 className="break-words font-serif text-[clamp(3.5rem,10vw,9rem)] leading-[0.96] tracking-[-0.04em]">
            {project.title}
          </h1>
          <p className="mt-7 max-w-[42ch] text-pretty font-serif text-xl leading-relaxed text-[var(--world-b-muted)] sm:text-2xl">
            {project.summary}
          </p>
        </ProjectReveal>

        <ProjectReveal delay={0.16} className="min-w-0">
          <dl className="grid gap-5 border-t border-[var(--world-b-border)] pt-5">
            <div>
              <dt className={labelClass}>Project type</dt>
              <dd className="mt-2 max-w-[30ch] text-base leading-relaxed">{project.category}</dd>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <dt className={labelClass}>Year</dt>
                <dd className="mt-2 text-base">{project.year}</dd>
              </div>
              <div>
                <dt className={labelClass}>Status</dt>
                <dd className="mt-2 text-base">{project.status === "shipped" ? "Shipped" : "In progress"}</dd>
              </div>
            </div>
          </dl>
          {project.status === "shipped" && project.demo && (
            <div className="mt-6 flex flex-col">
              <a href={project.demo} target="_blank" rel="noopener noreferrer" className={linkClass}>
                Live demo <span aria-hidden className="text-lg motion-safe:transition-transform motion-safe:duration-200 motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5">↗</span>
              </a>
            </div>
          )}
        </ProjectReveal>
      </header>

      <ProjectReveal delay={0.1}>
        <figure className="relative aspect-video overflow-hidden bg-[var(--world-b-surface)] ring-1 ring-[var(--world-b-border)]" data-project-detail-image>
          <Image
            src={project.image}
            alt={`${project.title} website interface`}
            fill
            loading="eager"
            sizes="(min-width: 1280px) 1152px, (min-width: 640px) calc(100vw - 80px), calc(100vw - 48px)"
            className="object-contain"
          />
        </figure>
      </ProjectReveal>

      <section aria-labelledby="overview-heading" className="mt-16 grid gap-7 border-t border-[var(--world-b-border)] pt-8 md:mt-24 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:gap-16 md:pt-10">
        <ProjectReveal>
          <h2 id="overview-heading" className={labelClass}>The project</h2>
        </ProjectReveal>
        <ProjectReveal className="min-w-0">
          <p className="text-pretty font-serif text-2xl leading-relaxed sm:text-3xl sm:leading-relaxed">
            {project.description}
          </p>
          {project.achievement && (
            <aside className="mt-9 border-l border-[var(--world-b-accent)] pl-5">
              <h3 className={labelClass}>Recognition</h3>
              <p className="mt-3 text-base leading-relaxed text-[var(--world-b-muted)]">{project.achievement}</p>
            </aside>
          )}
        </ProjectReveal>
      </section>

      {project.contributions && project.contributions.length > 0 && (
        <section aria-labelledby="contributions-heading" className="mt-14 grid gap-7 border-t border-[var(--world-b-border)] pt-8 md:mt-20 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:gap-16 md:pt-10">
          <ProjectReveal>
            <h2 id="contributions-heading" className={labelClass}>My contribution</h2>
          </ProjectReveal>
          <ProjectReveal className="min-w-0">
            <ul className="divide-y divide-[var(--world-b-border)]">
              {project.contributions.map((contribution) => (
                <li key={contribution} className="py-6 text-base leading-relaxed first:pt-0 last:pb-0 sm:text-lg">
                  {contribution}
                </li>
              ))}
            </ul>
          </ProjectReveal>
        </section>
      )}

      {project.stack.length > 0 && (
        <section aria-labelledby="stack-heading" className="mt-14 grid gap-7 border-t border-[var(--world-b-border)] pt-8 md:mt-20 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:gap-16 md:pt-10">
          <ProjectReveal>
            <h2 id="stack-heading" className={labelClass}>Built with</h2>
          </ProjectReveal>
          <ProjectReveal className="min-w-0">
            <ul className="flex flex-wrap gap-x-8 gap-y-4">
              {project.stack.map((technology) => (
                <li key={technology} className="border-b border-[var(--world-b-border)] pb-2 text-base text-[var(--world-b-muted)] sm:text-lg">{technology}</li>
              ))}
            </ul>
          </ProjectReveal>
        </section>
      )}
    </article>
  );
}
