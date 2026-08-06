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
45 FPS, so regressions surface as a failure rather than a feeling.

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

`/projects` and `/achievements` hold a clean 58–60 FPS / <1.5% jank
throughout, confirming the Lenis/GSAP scroll system itself was never the
bottleneck — the cost was home-page-specific render work. Idle scroll is
now a clean 60 FPS / 0% jank in production, versus real jank before this
work; the three fixes are documented in the
`perf(home): stop three perpetual/thrashing animations` commit.

**Known residual:** an occasional single-frame stall (roughly 600–1000ms
under 4× throttle, still present unthrottled on some passes) lands
consistently around the point the Capabilities section's pinned
ScrollTrigger engages. It looks like several scroll-driven systems
(ScrollTrigger pinning, an IntersectionObserver callback, and the orbital
timeline's interval starting) landing in the same frame rather than a
single fixable bug, and it doesn't reproduce on every run. It's the reason
`npm run perf` still exits non-zero on home even though jank dropped
6.7×  — a fresh profile of that one collision is the honest next step,
not another speculative edit.
