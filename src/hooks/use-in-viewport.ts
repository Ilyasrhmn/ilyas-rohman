"use client";

import { useEffect, useState, type RefObject } from "react";

/**
 * True while the referenced element intersects the viewport.
 * Used to gate expensive render loops so they stop when scrolled away.
 */
export function useInViewport(
  ref: RefObject<HTMLElement | null>,
  options: { rootMargin?: string } = {}
): boolean {
  const { rootMargin = "200px" } = options;
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, rootMargin]);

  return inView;
}
