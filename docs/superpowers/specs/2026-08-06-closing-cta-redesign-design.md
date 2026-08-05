# Closing flow (ClosingTransition + CTASection + footer ribbon) — Design Spec

Date: 2026-08-06
Status: approved, ready for implementation

## Problem

The site's final stretch — `ClosingTransition.tsx` → `CTASection.tsx` → the site-wide footer's marquee — was assembled from a different template than the rest of the site and never reconciled.

Concretely:

1. **Duplicate messaging.** `ClosingTransition` ends a 400vh pinned scroll-scrub by fading in "Ready to build?" — then `CTASection`, immediately below it, opens with its own "Let's build something [word] together." Two consecutive "let's start" prompts.
2. **Off-brand typography.** Both sections use `font-black uppercase tracking-tighter` — the same generic-bold voice already replaced everywhere else on the site (achievements, footer signature, the Achievements landing preview fixed earlier this session) with serif type and mono eyebrows.
3. **Autonomous motion where the site otherwise only moves on scroll.** Every other piece of motion on the site is scroll-driven: Roadmap's glow line tracks `scrollYProgress`, the achievements threshold scrubs with the scroll, `ScrollScale` zooms with the scroll. `CTASection`'s two crossed `InfiniteRibbon` marquees and the footer's `InfiniteRibbon` run on their own CSS-animation clock regardless of whether the user is scrolling — the one motion device on the site that ignores the reader. This is the concrete, nameable reason it reads as "not matching," independent of color or font.
4. **Two dead links.** `CTASection`'s buttons point to `/contact` and `/resume`, neither of which exists as a route. Contact is a modal (`useContact()` from `ChromeShell`), not a page. `/resume` was never built. Both buttons currently 404 on the live site.

## Approach

Collapse the redundant messaging into one beat: `ClosingTransition` closes the journey narrative and settles the color transition; `CTASection` alone carries the call to action. Replace every autonomous-clock marquee in scope with either scroll-tied motion or static text — never something that runs whether or not the reader is scrolling. Reuse `GooeyText` (already established by `Manifesto`) for the CTA's word-morph instead of inventing a second, worse implementation — this also avoids repeating the italic-serif-statement pattern already used on the Achievements landing preview, since `GooeyText`'s look (`font-bold font-serif tracking-tighter`, no italic) reads as a distinct voice.

## Changes

### `src/components/sections/ClosingTransition.tsx`

- Wrapper cut from `h-[400vh]` to roughly `h-[180vh]` — the timeline's `2.0`–`4.0` unit blocking (of the original 4-unit scale) gets rescaled proportionally into the shorter scrub range so the same beats (background darkens, journey text fades, nav colors shift) still happen, just without ~2 empty screens of scroll doing nothing first.
- "The Journey Continues" restyled from `font-black uppercase tracking-tighter` to a plain serif treatment consistent with Roadmap's big year numerals (`font-serif font-semibold tracking-tight`, no uppercase, no italic).
- The `.closing-dark-text` "Ready to build?" reveal is removed entirely — no replacement text. The section's job ends at "the color has finished settling into World A dark"; `CTASection` picks up the actual prompt immediately below it.

### `src/components/sections/CTASection.tsx`

- Both `InfiniteRibbon` marquees removed. Replaced with a single static (non-animated) mono meta line above the headline: `AVAILABLE FOR WORK · YOGYAKARTA, INDONESIA · REMOTE-FRIENDLY`, styled like the achievements hero's meta row (`font-mono text-xs uppercase tracking-wide`, hairline `·` separators, muted color) — informational, not decorative motion.
- The custom `AnimatePresence`/`rotateX`-flip word-cycle is replaced by the existing `GooeyText` component (`@/components/ui/gooey-text-morphing`, already imported by `Manifesto`). Sentence frame: **"Got an idea? Let's build [word]."** — cycling words: `it.`, `something real.`, `an interface.`, `a system.` — concrete nouns tied to what the site actually claims (`profile.positioning`: "I build interactive web experiences...") rather than the original's generic adjectives (Amazing/Innovative/Creative/Intelligent).
- Sub-copy rewritten to drop the agency-pitch voice ("Let's turn it into reality with scalable architecture and intelligent systems.") for something shorter and in the site's own register — final wording to match the dry, first-person tone established by the achievements page and Manifesto (drafted at implementation time, not fixed here word-for-word beyond the headline).
- Both CTA buttons restyled from rounded-full filled/outlined pills to the hairline sharp-corner mono style already established by `achievements/closing.tsx` (`border px-6 py-3 font-mono text-xs uppercase tracking-[0.2em]`).
- **Link fix (functional, not just cosmetic):** "Start a project" no longer renders as a `<Link href="/contact">` — it becomes a `<button>` calling `useContact()` (the same context `ChromeShell` already provides; `CTASection` needs `"use client"`, which it already has, and needs to be rendered somewhere inside `ChromeShell`'s `ContactContext.Provider` — it already is, via `page.tsx` → `ChromeShell`). "View my work" becomes `<Link href="/projects">`, replacing the nonexistent `/resume`.
- The scroll-triggered fade-in (`gsap.fromTo('.cta-content', ...)`) stays — it's scroll-triggered (fires once on entering viewport), not an autonomous loop, so it doesn't violate the motion principle.

### Site-wide footer (`src/components/layout/footer.tsx`)

- The `InfiniteRibbon` band (currently "THANK YOU FOR SCROLLING", running on its own animation clock) is replaced with a static, non-animated line carrying the same accent-colored band styling (`bg-[var(--world-b-accent)]`) but no `Marquee`/`animation: marquee` — plain centered text, no motion. Content: the same composed contact line pattern used elsewhere tonight (`AVAILABLE FOR WORK · {email} · {location}`), consistent with `CTASection`'s new meta line without being a verbatim repeat (footer is a closing credit line, CTASection's is a meta/status row — different visual role, same information register).
- `src/components/ui/infinite-ribbon.tsx` and `src/components/ui/marquee.tsx` are left in place (not deleted) — they may still be reachable/useful elsewhere later; this spec only stops using them at these two call sites. If, after this change, nothing else in the live component tree imports them, that's a follow-up dead-code cleanup, not part of this change.

## Out of scope

- Redesigning the footer's middle content row or wordmark signature (already handled earlier this session).
- Any change to `Manifesto.tsx` itself — `GooeyText` is reused, not modified.
- Deleting `infinite-ribbon.tsx`/`marquee.tsx` even if they end up fully unused after this change (separate cleanup pass, not bundled here).

## Verification

- `npx tsc --noEmit`, `npx eslint` on changed files.
- Confirm in the running app: "Start a project" opens the contact modal (not a 404), "View my work" navigates to `/projects`.
- Confirm no element in the closing flow or footer uses a CSS `animation` that runs without user scroll (i.e., no `Marquee`/`InfiniteRibbon` remains at these three call sites).
- Confirm `ClosingTransition`'s scroll-scrub still completes its color transition smoothly at the shorter scroll distance (no snap), same class of check used for the achievements threshold fix earlier this session.
