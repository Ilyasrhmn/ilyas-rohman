"use client";

import { forwardRef, useRef, type RefObject } from "react";
import Image from "next/image";
import type { Certificate } from "@/types";
import { issuedYear } from "./data";

type GalleryCardProps = {
  cert: Certificate;
  index: number;
  total: number;
  hidden?: boolean;
  onOpen: (cert: Certificate, trigger: HTMLButtonElement, image: HTMLElement) => void;
};

function isFourByThree(cert: Certificate) {
  return cert.slug === "problem-solving-basic";
}

export const GalleryCard = forwardRef<HTMLLIElement, GalleryCardProps>(function GalleryCard(
  { cert, index, total, hidden = false, onOpen },
  ref
) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const imageRef = useRef<HTMLSpanElement>(null);
  const alignment = index % 2 === 0 ? "self-start md:ml-[8%]" : "self-end md:mr-[8%]";

  return (
    <li ref={ref} className={`flex w-full ${alignment}`}>
      <button
        ref={buttonRef}
        type="button"
        data-certificate-card
        onClick={() => {
          if (buttonRef.current && imageRef.current) onOpen(cert, buttonRef.current, imageRef.current);
        }}
        className="group w-[min(88vw,32rem)] text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--world-b-accent)] md:w-[min(52vw,34rem)]"
        aria-label={`Open certificate: ${cert.program}, ${cert.track ?? "Other"}`}
      >
        <span
          ref={imageRef}
          data-certificate-image
          className={`relative block overflow-hidden border border-[var(--world-b-border)] bg-[var(--world-b-surface)] ${
            isFourByThree(cert) ? "aspect-[4/3]" : "aspect-[3508/2480]"
          }`}
        >
          <Image
            src={cert.image}
            alt=""
            fill
            sizes="(max-width: 639px) 88vw, (max-width: 1023px) 52vw, 544px"
            className={`object-contain transition duration-500 ease-out group-hover:scale-[1.015] group-focus-visible:scale-[1.015] ${
              hidden ? "opacity-0" : "opacity-100"
            }`}
          />
          <span className="pointer-events-none absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-[var(--world-b-accent)] transition-transform duration-500 group-hover:scale-x-100 group-focus-visible:scale-x-100" />
        </span>

        <span className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--world-b-muted)] sm:text-xs">
          <span className="row-span-3 pt-0.5 text-[var(--world-b-accent)]">
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
          <span>{cert.track ?? "Other"}</span>
          <span className="font-serif text-xl normal-case tracking-normal text-[var(--world-b-text)] transition-colors group-hover:text-[var(--world-b-accent)] sm:text-2xl">
            {cert.program}
          </span>
          <span>{cert.issuer} · {issuedYear(cert.issuedDate)}</span>
        </span>
      </button>
    </li>
  );
});

export type GalleryCardImageRef = RefObject<HTMLElement | null>;
