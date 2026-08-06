import Link from "next/link";
import { certificates } from "@/data/certificates";
import { BlurReveal } from "@/components/effects/blur-reveal";
import { lastAddedLabel } from "./data";

export function AchievementsHero() {
  const count = certificates.length;
  const trackCount = new Set(certificates.map((c) => c.track ?? "Other")).size;
  const issuerCount = new Set(certificates.map((c) => c.issuer)).size;
  const lastAdded = lastAddedLabel(certificates);

  return (
    <section className="relative overflow-hidden bg-[var(--world-b-bg)] text-[var(--world-b-text)] px-6 sm:px-10 pt-32 pb-28 md:pt-44 md:pb-40">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-0 flex select-none items-center justify-center overflow-hidden opacity-[0.03]"
      >
        <span className="whitespace-nowrap font-serif text-[22vw] leading-none">CERTIFIED</span>
      </div>

      <div className="relative z-10 mx-auto max-w-4xl">
        <BlurReveal>
          <Link
            href="/"
            className="inline-flex min-h-[44px] items-center font-mono text-xs uppercase tracking-[0.2em] text-[var(--world-b-muted)] transition-colors hover:text-[var(--world-b-accent)]"
          >
            ← Index
          </Link>
        </BlurReveal>

        <BlurReveal delay={0.05}>
          <p className="mt-10 font-mono text-xs uppercase tracking-[0.25em] text-[var(--world-b-accent)]">
            Archive — {String(count).padStart(3, "0")} certificates
          </p>
        </BlurReveal>

        <BlurReveal delay={0.1}>
          <h1 className="mt-4 font-serif leading-[0.95] text-[clamp(2.75rem,8vw,8rem)]">
            Eleven certificates.
          </h1>
        </BlurReveal>

        <BlurReveal delay={0.15}>
          <p className="mt-6 max-w-[65ch] font-serif text-lg text-[var(--world-b-muted)]">
            Most of them Dicoding, one HackerRank, one from a blockchain literacy month. None
            of them make me a senior engineer — they just mark where I stopped guessing and
            started knowing.
          </p>
        </BlurReveal>

        <BlurReveal delay={0.2}>
          <div className="mt-12 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-xs uppercase tracking-wide text-[var(--world-b-muted)]">
            <span>{count} certificates</span>
            <span aria-hidden className="text-[var(--world-b-border)]">
              ·
            </span>
            <span>{trackCount} tracks</span>
            <span aria-hidden className="text-[var(--world-b-border)]">
              ·
            </span>
            <span>{issuerCount} issuers</span>
            <span aria-hidden className="text-[var(--world-b-border)]">
              ·
            </span>
            <span>Last added {lastAdded}</span>
          </div>
        </BlurReveal>
      </div>
    </section>
  );
}
