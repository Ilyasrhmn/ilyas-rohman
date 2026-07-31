"use client";

import { useState, useRef } from "react";
import dynamic from "next/dynamic";
import { profile } from "@/data/profile";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

// Same fractal-noise texture used in src/components/achievements/threshold.tsx (GRAIN_BG),
// copied locally to avoid importing across feature folders.
const GRAIN_BG =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

const PromptingIsAllYouNeed = dynamic(
  () => import("@/components/ui/animated-hero-section").then((m) => m.PromptingIsAllYouNeed),
  {
    ssr: false,
    loading: () => <div className="w-full h-[38vh] min-h-[260px] sm:h-[45vh]" />,
  }
);

export function FooterSignature() {
  const [playing, setPlaying] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const reducedMotion = useReducedMotion();

  const handleClose = () => {
    setPlaying(false);
    toggleRef.current?.focus();
  };

  return (
    <div className="relative w-full overflow-hidden">
      {playing ? (
        <PromptingIsAllYouNeed />
      ) : (
        <div className="relative flex h-[200px] w-full items-center overflow-hidden px-6">
          {/* textLength pins the advance width to 1000, but serif ink overshoots that box
              on both sides — by ~21 units at small sizes, where the fallback face is wider.
              The 30 units of slack per side keep the outer strokes from being shaved. */}
          <svg
            aria-hidden
            viewBox="-30 0 1060 140"
            preserveAspectRatio="xMidYMid meet"
            className="w-full select-none"
          >
            <text
              x="0"
              y="98"
              textLength="1000"
              lengthAdjust="spacingAndGlyphs"
              textAnchor="start"
              fill="#E8E5DA"
              fillOpacity={0.12}
              style={{ fontFamily: "var(--font-serif)", letterSpacing: "-0.02em" }}
            >
              {profile.name.toUpperCase()}
            </text>
          </svg>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage: GRAIN_BG,
              backgroundSize: "160px 160px",
              opacity: 0.04,
            }}
          />
        </div>
      )}

      <button
        ref={toggleRef}
        type="button"
        onClick={() => (playing ? handleClose() : setPlaying(true))}
        aria-expanded={playing}
        className={`absolute bottom-2 right-2 flex min-h-[44px] items-center px-4 font-mono text-xs uppercase tracking-[0.2em] text-[#98A39A] hover:text-[#8FAF8F] focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-[#8FAF8F] ${
          reducedMotion ? "" : "transition-colors"
        }`}
      >
        {playing ? "Close" : "Play pong"}
      </button>
    </div>
  );
}

export default FooterSignature;
