"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import gsap from "gsap";
import { useCallback, useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { ShaderTransition } from "@/components/layout/shader-transition";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export type RevealDirection = "forward" | "back";
export type RevealOrigin = { x: number; y: number };

// Navbar uses this for its existing MENU/CLOSE animation. Keep its origin logic intact.
export function originOfElement(el: HTMLElement | null): RevealOrigin {
  if (!el) return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
}

export function RouteReveal({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();
  const progress = useRef({ value: 0 });
  const invalidateRef = useRef<(() => void) | null>(null);
  const targetPath = useRef<string | null>(null);
  const busy = useRef(false);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const reset = useCallback(() => {
    if (timeout.current) clearTimeout(timeout.current);
    timeout.current = null;
    targetPath.current = null;
    busy.current = false;
    progress.current.value = 0;
    invalidateRef.current?.();
  }, []);

  // The reference runs 0 -> 1 in two seconds and swaps the route at 0.9s.
  // Pause at the opaque midpoint until Next commits the destination, so a
  // slower route does not get revealed before it is ready.
  const navigate = useCallback((href: string, destinationPath: string) => {
    if (busy.current) return;
    if (!invalidateRef.current) {
      router.push(href);
      return;
    }
    busy.current = true;
    targetPath.current = destinationPath;
    progress.current.value = 0;
    invalidateRef.current();
    gsap.to(progress.current, {
      value: 0.5,
      duration: 1,
      ease: "none",
      onUpdate: () => invalidateRef.current?.(),
      onComplete: () => {
        router.push(href);
        timeout.current = setTimeout(() => {
          gsap.killTweensOf(progress.current);
          reset();
        }, 12000);
      },
    });
  }, [router, reset]);

  useEffect(() => {
    if (!busy.current || targetPath.current !== pathname) return;
    if (timeout.current) clearTimeout(timeout.current);
    timeout.current = null;
    targetPath.current = null;
    gsap.to(progress.current, {
      value: 1,
      duration: 1,
      ease: "none",
      onUpdate: () => invalidateRef.current?.(),
      onComplete: reset,
    });
  }, [pathname, reset]);

  // Capture native and Next links alike so navbar links, page CTAs, project
  // cards, and back links all use the same transition without editing their UI.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (
        reducedMotion || event.defaultPrevented || event.button !== 0 ||
        event.metaKey || event.ctrlKey || event.shiftKey || event.altKey
      ) return;
      const element = event.target;
      if (!(element instanceof Element)) return;
      const anchor = element.closest("a[href]");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      if (anchor.hasAttribute("download") || (anchor.target && anchor.target !== "_self")) return;
      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname && url.search === window.location.search) return;
      event.preventDefault();
      navigate(url.pathname + url.search + url.hash, url.pathname);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [navigate, reducedMotion]);

  useEffect(() => () => {
    if (timeout.current) clearTimeout(timeout.current);
    gsap.killTweensOf(progress.current);
  }, []);

  return (
    <>
      {children}
      {!reducedMotion && <ShaderTransition progress={progress} invalidateRef={invalidateRef} />}
    </>
  );
}

// Existing call sites keep their presentation and semantics. The provider's
// document-level capture handler animates this anchor just like any Next Link.
export function RevealLink({
  href,
  className,
  style,
  children,
  onClick,
}: {
  href: string;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
  onClick?: () => void;
  direction?: RevealDirection;
}) {
  return (
    <Link href={href} className={className} style={style} onClick={onClick}>
      {children}
    </Link>
  );
}
