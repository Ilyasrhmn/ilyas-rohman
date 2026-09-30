"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { gsap } from "gsap";
import { Flip } from "gsap/Flip";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Certificate } from "@/types";
import { certificates } from "@/data/certificates";
import { useLenisModal } from "@/hooks/use-lenis-modal";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { CertificateDetail } from "./certificate-detail";
import { GalleryCard } from "./gallery-card";
import { groupByTrack } from "./data";
import "./gallery.css";

gsap.registerPlugin(Flip, SplitText, ScrollTrigger);

type Source = { cert: Certificate; trigger: HTMLButtonElement; image: HTMLElement };
type Phase = "closed" | "opening" | "open" | "closing";

export function AchievementsIndex() {
  const orderedCerts = useMemo(() => groupByTrack(certificates).flatMap((group) => group.certs), []);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const reducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const galleryRef = useRef<HTMLOListElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const sourceRef = useRef<Source | null>(null);
  const phaseRef = useRef<Phase>("closed");
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const splitRef = useRef<SplitText | null>(null);
  const [selected, setSelected] = useState<Certificate | null>(() =>
    certificates.find((cert) => cert.slug === searchParams.get("cert")) ?? null
  );
  const selectedIndex = selected ? orderedCerts.findIndex((cert) => cert.slug === selected.slug) : -1;
  useLenisModal(Boolean(selected));

  const updateUrl = useCallback((slug: string | null) => {
    const params = new URLSearchParams(window.location.search);
    if (slug) params.set("cert", slug);
    else params.delete("cert");
    window.history.pushState(null, "", `${pathname}${params.size ? `?${params}` : ""}`);
  }, [pathname]);

  const reset = useCallback(() => {
    timelineRef.current?.kill();
    timelineRef.current = null;
    splitRef.current?.revert();
    splitRef.current = null;
    const source = sourceRef.current;
    const overlay = overlayRef.current;
    if (source?.image.isConnected) {
      delete source.image.dataset.flipId;
      gsap.set(source.image, { clearProps: "all" });
    }
    if (source?.trigger.isConnected) {
      gsap.set(source.trigger.querySelector("[data-certificate-caption]"), { clearProps: "opacity,visibility" });
      source.trigger.focus({ preventScroll: true });
    }
    if (galleryRef.current) gsap.set(galleryRef.current.querySelectorAll("[data-certificate-slide]"), { clearProps: "opacity,visibility" });
    if (overlay) gsap.set(overlay, { display: "none" });
    if (previewRef.current) gsap.set(previewRef.current, { clearProps: "transform,top,left,width,height,position" });
    phaseRef.current = "closed";
    sourceRef.current = null;
    setSelected(null);
  }, []);

  const closeCertificate = useCallback((fromHistory = false) => {
    if (phaseRef.current === "closing" || phaseRef.current === "closed") return;
    if (!fromHistory) updateUrl(null);
    phaseRef.current = "closing";
    const source = sourceRef.current;
    const preview = previewRef.current;
    const overlay = overlayRef.current;
    const canFlip = !reducedMotion && source?.image.isConnected && preview && overlay;

    if (!canFlip || !source || !preview || !overlay) {
      reset();
      return;
    }
    if (timelineRef.current?.isActive()) {
      timelineRef.current.eventCallback("onReverseComplete", reset);
      timelineRef.current.reverse();
      return;
    }
    timelineRef.current?.kill();
    const others = Array.from(galleryRef.current?.querySelectorAll("[data-certificate-slide]") ?? []).filter((slide) => slide !== source.trigger.closest("[data-certificate-slide]"));
    const caption = source.trigger.querySelector("[data-certificate-caption]");
    const previewImg = preview.querySelector("img");
    const fit = Flip.fit(preview, source.image, { duration: 1, ease: "power3.inOut", absolute: true });
    timelineRef.current = gsap.timeline({ onComplete: reset })
      .to(splitRef.current?.lines ?? [], { autoAlpha: 0, duration: 0.4, stagger: 0.04, ease: "power1.out" }, 0)
      .to(previewImg, { scale: 1.2, duration: 1, ease: "power3.inOut" }, 0)
      .to(others, { autoAlpha: 1, duration: 0.5, ease: "power2.out" }, 0.5)
      .to(caption, { autoAlpha: 1, duration: 0.4, ease: "power2.out" }, 0.6);
    if (fit) timelineRef.current.add(fit as gsap.core.Tween, 0);
  }, [reducedMotion, reset, updateUrl]);

  const openCertificate = useCallback((cert: Certificate, trigger: HTMLButtonElement, image: HTMLElement) => {
    if (phaseRef.current !== "closed") return;
    sourceRef.current = { cert, trigger, image };
    phaseRef.current = "opening";
    updateUrl(cert.slug);
    setSelected(cert);
  }, [updateUrl]);

  useEffect(() => {
    if (!selected || !overlayRef.current || !previewRef.current || phaseRef.current !== "opening") return;
    const overlay = overlayRef.current;
    const preview = previewRef.current;
    const source = sourceRef.current;
    const previewImg = preview.querySelector("img");
    let cancelled = false;

    const animate = () => {
      if (cancelled || phaseRef.current !== "opening") return;
      if (!source || reducedMotion || !source.image.isConnected) {
        gsap.set(overlay, { display: "block" });
        phaseRef.current = "open";
        overlay.querySelector("button")?.focus();
        return;
      }
      source.image.dataset.flipId = "preview";
      const state = Flip.getState(source.image);
      gsap.set(overlay, { display: "block" });
      overlay.querySelector("button")?.focus({ preventScroll: true });
      gsap.killTweensOf(source.image);
      gsap.set(source.image, { autoAlpha: 0 });
      const caption = source.trigger.querySelector("[data-certificate-caption]");
      const others = Array.from(galleryRef.current?.querySelectorAll("[data-certificate-slide]") ?? []).filter((slide) => slide !== source.trigger.closest("[data-certificate-slide]"));
      splitRef.current = new SplitText(overlay.querySelectorAll(".certificate-content__back, .certificate-content__group > *"), { type: "lines,chars", charsClass: "certificate-char" });
      timelineRef.current = gsap.timeline({
        onComplete: () => { phaseRef.current = "open"; overlay.querySelector("button")?.focus(); },
        onReverseComplete: reset,
      })
        .to(others, { autoAlpha: 0, duration: 0.5, ease: "power2.out" }, 0)
        .to(caption, { autoAlpha: 0, duration: 0.3, ease: "power2.out" }, 0)
        .add(Flip.from(state, { targets: preview, duration: 1.2, ease: "power4.inOut", absolute: true }), 0)
        .to(previewImg, { scale: 1, duration: 1.2, ease: "power4.inOut" }, 0);
      splitRef.current.lines.forEach((line, index) => {
        timelineRef.current?.fromTo(line.querySelectorAll(".certificate-char"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 1, ease: "power3.out", stagger: 0.01 }, 0.8 + index * 0.06);
      });
    };
    if (previewImg?.complete) animate();
    else previewImg?.addEventListener("load", animate, { once: true });
    return () => { cancelled = true; previewImg?.removeEventListener("load", animate); };
  }, [selected, reducedMotion, reset]);

  useEffect(() => {
    if (selected && phaseRef.current === "closed" && overlayRef.current) {
      gsap.set(overlayRef.current, { display: "block" });
      phaseRef.current = "open";
    }
  }, [selected]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && phaseRef.current !== "closed") closeCertificate();
      if (event.key === "Tab" && phaseRef.current !== "closed" && overlayRef.current) {
        const targets = Array.from(overlayRef.current.querySelectorAll<HTMLElement>("button, a[href]"));
        const first = targets[0];
        const last = targets[targets.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeCertificate]);

  useEffect(() => {
    const onPopState = () => {
      const cert = certificates.find((item) => item.slug === new URLSearchParams(window.location.search).get("cert")) ?? null;
      if (!cert && phaseRef.current !== "closed") closeCertificate(true);
      else if (cert && phaseRef.current === "closed") setSelected(cert);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [closeCertificate]);

  useEffect(() => {
    const gallery = galleryRef.current;
    if (!gallery || reducedMotion) return;
    const speeds = [1.3, 0.8, 1.15, 0.7, 1.25, 0.85];
    const splits: SplitText[] = [];
    const ctx = gsap.context(() => {
      Array.from(gallery.querySelectorAll<HTMLElement>("[data-certificate-slide]")).forEach((slide, index) => {
        const wrapper = slide.querySelector<HTMLElement>("[data-certificate-image]");
        const caption = slide.querySelector<HTMLElement>("[data-certificate-caption]");
        if (!wrapper || !caption) return;
        const split = new SplitText(caption, { type: "chars" });
        splits.push(split);
        const show = () => {
          gsap.to(wrapper, { autoAlpha: 1, duration: 1, ease: "power2.out", overwrite: true });
          gsap.to(split.chars, { autoAlpha: 1, duration: 0.4, ease: "none", stagger: 0.025, delay: 0.2, overwrite: true });
        };
        const hide = () => {
          if (phaseRef.current !== "closed") return;
          gsap.set(wrapper, { autoAlpha: 0, overwrite: true });
          gsap.set(split.chars, { autoAlpha: 0, overwrite: true });
        };
        gsap.set([wrapper, ...split.chars], { autoAlpha: 0 });
        ScrollTrigger.create({ trigger: slide, start: "top 95%", end: "bottom 5%", onEnter: show, onEnterBack: show, onLeave: hide, onLeaveBack: hide });
        // Source's per-slide speed multipliers, adapted to finite document scroll.
        gsap.fromTo(slide, { y: -(speeds[index % speeds.length] - 1) * 110 }, { y: (speeds[index % speeds.length] - 1) * 110, ease: "none", scrollTrigger: { trigger: slide, start: "top bottom", end: "bottom top", scrub: 0.75, invalidateOnRefresh: true } });
      });
    }, gallery);
    return () => { ctx.revert(); splits.forEach((split) => split.revert()); };
  }, [reducedMotion]);

  useEffect(() => {
    const sync = () => {
      if (sectionRef.current && sectionRef.current.getBoundingClientRect().top < window.innerHeight * .72) document.body.setAttribute("data-nav-theme", "world-b");
    };
    sync();
    window.addEventListener("scroll", sync, { passive: true });
    return () => window.removeEventListener("scroll", sync);
  }, []);

  useEffect(() => () => { timelineRef.current?.kill(); splitRef.current?.revert(); }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-[#eaeeed] text-[var(--world-b-text)]">
      <ol ref={galleryRef} data-certificate-gallery className="certificate-gallery">
        {orderedCerts.map((cert, index) => <GalleryCard key={cert.slug} cert={cert} index={index} onOpen={openCertificate} />)}
      </ol>
      <CertificateDetail cert={selected} index={selectedIndex < 0 ? 0 : selectedIndex} rootRef={overlayRef} previewRef={previewRef} onClose={closeCertificate} />
    </section>
  );
}
