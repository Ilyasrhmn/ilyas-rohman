"use client";

import Link from "next/link";
import { useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Navbar({ onContact }: { onContact: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header
        style={{ opacity: "var(--nav-opacity)" }}
        className="fixed top-0 left-0 right-0 z-[100] transition-opacity duration-300 pointer-events-none p-5 sm:p-10"
      >
        <nav className="flex items-start justify-between w-full pointer-events-auto">
          {/* Brand */}
          <Link href="/" className="flex flex-col gap-0.5 group">
            <span className="font-serif text-sm sm:text-lg font-medium tracking-[0.15em] uppercase text-[var(--nav-text)] transition-opacity group-hover:opacity-70">
              INR
            </span>
          </Link>

          {/* Menu Button */}
          <button
            onClick={() => setMenuOpen(true)}
            className="group relative cursor-pointer py-2 font-sans text-[0.625rem] font-normal tracking-[0.3em] uppercase text-[var(--nav-text)] transition-colors duration-400 hover:text-[var(--nav-contact-border)]"
          >
            MENU
            <span className="absolute bottom-1 left-0 h-px w-0 bg-[var(--nav-contact-border)] transition-all duration-400 ease-in-out group-hover:w-full" />
          </button>
        </nav>
      </header>

      {/* Fullscreen Menu Overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-[200] flex flex-col bg-[var(--world-a-bg)] text-[var(--world-a-text)]">
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
              onClick={() => setMenuOpen(false)}
              className="group relative cursor-pointer py-2 font-sans text-[0.625rem] font-normal tracking-[0.3em] uppercase transition-colors duration-400 hover:text-[var(--world-a-accent)]"
            >
              CLOSE
              <span className="absolute bottom-1 left-0 h-px w-0 bg-[var(--world-a-accent)] transition-all duration-400 ease-in-out group-hover:w-full" />
            </button>
          </div>

          <div className="flex flex-1 flex-col items-center justify-center gap-8 text-center">
            <Link
              href="/projects"
              onClick={() => setMenuOpen(false)}
              className="font-serif text-4xl sm:text-6xl font-light uppercase tracking-widest hover:text-[var(--world-a-accent)] transition-colors"
            >
              Projects
            </Link>
            <button
              onClick={() => {
                setMenuOpen(false);
                onContact();
              }}
              className="font-serif text-4xl sm:text-6xl font-light uppercase tracking-widest hover:text-[var(--world-a-accent)] transition-colors"
            >
              Contact
            </button>
            <div className="mt-8 flex flex-col items-center gap-4">
              <span className="font-sans text-[0.625rem] uppercase tracking-[0.3em] text-[var(--world-a-muted)]">
                Theme
              </span>
              <ThemeToggle />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
