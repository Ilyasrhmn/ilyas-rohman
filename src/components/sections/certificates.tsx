"use client";

import { certificates } from "@/data/certificates";
import { PinnedScatter } from "@/components/motion/pinned-scatter";
import Image from "next/image";

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
          <a
            key={c.slug}
            href={c.credentialUrl || undefined}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-full flex-col justify-between rounded-lg border border-border bg-card overflow-hidden group"
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-card">
              <Image
                src={c.image}
                alt={c.program}
                fill
                sizes="(max-width: 768px) 100vw, 300px"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-serif text-lg text-foreground">{c.program}</h3>
                <p className="mt-1 text-sm text-foreground/70">{c.issuer}</p>
              </div>
              <ul className="mt-3 flex flex-wrap gap-2">
                {c.skills.slice(0, 3).map((s) => (
                  <li key={s} className="rounded-full border border-foreground/25 px-2.5 py-0.5 text-[0.7rem] text-foreground/90">
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </a>
        ))}
      </PinnedScatter>
    </section>
  );
}
