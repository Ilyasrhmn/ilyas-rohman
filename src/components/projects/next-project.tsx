import Link from "next/link";
import { BlurReveal } from "@/components/effects/blur-reveal";
import { projects } from "@/data/projects";

export function NextProject({ currentSlug }: { currentSlug: string }) {
  const currentIndex = projects.findIndex((p) => p.slug === currentSlug);
  if (currentIndex === -1) return null;
  const next = projects[(currentIndex + 1) % projects.length];

  return (
    <BlurReveal delay={0.1}>
      <Link
        href={`/projects/${next.slug}`}
        className="group mx-auto mt-16 flex max-w-3xl flex-col items-center gap-2 border-t border-[var(--world-a-border)] py-10 text-center transition-colors hover:border-[var(--world-a-accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--world-a-muted)]">
          Next project
        </span>
        <span className="font-serif text-3xl text-[var(--world-a-text)] transition-colors group-hover:text-[var(--world-a-accent)] sm:text-4xl">
          {next.title} &rarr;
        </span>
      </Link>
    </BlurReveal>
  );
}
