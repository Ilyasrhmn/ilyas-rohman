"use client";

import { certificates } from "@/data/certificates";
import { PinnedScatter } from "@/components/motion/pinned-scatter";

export function Certificates() {
  return (
    <section id="certificates" className="relative">
      <div className="section-pad px-6 text-center sm:px-10">
        <span className="eyebrow">Learning &amp; Achievements</span>
        <h2 className="section-title mx-auto mt-4 max-w-3xl text-foreground">
          Proof of process, not a shelf of PDFs.
        </h2>
      </div>

      <PinnedScatter>
        {certificates.map((c) => (
          <div key={c.program} className="flex h-full flex-col justify-between rounded-lg border border-border bg-card p-5">
            <div>
              <h3 className="font-serif text-lg text-foreground">{c.program}</h3>
              <p className="mt-1 text-sm text-foreground/70">{c.issuer}</p>
            </div>
            <ul className="mt-3 flex flex-wrap gap-2">
              {c.skills.map((s) => (
                <li key={s} className="rounded-full border border-foreground/25 px-2.5 py-0.5 text-[0.7rem] text-foreground/90">
                  {s}
                </li>
              ))}
            </ul>
            {c.credentialUrl && (
              <a href={c.credentialUrl} target="_blank" rel="noopener noreferrer" className="mt-3 text-sm text-accent underline underline-offset-4">
                View Credential &rarr;
              </a>
            )}
          </div>
        ))}
      </PinnedScatter>
    </section>
  );
}
