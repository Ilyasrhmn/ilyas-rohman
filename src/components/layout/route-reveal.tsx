"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
  type ReactNode,
} from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

// Must match the reveal-in / reveal-fade / reveal-out animations in globals.css.
const FORWARD_COVER_MS = 800; // disc grows out of the link and covers the screen
const FORWARD_FADE_MS = 250; // then the cover dissolves onto the destination
const BACK_MS = 650;

// "forward" = going deeper (home -> projects -> a project). The dark disc grows out of the
// clicked link and covers the page being left, exactly like MENU grows out of the MENU
// button. The route is swapped once that cover is complete -- swapping any earlier would
// put the destination on screen before the transition had played over it.
// "back" = returning the way you came. The route is swapped immediately, under a disc that
// already covers the screen, and the disc then retracts toward the button to uncover it --
// the same motion CLOSE uses on the menu.
export type RevealDirection = "forward" | "back";

export type RevealOrigin = { x: number; y: number };

type RevealFn = (
  href: string,
  origin: RevealOrigin,
  direction: RevealDirection
) => void;

const RouteRevealContext = createContext<RevealFn | null>(null);

export const useRouteReveal = () => useContext(RouteRevealContext);

/**
 * The exact point the user clicked, in viewport coordinates -- the same space the overlay
 * (position: fixed, inset-0) is laid out in, so no scroll or element-local offset has to be
 * reconciled. Keyboard activation fires a click carrying no pointer position (detail === 0,
 * clientX/Y both 0), which would otherwise anchor every keyboard navigation to the top-left
 * corner, so that case falls back to the middle of the element that was activated.
 */
export function originFromEvent(
  e: MouseEvent<HTMLElement>,
  fallbackEl: HTMLElement | null
): RevealOrigin {
  if (e.detail !== 0) return { x: e.clientX, y: e.clientY };
  if (fallbackEl) {
    const r = fallbackEl.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }
  return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
}

export function RouteReveal({ children }: { children: ReactNode }) {
  const [playing, setPlaying] = useState(false);
  const [direction, setDirection] = useState<RevealDirection>("forward");
  const [origin, setOrigin] = useState({ x: 0, y: 0 });
  // The forward destination, held until the cover animation has finished.
  const [pending, setPending] = useState<string | null>(null);
  const router = useRouter();
  const reduced = useReducedMotion();
  // A ref, not state, so revealTo stays referentially stable and doesn't churn the
  // context value while a transition is running.
  const busy = useRef(false);
  // Where each still-open navigation was entered from. Going forward pushes the click
  // point; going back pops it, so a page always closes toward the exact point it was
  // opened from rather than toward wherever the back link happens to sit. It is a stack
  // rather than a single value so nesting unwinds correctly: home -> projects -> a
  // project, then back, back, returns to the project link's point and then the "View my
  // work" point, in that order. This lives in a ref on a provider above <main>, so it
  // survives the route change it describes.
  const originStack = useRef<RevealOrigin[]>([]);

  const revealTo = useCallback<RevealFn>(
    (href, point, dir) => {
      if (busy.current) return;
      if (reduced) {
        router.push(href);
        return;
      }
      busy.current = true;
      if (dir === "forward") {
        originStack.current.push(point);
        setOrigin(point);
      } else {
        // Landing here directly (deep link, refresh, browser back) leaves nothing to pop,
        // so the back link's own click point is the only sensible anchor.
        setOrigin(originStack.current.pop() ?? point);
      }
      setDirection(dir);
      setPlaying(true);
      setPending(dir === "forward" ? href : null);
      // Going back, the disc already covers the screen on its very first frame, so the
      // swap can happen right now and be hidden by it. Going forward the disc starts at
      // nothing, so the swap has to wait until it has covered (see the effect below).
      if (dir === "back") router.push(href);
    },
    [reduced, router]
  );

  // Forward only: swap the route once the disc has finished covering the screen.
  useEffect(() => {
    if (!pending) return;
    const id = setTimeout(() => router.push(pending), FORWARD_COVER_MS);
    return () => clearTimeout(id);
  }, [pending, router]);

  // One shape animation per navigation: when it has played out, drop the overlay.
  useEffect(() => {
    if (!playing) return;
    const id = setTimeout(
      () => {
        busy.current = false;
        setPending(null);
        setPlaying(false);
      },
      direction === "forward" ? FORWARD_COVER_MS + FORWARD_FADE_MS : BACK_MS
    );
    return () => clearTimeout(id);
  }, [playing, direction]);

  return (
    <RouteRevealContext.Provider value={revealTo}>
      {children}
      {playing && (
        <div
          aria-hidden
          data-reveal={direction === "forward" ? "enter" : "out"}
          style={
            {
              "--reveal-ox": `${origin.x}px`,
              "--reveal-oy": `${origin.y}px`,
            } as CSSProperties
          }
          // Above the navbar (z-100) and the menu overlay (z-200) so nothing pokes
          // through mid-transition.
          className="reveal-layer pointer-events-none fixed inset-0 z-[300] bg-[var(--world-a-bg)]"
        />
      )}
    </RouteRevealContext.Provider>
  );
}

export function RevealLink({
  href,
  className,
  style,
  children,
  onClick,
  direction = "forward",
}: {
  href: string;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
  onClick?: () => void;
  direction?: RevealDirection;
}) {
  const reveal = useRouteReveal();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.();
    // Leave modified and non-primary clicks to the browser: ctrl/cmd/shift/alt click and
    // middle click should still open a new tab rather than animate this one.
    if (!reveal || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    reveal(href, originFromEvent(e, e.currentTarget), direction);
  };

  return (
    <Link href={href} className={className} style={style} onClick={handleClick}>
      {children}
    </Link>
  );
}
