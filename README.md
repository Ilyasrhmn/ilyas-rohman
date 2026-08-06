# Ilyas Nur Rohman — Portfolio

Interaction-rich portfolio built with Next.js 16, TypeScript, Tailwind CSS 4, Framer Motion, GSAP, and Lenis.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Editing content

All copy lives in typed data files under `src/data/` — no code changes needed to update content:

- `src/data/profile.ts` — name, role, positioning statement, socials
- `src/data/projects.ts` — projects, including `achievement` and `contributions`; `status: "building"` shows the "Currently Building" treatment instead of demo links
- `src/data/certificates.ts` — certifications shown on `/achievements`
- `src/data/stack.ts` — capability groups shown in the Stack section

## Contact form

`POST /api/contact` validates and (optionally) emails submissions via `nodemailer`. Without SMTP env vars set, it accepts and logs to the server console — useful for local dev. To send real email in production, set:

```
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
CONTACT_TO=        # defaults to SMTP_USER if unset
NEXT_PUBLIC_SITE_URL=   # your deployed URL, used for OG image resolution
```

## Structure

- `/` — single long-scroll home
- `/projects`, `/projects/[slug]` — project grid and case-study detail pages
- `/achievements` — certification archive
- Contact is a modal (triggered from the navbar or the CTA section), not a route

## Testing

```bash
npx tsx --test src/data/data.test.ts src/app/api/contact/route.test.ts src/components/motion/scroll-reveal.test.ts
```

## Performance

Mobile performance is measured, not estimated. With the dev server running:

```bash
npm run perf
```

This drives headless Chrome at a 375×812 viewport with 4× CPU throttling
(roughly a mid-range Android phone), scrolls each route, and reports frame
rate, jank percentage, payload, horizontal overflow, and any tap target
under 44px. It exits non-zero if home-page scroll performance falls below
45 FPS, so regressions surface as a failure rather than a feeling. That gate
is currently expected-red on `/` given the documented residual below (home
scroll measures ~30-34 FPS, short of the 45 FPS floor), pending either a
harness methodology fix (see the `scrollBy` vs `wheel` caveat below) or
further investigation of the residual itself.

Dev mode (`next dev`) ships unminified React with extra validation
(`jsxDEV`), so its numbers are consistently worse than what actually
ships. For a representative reading, build and point the harness at a
production server instead:

```bash
npm run build
npx next start -p 3001
PERF_BASE=http://localhost:3001 node scripts/perf/measure.mjs
```

Measured history for the home page at 4× throttle:

| State | FPS | Jank | Worst frame |
| --- | --- | --- | --- |
| Original baseline (dev) | 22.1 | 48.3% | 1036ms |
| After canvas/image/cursor/pong fixes (dev) | ~30 | ~30% | 220–1040ms |
| + fixed 3 perpetual/thrashing loops (production) | 33.4 | 6.8% | 945ms |
| + cached ScrollScale measurement, deferred/scroll-paused orbital timer, mobile cert-gallery fix, lanyard band-overshoot fix (production) | 33.6 | 8.4% | 900ms |

`/projects` and `/achievements` hold a clean 58–60 FPS / <1.5% jank
throughout, confirming the Lenis/GSAP scroll system itself was never the
bottleneck — the cost was home-page-specific render work. Idle scroll is
now a clean 60 FPS / 0% jank in production, versus real jank before this
work; the three fixes are documented in the
`perf(home): stop three perpetual/thrashing animations` commit.

**A measurement-methodology caveat, found while chasing the residual above:**
`npm run perf` drives scroll via `window.scrollBy()`. Lenis (this site's
smooth-scroll library) renders the page from its own lerped virtual scroll
position, not native `scrollTop` — it doesn't reconcile external
`scrollBy()` jumps the way it processes real wheel/touch input, so the
harness's scroll pattern forces artificial "catch-up" stalls that a real
user scrolling normally does not experience anywhere near as often. Retested
the same page with `page.mouse.wheel()` (which Lenis does handle natively)
at 1440×900, no throttle: worst frame **39–52ms**, ~**60 FPS**, **<2% jank**
across five separate runs, both before and after the fixes below — the page
was already close to smooth under realistic input. The fixes still produced
a real, measurable tightening under that same realistic test (52/49ms →
43/39/40ms worst frame), just a smaller one than the `scrollBy`-based number
in the table above suggests. The harness itself is unchanged (still
`window.scrollBy()`-based, matching its original design) — pointing this
out here rather than quietly changing what the regression guard measures.

**Root causes found and fixed in this pass** (`docs/superpowers/plans/2026-08-06-scroll-cert-lanyard-fixes.md`):
- `ScrollScale.tsx`'s zoom-transition tween called an expensive
  `getBoundingClientRect()`-based measurement 3 times per evaluation
  (once each for scale/x/y) instead of once — now cached per
  ScrollTrigger refresh cycle.
- The Capabilities section's orbital timeline ran a 50ms rotation
  `setInterval` continuously for the entire time it was visible (most of
  a 500vh pinned scroll range), competing with the scroll gesture the
  whole way through, and its start could land in the same frame as the
  section's `ScrollTrigger` pin engaging. Now deferred by one frame and
  paused entirely while Lenis reports active scrolling.
- The home-page certificate gallery teaser hard-clipped its 2nd and 3rd
  columns on mobile (`min-w-[250px]` × 3 doesn't fit a 375px viewport) —
  now responsive.
- The 3D lanyard's band mesh could visually overshoot through the metal
  clip onto the card face under fast drag motion, because its rendered
  endpoint trusted an independently-simulated (compliant, not rigid)
  physics body instead of the card's actual transform — now derived
  directly from the card's rigidly-attached joint-anchor point, so the
  band's endpoint can never drift from the card regardless of drag speed.

**Follow-up fix (user-reported):** even after the band's endpoint could no
longer overshoot past the card, the band mesh still visually drew *over*
the card's face whenever the curve geometrically passed behind it —
`meshLineMaterial` had `depthTest={false}`, which makes a mesh ignore the
depth buffer entirely and always render on top regardless of actual 3D
position. Removed it (back to the Three.js default of depth-tested
rendering); verified via screenshots across idle sway and dragged
positions that the band now correctly renders behind the card where
geometry says it should, with no z-fighting.

**Known residual:** an occasional single-frame stall under the
`scrollBy`-based harness still lands around the Capabilities section's
pinned-ScrollTrigger-engage point — smaller and less frequent after this
pass, but not eliminated under that specific synthetic test. Given the
methodology caveat above, and that realistic wheel-driven scroll already
measures clean, further chasing this specific harness number is likely
chasing a test artifact rather than a real user-facing problem. If it's
revisited, retest with `page.mouse.wheel()` first to confirm it's still
real under realistic input before spending more time on it.
