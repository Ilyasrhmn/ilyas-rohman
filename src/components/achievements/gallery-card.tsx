"use client";

import { useRef } from "react";
import Image from "next/image";
import type { Certificate } from "@/types";
import { galleryContent } from "./gallery-content";

type GalleryCardProps = {
  cert: Certificate;
  index: number;
  onOpen: (cert: Certificate, trigger: HTMLButtonElement, image: HTMLElement) => void;
};

export function GalleryCard({ cert, index, onOpen }: GalleryCardProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const imageRef = useRef<HTMLSpanElement>(null);

  return (
    <li className="certificate-gallery__slide" data-certificate-slide>
      <button
        ref={buttonRef}
        type="button"
        data-certificate-card
        className="certificate-gallery__button focus-visible:outline-2 focus-visible:outline-[var(--world-b-accent)]"
        aria-label={`Open ${cert.program} certificate`}
        onClick={() => {
          if (buttonRef.current && imageRef.current) onOpen(cert, buttonRef.current, imageRef.current);
        }}
      >
        <span ref={imageRef} className="certificate-gallery__image" data-certificate-image>
          <Image src={cert.image} alt="" fill sizes="(max-width: 767px) 86vw, (max-width: 1199px) 72vw, 48vw" loading={index < 2 ? "eager" : "lazy"} />
        </span>
        <span className="certificate-gallery__caption" data-certificate-caption>{galleryContent[index].title}</span>
      </button>
    </li>
  );
}
