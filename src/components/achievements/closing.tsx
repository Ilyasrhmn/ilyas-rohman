"use client";

import { RevealLink } from "@/components/layout/route-reveal";
import { useContact } from "@/components/layout/chrome-shell";

export function AchievementsClosing() {
  const openContact = useContact();

  return (
    <section className="bg-[var(--world-b-bg)] text-[var(--world-b-text)]">
      <div className="mx-auto flex max-w-4xl flex-col items-center justify-center gap-8 px-6 py-32 text-center sm:px-10 md:py-40">
        <p className="font-serif text-3xl md:text-5xl">That&apos;s the whole shelf.</p>
        <p className="max-w-[55ch] font-serif text-base text-[var(--world-b-muted)] md:text-lg">Certificates are a floor, not a ceiling. If you want to see what I built on top of them, the work is one click away.</p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
          <RevealLink href="/projects" className="inline-flex min-h-[44px] items-center gap-2 border border-[var(--world-b-text)] px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] transition-opacity hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">
            See the work →
          </RevealLink>
          <button type="button" onClick={openContact} className="inline-flex min-h-[44px] items-center gap-2 px-2 py-3 font-mono text-xs uppercase tracking-[0.2em] underline underline-offset-4 transition-opacity hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">
            Start a conversation
          </button>
        </div>
      </div>
    </section>
  );
}
