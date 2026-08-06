import Link from "next/link";
import { BlurReveal } from "@/components/effects/blur-reveal";
import { projects } from "@/data/projects";

export function ProjectsHero() {
  const total = projects.length;
  const shipped = projects.filter((p) => p.status === "shipped").length;
  const categoryCount = new Set(projects.map((p) => p.category)).size;

  return (
    <section className="relative overflow-hidden bg-[var(--world-a-bg)] px-6 pb-20 pt-32 text-[var(--world-a-text)] sm:px-10 md:pb-28 md:pt-44">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex select-none items-center justify-center overflow-hidden opacity-[0.04]"
      >
        <span className="whitespace-nowrap font-serif text-[20vw] leading-none">WORK</span>
      </div>

      <div className="relative z-10 mx-auto max-w-4xl">
        <BlurReveal>
          <Link
            href="/"
            className="inline-flex min-h-[44px] items-center font-mono text-xs uppercase tracking-[0.2em] text-[var(--world-a-muted)] transition-colors hover:text-[var(--world-a-accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            &larr; Index
          </Link>
        </BlurReveal>

        <BlurReveal delay={0.05}>
          <p className="mt-10 font-mono text-xs uppercase tracking-[0.25em] text-[var(--world-a-accent)]">
            Index &mdash; {String(total).padStart(3, "0")} projects
          </p>
        </BlurReveal>

        <BlurReveal delay={0.1}>
          <h1 className="mt-4 font-serif leading-[0.95] text-[clamp(2.75rem,8vw,7rem)]">
            Built to ship, not to sit in a folder.
          </h1>
        </BlurReveal>

        <BlurReveal delay={0.15}>
          <p className="mt-6 max-w-[65ch] font-serif text-lg text-[var(--world-a-muted)]">
            Hackathon platforms, campus systems, and the odd late-night prototype —{" "}
            {shipped < total
              ? `${shipped} shipped, the rest still building.`
              : `all ${shipped} shipped.`}
          </p>
        </BlurReveal>

        <BlurReveal delay={0.2}>
          <div className="mt-12 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-xs uppercase tracking-wide text-[var(--world-a-muted)]">
            <span>{total} projects</span>
            {shipped < total && (
              <>
                <span aria-hidden className="text-[var(--world-a-border)]">
                  &middot;
                </span>
                <span>{shipped} shipped</span>
              </>
            )}
            <span aria-hidden className="text-[var(--world-a-border)]">
              &middot;
            </span>
            <span>{categoryCount} categories</span>
          </div>
        </BlurReveal>
      </div>
    </section>
  );
}
