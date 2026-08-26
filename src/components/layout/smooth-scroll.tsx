"use client";
import { createContext, useContext, useEffect, useState } from "react";
import Lenis from "lenis";
import { registerGsap, gsap, ScrollTrigger } from "@/lib/gsap";

const LenisContext = createContext<Lenis | null>(null);

export const useLenis = () => useContext(LenisContext);

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    const lenisInstance = new Lenis({
      lerp: 0.1,
      duration: 1.5,
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
    });
    setLenis(lenisInstance);
    (window as unknown as { lenis?: Lenis }).lenis = lenisInstance;

    registerGsap();
    lenisInstance.on("scroll", ScrollTrigger.update);

    const onTick = (time: number) => lenisInstance.raf(time * 1000);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    // Every ScrollTrigger on this page (ScrollScale's zoom, achievements' pinned
    // sections, the radial timeline) computes its start/end/scale from the DOM's
    // layout at the moment it's first measured. If that first measurement happens
    // before fonts have swapped in or other async content has finished shifting
    // page height, the measurement is wrong and nothing ever corrects it again
    // during normal scrolling (confirmed directly: ScrollScale's zoom cache can
    // get poisoned by an early measurement, producing a shrink-to-invisible
    // instead of the intended 100x+ zoom -- see docs/superpowers/plans/
    // 2026-08-26-scrollscale-stale-cache-fix.md). Refresh once fonts are
    // confirmed loaded, and again on any further layout-height change, so every
    // trigger's measurements are taken against final, settled layout.
    let refreshTimer: ReturnType<typeof setTimeout> | undefined;
    const scheduleRefresh = () => {
      clearTimeout(refreshTimer);
      refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 150);
    };

    document.fonts?.ready?.then(scheduleRefresh);

    const resizeObserver = new ResizeObserver(scheduleRefresh);
    resizeObserver.observe(document.body);

    return () => {
      clearTimeout(refreshTimer);
      resizeObserver.disconnect();
      gsap.ticker.remove(onTick);
      lenisInstance.destroy();
      setLenis(null);
    };
  }, []);

  return (
    <LenisContext.Provider value={lenis}>
      {children}
    </LenisContext.Provider>
  );
}
