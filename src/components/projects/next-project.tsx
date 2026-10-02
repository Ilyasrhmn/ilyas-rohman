import Image from "next/image";
import { RevealLink } from "@/components/layout/route-reveal";
import { ProjectReveal } from "./project-reveal";
import { projects } from "@/data/projects";

export function NextProject({ currentSlug }: { currentSlug: string }) {
  const currentIndex = projects.findIndex((project) => project.slug === currentSlug);
  if (currentIndex === -1 || projects.length < 2) return null;
  const next = projects[(currentIndex + 1) % projects.length];

  return (
    <section data-next-project className="overflow-hidden bg-[var(--world-a-bg)] px-6 py-16 text-[var(--world-a-text)] sm:px-10 md:py-24">
      <div className="mx-auto max-w-6xl">
        <ProjectReveal>
          <RevealLink
            href={`/projects/${next.slug}`}
            className="group grid min-w-0 items-center gap-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:gap-20"
          >
            <div className="min-w-0">
              <span className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--world-a-muted)]">Next project</span>
              <div className="mt-6 flex items-center justify-between gap-5">
                <h2 className="min-w-0 break-words font-serif text-[clamp(2.75rem,6vw,6rem)] leading-[1.05] tracking-[-0.03em] transition-colors group-hover:text-[var(--world-a-accent)]">{next.title}</h2>
                <span aria-hidden className="shrink-0 text-4xl text-[var(--world-a-accent)] motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:translate-x-2 sm:text-5xl">→</span>
              </div>
              <p className="mt-5 max-w-[34ch] text-base leading-relaxed text-[var(--world-a-muted)]">{next.category}</p>
            </div>
            <div className="relative aspect-video min-w-0 overflow-hidden bg-[var(--world-a-surface)] ring-1 ring-[var(--world-a-border)]">
              <Image src={next.image} alt="" fill sizes="(min-width: 1280px) 466px, (min-width: 1024px) 42vw, (min-width: 640px) calc(100vw - 80px), calc(100vw - 48px)" className="object-contain motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-[1.025]" />
            </div>
          </RevealLink>
        </ProjectReveal>
        <div className="mt-12 border-t border-[var(--world-a-border)] pt-5">
          <RevealLink href="/projects" direction="back" className="inline-flex min-h-11 items-center gap-3 font-mono text-xs uppercase tracking-[0.16em] text-[var(--world-a-muted)] transition-colors hover:text-[var(--world-a-text)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4">
            <span aria-hidden>←</span> All projects
          </RevealLink>
        </div>
      </div>
    </section>
  );
}
