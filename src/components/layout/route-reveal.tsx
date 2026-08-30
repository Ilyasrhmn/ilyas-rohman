"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

// Must match the reveal-in / reveal-out animations in globals.css.
const COVER_MS = 800;
const UNCOVER_MS = 650;
// Give the freshly-committed route a beat to paint before we uncover it.
const SETTLE_MS = 80;
// Never leave the screen covered if a navigation stalls or fails outright.
const NAV_FALLBACK_MS = 1500;

type Phase = "idle" | "covering" | "uncovering";
type RevealFn = (href: string, origin: HTMLElement | null) => void;

const RouteRevealContext = createContext<RevealFn | null>(null);

export const useRouteReveal = () => useContext(RouteRevealContext);

const centerOf = (el: HTMLElement | null) => {
  if (!el) return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
};

export function RouteReveal({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [target, setTarget] = useState<string | null>(null);
  const [origin, setOrigin] = useState({ x: 0, y: 0 });
  const router = useRouter();
  const pathname = usePathname();
  const reduced = useReducedMotion();
  // A ref, not `phase`, so revealTo stays referentially stable and doesn't churn the
  // context value on every phase change.
  const busy = useRef(false);

  const revealTo = useCallback<RevealFn>(
    (href, el) => {
      if (busy.current) return;
      if (reduced) {
        router.push(href);
        return;
      }
      busy.current = true;
      setOrigin(centerOf(el));
      setTarget(href);
      setPhase("covering");
    },
    [reduced, router]
  );

  // Cover finishes -> commit the navigation underneath it.
  useEffect(() => {
    if (phase !== "covering" || !target) return;
    const id = setTimeout(() => router.push(target), COVER_MS);
    return () => clearTimeout(id);
  }, [phase, target, router]);

  // The new route is live -> uncover it.
  useEffect(() => {
    if (phase !== "covering" || !target || pathname !== target) return;
    const id = setTimeout(() => setPhase("uncovering"), SETTLE_MS);
    return () => clearTimeout(id);
  }, [phase, target, pathname]);

  // Safety net: uncover even if the navigation never lands, so the page is never
  // permanently hidden behind the overlay.
  useEffect(() => {
    if (phase !== "covering") return;
    const id = setTimeout(() => setPhase("uncovering"), COVER_MS + NAV_FALLBACK_MS);
    return () => clearTimeout(id);
  }, [phase]);

  // Uncover finishes -> tear the overlay down and accept clicks again.
  useEffect(() => {
    if (phase !== "uncovering") return;
    const id = setTimeout(() => {
      busy.current = false;
      setTarget(null);
      setPhase("idle");
    }, UNCOVER_MS);
    return () => clearTimeout(id);
  }, [phase]);

  return (
    <RouteRevealContext.Provider value={revealTo}>
      {children}
      {phase !== "idle" && (
        <div
          aria-hidden
          data-reveal={phase === "covering" ? "in" : "out"}
          style={
            {
              "--reveal-ox": `${origin.x}px`,
              "--reveal-oy": `${origin.y}px`,
            } as React.CSSProperties
          }
          // Above the navbar (z-100) and the menu overlay (z-200) so nothing pokes
          // through mid-transition.
          className="reveal-layer fixed inset-0 z-[300] bg-[var(--world-a-bg)]"
        />
      )}
    </RouteRevealContext.Provider>
  );
}

export function RevealLink({
  href,
  className,
  children,
  onClick,
}: {
  href: string;
  className?: string;
  children: ReactNode;
  onClick?: () => void;
}) {
  const reveal = useRouteReveal();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.();
    // Leave modified and non-primary clicks to the browser: ctrl/cmd/shift/alt click and
    // middle click should still open a new tab rather than animate this one.
    if (!reveal || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    reveal(href, e.currentTarget);
  };

  return (
    <Link href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  );
}
