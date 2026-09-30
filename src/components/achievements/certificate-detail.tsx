"use client";

import { type RefObject } from "react";
import Image from "next/image";
import type { Certificate } from "@/types";
import { galleryContent } from "./gallery-content";

type Props = {
  cert: Certificate | null;
  index: number;
  rootRef: RefObject<HTMLDivElement | null>;
  previewRef: RefObject<HTMLDivElement | null>;
  onClose: () => void;
};

export function CertificateDetail({ cert, index, rootRef, previewRef, onClose }: Props) {
  return (
    <div ref={rootRef} className="certificate-content" role={cert ? "dialog" : undefined} aria-modal={cert ? "true" : undefined} aria-label={cert ? galleryContent[index].title : undefined} data-certificate-detail aria-hidden={!cert}>
      {cert && (
        <>
          <div ref={previewRef} className="certificate-content__preview" data-certificate-detail-image data-flip-id="preview">
            <Image src={cert.image} alt={`${cert.program} certificate from ${cert.issuer}`} fill sizes="(max-width: 767px) 100vw, 60vw" priority />
          </div>
          <div className="certificate-content__copy">
            <button type="button" onClick={() => onClose()} className="certificate-content__back focus-visible:outline-2">← back [ESC]</button>
            <div className="certificate-content__group">
              <h2 className="certificate-content__title">{galleryContent[index].title}</h2>
              <p className="certificate-content__description">{galleryContent[index].description}</p>
              {cert.credentialUrl && <a className="certificate-content__verify" href={cert.credentialUrl} target="_blank" rel="noopener noreferrer">Verify {cert.program} ↗</a>}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
