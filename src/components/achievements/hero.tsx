import { RevealLink } from "@/components/layout/route-reveal";
import { BlurReveal } from "@/components/effects/blur-reveal";
import styles from "./hero.module.css";

export function AchievementsHero() {
  return (
    <section className="relative overflow-hidden bg-[var(--world-b-bg)] text-[var(--world-b-text)] px-6 sm:px-10 pt-32 pb-28 md:pt-44 md:pb-12">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-0 flex select-none items-center justify-center overflow-hidden opacity-[0.03]"
      >
        <span className="whitespace-nowrap font-serif text-[22vw] leading-none">CERTIFIED</span>
      </div>

      <div data-achievements-hero-content className={`relative z-10 ${styles.content}`}>
        <BlurReveal>
          <RevealLink
            href="/"
            direction="back"
            className="inline-flex min-h-[44px] items-center font-mono text-xs uppercase tracking-[0.2em] text-[var(--world-b-muted)] transition-colors hover:text-[var(--world-b-accent)]"
          >
            ← Index
          </RevealLink>
        </BlurReveal>

        <BlurReveal delay={0.1}>
          <h1 className="mt-10 font-serif leading-[0.95] text-[clamp(2.75rem,8vw,8rem)]">
            Certificates
          </h1>
        </BlurReveal>

        <BlurReveal delay={0.15}>
          <p className="mt-6 max-w-[65ch] font-serif text-lg text-[var(--world-b-muted)]">
            A collection of learning milestones behind the work I build.
          </p>
        </BlurReveal>

      </div>
    </section>
  );
}
