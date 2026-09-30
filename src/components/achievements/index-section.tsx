"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import type { Certificate } from "@/types";
import { certificates } from "@/data/certificates";
import { BlurReveal } from "@/components/effects/blur-reveal";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { CertificateDetail } from "./certificate-detail";
import { GalleryCard } from "./gallery-card";
import { flyCertificateImage, type ImageFlight } from "./image-flight";
import { groupByTrack } from "./data";

type Source = { cert: Certificate; trigger: HTMLButtonElement; image: HTMLElement };

export function AchievementsIndex() {
  const orderedCerts = useMemo(() => groupByTrack(certificates).flatMap((group) => group.certs), []);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const reducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const detailImageRef = useRef<HTMLDivElement>(null);
  const sourceRef = useRef<Source | null>(null);
  const flightRef = useRef<ImageFlight | null>(null);
  const shouldOpenFlightRef = useRef(false);
  const [imageHidden, setImageHidden] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [activeSourceSlug, setActiveSourceSlug] = useState<string | null>(null);

  const openSlug = searchParams.get("cert");
  const openCert = certificates.find((cert) => cert.slug === openSlug) ?? null;

  const clearCertificate = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("cert");
    const query = params.toString();
    const href = query ? `${pathname}?${query}` : pathname;
    window.history.pushState(null, "", href);
  }, [pathname, searchParams]);

  const openCertificate = useCallback((cert: Certificate, trigger: HTMLButtonElement, image: HTMLElement) => {
    flightRef.current?.cancel();
    sourceRef.current = { cert, trigger, image };
    shouldOpenFlightRef.current = true;
    setActiveSourceSlug(cert.slug);
    setImageHidden(false);
    const params = new URLSearchParams(searchParams.toString());
    params.set("cert", cert.slug);
    window.history.pushState(null, "", `${pathname}?${params.toString()}`);
  }, [pathname, searchParams]);

  const closeCertificate = useCallback(() => {
    if (!openCert || isClosing) return;
    const source = sourceRef.current;
    const detailImage = detailImageRef.current;
    const sourceRect = source?.image.getBoundingClientRect();
    const canFlyBack = !reducedMotion && source?.cert.slug === openCert.slug && source.image.isConnected && detailImage && sourceRect && sourceRect.bottom > 0 && sourceRect.top < window.innerHeight;

    if (!canFlyBack || !source || !detailImage || !sourceRect) {
      clearCertificate();
      requestAnimationFrame(() => sourceRef.current?.trigger.isConnected && sourceRef.current.trigger.focus());
      return;
    }

    setIsClosing(true);
    setImageHidden(true);
    flightRef.current?.cancel();
    const flight = flyCertificateImage({ src: openCert.image, from: detailImage.getBoundingClientRect(), to: sourceRect, durationMs: 560 });
    flightRef.current = flight;
    flight.finished.then(() => {
      if (flightRef.current !== flight) return;
      flightRef.current = null;
      setImageHidden(false);
      setIsClosing(false);
      clearCertificate();
      requestAnimationFrame(() => source.trigger.isConnected && source.trigger.focus());
    });
  }, [clearCertificate, isClosing, openCert, reducedMotion]);

  useEffect(() => {
    if (!openCert) {
      flightRef.current?.cancel();
      flightRef.current = null;
      shouldOpenFlightRef.current = false;
      const frame = requestAnimationFrame(() => {
        setImageHidden(false);
        setIsClosing(false);
        setActiveSourceSlug(null);
      });
      return () => cancelAnimationFrame(frame);
    }
    if (!shouldOpenFlightRef.current || reducedMotion || isClosing) return;
    const source = sourceRef.current;
    if (!source || source.cert.slug !== openCert.slug) return;
    const frame = requestAnimationFrame(() => {
      const detailImage = detailImageRef.current;
      if (!detailImage || !source.image.isConnected) return;
      const from = source.image.getBoundingClientRect();
      const to = detailImage.getBoundingClientRect();
      if (from.bottom <= 0 || from.top >= window.innerHeight) return;
      shouldOpenFlightRef.current = false;
      setImageHidden(true);
      flightRef.current?.cancel();
      const flight = flyCertificateImage({ src: openCert.image, from, to, durationMs: 720 });
      flightRef.current = flight;
      flight.finished.then(() => {
        if (flightRef.current !== flight) return;
        flightRef.current = null;
        setImageHidden(false);
      });
    });
    return () => cancelAnimationFrame(frame);
  }, [isClosing, openCert, reducedMotion]);

  useEffect(() => {
    const syncNavTheme = () => {
      const section = sectionRef.current;
      if (section && section.getBoundingClientRect().top < window.innerHeight * 0.72) document.body.setAttribute("data-nav-theme", "world-b");
    };
    syncNavTheme();
    window.addEventListener("scroll", syncNavTheme, { passive: true });
    window.addEventListener("resize", syncNavTheme);
    return () => {
      window.removeEventListener("scroll", syncNavTheme);
      window.removeEventListener("resize", syncNavTheme);
    };
  }, []);

  useEffect(() => () => flightRef.current?.cancel(), []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-[var(--world-b-bg)] px-6 pb-28 pt-28 text-[var(--world-b-text)] sm:px-10 md:pb-40 md:pt-36">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-[var(--world-a-bg)] to-[var(--world-b-bg)]" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-28 flex justify-center overflow-hidden opacity-[0.035]"><span className="whitespace-nowrap font-serif text-[20vw] leading-none">COLLECTION</span></div>

      <div className="relative mx-auto max-w-6xl">
        <BlurReveal>
          <div className="mb-20 max-w-xl pt-12 md:mb-28 md:pt-16">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-[var(--world-b-accent)]">The collection · {String(orderedCerts.length).padStart(2, "0")} certificates</p>
            <h2 className="mt-4 font-serif text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.95]">Things I learned, kept close.</h2>
            <p className="mt-5 max-w-[50ch] font-serif text-base leading-relaxed text-[var(--world-b-muted)] md:text-lg">Each certificate marks a focused stretch of work. Open one to see the skills and credential behind it.</p>
          </div>
        </BlurReveal>
        <ol data-certificate-gallery className="flex flex-col gap-20 sm:gap-28 md:gap-36">
          {orderedCerts.map((cert, index) => <GalleryCard key={cert.slug} cert={cert} index={index} total={orderedCerts.length} hidden={imageHidden && activeSourceSlug === cert.slug} onOpen={openCertificate} />)}
        </ol>
      </div>
      <CertificateDetail cert={openCert} imageRef={detailImageRef} imageHidden={imageHidden} onClose={closeCertificate} />
    </section>
  );
}
