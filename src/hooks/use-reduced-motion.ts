"use client";

import { useEffect, useState } from "react";

function useMedia(query: string): boolean {
  const [match, setMatch] = useState(false);

  useEffect(() => {
    const m = window.matchMedia(query);
    setMatch(m.matches);
    const on = () => setMatch(m.matches);
    m.addEventListener("change", on);
    return () => m.removeEventListener("change", on);
  }, [query]);

  return match;
}

export const useReducedMotion = () => useMedia("(prefers-reduced-motion: reduce)");
export const useIsTouch = () => useMedia("(pointer: coarse)");
