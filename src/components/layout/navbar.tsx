"use client";

import Link from "next/link";
import { profile } from "@/data/profile";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Navbar({ onContact }: { onContact: () => void }) {
  return (
    <header
      style={{ opacity: "var(--nav-opacity)" }}
      className="fixed top-0 left-0 right-0 z-[100] transition-opacity duration-300 pointer-events-none py-6"
    >
      {/* Background layer */}
      <div
        style={{
          backgroundColor: "var(--nav-bg)",
          backdropFilter: "var(--nav-backdrop-filter)",
          WebkitBackdropFilter: "var(--nav-backdrop-filter)",
          borderBottom: "1px solid var(--nav-border)",
        }}
        className="absolute inset-0 -z-10 pointer-events-auto transition-colors duration-500"
      />

      <nav className="mx-auto max-w-6xl px-6 flex items-center justify-between w-full pointer-events-auto">
        <Link
          href="/"
          className="relative z-[110] flex items-center gap-2 group"
        >
          <span
            style={{ color: "var(--nav-text)" }}
            className="text-lg sm:text-xl font-serif tracking-tight transition-all duration-300 group-hover:opacity-70"
          >
            {profile.name}
          </span>
        </Link>

        <div className="flex items-center gap-4 sm:gap-8">
          <Link
            href="/projects"
            style={{ color: "var(--nav-muted)" }}
            className="text-xs font-medium uppercase tracking-[0.2em] transition-colors hover:opacity-100 opacity-70 hidden sm:block"
          >
            Projects
          </Link>

          <ThemeToggle />
          
          <button
            onClick={onContact}
            style={{ 
              color: "var(--nav-text)", 
              borderColor: "var(--nav-contact-border)" 
            }}
            className="cursor-pointer rounded-full border px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] transition-all hover:bg-[var(--nav-contact-border)] hover:text-[var(--nav-bg)]"
          >
            Contact
          </button>
        </div>
      </nav>
    </header>
  );
}
