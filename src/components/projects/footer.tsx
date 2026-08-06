"use client";

import { useLenis } from "@/components/layout/smooth-scroll";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { profile } from "@/data/profile";

export function ProjectsFooter() {
  const lenis = useLenis();
  const reducedMotion = useReducedMotion();

  const scrollToTop = () => {
    if (lenis) {
      lenis.scrollTo(0, { immediate: reducedMotion });
      return;
    }
    window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
  };

  return (
    <footer
      className="border-t px-6 py-6 sm:px-10"
      style={{
        backgroundColor: "var(--world-a-bg)",
        borderColor: "var(--world-a-border)",
        color: "var(--world-a-muted)",
      }}
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <p>
          &copy; {new Date().getFullYear()} {profile.name}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {profile.socials.map((social) => (
            <a
              key={social.label}
              href={social.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center transition-colors duration-200 hover:text-[var(--world-a-accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              {social.label}
            </a>
          ))}
          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex min-h-11 items-center transition-colors duration-200 hover:text-[var(--world-a-accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            Back to top
          </button>
        </div>
      </div>
    </footer>
  );
}
