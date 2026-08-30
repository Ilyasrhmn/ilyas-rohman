"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { originOfElement } from "@/components/layout/route-reveal";

// Must stay >= the reveal-out animation in globals.css, so the overlay isn't yanked
// out of the DOM before the collapse has finished playing.
const CLOSE_MS = 650;

export default function Navbar({ onContact }: { onContact: () => void }) {
  // Two flags, not one: the overlay has to stay in the DOM while it animates closed, so
  // "is it rendered" and "is it collapsing" are genuinely different questions. The reveal
  // itself is driven entirely by CSS (see .reveal-layer in globals.css) -- no JS timing.
  const [isMounted, setIsMounted] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  // Reveal origin in viewport px: the MENU button's own position. CLOSE reuses it rather
  // than measuring itself, so the menu retracts to the same place it grew out of instead of
  // jumping to wherever CLOSE happens to sit.
  const [origin, setOrigin] = useState({ x: 0, y: 0 });
  const openOrigin = useRef({ x: 0, y: 0 });

  const menuBtnRef = useRef<HTMLButtonElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const reduced = useReducedMotion();

  const openMenu = () => {
    const point = originOfElement(menuBtnRef.current);
    openOrigin.current = point;
    setOrigin(point);
    setIsClosing(false);
    setIsMounted(true);
  };

  const closeMenu = useCallback(() => {
    setOrigin(openOrigin.current);
    setIsClosing(true);
  }, []);

  // Unmount only after the collapse has finished playing. A timer rather than an
  // animationend listener: animationend can silently never fire (interrupted animation,
  // reduced-motion `animation: none`), which is exactly the stuck-overlay failure mode.
  // The cleanup cancels it if the menu is reopened mid-close.
  useEffect(() => {
    if (!isMounted || !isClosing) return;
    const id = setTimeout(() => setIsMounted(false), reduced ? 0 : CLOSE_MS);
    return () => clearTimeout(id);
  }, [isMounted, isClosing, reduced]);

  // No resize handler recomputing the origin: it used to re-anchor to the CLOSE button,
  // which defeats the point of closing toward where the user actually opened from. A
  // resize can only shift that stored point slightly relative to the new layout, and the
  // circle(150%) radius still covers the viewport at any size, so nothing needs fixing up.

  useEffect(() => {
    if (!isMounted) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isMounted, closeMenu]);

  return (
    <>
      <header
        style={{ opacity: "var(--nav-opacity)" }}
        className="fixed top-0 left-0 right-0 z-[100] transition-opacity duration-300 pointer-events-none p-5 sm:p-10"
      >
        <nav className="flex items-start justify-between w-full pointer-events-auto">
          {/* Brand */}
          <Link href="/" className="group flex min-h-[44px] min-w-[44px] flex-col justify-center gap-0.5">
            <span className="font-serif text-sm sm:text-lg font-medium tracking-[0.15em] uppercase text-[var(--nav-text)] transition-opacity group-hover:opacity-70">
              INR
            </span>
          </Link>

          {/* Menu Button */}
          <button
            ref={menuBtnRef}
            onClick={openMenu}
            aria-expanded={isMounted && !isClosing}
            className="group relative inline-flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center font-sans text-[0.625rem] font-normal tracking-[0.3em] uppercase text-[var(--nav-text)] transition-colors duration-400 hover:text-[var(--nav-contact-border)]"
          >
            MENU
            <span className="absolute bottom-1 left-0 h-px w-0 bg-[var(--nav-contact-border)] transition-all duration-400 ease-in-out group-hover:w-full" />
          </button>
        </nav>
      </header>

      {/* Fullscreen Menu Overlay */}
      {isMounted && (
        <div
          data-reveal={isClosing ? "out" : "in"}
          style={
            {
              // The overlay is inset-0, so its border-box is exactly the viewport and
              // these viewport-space px coordinates map straight onto it.
              "--reveal-ox": `${origin.x}px`,
              "--reveal-oy": `${origin.y}px`,
            } as React.CSSProperties
          }
          className="reveal-layer fixed inset-0 z-[200] flex flex-col bg-[var(--world-a-bg)] text-[var(--world-a-text)]"
        >
          <div className="flex items-start justify-between p-5 sm:p-10">
            <div className="flex flex-col gap-0.5">
              <span className="font-serif text-sm sm:text-lg font-medium tracking-[0.15em] uppercase">
                INR
              </span>
              <span className="font-sans text-[0.55rem] sm:text-[0.6rem] font-light tracking-[0.22em] uppercase text-[var(--world-a-muted)]">
                Portfolio
              </span>
            </div>
            <button
              ref={closeBtnRef}
              onClick={closeMenu}
              className="group relative inline-flex min-h-[44px] cursor-pointer items-center font-sans text-[0.625rem] font-normal tracking-[0.3em] uppercase transition-colors duration-400 hover:text-[var(--world-a-accent)]"
            >
              CLOSE
              <span className="absolute bottom-1 left-0 h-px w-0 bg-[var(--world-a-accent)] transition-all duration-400 ease-in-out group-hover:w-full" />
            </button>
          </div>

          <div className="flex flex-1 flex-col items-center justify-center gap-8 text-center">
            <Link
              href="/projects"
              onClick={closeMenu}
              className="font-serif text-4xl sm:text-6xl font-light uppercase tracking-widest hover:text-[var(--world-a-accent)] transition-colors"
            >
              Projects
            </Link>
            <Link
              href="/achievements"
              onClick={closeMenu}
              className="font-serif text-4xl sm:text-6xl font-light uppercase tracking-widest hover:text-[var(--world-a-accent)] transition-colors"
            >
              Archive
            </Link>
            <button
              onClick={() => {
                closeMenu();
                onContact();
              }}
              className="font-serif text-4xl sm:text-6xl font-light uppercase tracking-widest hover:text-[var(--world-a-accent)] transition-colors"
            >
              Contact
            </button>
          </div>
        </div>
      )}
    </>
  );
}
