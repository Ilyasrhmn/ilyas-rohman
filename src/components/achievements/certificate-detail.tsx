"use client";

import { type RefObject } from "react";
import Image from "next/image";
import type { Certificate } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLenisModal } from "@/hooks/use-lenis-modal";

type CertificateDetailProps = {
  cert: Certificate | null;
  imageRef: RefObject<HTMLDivElement | null>;
  imageHidden: boolean;
  onClose: () => void;
};

export function CertificateDetail({ cert, imageRef, imageHidden, onClose }: CertificateDetailProps) {
  const open = Boolean(cert);
  useLenisModal(open);

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent
        showCloseButton
        className="max-h-[calc(100dvh-2rem)] w-full max-w-[calc(100%-2rem)] gap-0 overflow-y-auto rounded-none border border-[var(--world-b-border)] bg-[var(--world-b-bg)] p-0 text-[var(--world-b-text)] ring-0 sm:max-w-5xl"
      >
        {cert && (
          <div className="grid min-h-0 md:grid-cols-[minmax(0,1.25fr)_minmax(18rem,0.75fr)]">
            <DialogHeader className="sr-only">
              <DialogTitle>{cert.program}</DialogTitle>
              <DialogDescription>{cert.issuer}</DialogDescription>
            </DialogHeader>

            <div
              ref={imageRef}
              data-certificate-detail-image
              className="relative aspect-[4/3] min-h-0 border-b border-[var(--world-b-border)] bg-[var(--world-b-surface)] md:border-b-0 md:border-r"
            >
              <Image
                src={cert.image}
                alt={`${cert.program} certificate from ${cert.issuer}`}
                fill
                sizes="(max-width: 768px) calc(100vw - 2rem), 720px"
                className={`object-contain transition-opacity duration-150 ${imageHidden ? "opacity-0" : "opacity-100"}`}
              />
            </div>

            <div className="flex min-h-0 flex-col gap-6 p-6 pt-14 sm:p-8 sm:pt-14">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--world-b-accent)]">
                  {cert.track ?? "Other"}
                </p>
                <h3 className="mt-3 font-serif text-3xl leading-tight sm:text-4xl">{cert.program}</h3>
              </div>

              <dl className="grid grid-cols-2 gap-x-6 gap-y-4 font-mono text-xs">
                <div>
                  <dt className="uppercase tracking-wide text-[var(--world-b-muted)]">Issuer</dt>
                  <dd className="mt-1 normal-case text-[var(--world-b-text)]">{cert.issuer}</dd>
                </div>
                <div>
                  <dt className="uppercase tracking-wide text-[var(--world-b-muted)]">Issued</dt>
                  <dd className="mt-1 normal-case text-[var(--world-b-text)]">{cert.issuedDate}</dd>
                </div>
                {cert.expiryDate && (
                  <div>
                    <dt className="uppercase tracking-wide text-[var(--world-b-muted)]">Expires</dt>
                    <dd className="mt-1 normal-case text-[var(--world-b-text)]">{cert.expiryDate}</dd>
                  </div>
                )}
                {cert.credentialId && (
                  <div>
                    <dt className="uppercase tracking-wide text-[var(--world-b-muted)]">Credential ID</dt>
                    <dd className="mt-1 break-all normal-case text-[var(--world-b-text)]">{cert.credentialId}</dd>
                  </div>
                )}
              </dl>

              <div>
                <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-[var(--world-b-muted)]">What it covered</p>
                <ul className="flex flex-wrap gap-2">
                  {cert.skills.map((skill) => (
                    <li key={skill} className="border border-[var(--world-b-border)] px-3 py-1 font-mono text-xs text-[var(--world-b-text)]">
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-auto border-t border-[var(--world-b-border)] pt-4">
                {cert.credentialUrl ? (
                  <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center font-mono text-sm uppercase tracking-wide text-[var(--world-b-accent)] hover:underline">
                    Verify on {cert.issuer} ↗
                  </a>
                ) : (
                  <p className="font-mono text-sm text-[var(--world-b-muted)]">No public credential link for this one.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
