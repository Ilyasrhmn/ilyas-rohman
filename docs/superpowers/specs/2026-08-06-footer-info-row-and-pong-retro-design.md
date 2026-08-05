# Footer info row fix + pong retro-arcade treatment — Design Spec

Date: 2026-08-06
Status: approved, ready for implementation

## Problem 1: footer info row reads as broken

`src/components/layout/footer.tsx`'s name/location/socials/copyright row wraps in `text-[var(--world-b-text)]` (line 14). `--world-b-text` resolves to `#172019` (near-black ink meant for the cream World B surface) — but the footer's background is a hardcoded permanently-dark `bg-[#101612]`. Measured contrast: ~1.07:1. `--world-b-muted` (used for location/copyright) is `#687269` on the same background, ~3.4:1 — also under the 4.5:1 AA minimum. This is the same bug fixed earlier this session and then explicitly reverted at the user's request (to undo unrelated over-eager changes); it is now back, and the user is independently flagging that the row "reads as off" without knowing the specific cause.

Additionally, the row's `justify-between` layout strands the social links (GITHUB / LINKEDIN) alone in the middle of a wide row with substantial empty space on either side at desktop widths.

## Fix 1

- Replace `--world-b-*` CSS variable references in this row with literal hex values matching the footer's actual permanently-dark palette (the same constants already used elsewhere in the footer/pong: `#E8E5DA` text, `#98A39A` muted, `#8FAF8F` accent, `#29342C` border) — CSS variables are unsafe here because nothing in the site inverts them for this row's context, and the row is *always* dark regardless of any theme state (the theme toggle was removed entirely earlier tonight anyway).
- Restructure from `justify-between` to a left-aligned grid, approved shape:
  ```
  Ilyas Nur Rohman            ELSEWHERE
  YOGYAKARTA, INDONESIA       GITHUB
  {profile.email}             LINKEDIN
  ────────────────────────────────────
  © 2026 Ilyas Nur Rohman
  ```
  Two columns above a hairline, copyright on its own row below it. Email becomes a visible `mailto:` link (currently only appears in the accent ribbon above, not in this row). "ELSEWHERE" is a small mono uppercase tracked label above the social links column, matching the site's established micro-heading pattern (e.g. achievements' `[001]` group headers use the same visual weight for structural labels).
- Every link keeps a ≥44px hit area and a visible focus ring, matching the standard already used throughout the site.

## Problem 2: pong overlays don't feel like a game, and Start got a double box

Earlier tonight, a shared `panelClass` wrapper (solid backdrop + border) was added to all four overlay states (idle, life-lost, gameover, win) to fix a real legibility bug — white text and green borders were blending into the green pixel-letter art on `gameover`/`win`/`life-lost`, where hit pixels are bright. But `idle` never had that problem (before any life is lost, all letter pixels are still dim/unhit, so there's nothing bright behind the Start button) — wrapping it in the same panel produced two nested bordered boxes of nearly identical size, reading as a rendering mistake rather than a deliberate two-part composition.

Separately, the user wants the whole game to read as a genuine retro 8-bit arcade game (Pong / Snake / Mario-era), not a site-styled overlay — and wants inviting copy so visitors realize the footer has a playable game at all, since currently nothing signals that before you scroll all the way down and notice a small "Start" button.

## Fix 2

- **Typography**: add `Press Start 2P` via `next/font/google`, scoped to `pong-game.tsx` only — not applied anywhere else on the site. This is the standard, recognizable bitmap-style arcade font; it's the deliberate exception to the site's serif/mono voice, not an extension of it, because this element is meant to read as "arcade cabinet dropped into the footer," not "another site section."
- **Idle state**: remove the panel wrapper. Two lines of retro-font copy above a single bordered Start button (button keeps its own border — a button having a border is normal, that's not the "double box" problem; the problem was a *panel* and a *button* forming two near-identical nested rectangles):
  ```
  A GAME IS HIDING HERE
  TRY TO SPELL MY NAME

  [ PRESS START ]
  ```
- **Life-lost / Game Over / Win**: keep the panel backdrop (still genuinely needed here), but restyle: `Press Start 2P` font, thicker border (`border-4` instead of the site's usual hairline `border`/`border-b`) so it reads as a chunky arcade-screen frame rather than the site's normal thin-hairline card. Copy stays as already written (`Life lost`, `Game Over`, `You spelled it.`) but rendered uppercase in the retro font.
- **Canvas HUD** (hearts, `Progress: NN%`) is unchanged — it's already pixel art, no font issue there.
- All buttons keep ≥44px hit area and visible focus rings — the retro restyle is visual only, not an accessibility regression.

## Out of scope

- No changes to game mechanics (already implemented and working: one paddle, 3 lives, win/lose states).
- No changes to the site's global typography — `Press Start 2P` is scoped to this one component.
- No changes to `HorizontalProjects.tsx` or `Roadmap.tsx` (handled earlier tonight).

## Verification

- `npx tsc --noEmit`, `npx eslint` on both touched files.
- Contrast check on the footer info row: confirm the new literal-hex pairs clear 4.5:1 against `#101612` (same method used earlier tonight — WCAG relative luminance, then confirmed live via computed styles).
- Confirm idle state renders as a single bordered element (no nested panel), and life-lost/gameover/win keep their legibility fix.
- Confirm the footer email link is a real `mailto:` anchor, ≥44px, focus-visible.
- Commit locally as usual. **Do not `git push` or deploy — still holding per this session's standing instruction until explicitly told to push.**
