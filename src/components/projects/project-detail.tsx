import Image from "next/image";
import { BlurReveal } from "@/components/effects/blur-reveal";
import type { Project } from "@/types";

export function ProjectDetail({ project }: { project: Project }) {
  return (
    <article className="mx-auto max-w-3xl">
      <BlurReveal>
        <div className="flex items-center justify-between font-mono text-xs uppercase tracking-[0.2em] text-[var(--world-a-muted)]">
          <span>{project.category}</span>
          <span>{project.year}</span>
        </div>
      </BlurReveal>

      <BlurReveal delay={0.05}>
        <h1 className="mt-4 font-serif leading-[0.95] text-[clamp(2.5rem,7vw,5rem)] text-[var(--world-a-text)]">
          {project.title}
        </h1>
      </BlurReveal>

      <BlurReveal delay={0.1}>
        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-xs uppercase tracking-wide text-[var(--world-a-muted)]">
          <span>{project.status === "shipped" ? "Shipped" : "Currently building"}</span>
          <span aria-hidden className="text-[var(--world-a-border)]">
            &middot;
          </span>
          <span>{project.stack.length} technologies</span>
        </div>
      </BlurReveal>

      {project.achievement && (
        <BlurReveal delay={0}>
          <div className="mt-6 inline-flex items-start gap-2 rounded-full border border-[var(--world-a-accent)]/40 bg-[var(--world-a-accent)]/10 px-4 py-3 text-sm text-[var(--world-a-text)]">
            <span className="mt-0.5 shrink-0 font-mono text-xs font-medium uppercase tracking-wide text-[var(--world-a-accent)]">
              Achievement
            </span>
            <span className="text-[var(--world-a-text)]/90">{project.achievement}</span>
          </div>
        </BlurReveal>
      )}

      <BlurReveal delay={0}>
        <div className="relative -mx-6 mt-8 aspect-[16/9] overflow-hidden border border-[var(--world-a-border)] sm:mx-0 sm:rounded-lg">
          <Image
            src={project.image}
            alt=""
            fill
            sizes="(min-width: 768px) 768px, 100vw"
            className="object-cover"
          />
        </div>
      </BlurReveal>

      {project.status === "building" ? (
        <BlurReveal delay={0}>
          <div className="mt-6 rounded-full border border-[var(--world-a-accent)] bg-[var(--world-a-accent)]/10 px-4 py-3 text-sm text-[var(--world-a-text)]">
            Currently building — this project is in progress. Details will be added as it
            develops.
          </div>
        </BlurReveal>
      ) : (
        (project.demo || project.repo) && (
          <BlurReveal delay={0}>
            <div className="mt-6 flex gap-4">
              {project.demo && (
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[44px] items-center rounded-full bg-[var(--world-a-accent)] px-5 py-2 text-sm font-medium text-[var(--world-a-bg)] transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  Live demo
                </a>
              )}
              {project.repo && (
                <a
                  href={project.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[44px] items-center rounded-full border border-[var(--world-a-border)] px-5 py-2 text-sm font-medium text-[var(--world-a-text)] transition-colors hover:border-[var(--world-a-accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  Repository
                </a>
              )}
            </div>
          </BlurReveal>
        )
      )}

      <BlurReveal delay={0}>
        <p className="mt-8 font-serif text-lg leading-relaxed text-[var(--world-a-text)]/85">
          {project.description}
        </p>
      </BlurReveal>

      {project.contributions && project.contributions.length > 0 && (
        <BlurReveal delay={0}>
          <div className="mt-10">
            <h2 className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-[var(--world-a-muted)]">
              Contributions
            </h2>
            <ol className="mt-4 flex flex-col divide-y divide-[var(--world-a-border)] border-y border-[var(--world-a-border)]">
              {project.contributions.map((item, i) => (
                <li key={item} className="flex gap-4 py-4">
                  <span className="shrink-0 font-mono text-xs text-[var(--world-a-accent)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-base leading-relaxed text-[var(--world-a-text)]/85">
                    {item}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </BlurReveal>
      )}

      <BlurReveal delay={0}>
        <div className="mt-10">
          <h2 className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-[var(--world-a-muted)]">
            Stack
          </h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {project.stack.map((tech) => (
              <li
                key={tech}
                className="rounded-full border border-[var(--world-a-border)] px-3 py-1 font-mono text-xs text-[var(--world-a-text)] transition-colors hover:border-[var(--world-a-accent)]"
              >
                {tech}
              </li>
            ))}
          </ul>
        </div>
      </BlurReveal>
    </article>
  );
}
