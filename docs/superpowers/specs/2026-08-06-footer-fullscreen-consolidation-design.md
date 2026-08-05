# Footer full-screen consolidation + arrow-entity fix — Design Spec

Date: 2026-08-06
Status: approved, ready for implementation

## Problem

After the info-row contrast/layout fix earlier tonight, the footer reads as two stacked, competing blocks: a tall two-column info card (name/location/email, then a full "Elsewhere" column with a heading above the social links), then a hairline, then a separate copyright block, then a *second* hairline wrapper, then the pong game constrained to `h-[50vh] min-h-[400px] sm:h-[70vh]`. The user's screenshots show real dead space between the info block and where the game visually starts, and the two-column card is described as "gede banget panjang lebar ngambil tempat" (huge, tall and wide, taking up space) relative to what it actually needs to say.

Separately: hovering a social link renders the literal text `&NEARR;` instead of an arrow glyph. `&nearr;` as a bare JSX text child is not guaranteed to be HTML-entity-decoded by the JSX transform, so the raw string sits in the DOM; the parent's `uppercase` CSS class then uppercases that raw string into `&NEARR;`. This is a pre-existing bug (predates tonight), just rarely visible since the arrow is `opacity-0` except on hover.

## Fix

### `src/components/layout/footer.tsx`

Collapse the current three-block structure (info card → copyright block → game wrapper) into one continuous full-screen composition:

- The whole footer below the accent ribbon becomes a single `h-screen` section (or `min-h-screen`, whichever reads correctly once built) containing, top to bottom:
  1. **A slim single-line info bar** — not the current tall two-column card. One row: `Ilyas Nur Rohman · Yogyakarta, Indonesia · {email}` on the left (or wrapping sensibly on mobile), `GITHUB` `LINKEDIN` inline on the right. Same literal-hex colors already fixed tonight, same `mailto:` link, same focus rings and `min-h-[44px]` hit areas — just laid out as one compact row instead of a two-column card with its own heading ("Elsewhere") and vertical list.
  2. **The pong game, filling essentially all remaining vertical space** — change its container from `h-[50vh] min-h-[400px] sm:h-[70vh]` to fill the section (e.g. `flex-1` inside a flex column section, or an explicit height calculated from the remaining viewport — implementer's call on the exact mechanism, the outcome is "no visible dead gap between the info bar and the game, and the game is the dominant visual element of the screen").
  3. **A slim copyright line at the very bottom** of the same screen, not a separately-padded block with its own top border above it — just enough space to read comfortably.
- Net result: one full-viewport-height footer screen. Thin bar, then the game (now the dominant element, arcade-HUD-like), then a thin copyright line. Not three stacked sections with independent padding fighting each other.
- Fix the arrow: replace the literal `&nearr;` JSX text with the actual Unicode character `↗` typed directly into the JSX (not an HTML entity reference), so there's no decoding step to fail.

### No changes to `pong-game.tsx` mechanics

The game itself (states, physics, retro font, panel/button styling from tonight's earlier pass) is unchanged — only the *container* it sits in changes size. If the taller container means the internal letter-pixel layout recalculates (it already reads `container.clientWidth`/`clientHeight` via `ResizeObserver` in `resizeCanvas`), that's expected and desired — the game should visually fill the new, larger space.

## Out of scope

- No changes to game mechanics, colors, or the retro-arcade typography treatment already done tonight.
- No changes to any other section of the site.

## Verification

- `npx tsc --noEmit`, `npx eslint` on `footer.tsx` (and `pong-game.tsx` only if its container-sizing assumptions needed touching).
- `npm run build`.
- Browser: confirm no dead gap between the info bar and the game at a real viewport height; confirm the info bar is a single compact row, not a tall card; confirm hovering a social link shows an actual `↗` glyph, not literal text; confirm the game canvas resizes to the new larger container (check `canvas.width`/`height` or visually that the letters are noticeably larger than before).
- Commit locally as usual. **Do not `git push` or deploy — still holding until explicitly told to push.**
