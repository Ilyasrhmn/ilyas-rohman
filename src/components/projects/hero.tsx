import { RevealLink } from "@/components/layout/route-reveal";
import { ProjectReveal } from "./project-reveal";

export function ProjectsHero() {
  return (
    <section className="relative overflow-hidden bg-[var(--world-b-bg)] px-6 pb-20 pt-32 text-[var(--world-b-text)] sm:px-10 md:pb-24 md:pt-44">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex select-none items-center justify-center overflow-hidden opacity-[0.03]"
      >
        <span className="whitespace-nowrap font-serif text-[22vw] leading-none">
          WORK
        </span>
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        <ProjectReveal>
          <RevealLink
            href="/"
            direction="back"
            className="inline-flex min-h-11 items-center font-mono text-xs uppercase tracking-[0.2em] text-[var(--world-b-muted)] transition-colors hover:text-[var(--world-b-accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
          >
            ← Index
          </RevealLink>
        </ProjectReveal>

        <ProjectReveal delay={0.1}>
          <h1 className="mt-10 font-serif text-[clamp(2.75rem,8vw,8rem)] leading-[0.95]">
            Projects
          </h1>
        </ProjectReveal>

        <ProjectReveal delay={0.15}>
          <p className="mt-6 max-w-[65ch] font-serif text-lg text-[var(--world-b-muted)]">
            Built around real needs, ideas, and practical problems.
          </p>
        </ProjectReveal>
      </div>
    </section>
  );
}
