"use client";

import { useCallback, useSyncExternalStore } from "react";

function useMedia(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const media = window.matchMedia(query);
      media.addEventListener("change", onChange);
      return () => media.removeEventListener("change", onChange);
    },
    [query]
  );

  // This used to be useState + a setState inside an effect, which made every consumer
  // render once with a placeholder and then immediately re-render with the real value --
  // an extra render in each of the 19 components that read it, several of them on the
  // critical path. useSyncExternalStore reads the media query during render instead, so
  // there is only one render, while getServerSnapshot keeps SSR and hydration agreeing
  // (the server has no matchMedia). Matches the pattern already used by useMediaQuery.
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false
  );
}

export const useReducedMotion = () => useMedia("(prefers-reduced-motion: reduce)");
export const useIsTouch = () => useMedia("(pointer: coarse)");
