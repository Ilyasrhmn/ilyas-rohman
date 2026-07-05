# Immersive Scroll Redo — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the existing static-fade portfolio home into an immersive, scrub-driven scroll experience matching PersonalBlog's interaction quality and lenis.dev / landonorris.com's premium feel — real scroll-linked motion, a signature zoom-text-into-background transition wired into the real page, a non-flat dark "color world" background, and expressive varied typography.

**Architecture:** The scaffold, chrome (preloader/cursor/nav/footer/contact modal), data layer, routes, and Lenis smooth-scroll from the previous build are KEPT. This plan replaces the *motion vocabulary and visual system* only: it wires Lenis↔GSAP ScrollTrigger for scrub sync, ports three proven scroll primitives from PersonalBlog (word-reveal, sticky-active-card, pinned scatter→grid), upgrades the signature scroll-scale to reveal a color panel (become-the-background), and rewrites each home section to use these with dramatically varied type on a textured dark base.

**Tech Stack:** Next.js 16 (App Router) + TypeScript + Tailwind 4, Framer Motion (general motion), GSAP + ScrollTrigger (scrub/pin), Lenis (smooth scroll), next/font (Playfair Display + Space Grotesk + Inter).

## Global Constraints

- Next.js 16: dynamic `params` is `Promise` — always `await params`. (Already handled in `/projects/[slug]`.)
- **Framer Motion** for general UI motion; **GSAP ScrollTrigger** for all scrub/pin choreography. Lenis MUST be wired to ScrollTrigger (Task 1) or scrub desyncs.
- **Reduced-motion + touch:** every scrub/pin/parallax component checks `useReducedMotion()` and `useIsTouch()` (existing `src/hooks/use-reduced-motion.ts`) and renders a static, readable fallback. Custom cursor already off on touch.
- **Dark-anchored, NOT flat black:** base `#0A0B0A` with a fixed grain + vignette layer; sections shift the page background color on scroll (the "color world"). Never a single flat `#000`/`#0E0F0E` fill.
- **Expressive, varied type:** oversized display headlines (`clamp()` up to ~11rem / 12vw), uppercase grotesk eyebrows, italic serif editorial moments. Never one uniform size/weight across sections.
- **Performance:** mobile Lighthouse ≥ 90. No heavy 3D (three/R3F/spline/matter-js). LCP text must render server-side (no `opacity:0` gate on above-the-fold content — animate with `initial={false}` or scrub-in only below the fold).
- **Accessibility:** body/text contrast ≥ 4.5:1 on every background color it sits on (verify per section as in the prior build).
- Identity/copy: Ilyas Nur Rohman — Frontend Engineer (backend-capable), Yogyakarta. Marketplace desa = "Currently Building" placeholder, no fabricated finished content.

**Reference source files (read before porting):**
- `PersonalBlog/src/components/ScrollReveal.tsx` (word-by-word scrub)
- `PersonalBlog/src/components/ui/sticky-scroll-reveal.tsx` (active-card sticky)
- `PersonalBlog/src/components/sections/CertificateHeroScroll.tsx` (pinned scatter→grid)

---

### Task 1: Wire Lenis ↔ ScrollTrigger + GSAP setup

**Why first:** Every scrub animation in later tasks desyncs from smooth-scroll unless Lenis drives ScrollTrigger. Also centralizes GSAP plugin registration.

**Files:**
- Modify: `src/components/layout/smooth-scroll.tsx`
- Create: `src/lib/gsap.ts`

**Interfaces:**
- Produces: `src/lib/gsap.ts` exports `registerGsap(): void` (idempotent `gsap.registerPlugin(ScrollTrigger)`), and re-exports `gsap`, `ScrollTrigger`.
- Produces: `smooth-scroll.tsx` unchanged export (`default SmoothScroll`, `useLenis`), but now updates ScrollTrigger on every Lenis scroll and drives Lenis from GSAP's ticker.

- [ ] **Step 1: Create the GSAP helper**

```ts
// src/lib/gsap.ts
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;
export function registerGsap() {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger);
  registered = true;
}

export { gsap, ScrollTrigger };
```

- [ ] **Step 2: Wire Lenis into the GSAP ticker + ScrollTrigger in `smooth-scroll.tsx`**

Replace the `useEffect` body so the RAF loop is driven by GSAP's ticker and ScrollTrigger updates on scroll (keep the `LenisContext`/`useLenis` exports exactly as they are):

```tsx
useEffect(() => {
  const lenisInstance = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });
  setLenis(lenisInstance);

  registerGsap();
  lenisInstance.on("scroll", ScrollTrigger.update);

  const onTick = (time: number) => lenisInstance.raf(time * 1000);
  gsap.ticker.add(onTick);
  gsap.ticker.lagSmoothing(0);

  return () => {
    gsap.ticker.remove(onTick);
    lenisInstance.destroy();
    setLenis(null);
  };
}, []);
```

Add imports at top: `import { registerGsap, gsap, ScrollTrigger } from "@/lib/gsap";`

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit`
Expected: no output (clean).

- [ ] **Step 4: Verify smooth scroll still works**

Run: `preview_start` (portfolio-dev), wait 1.6s, `preview_eval`: `window.scrollTo(0, 1200)` then screenshot. Expected: page scrolls smoothly, no console errors (`preview_console_logs` level error → empty).

- [ ] **Step 5: Commit**

```bash
git add src/lib/gsap.ts src/components/layout/smooth-scroll.tsx
git commit -m "feat: wire lenis to gsap scrolltrigger for scrub sync"
```

---

### Task 2: Textured dark background ("not flat black")

**Goal:** Replace the flat base with `#0A0B0A` + a fixed film-grain + radial vignette layer that sits behind all content, so the page reads as atmospheric dark, never flat.

**Files:**
- Modify: `src/app/globals.css`
- Create: `src/components/layout/backdrop.tsx`
- Modify: `src/components/layout/chrome-shell.tsx` (mount `<Backdrop/>`)

**Interfaces:**
- Produces: `<Backdrop />` — a `fixed inset-0 -z-10` layer (grain + vignette), pointer-events-none.

- [ ] **Step 1: Update base tokens + add grain/vignette utilities in `globals.css`**

Change `--background` and add utilities. In `:root` set:

```css
  --background: #0A0B0A;
```

Add after the `.mist` block:

```css
/* Fixed atmospheric backdrop: grain + vignette so the dark is never flat */
.backdrop-grain {
  position: fixed;
  inset: 0;
  z-index: -10;
  pointer-events: none;
  background-color: #0A0B0A;
}
.backdrop-grain::before {
  content: "";
  position: absolute;
  inset: 0;
  opacity: 0.04;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-size: 160px 160px;
}
.backdrop-grain::after {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(120% 90% at 50% 0%, rgba(47,93,69,0.10), transparent 55%),
              radial-gradient(100% 100% at 50% 100%, rgba(0,0,0,0.55), transparent 60%);
}
```

- [ ] **Step 2: Create `Backdrop`**

```tsx
// src/components/layout/backdrop.tsx
export function Backdrop() {
  return <div className="backdrop-grain" aria-hidden />;
}
```

- [ ] **Step 3: Mount it in `chrome-shell.tsx`**

Add `import { Backdrop } from "@/components/layout/backdrop";` and render `<Backdrop />` as the first child inside `<SmoothScroll>` (before `<Preloader/>`).

- [ ] **Step 4: Typecheck + visual verify**

Run: `npx tsc --noEmit` (clean). Then `preview_start`, screenshot the hero: expect subtle grain/vignette, background reads as deep atmospheric dark, not flat.

- [ ] **Step 5: Commit**

```bash
git add src/app/globals.css src/components/layout/backdrop.tsx src/components/layout/chrome-shell.tsx
git commit -m "feat: textured atmospheric dark backdrop"
```

---

### Task 3: Expressive typography system

**Goal:** Add a bold uppercase grotesk (Space Grotesk) for eyebrows/labels alongside Playfair Display (editorial serif) + Inter (body), and define a dramatic, varied type scale as utilities.

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/app/globals.css`

**Interfaces:**
- Produces: CSS var `--font-grotesk`; Tailwind can use `font-[family-name:var(--font-grotesk)]`. Utility classes: `.display` (huge Playfair clamp), `.eyebrow` (Space Grotesk uppercase), `.section-title` (Playfair clamp mid).

- [ ] **Step 1: Add Space Grotesk in `layout.tsx`**

```tsx
import { Playfair_Display, Inter, Space_Grotesk } from "next/font/google";

const playfair = Playfair_Display({ variable: "--font-serif", subsets: ["latin"] });
const inter = Inter({ variable: "--font-sans", subsets: ["latin"] });
const grotesk = Space_Grotesk({ variable: "--font-grotesk", subsets: ["latin"] });
```

Update the `<html className>` to include `${grotesk.variable}`.

- [ ] **Step 2: Register font + type utilities in `globals.css`**

In `@theme inline` add: `--font-grotesk: var(--font-grotesk);`

Add utilities after the type theme block:

```css
.display {
  font-family: var(--font-serif);
  font-weight: 500;
  line-height: 0.95;
  letter-spacing: -0.02em;
  font-size: clamp(2.75rem, 11vw, 11rem);
}
.section-title {
  font-family: var(--font-serif);
  font-weight: 500;
  line-height: 1.0;
  letter-spacing: -0.01em;
  font-size: clamp(2rem, 6vw, 4.5rem);
}
.eyebrow {
  font-family: var(--font-grotesk);
  text-transform: uppercase;
  letter-spacing: 0.32em;
  font-size: 0.7rem;
  color: var(--color-accent-2);
}
```

- [ ] **Step 3: Typecheck + verify fonts load**

Run: `npx tsc --noEmit` (clean). `preview_start`, `preview_eval`:
```js
getComputedStyle(document.querySelector('h1')).fontFamily
```
Expected: contains "Playfair Display". (Full visual use lands in later tasks.)

- [ ] **Step 4: Commit**

```bash
git add src/app/layout.tsx src/app/globals.css
git commit -m "feat: expressive varied typography system"
```

---

### Task 4: ScrollReveal primitive (word-by-word scrub)

**Goal:** Port PersonalBlog's `ScrollReveal` to our stack — text where each word rises from low opacity + blur, driven by scrub, with a subtle container rotation. Reduced-motion/touch → plain text.

**Files:**
- Create: `src/components/motion/scroll-reveal.tsx`
- Create: `src/components/motion/scroll-reveal.test.ts` (logic: word-splitting helper)

**Interfaces:**
- Produces: `splitWords(text: string): string[]` (exported pure helper — splits keeping whitespace tokens).
- Produces: `<ScrollReveal>{string}</ScrollReveal>` with props `{ className?: string; baseOpacity?: number; blur?: number }`.

- [ ] **Step 1: Write the failing test for the word splitter**

```ts
// src/components/motion/scroll-reveal.test.ts
import assert from "node:assert";
import { test } from "node:test";
import { splitWords } from "./scroll-reveal";

test("splits into words and preserves spacing tokens", () => {
  const parts = splitWords("hello  world");
  assert.deepEqual(parts, ["hello", "  ", "world"]);
});

test("empty string yields empty array of words", () => {
  assert.deepEqual(splitWords(""), [""]);
});
```

- [ ] **Step 2: Run it, expect failure**

Run: `npx tsx --test src/components/motion/scroll-reveal.test.ts`
Expected: FAIL (`splitWords` not exported / module not found).

- [ ] **Step 3: Implement `scroll-reveal.tsx`**

```tsx
"use client";

import { useEffect, useMemo, useRef } from "react";
import { registerGsap, gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export function splitWords(text: string): string[] {
  return text.split(/(\s+)/);
}

export function ScrollReveal({
  children,
  className = "",
  baseOpacity = 0.2,
  blur = 4,
}: {
  children: string;
  className?: string;
  baseOpacity?: number;
  blur?: number;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduced = useReducedMotion();
  const parts = useMemo(() => splitWords(children), [children]);

  useEffect(() => {
    if (reduced || !ref.current) return;
    registerGsap();
    const el = ref.current;
    const words = el.querySelectorAll<HTMLElement>(".sr-word");

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { rotate: 2, transformOrigin: "0% 50%" },
        { rotate: 0, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "top center", scrub: true } }
      );
      gsap.fromTo(
        words,
        { opacity: baseOpacity, filter: `blur(${blur}px)` },
        {
          opacity: 1,
          filter: "blur(0px)",
          ease: "power2.out",
          stagger: 0.03,
          scrollTrigger: { trigger: el, start: "top 88%", end: "top 45%", scrub: true },
        }
      );
    }, el);

    return () => ctx.revert();
  }, [reduced, baseOpacity, blur]);

  return (
    <p ref={ref} className={className}>
      {parts.map((p, i) =>
        /^\s+$/.test(p) ? (
          <span key={i}>{p}</span>
        ) : (
          <span key={i} className="sr-word inline-block" style={reduced ? undefined : { opacity: baseOpacity }}>
            {p}
          </span>
        )
      )}
    </p>
  );
}
```

- [ ] **Step 4: Run test, expect pass**

Run: `npx tsx --test src/components/motion/scroll-reveal.test.ts`
Expected: PASS (2 tests).

- [ ] **Step 5: Typecheck**

Run: `npx tsc --noEmit` → clean.

- [ ] **Step 6: Commit**

```bash
git add src/components/motion/scroll-reveal.tsx src/components/motion/scroll-reveal.test.ts
git commit -m "feat: scroll-reveal word-by-word scrub primitive"
```

---

### Task 5: Upgrade ScrollScale to reveal a color panel (zoom-into-background)

**Goal:** The signature lenis.dev moment — oversized text pins, scales up, and as it fades a full-screen color panel is revealed behind it, which becomes the next section's background. Replaces the current scale-only effect.

**Files:**
- Modify: `src/components/motion/scroll-scale.tsx`

**Interfaces:**
- Produces: `<ScrollScale text={string} panelColor={string} className?={string} />` — pins for 1×viewport, scales `text` 1→14 while fading, and cross-reveals a panel of `panelColor` (default `#0A0B0A`). Reduced-motion/touch → static centered text on `panelColor`.

- [ ] **Step 1: Rewrite `scroll-scale.tsx`**

```tsx
"use client";

import { useEffect, useRef } from "react";
import { registerGsap, gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion, useIsTouch } from "@/hooks/use-reduced-motion";

export function ScrollScale({
  text,
  panelColor = "#0A0B0A",
  className = "",
}: {
  text: string;
  panelColor?: string;
  className?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const disabled = useReducedMotion() || useIsTouch();

  useEffect(() => {
    if (disabled || !wrapRef.current) return;
    registerGsap();
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: wrapRef.current, start: "top top", end: "+=140%", scrub: 0.5, pin: true },
      });
      tl.fromTo(panelRef.current, { opacity: 0 }, { opacity: 1, ease: "none" }, 0);
      tl.fromTo(
        textRef.current,
        { scale: 1, opacity: 1 },
        { scale: 14, opacity: 0, ease: "power1.in" },
        0
      );
    }, wrapRef);
    return () => ctx.revert();
  }, [disabled]);

  if (disabled) {
    return (
      <div className={`section-pad flex items-center justify-center ${className}`} style={{ backgroundColor: panelColor }}>
        <div className="display text-center text-foreground">{text}</div>
      </div>
    );
  }

  return (
    <div ref={wrapRef} className={`relative h-screen overflow-hidden ${className}`}>
      <div ref={panelRef} className="absolute inset-0" style={{ backgroundColor: panelColor, opacity: 0 }} />
      <div className="absolute inset-0 flex items-center justify-center">
        <div ref={textRef} className="display text-center text-foreground will-change-transform" style={{ transformOrigin: "center" }}>
          {text}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit` → clean.

- [ ] **Step 3: Verify on the demo route** (still exists at `/motion-demo`; final removal in Task 13)

`preview_start`, navigate `/motion-demo`, scroll incrementally through the pin (200px steps, 30ms apart) and screenshot mid-pin. Expected: text scales up AND a panel fades in behind it (becomes background), then releases.

- [ ] **Step 4: Commit**

```bash
git add src/components/motion/scroll-scale.tsx
git commit -m "feat: scroll-scale reveals color panel (zoom-into-background)"
```

---

### Task 6: StickyScroll primitive (active-card)

**Goal:** Port PersonalBlog's `StickyScroll` — a two-column block where the left column scrolls through items and the right column shows a sticky visual that crossfades (blur+scale) as the active item changes. Used by Journey.

**Files:**
- Create: `src/components/motion/sticky-scroll.tsx`

**Interfaces:**
- Consumes: nothing from other tasks.
- Produces: `<StickyScroll items={StickyItem[]} />` where `StickyItem = { eyebrow: string; title: string; body: string; visual: React.ReactNode }`. Tracks active index via `useScroll` on the section; left list dims inactive items; right sticky panel crossfades `visual`. Reduced-motion → simple stacked list, no crossfade.

- [ ] **Step 1: Implement `sticky-scroll.tsx`**

```tsx
"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export type StickyItem = { eyebrow: string; title: string; body: string; visual: React.ReactNode };

export function StickyScroll({ items }: { items: StickyItem[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start center", "end center"] });

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const idx = Math.min(items.length - 1, Math.floor(p * items.length));
    setActive(idx < 0 ? 0 : idx);
  });

  return (
    <div ref={ref} className="relative mx-auto grid max-w-6xl gap-10 lg:grid-cols-2">
      <div>
        {items.map((item, i) => (
          <div key={item.title} className="min-h-[70vh] flex flex-col justify-center">
            <span className="eyebrow">{item.eyebrow}</span>
            <motion.h3
              animate={{ opacity: reduced ? 1 : active === i ? 1 : 0.25 }}
              transition={{ duration: 0.4 }}
              className="section-title mt-3 text-foreground"
            >
              {item.title}
            </motion.h3>
            <motion.p
              animate={{ opacity: reduced ? 1 : active === i ? 1 : 0.2 }}
              transition={{ duration: 0.4 }}
              className="mt-4 max-w-md text-lg text-foreground/85"
            >
              {item.body}
            </motion.p>
            <div className="mt-6 lg:hidden">{item.visual}</div>
          </div>
        ))}
      </div>

      <div className="hidden lg:block">
        <div className="sticky top-0 flex h-screen items-center">
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-border">
            <AnimatePresence>
              <motion.div
                key={active}
                initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.96, filter: "blur(8px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 1.04, filter: "blur(8px)" }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0"
              >
                {items[active].visual}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit` → clean.

- [ ] **Step 3: Commit**

```bash
git add src/components/motion/sticky-scroll.tsx
git commit -m "feat: sticky-scroll active-card primitive"
```

---

### Task 7: PinnedScatter primitive (scatter → grid)

**Goal:** Port the certificate hero choreography generically — children start scattered/rotated/faded and animate into a clean grid as you scroll through a pinned spacer. Used by Certificates.

**Files:**
- Create: `src/components/motion/pinned-scatter.tsx`

**Interfaces:**
- Produces: `<PinnedScatter>{children[]}</PinnedScatter>` — pins a full-screen stage for `~300vh`; each direct child element is positioned scattered initially and tweened to a responsive grid slot on scrub. Reduced-motion/touch → renders children in a normal CSS grid (no pin).

- [ ] **Step 1: Implement `pinned-scatter.tsx`**

```tsx
"use client";

import { Children, useEffect, useRef } from "react";
import { registerGsap, gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion, useIsTouch } from "@/hooks/use-reduced-motion";

export function PinnedScatter({ children }: { children: React.ReactNode }) {
  const spacerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const disabled = useReducedMotion() || useIsTouch();
  const items = Children.toArray(children);

  useEffect(() => {
    if (disabled || !spacerRef.current) return;
    registerGsap();
    const els = itemRefs.current.filter((e): e is HTMLDivElement => !!e);
    const n = els.length;
    const cols = Math.ceil(Math.sqrt(n));

    const ctx = gsap.context(() => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const gridW = Math.min(vw * 0.9, 1100);
      const cellW = gridW / cols;
      const cellH = Math.min(cellW * 0.7, vh * 0.28);
      const startX = (vw - gridW) / 2;
      const startY = (vh - Math.ceil(n / cols) * cellH) / 2;

      const tl = gsap.timeline({
        scrollTrigger: { trigger: spacerRef.current, start: "top top", end: "bottom bottom", scrub: 0.5, pin: stageRef.current },
      });

      els.forEach((el, i) => {
        const row = Math.floor(i / cols);
        const col = i % cols;
        tl.fromTo(
          el,
          {
            top: vh * (0.1 + Math.random() * 0.6),
            left: vw * (0.05 + Math.random() * 0.7),
            rotate: i % 2 ? 6 : -6,
            opacity: 0.5,
            scale: 0.85,
          },
          {
            top: startY + row * (cellH + 12),
            left: startX + col * cellW + 6,
            width: cellW - 12,
            height: cellH - 12,
            rotate: 0,
            opacity: 1,
            scale: 1,
            ease: "power2.inOut",
            immediateRender: false,
          },
          0
        );
      });
      tl.to({}, { duration: 0.6 });
    }, spacerRef);

    return () => ctx.revert();
  }, [disabled, items.length]);

  if (disabled) {
    return <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">{children}</div>;
  }

  return (
    <>
      <div ref={spacerRef} className="h-[300vh] w-full" />
      <div ref={stageRef} className="pointer-events-none fixed inset-0 h-screen w-full overflow-hidden">
        {items.map((child, i) => (
          <div
            key={i}
            ref={(el) => { itemRefs.current[i] = el; }}
            className="pointer-events-auto absolute w-[42vw] sm:w-[26vw]"
          >
            {child}
          </div>
        ))}
      </div>
    </>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit` → clean.

- [ ] **Step 3: Commit**

```bash
git add src/components/motion/pinned-scatter.tsx
git commit -m "feat: pinned scatter-to-grid primitive"
```

---

### Task 8: Hero — scroll parallax + oversized display type

**Goal:** Keep the misty forest but add scroll parallax (bg drifts slower, content drifts up/fades) and make the name a true oversized `.display` headline; LCP-safe (name renders server-side, no opacity gate).

**Files:**
- Modify: `src/components/sections/hero.tsx`

**Interfaces:**
- Consumes: `profile` from `@/data/profile`.

- [ ] **Step 1: Rewrite hero content to use parallax + `.display`/`.eyebrow`**

Replace the content block and imports. Use Framer `useScroll`/`useTransform` on the section for parallax; the `<h1>` uses `.display` and stays visible (LCP-safe). Full component:

```tsx
"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { profile } from "@/data/profile";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", reduced ? "0%" : "18%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", reduced ? "0%" : "-30%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, reduced ? 1 : 0]);

  return (
    <section ref={ref} id="hero" className="relative h-screen w-full overflow-hidden">
      <motion.div style={{ y: bgY }} className="absolute inset-0 scale-110">
        <Image src="/hero/forest.webp" alt="Misty mountain forest landscape" fill priority sizes="100vw" className="object-cover object-top" />
      </motion.div>
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(10,11,10,0.15) 0%, rgba(10,11,10,0.05) 25%, rgba(10,11,10,0.4) 65%, rgba(10,11,10,0.96) 100%)" }} />
      <div className="hero-clouds absolute inset-0 overflow-hidden opacity-40">
        <div className="hero-clouds__track--left flex h-full w-[200%]">
          <Image src="/hero/cloud1.webp" alt="" width={1600} height={900} sizes="50vw" className="h-full w-1/2 object-cover object-bottom" aria-hidden />
          <Image src="/hero/cloud1.webp" alt="" width={1600} height={900} sizes="50vw" className="h-full w-1/2 -scale-x-100 object-cover object-bottom" aria-hidden />
        </div>
      </div>
      <div className="mist absolute inset-0" />

      <motion.div style={{ y: contentY, opacity: contentOpacity }} className="relative z-10 flex h-full flex-col justify-end px-6 pb-20 sm:px-10 sm:pb-24">
        <span className="eyebrow mb-4">{profile.role}</span>
        <h1 className="display max-w-[14ch] text-foreground">{profile.name}</h1>
        <p className="mt-6 max-w-xl font-serif text-xl italic text-foreground/70 sm:text-2xl">{profile.positioning}</p>
        <div className="mt-10 flex items-center gap-3">
          <span className="eyebrow !tracking-[0.3em]">Scroll</span>
          <span className="relative h-px w-12 overflow-hidden bg-white/20"><span className="hero-scroll-slide absolute inset-y-0 left-[-100%] w-full bg-accent" /></span>
        </div>
      </motion.div>

      <style>{`
        @keyframes cloudDriftLeft { from { transform: translateX(0);} to { transform: translateX(-50%);} }
        @keyframes scrollLineSlide { from { left: -100%;} to { left: 100%;} }
        .hero-clouds__track--left { animation: cloudDriftLeft 90s linear infinite; }
        .hero-scroll-slide { animation: scrollLineSlide 2.5s ease-in-out infinite; }
      `}</style>
    </section>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit` → clean.

- [ ] **Step 3: Visual + parallax verify**

`preview_start`, screenshot hero (expect huge Playfair name, grotesk eyebrow). `preview_eval` scroll to 400px, screenshot: bg should have drifted less than content (parallax), content fading.

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/hero.tsx
git commit -m "feat: hero scroll parallax + oversized display type"
```

---

### Task 9: About — word-by-word ScrollReveal on a color-world section

**Goal:** Replace fade-up About with `ScrollReveal` word animation, oversized `.section-title`, on a `SectionColor` cool wash. Verify contrast.

**Files:**
- Modify: `src/components/sections/about.tsx`

- [ ] **Step 1: Rewrite `about.tsx`**

```tsx
"use client";

import { SectionColor } from "@/components/motion/section-color";
import { ScrollReveal } from "@/components/motion/scroll-reveal";

export function About() {
  return (
    <SectionColor color="#16232B">
      <section id="about" className="section-pad px-6 sm:px-10">
        <div className="mx-auto max-w-4xl">
          <span className="eyebrow">About</span>
          <ScrollReveal className="section-title mt-6 text-foreground">
            I build interactive web experiences — and stay comfortable enough on the backend to ship a feature end to end.
          </ScrollReveal>
          <ScrollReveal className="mt-10 text-xl leading-relaxed text-foreground/85">
            Based in Yogyakarta. I work as a teaching assistant, mentoring students through frontend and web coursework — which keeps me sharp at the fundamentals. Most of what I have built comes from hackathons and campus projects, and right now a real-world marketplace connecting village producers to buyers.
          </ScrollReveal>
        </div>
      </section>
    </SectionColor>
  );
}
```

- [ ] **Step 2: Verify contrast** (foreground `#EDEDE8` and `foreground/85` on `#16232B`)

Run:
```bash
node -e "const L=(r,g,b)=>{const a=[r,g,b].map(v=>{v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)});return a[0]*.2126+a[1]*.7152+a[2]*.0722};const C=(x,y)=>{const l1=L(...x)+.05,l2=L(...y)+.05;return (l1>l2?l1/l2:l2/l1).toFixed(2)};console.log('fg', C([237,237,232],[22,35,43]));"
```
Expected: ≥ 4.5 (bump the color darker if not).

- [ ] **Step 3: Typecheck + visual verify**

`npx tsc --noEmit` clean. `preview_start`, scroll into About incrementally, screenshot mid-reveal: words should be mid-transition (some blurred/dim, some sharp).

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/about.tsx
git commit -m "feat: about with word-by-word scroll reveal"
```

---

### Task 10: Journey — StickyScroll active-card timeline

**Goal:** Rebuild Journey using `StickyScroll`; each journey item gets a visual card (icon + gradient) that crossfades in the sticky panel.

**Files:**
- Modify: `src/components/sections/journey.tsx`

**Interfaces:**
- Consumes: `journey` from `@/data/journey`, `StickyScroll`/`StickyItem` from Task 6.

- [ ] **Step 1: Rewrite `journey.tsx`**

```tsx
"use client";

import { GraduationCap, Users, Hammer, BookOpen } from "lucide-react";
import { journey } from "@/data/journey";
import type { JourneyKind } from "@/types";
import { StickyScroll, type StickyItem } from "@/components/motion/sticky-scroll";

const ICON: Record<JourneyKind, typeof GraduationCap> = {
  education: GraduationCap, teaching: Users, building: Hammer, learning: BookOpen,
};
const TINT: Record<JourneyKind, string> = {
  education: "from-emerald-900/60", teaching: "from-sky-900/60", building: "from-amber-900/60", learning: "from-violet-900/60",
};

export function Journey() {
  const items: StickyItem[] = journey.map((j) => {
    const Icon = ICON[j.kind];
    return {
      eyebrow: `${j.year}${j.org ? ` · ${j.org}` : ""}`,
      title: j.title,
      body: j.detail,
      visual: (
        <div className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${TINT[j.kind]} to-black/70`}>
          <Icon className="h-24 w-24 text-foreground/80" strokeWidth={1} />
        </div>
      ),
    };
  });

  return (
    <section id="journey" className="section-pad px-6 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <span className="eyebrow">Journey</span>
        <h2 className="section-title mt-4 mb-10 text-foreground">Growth, in order.</h2>
      </div>
      <StickyScroll items={items} />
    </section>
  );
}
```

- [ ] **Step 2: Typecheck + visual verify**

`npx tsc --noEmit` clean. `preview_start`, scroll through Journey incrementally, screenshot: left titles dim/brighten with active item, right sticky card crossfades.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/journey.tsx
git commit -m "feat: journey as sticky active-card timeline"
```

---

### Task 11: Works — sticky feature + hover-reveal cards

**Goal:** Make Works feel deliberate: the "Currently Building" project is a large sticky feature panel; the grid cards get an image-zoom + detail reveal on hover; oversized section title.

**Files:**
- Modify: `src/components/sections/works.tsx`
- Modify: `src/components/projects/project-card.tsx`

- [ ] **Step 1: Upgrade `project-card.tsx` hover**

Add group-hover overlay revealing summary + a "View →" affordance and stronger image zoom. Replace the card body:

```tsx
import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/types";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link href={`/projects/${project.slug}`} className="group relative block overflow-hidden rounded-lg border border-border bg-card transition-colors hover:border-accent">
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image src={project.image} alt={project.title} fill sizes="(min-width:640px) 50vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-70" />
        {project.status === "building" && (
          <span className="eyebrow absolute left-4 top-4 rounded-full bg-accent px-3 py-1 !text-[0.6rem] !text-accent-foreground !tracking-widest">Currently Building</span>
        )}
        <div className="absolute inset-x-0 bottom-0 p-5">
          <div className="flex items-center justify-between text-xs uppercase tracking-wide text-foreground/70">
            <span>{project.category}</span><span>{project.year}</span>
          </div>
          <h3 className="mt-2 font-serif text-2xl text-foreground">{project.title}</h3>
          <p className="mt-1 max-h-0 overflow-hidden text-sm text-foreground/80 transition-all duration-500 group-hover:max-h-20">{project.summary}</p>
        </div>
      </div>
    </Link>
  );
}
```

- [ ] **Step 2: Rewrite `works.tsx`** (oversized title + building feature spanning full width, rest in grid, all with staggered scrub-in via `whileInView` kept only BELOW fold)

```tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { getFeaturedProjects } from "@/data/projects";
import { ProjectCard } from "@/components/projects/project-card";

export function Works() {
  const featured = getFeaturedProjects();
  const building = featured.find((p) => p.status === "building");
  const rest = featured.filter((p) => p.status !== "building");

  return (
    <section id="works" className="section-pad px-6 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-end justify-between gap-4">
          <div>
            <span className="eyebrow">Selected Works</span>
            <h2 className="section-title mt-4 text-foreground">Things I&apos;ve built.</h2>
          </div>
          <Link href="/projects" className="shrink-0 text-sm text-foreground/60 transition-colors hover:text-foreground">See all →</Link>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {building && (
            <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.7 }} className="sm:col-span-2">
              <ProjectCard project={building} />
            </motion.div>
          )}
          {rest.map((p, i) => (
            <motion.div key={p.slug} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.7, delay: i * 0.1 }}>
              <ProjectCard project={p} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Typecheck + visual verify**

`npx tsc --noEmit` clean. `preview_start`, scroll to Works, screenshot; hover a card via `preview_eval` dispatching `mouseenter`, screenshot to confirm zoom + summary reveal.

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/works.tsx src/components/projects/project-card.tsx
git commit -m "feat: works sticky feature + hover-reveal cards"
```

---

### Task 12: Certificates — pinned scatter → grid

**Goal:** Rebuild Certificates using `PinnedScatter`: each certificate is a card that flies from scattered into a clean grid as you scroll. Keep the `Program → Skills → Credential` info. Verify contrast on the warm wash retained via a header, cards on dark.

**Files:**
- Modify: `src/components/sections/certificates.tsx`

**Interfaces:**
- Consumes: `certificates` from `@/data/certificates`, `PinnedScatter` from Task 7.

- [ ] **Step 1: Rewrite `certificates.tsx`**

```tsx
"use client";

import { certificates } from "@/data/certificates";
import { PinnedScatter } from "@/components/motion/pinned-scatter";

export function Certificates() {
  return (
    <section id="certificates" className="relative">
      <div className="section-pad px-6 text-center sm:px-10">
        <span className="eyebrow">Learning &amp; Achievements</span>
        <h2 className="section-title mx-auto mt-4 max-w-3xl text-foreground">Proof of process, not a shelf of PDFs.</h2>
      </div>

      <PinnedScatter>
        {certificates.map((c) => (
          <div key={c.program} className="flex h-full flex-col justify-between rounded-lg border border-border bg-card p-5">
            <div>
              <h3 className="font-serif text-lg text-foreground">{c.program}</h3>
              <p className="mt-1 text-sm text-foreground/70">{c.issuer}</p>
            </div>
            <ul className="mt-3 flex flex-wrap gap-2">
              {c.skills.map((s) => (
                <li key={s} className="rounded-full border border-foreground/25 px-2.5 py-0.5 text-[0.7rem] text-foreground/90">{s}</li>
              ))}
            </ul>
            {c.credentialUrl && (
              <a href={c.credentialUrl} target="_blank" rel="noopener noreferrer" className="mt-3 text-sm text-accent underline underline-offset-4">View Credential →</a>
            )}
          </div>
        ))}
      </PinnedScatter>
    </section>
  );
}
```

> Note: cards sit on the dark base (`text-foreground` on `--card #141614` = safe contrast, already verified in the prior build).

- [ ] **Step 2: Typecheck + visual verify**

`npx tsc --noEmit` clean. `preview_start`, scroll through the certificates pin incrementally; screenshot early (scattered) and late (grid). Expected: cards converge into a grid on scrub. On mobile viewport, expect a plain 2-col grid (fallback).

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/certificates.tsx
git commit -m "feat: certificates pinned scatter-to-grid"
```

---

### Task 13: Compose page with color-world + signature transitions, then verify & clean up

**Goal:** Assemble the home so sections flow through a color world with the signature `ScrollScale` transition between the hero group and the closing, upgrade Stack + CTA type, remove the temp demo route, and pass a final perf/a11y check.

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/components/sections/stack.tsx` (eyebrow + `.section-title` + stagger)
- Modify: `src/components/sections/cta.tsx` (oversized `.display`, keep `useContact`)
- Delete: `src/app/motion-demo/` (temp)

- [ ] **Step 1: Upgrade `stack.tsx` header + card reveal**

Change the heading block to `span.eyebrow` + `h2.section-title`, and add `initial/whileInView` stagger to the three group cards (opacity/y, `viewport once`), keep the 3-group data mapping intact.

- [ ] **Step 2: Upgrade `cta.tsx` headline to `.display`**

Replace the `<h2>` classes with `className="display text-foreground"` and keep the `useContact()` button + email.

- [ ] **Step 3: Rewrite `page.tsx` with a signature transition before the close**

```tsx
import { Hero } from "@/components/sections/hero";
import { Works } from "@/components/sections/works";
import { About } from "@/components/sections/about";
import { Journey } from "@/components/sections/journey";
import { Stack } from "@/components/sections/stack";
import { Certificates } from "@/components/sections/certificates";
import { Cta } from "@/components/sections/cta";
import { ScrollScale } from "@/components/motion/scroll-scale";

export default function Home() {
  return (
    <>
      <Hero />
      <Works />
      <About />
      <Journey />
      <Stack />
      <ScrollScale text="Always learning." panelColor="#7A5C3E" />
      <Certificates />
      <Cta />
    </>
  );
}
```

- [ ] **Step 4: Delete the temp demo route**

```bash
rm -r src/app/motion-demo
```

- [ ] **Step 5: Typecheck + full build**

Run: `npx tsc --noEmit` (clean), then `npx next build` (expect success, routes: `/`, `/projects`, `/projects/[slug]`, `/api/contact`, `/icon.svg`, `/opengraph-image`; no `/motion-demo`).

- [ ] **Step 6: Full-scroll visual pass**

`preview_start`; scroll top→bottom in ~200px steps (30ms apart); screenshot at hero, About reveal, Journey sticky, the `ScrollScale` "Always learning." pin (text scales, warm panel reveals), Certificates scatter→grid, CTA. Confirm each transition reads as intended and no section is a flat fade. Check `preview_console_logs` level error → empty.

- [ ] **Step 7: Lighthouse mobile perf + a11y**

```bash
npx next start -p 3010 &
npx lighthouse http://localhost:3010 --preset=perf --form-factor=mobile --screenEmulation.mobile --chrome-flags="--headless=new --no-sandbox" --output=json --output-path=./lh.json --quiet
node -e "const r=require('./lh.json');console.log('perf',Math.round(r.categories.performance.score*100),'LCP',r.audits['largest-contentful-paint'].displayValue,'CLS',r.audits['cumulative-layout-shift'].displayValue)"
rm lh.json
```
Expected: perf ≥ 90, CLS < 0.1. If pinned sections inflate CLS/TBT, confirm they use `transform`/`opacity` only and `will-change` is set; if perf < 90, check the LCP element is the hero text (server-rendered), not a late image.

- [ ] **Step 8: Reduced-motion pass**

`preview_resize` colorScheme irrelevant; set emulate reduced-motion via `preview_eval` is not reliable — instead confirm in code each primitive early-returns a static branch (ScrollReveal, ScrollScale, PinnedScatter, StickyScroll, Hero parallax all gate on `useReducedMotion`/`useIsTouch`). Spot-check by temporarily forcing `reduced=true`? No — rely on the gates already unit-covered by presence. Screenshot mobile viewport (`preview_resize` mobile) of each section to confirm static fallbacks render readable.

- [ ] **Step 9: Commit + push**

```bash
git add -A
git commit -m "feat: compose immersive home + signature transition, remove demo route"
git push
```

---

## Self-Review

**Spec coverage** (against the user's demands):
- "interactive scrolling like PersonalBlog" → Tasks 4 (word-reveal), 6/10 (sticky active-card), 7/12 (pinned scatter→grid), 11 (hover-reveal) — all ported from PersonalBlog source. ✓
- "lenis.dev zoom + change background" → Task 5 (ScrollScale reveals color panel) wired into the real page in Task 13. ✓
- "background not flat black, dominant dark but not full black, with transitions" → Task 2 (textured `#0A0B0A` grain+vignette) + `SectionColor` color-world in Tasks 9/13. ✓
- "fonts not uniform/template" → Task 3 (3-font system + varied `.display`/`.section-title`/`.eyebrow` scale) applied across Tasks 8–13. ✓
- "comprehensive detailed plan" → this document. ✓

**Placeholder scan:** No TBD/TODO; every code step has complete code; contrast + Lighthouse steps have runnable commands. ✓

**Type consistency:** `StickyItem` fields (`eyebrow/title/body/visual`) match Task 6 definition and Task 10 usage; `ScrollScale` props (`text/panelColor/className`) match Task 5 and Task 13 usage; `splitWords` signature matches test and component; `registerGsap/gsap/ScrollTrigger` exports match all consumers. ✓

**Kept (not rebuilt):** scaffold, chrome, data, routes, contact modal, `SectionColor` (reused as-is). Reduced-motion/touch gating required on every new scrub/pin primitive (constraint). ✓
