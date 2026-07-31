"use client";

import { useMemo, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { certificates } from "@/data/certificates";
import type { Certificate } from "@/types";
import { BlurReveal } from "@/components/effects/blur-reveal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLenisModal } from "@/hooks/use-lenis-modal";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { groupByTrack, issuedYear, type CertificateGroup } from "./data";

export function AchievementsIndex() {
  const groups = useMemo(() => groupByTrack(certificates), []);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);

  const openSlug = searchParams.get("cert");
  const openCert = certificates.find((c) => c.slug === openSlug) ?? null;

  function openCertificate(slug: string, trigger: HTMLButtonElement) {
    lastTriggerRef.current = trigger;
    const params = new URLSearchParams(searchParams.toString());
    params.set("cert", slug);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  function closeCertificate() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("cert");
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    lastTriggerRef.current?.focus();
  }

  return (
    <section className="relative overflow-hidden bg-[var(--world-a-bg)] px-6 py-24 text-[var(--world-a-text)] sm:px-10 md:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 -z-0 h-[500px] w-full max-w-lg -translate-x-1/2 rounded-full bg-[var(--world-a-accent)]/10 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-0 -z-0 h-[500px] w-full max-w-lg translate-x-1/2 rounded-full bg-[var(--world-a-accent)]/10 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-0 flex select-none items-center justify-center overflow-hidden opacity-[0.04]"
      >
        <span className="whitespace-nowrap font-serif text-[20vw] leading-none">INDEX</span>
      </div>

      <div className="relative z-10 mx-auto max-w-4xl">
        {groups.map((group, i) => (
          <TrackGroup key={group.track} index={i + 1} group={group} onOpen={openCertificate} />
        ))}
      </div>

      <CertificateDialog
        cert={openCert}
        onOpenChange={(open) => {
          if (!open) closeCertificate();
        }}
      />
    </section>
  );
}

function TrackGroup({
  index,
  group,
  onOpen,
}: {
  index: number;
  group: CertificateGroup;
  onOpen: (slug: string, trigger: HTMLButtonElement) => void;
}) {
  return (
    <div className="mb-16 last:mb-0 md:mb-20">
      <BlurReveal>
        <div className="mb-2 flex items-baseline gap-4">
          <span className="font-mono text-xs text-[var(--world-a-accent)]">
            [{String(index).padStart(3, "0")}]
          </span>
          <h2 className="font-serif text-2xl md:text-3xl">{group.track}</h2>
          <div className="h-px flex-1 bg-[var(--world-a-border)]" />
          <span className="whitespace-nowrap font-mono text-xs uppercase text-[var(--world-a-muted)]">
            {group.certs.length} cert{group.certs.length === 1 ? "" : "s"}
          </span>
        </div>
        {group.note && (
          <p className="mb-6 font-serif text-sm text-[var(--world-a-muted)] md:text-base">
            {group.note}
          </p>
        )}
      </BlurReveal>

      <RowList certs={group.certs} onOpen={onOpen} />
    </div>
  );
}

function RowList({
  certs,
  onOpen,
}: {
  certs: Certificate[];
  onOpen: (slug: string, trigger: HTMLButtonElement) => void;
}) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.ul
      className="divide-y divide-[var(--world-a-border)] border-y border-[var(--world-a-border)]"
      initial={reducedMotion ? false : "hidden"}
      whileInView={reducedMotion ? undefined : "visible"}
      viewport={{ once: true, margin: "-60px" }}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.04 } } }}
    >
      {certs.map((cert, i) => (
        <Row key={cert.slug} index={i + 1} cert={cert} onOpen={onOpen} />
      ))}
    </motion.ul>
  );
}

function Row({
  index,
  cert,
  onOpen,
}: {
  index: number;
  cert: Certificate;
  onOpen: (slug: string, trigger: HTMLButtonElement) => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);

  return (
    <motion.li
      variants={{
        hidden: { opacity: 0, y: 12 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
      }}
    >
      <button
        ref={ref}
        type="button"
        onClick={() => ref.current && onOpen(cert.slug, ref.current)}
        className="group relative grid min-h-[44px] w-full grid-cols-[2.5rem_4rem_1fr_auto] items-start gap-3 px-2 py-4 text-left transition-colors hover:bg-[var(--world-a-surface)] focus-visible:bg-[var(--world-a-surface)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--world-a-accent)] focus-visible:-outline-offset-2 md:grid-cols-[3rem_4.5rem_1fr_auto_1.5rem] md:gap-4"
      >
        <span
          aria-hidden
          className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-[var(--world-a-accent)] transition-transform duration-300 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100"
        />
        <span className="pt-1 font-mono text-xs text-[var(--world-a-muted)]">
          {String(index).padStart(2, "0")}
        </span>
        <span className="relative h-12 w-[4.5rem] shrink-0 overflow-hidden border border-[var(--world-a-border)]">
          <Image
            src={cert.image}
            alt=""
            fill
            sizes="80px"
            className="object-cover grayscale transition-all duration-500 group-hover:scale-105 group-hover:grayscale-0 group-focus-visible:grayscale-0"
          />
        </span>
        <span className="font-serif text-[clamp(1.25rem,3vw,2.25rem)] leading-tight text-[var(--world-a-text)] transition-colors group-hover:text-[var(--world-a-accent)]">
          {cert.program}
        </span>
        <span className="hidden whitespace-nowrap pt-1 text-right font-mono text-xs text-[var(--world-a-muted)] md:block">
          {cert.issuer} · {issuedYear(cert.issuedDate)}
        </span>
        <ArrowRight
          aria-hidden
          className="mt-1 hidden h-4 w-4 text-[var(--world-a-muted)] transition-transform group-hover:translate-x-1 group-hover:text-[var(--world-a-accent)] md:block"
        />
      </button>
    </motion.li>
  );
}

function CertificateDialog({
  cert,
  onOpenChange,
}: {
  cert: Certificate | null;
  onOpenChange: (open: boolean) => void;
}) {
  const open = !!cert;
  useLenisModal(open);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton
        className="w-full max-w-2xl gap-0 rounded-none border border-[var(--world-a-border)] bg-[var(--world-a-surface)] p-0 text-[var(--world-a-text)] ring-0 sm:max-w-2xl"
      >
        {cert && (
          <div className="flex max-h-[85vh] flex-col overflow-y-auto">
            <DialogHeader className="sr-only">
              <DialogTitle>{cert.program}</DialogTitle>
              <DialogDescription>{cert.issuer}</DialogDescription>
            </DialogHeader>

            <div className="relative aspect-[4/3] w-full shrink-0 border-b border-[var(--world-a-border)] bg-[var(--world-a-bg)]">
              <Image
                src={cert.image}
                alt={cert.program}
                fill
                sizes="(max-width: 768px) 100vw, 640px"
                className="object-contain"
              />
            </div>

            <div className="flex flex-col gap-6 p-6 md:p-8">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--world-a-accent)]">
                  {cert.track ?? "Other"}
                </p>
                <h3 className="mt-2 font-serif text-2xl md:text-3xl">{cert.program}</h3>
              </div>

              <dl className="grid grid-cols-2 gap-x-6 gap-y-4 font-mono text-xs">
                <div>
                  <dt className="uppercase tracking-wide text-[var(--world-a-muted)]">Issuer</dt>
                  <dd className="mt-1 normal-case text-[var(--world-a-text)]">{cert.issuer}</dd>
                </div>
                <div>
                  <dt className="uppercase tracking-wide text-[var(--world-a-muted)]">Issued</dt>
                  <dd className="mt-1 normal-case text-[var(--world-a-text)]">
                    {cert.issuedDate}
                  </dd>
                </div>
                {cert.expiryDate && (
                  <div>
                    <dt className="uppercase tracking-wide text-[var(--world-a-muted)]">
                      Expires
                    </dt>
                    <dd className="mt-1 normal-case text-[var(--world-a-text)]">
                      {cert.expiryDate}
                    </dd>
                  </div>
                )}
                {cert.credentialId && (
                  <div>
                    <dt className="uppercase tracking-wide text-[var(--world-a-muted)]">
                      Credential ID
                    </dt>
                    <dd className="mt-1 break-all normal-case text-[var(--world-a-text)]">
                      {cert.credentialId}
                    </dd>
                  </div>
                )}
              </dl>

              <div>
                <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-[var(--world-a-muted)]">
                  What it covered
                </p>
                <ul className="flex flex-wrap gap-2">
                  {cert.skills.map((skill) => (
                    <li
                      key={skill}
                      className="border border-[var(--world-a-border)] px-3 py-1 font-mono text-xs text-[var(--world-a-text)]"
                    >
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-[var(--world-a-border)] pt-4">
                {cert.credentialUrl ? (
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 font-mono text-sm uppercase tracking-wide text-[var(--world-a-accent)] hover:underline"
                  >
                    Verify on {cert.issuer} ↗
                  </a>
                ) : (
                  <p className="font-mono text-sm text-[var(--world-a-muted)]">
                    No public credential link for this one.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
