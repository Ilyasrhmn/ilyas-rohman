# /achievements Redesign — Design Spec

Date: 2026-07-31
Status: approved, ready for implementation

## Problem

`/achievements` reads like a different product from the landing page.

| Landing language | Current `/achievements` |
| --- | --- |
| `--world-a-*` / `--world-b-*` tokens | generic shadcn tokens (`bg-secondary/50`, `text-primary`) |
| `font-serif` headings (Playfair) | `font-black tracking-tighter` |
| sharp-cornered 1px-border blocks | `glass-card rounded-xl`, `rounded-full` pills |
| every section numbered (`[004]`, `01 //`) | no numbering |
| BlurReveal, parallax, watermark, GSAP scrub | zero motion |

Three structural faults:

1. **Duplicate headline.** "Validating Excellence through Global Standards" appears verbatim in both `src/components/sections/Achievements.tsx` and the page hero. Clicking the CTA repeats the sentence the user just read.
2. **Broken world continuity.** The CTA sits in the cream World B section; the destination page is dark and generic. No bridge.
3. **Duplicate data.** `Achievements.tsx` hardcodes 11 image paths that already exist in `src/data/certificates.ts` alongside track, skills and credential metadata.

## Approach

Editorial index, not another image grid. The landing already shows certificate images in a parallax gallery — repeating that here adds size, not information. The index gives what the gallery cannot: track, issuer, year, skills, credential ID. Images stay reachable through a cursor-following preview and the detail modal.

## Page structure

### 1. Hero — World B (cream)

Continuous with the CTA's colour, so the click reads as staying in the room.

- Back link, mono, no pill: `← Index`
- Eyebrow, mono, uppercase, accent: `ARCHIVE — 011 CERTIFICATES`
- H1, serif, large: `Eleven certificates.`
- Lede, muted, max ~65ch: `Most of them Dicoding, one HackerRank, one from a blockchain literacy month. None of them make me a senior engineer — they just mark where I stopped guessing and started knowing.`
- Meta row, mono, hairline-separated: `11 CERTIFICATES · 6 TRACKS · 2 ISSUERS · LAST ADDED JUN 2026`

Counts derive from `certificates.ts` at build time, never hardcoded.

### 2. Threshold — cream dissolving into dark

One sticky section, GSAP scrub on scroll:

- background colour animates `--world-b-bg` → `--world-a-bg`
- text colour animates `--world-b-text` → `--world-a-text`
- giant serif watermark `ARCHIVE` drifts on parallax at low opacity
- grain overlay fades in

One dry mono line rides through the transition: `Everything below is the full list, ordered by track.`

No new dependency. GSAP + ScrollTrigger are already installed and registered elsewhere in the codebase.

### 3. Index — World A (dark)

Grouped by `track`, groups ordered by certificate count descending.

Group header: `[001]` mono accent · track name serif · hairline rule · `2 CERTS` mono muted. Each track carries a one-line note in the site's voice:

| Track | Note |
| --- | --- |
| Frontend | `The bulk of it. This is the part I do for a living.` |
| AI & Machine Learning | `Where the maths stopped being optional.` |
| Design | `Enough UX to argue with a designer and lose politely.` |
| Data Science | `One course, one honest beginner.` |
| Blockchain | `A literacy month. I came out curious, not converted.` |
| Problem Solving | `Algorithms, timed, no autocomplete.` |

Rows are full-width, hairline-separated:

```
01   Belajar Dasar AI                Dicoding Indonesia   2026   →
02   Belajar Penerapan AI di Web     Dicoding Indonesia   2026   →
```

- index number: mono, muted
- program: serif, `clamp(1.25rem, 3vw, 2.25rem)`
- issuer + year: mono, muted, right-aligned
- hover/focus: row background lifts to `--world-a-surface`, program shifts to `--world-a-accent`, arrow slides right
- hover only: certificate thumbnail follows the cursor with a framer-motion spring, `aria-hidden`, suppressed on touch and under `prefers-reduced-motion`
- row min-height 44px, visible focus ring

### 4. Detail — modal

Reuses the existing `src/components/ui/dialog.tsx`. No new route.

- full certificate image, `object-contain`, never cropped
- labelled meta, mono uppercase: `ISSUER`, `ISSUED`, `EXPIRES`, `CREDENTIAL ID`
- `WHAT IT COVERED` — every skill as a sharp-cornered chip, not a pill; show all, no `+3` truncation
- primary action: `Verify on {issuer} ↗` opening `credentialUrl` in a new tab
- when `credentialUrl` is empty (Bulan Literasi Blockchain): `No public credential link for this one.` — no dead button
- `expiryDate` is optional; omit the row entirely when absent

Deep link: the open certificate syncs to `?cert=<slug>`, so a modal state is shareable and the browser back button closes it.

### 5. Closing — back to World B (cream)

Reverse threshold, shorter than the entry one.

- Line, serif: `That's the whole shelf.`
- Sub, muted: `Certificates are a floor, not a ceiling. If you want to see what I built on top of them, the work is one click away.`
- Primary: `See the work →` → `/projects`
- Secondary: `Start a conversation` → calls `useContact()` from `ChromeShell`

## Data cleanup

`src/components/sections/Achievements.tsx` drops its hardcoded 11-path array and maps `certificates.map(c => c.image)` from `src/data/certificates.ts`. Single source of truth. The landing headline stays; the page headline is now different, so the duplication is resolved from the page side.

## Motion

- `BlurReveal` (existing) for hero and group headers
- rows stagger in at 40ms intervals, `ease-out`, ≤300ms each
- thresholds scrub with GSAP `ScrollTrigger`, `invalidateOnRefresh: true`
- everything respects `prefers-reduced-motion` via the existing `use-reduced-motion` hook: no scrub, no cursor preview, instant reveals

## Accessibility

- rows are real links/buttons, keyboard reachable, focus ring visible in both worlds
- cursor preview is decorative and `aria-hidden`; hover is never the only way to reach information
- certificate images carry the program name as alt text
- modal traps focus, closes on `Esc`, returns focus to the originating row
- contrast verified separately for the cream and dark halves

## Out of scope

- per-certificate static routes (`/achievements/[slug]`) — the modal plus `?cert=` query covers sharing
- filtering or search — 11 items grouped by track do not need it
- editing the landing `Achievements.tsx` layout beyond the data import
