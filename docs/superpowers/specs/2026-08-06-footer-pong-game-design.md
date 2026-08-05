# Footer pong: from ambient decoration to a playable game — Design Spec

Date: 2026-08-06
Status: approved, ready for implementation

## Problem

The footer's pong easter egg (`src/components/ui/animated-hero-section.tsx`, exported as `PromptingIsAllYouNeed`) is four AI-controlled paddles boxing a ball in on all sides, batting it against pixel letters spelling "ILYASRHMN" until they change color. It's decorative — nothing the visitor does affects it. The user wants it to be an actual game: one paddle, mouse-controlled, three lives, win/lose states.

## Approach (A, approved)

- One paddle, bottom only, horizontal, driven by mouse X (plus keyboard arrows and touch drag as alternative input).
- Top, left, right walls bounce the ball, same as today. Bottom has no wall — it's open, guarded only by the paddle.
- Ball missing the paddle and reaching the bottom costs one life. Three lives total, rendered as small 8-bit pixel hearts drawn on the canvas (same fillRect-per-pixel technique already used for the letters).
- Losing all three lives ends the game: GAME OVER overlay, "Play Again" button, resets to a fresh 3-life game.
- The letter-pixel "brick" mechanic already in the code (ball bounces off an unhit pixel, pixel flips to the hit color) is unchanged. New: once every pixel across all letters is hit, the game ends in a **win** — "You spelled it." overlay, same "Play Again" button. This is the reason to keep a win state at all instead of an endless loop: the name being spelled out is the point of the whole piece, so finishing it should mean something instead of just continuing to bounce forever.
- A small HUD shows hearts (top-left) and a rough completion readout, e.g. "Progress: 62%" (fraction of letter pixels hit) — cheap to compute, gives the player something to chase toward the win state without needing per-letter tracking.

## States

`idle` → `playing` → (`life-lost` pause, ~700ms, non-interactive but rendered) → back to `playing`, or → `gameover` / `win` (terminal, "Play Again" returns to `idle` with a fresh game, not an auto-restart).

`idle` is fully static: letters unlit, no ball, no paddle motion, just the wordmark-adjacent "Start" button. This is also the `prefers-reduced-motion` boundary — nothing animates until the player explicitly presses Start. Once pressed, that's a deliberate user-initiated interaction, not unsolicited motion, so gameplay is not gated behind reduced-motion the way the site's ambient/decorative motion is elsewhere. This matches how the achievements page's own reduced-motion guards work: they suppress motion nobody asked for, not something the visitor just explicitly clicked to start.

Overlays (`idle`'s Start button, `life-lost`'s brief "beat," `gameover`/`win`'s text and "Play Again") are real DOM elements absolutely positioned over the canvas — not drawn and hit-tested on canvas — so they're real, keyboard-reachable, focus-visible `<button>`s rather than fake canvas buttons.

## Controls

- Mouse: paddle x tracks cursor x (relative to canvas, clamped so the paddle never leaves the canvas).
- Touch: same mapping, driven by touchmove.
- Keyboard: `ArrowLeft`/`ArrowRight` nudge the paddle a fixed step per keydown (including the browser's native key-repeat while held — no separate held-state loop needed). Listener attaches only while `state === "playing"`, removed otherwise.

## Rename

The component is renamed from `PromptingIsAllYouNeed` (a leftover ironic name from wherever this was adapted from, meaningless in this file's actual content now) to `PongGame`, file `src/components/ui/animated-hero-section.tsx` → `src/components/ui/pong-game.tsx`. One import site to update: `src/components/layout/footer-signature.tsx`'s `next/dynamic` import.

## Constraints carried over from the existing implementation (do not regress)

- DPR-aware canvas sizing (capped at 2x), all game math in CSS-pixel logical coordinates — this was a real bug fixed earlier this session, must not be reintroduced.
- `requestAnimationFrame` id stored and cancelled on unmount; `IntersectionObserver` pauses the loop when the footer scrolls out of view.
- Still lives behind the existing "Play pong" / "Close" toggle in `footer-signature.tsx` — that gate is unchanged. What's inside it changes; the gate itself doesn't.

## Out of scope

- Persisted high scores / leaderboards.
- Difficulty ramping (ball speed increase over time, multiple balls, power-ups).
- Sound.
- Anything outside `pong-game.tsx` (renamed) and the one import line in `footer-signature.tsx`.

## Verification

- `npx tsc --noEmit`, `npx eslint` on both touched files.
- `npm run build`.
- Manual/browser check: Start button begins a static-until-pressed game; mouse and keyboard both move the paddle; losing the ball with 0 lives left shows Game Over with a working Play Again; hitting every letter pixel shows the win overlay; reduced-motion leaves the idle screen fully static until Start is pressed.
- Commit locally as usual. **Do not `git push` or deploy — explicit instruction this session, only push when told.**
