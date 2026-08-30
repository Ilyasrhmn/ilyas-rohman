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

// Must match the reveal-open / reveal-out animations in globals.css.
const FORWARD_MS = 800;
const BACK_MS = 650;

// "forward" = going deeper (home -> projects -> a project). The dark layer opens a hole
// that irises the destination into view from the click point.
// "back" = returning the way you came. The dark layer is a disc that retracts toward the
// button, uncovering the page behind it -- the same motion CLOSE uses on the menu.
export type RevealDirection = "forward" | "back";

type RevealFn = (
  href: string,
  origin: HTMLElement | null,
  direction: RevealDirection
) => void;

const RouteRevealContext = createContext<RevealFn | null>(null);

export const useRouteReveal = () => useContext(RouteRevealContext);

const centerOf = (el: HTMLElement | null) => {
  if (!el) return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
};

export function RouteReveal({ children }: { children: ReactNode }) {
  const [playing, setPlaying] = useState(false);
  const [direction, setDirection] = useState<RevealDirection>("forward");
  const [origin, setOrigin] = useState({ x: 0, y: 0 });
  const router = useRouter();
  const reduced = useReducedMotion();
  // A ref, not state, so revealTo stays referentially stable and doesn't churn the
  // context value while a transition is running.
  const busy = useRef(false);

  const revealTo = useCallback<RevealFn>(
    (href, el, dir) => {
      if (busy.current) return;
      if (reduced) {
        router.push(href);
        return;
      }
      busy.current = true;
      setOrigin(centerOf(el));
      setDirection(dir);
      setPlaying(true);
      // Navigate straight away rather than after the animation. The overlay already
      // hides the swap (a forward transition starts fully dark, a back transition starts
      // as a full-screen disc), so the destination is in place by the time the animation
      // uncovers it -- which is what lets a single animation finish the whole navigation
      // instead of needing a second one to undo a cover.
      router.push(href);
    },
    [reduced, router]
  );

  // One animation per navigation: when it has played out, drop the overlay. There is no
  // second phase and nothing waits on the route -- if navigation is slow the destination
  // simply appears under an overlay that is already on its way out.
  useEffect(() => {
    if (!playing) return;
    const id = setTimeout(
      () => {
        busy.current = false;
        setPlaying(false);
      },
      direction === "forward" ? FORWARD_MS : BACK_MS
    );
    return () => clearTimeout(id);
  }, [playing, direction]);

  return (
    <RouteRevealContext.Provider value={revealTo}>
      {children}
      {playing && (
        <div
          aria-hidden
          data-reveal={direction === "forward" ? "open" : "out"}
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
    reveal(href, e.currentTarget, direction);
  };

  return (
    <Link href={href} className={className} style={style} onClick={handleClick}>
      {children}
    </Link>
  );
}
