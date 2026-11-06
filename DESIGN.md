---
name: Care4Students
description: A student's open ledger on heavy paper in daylight, ruled in hairlines and big plain figures, with one deep moment where each grant is written in line by line.
northStar: Bright Ledger
doctrine: convenium-design-kinetic

colors:
  canvas: "#f6f6f3"
  surface: "#ffffff"
  ink: "#283848"
  ink-2: "#5b6975"
  line: "#d9dde1"
  primary: "#18b1bf"
  primary-text: "#0e7b86"
  depth: "#316272"
  deep: "#0f2a33"
  on-deep-muted: "#a8bac2"
  line-deep: "#2c4c58"
  warm: "#f6bd13"
  warm-ink: "#3a2d00"
  mint: "#38e8d8"
  destructive: "#b3261e"

typography:
  hero-phone:
    fontFamily: "Plus Jakarta Sans, Jakarta Fallback, system-ui, sans-serif"
    fontSize: "clamp(3.25rem, 18vw, 5.5rem)"
    fontWeight: 800
    lineHeight: 0.9
    letterSpacing: "-0.04em"
  hero:
    fontFamily: "Plus Jakarta Sans, Jakarta Fallback, system-ui, sans-serif"
    fontSize: "clamp(3.25rem, min(12vw, 23svh), 12.5rem)"
    fontWeight: 800
    lineHeight: 0.9
    letterSpacing: "-0.04em"
  page-h1:
    fontFamily: "Plus Jakarta Sans, Jakarta Fallback, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 11vw, 5.5rem)"
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: "-0.03em"
  display:
    fontFamily: "Plus Jakarta Sans, Jakarta Fallback, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 5.5vw, 5.5rem)"
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: "-0.03em"
  serif-accent:
    fontFamily: "Instrument Serif, Serif Fallback, Georgia, serif"
    fontSize: "1em"
    fontStyle: "italic"
    fontWeight: 400
    lineHeight: "inherit"
    letterSpacing: "-0.01em"
  ledger-figure-phone:
    fontFamily: "Plus Jakarta Sans, Jakarta Fallback, system-ui, sans-serif"
    fontSize: "clamp(3.5rem, 21vw, 9rem)"
    fontWeight: 800
    lineHeight: 0.9
    letterSpacing: "-0.04em"
    fontVariantNumeric: "tabular-nums"
  ledger-figure:
    fontFamily: "Plus Jakarta Sans, Jakarta Fallback, system-ui, sans-serif"
    fontSize: "clamp(5rem, 11vw, 11rem)"
    fontWeight: 800
    lineHeight: 0.9
    letterSpacing: "-0.04em"
    fontVariantNumeric: "tabular-nums"
  row-amount-phone:
    fontFamily: "Plus Jakarta Sans, Jakarta Fallback, system-ui, sans-serif"
    fontSize: "clamp(1.75rem, 8vw, 2.25rem)"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.02em"
    fontVariantNumeric: "tabular-nums"
  row-amount:
    fontFamily: "Plus Jakarta Sans, Jakarta Fallback, system-ui, sans-serif"
    fontSize: "clamp(2rem, min(4.2vw, 7svh), 3.5rem)"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.02em"
    fontVariantNumeric: "tabular-nums"
  stat-figure:
    fontFamily: "Plus Jakarta Sans, Jakarta Fallback, system-ui, sans-serif"
    fontSize: "clamp(2rem, 3vw, 3rem)"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.02em"
    fontVariantNumeric: "tabular-nums"
  footer-wordmark:
    fontFamily: "Plus Jakarta Sans, Jakarta Fallback, system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 12.6vw, 12.6rem)"
    fontWeight: 800
    lineHeight: 0.85
    letterSpacing: "-0.04em"
  lead:
    fontFamily: "Plus Jakarta Sans, Jakarta Fallback, system-ui, sans-serif"
    fontSize: "clamp(1.125rem, 1.2vw, 1.375rem)"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0"
  pull-quote:
    fontFamily: "Instrument Serif, Serif Fallback, Georgia, serif"
    fontSize: "clamp(1.375rem, 1.1rem + 1vw, 1.75rem)"
    fontStyle: "italic"
    fontWeight: 400
    lineHeight: 1.35
    letterSpacing: "0"
  row-name:
    fontFamily: "Plus Jakarta Sans, Jakarta Fallback, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "0"
  body:
    fontFamily: "Plus Jakarta Sans, Jakarta Fallback, system-ui, sans-serif"
    fontSize: "clamp(1rem, 0.96rem + 0.2vw, 1.0625rem)"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0"
  meta:
    fontFamily: "Plus Jakarta Sans, Jakarta Fallback, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0"
  label:
    fontFamily: "Plus Jakarta Sans, Jakarta Fallback, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "0.14em"
    textTransform: "uppercase"
  button-label:
    fontFamily: "Plus Jakarta Sans, Jakarta Fallback, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0"
  nav-link:
    fontFamily: "Plus Jakarta Sans, Jakarta Fallback, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "0"
  input:
    fontFamily: "Plus Jakarta Sans, Jakarta Fallback, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0"
  tab-label:
    fontFamily: "Plus Jakarta Sans, Jakarta Fallback, system-ui, sans-serif"
    fontSize: "0.6875rem"
    fontSizeFrom360: "0.75rem"
    fontWeight: 500
    fontWeightCurrent: 700
    lineHeight: 1
    letterSpacing: "0"

rounded:
  none: "0"
  control: "0.25rem"

spacing:
  scale: "4 8 16 24 32 48 64 128 px"
  gutter: "clamp(16px, 2.8vw, 40px)"
  grid-columns: 12
  grid-gap: "24px"
  measure: "68ch"
  content-max: "1600px"
  section-phone: "48px"
  section: "clamp(5rem, 10vh, 9rem)"
  nav-height: "72px"
  nav-height-phone: "56px"
  tab-bar-height: "calc(64px + env(safe-area-inset-bottom))"
  touch-min: "44px"
  tap-floor: "24px"
  button-height: "48px"
  button-gap: "8px"
  row-ledger-pinned: "clamp(56px, 9svh, 80px)"
  row-toggle-min: "48px"
  row-sheet-min: "48px"
  row-faq-min: "56px"
  row-footer-min: "44px"
  rule: "1px"
  rule-hover: "2px"
  toggle-box: "24px"
  mask-pad-bottom: "0.25em"
  mask-pad-inline: "0.08em"
  mark-hero: "min(34vw, calc(100svh - 372px))"
  mark-hero-phone: "62vw"
  mark-hero-phone-bleed: "-6vw"

motion:
  micro: "150ms"
  press: "120ms"
  settle-text: "300ms"
  move: "400ms"
  scene: "800ms"
  sheet-open: "300ms"
  sheet-close: "200ms"
  count-phone: "900ms"
  live-region-delay: "500ms"
  fonts-ready-cap: "1200ms"
  loader-delay: "300ms"
  ease-out: "cubic-bezier(.16,1,.3,1)"
  ease-in-out: "cubic-bezier(.65,0,.35,1)"
  stagger: "60ms"
  stagger-max: 8
  scrub: 1
  press-scale: 0.97
  hero-settle-from: "translateY(.06em)"
  row-settle-from: "translateY(.5em)"
  nav-threshold: "80px"
  guard: "(min-width: 1024px) and (pointer: fine) and (min-height: 640px) and (prefers-reduced-motion: no-preference)"
  dragonfly-sequence:
    frames: 16
    fallback-frames: 0
    start: "top top"
    end: "bottom top"
    scrub: 1
    pin: false
    draw: "canvas, crossfading adjacent frames by fraction"
    frame-max: "30KB"
    total-max: "480KB"
    fetch: "after load and idle, guard only, skipped on saveData"
    swap: "poster stays until all 16 decode"
  ledger-pin:
    height: "100dvh"
    end: "+=220%"
    scrub: 1
    invalidate-on-refresh: true
    first-line: "0-35%"
    other-lines: "35-90%"
    last-line: "90-100%"
    counter-from: 0
    counter-to: 5040
  phone-reveal-root-margin: "0px 0px -10% 0px"
  personal-ledger:
    tick: "150ms"
    row-rule: "400ms"
    row-text: "300ms"
    figure-roll: "400ms"

breakpoints:
  target: "360-430 px is the primary layout; 1280x720 and 1440x900 are the designed desktops"
  floor: "320px"
  tab-label-step: "360px"
  cta-stack-below: "360px"
  desktop-nav: "768px"
  nav-name-visible: "900px"
  guard-width: "1024px"
  guard-height: "640px"
  content-max: "1600px"

components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.ink}"
    typography: "{typography.button-label}"
    rounded: "{rounded.control}"
    height: "{spacing.button-height}"
    padding: "0 16px"
    contrast: 4.62
  button-primary-on-deep:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.ink}"
    typography: "{typography.button-label}"
    rounded: "{rounded.control}"
    height: "{spacing.button-height}"
    padding: "0 16px"
    contrast: 4.62
    fillAgainstGround: 5.77
  button-warm:
    backgroundColor: "{colors.warm}"
    textColor: "{colors.warm-ink}"
    typography: "{typography.button-label}"
    rounded: "{rounded.control}"
    height: "{spacing.button-height}"
    padding: "0 16px"
    contrast: 7.85
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    borderColor: "{colors.ink}"
    typography: "{typography.button-label}"
    rounded: "{rounded.control}"
    height: "{spacing.button-height}"
    padding: "0 16px"
    contrast: 11.09
  button-destructive:
    backgroundColor: "{colors.destructive}"
    textColor: "{colors.canvas}"
    typography: "{typography.button-label}"
    rounded: "{rounded.control}"
    height: "{spacing.button-height}"
    padding: "0 16px"
    contrast: 6.04
  link:
    textColor: "{colors.primary-text}"
    typography: "{typography.body}"
    contrast: 4.62
  nav-link-canvas:
    textColor: "{colors.ink}"
    typography: "{typography.nav-link}"
    contrast: 11.09
  nav-bar-depth:
    backgroundColor: "{colors.depth}"
    textColor: "{colors.canvas}"
    typography: "{typography.nav-link}"
    rounded: "{rounded.none}"
    height: "{spacing.nav-height}"
    contrast: 6.22
  nav-signup:
    backgroundColor: "{colors.warm}"
    textColor: "{colors.warm-ink}"
    typography: "{typography.nav-link}"
    rounded: "{rounded.control}"
    contrast: 7.85
    fillAgainstDepth: 3.91
  tab-bar:
    backgroundColor: "{colors.surface}"
    height: "{spacing.tab-bar-height}"
  tab-cell:
    textColor: "{colors.ink}"
    typography: "{typography.tab-label}"
    rounded: "{rounded.none}"
    contrast: 12.00
  tab-cell-current:
    textColor: "{colors.ink}"
    borderColor: "{colors.ink}"
    typography: "{typography.tab-label}"
    rounded: "{rounded.none}"
    contrast: 12.00
  tab-cell-signup:
    backgroundColor: "{colors.warm}"
    textColor: "{colors.warm-ink}"
    typography: "{typography.tab-label}"
    rounded: "{rounded.none}"
    contrast: 7.85
  sheet:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    contrast: 12.00
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    borderColor: "{colors.ink-2}"
    typography: "{typography.input}"
    rounded: "{rounded.control}"
    height: "{spacing.button-height}"
    padding: "0 16px"
    contrast: 12.00
    borderAgainstCanvas: 5.21
  row-canvas:
    textColor: "{colors.ink}"
    borderColor: "{colors.line}"
    typography: "{typography.row-name}"
    rounded: "{rounded.none}"
    contrast: 11.09
  row-deep:
    textColor: "{colors.canvas}"
    borderColor: "{colors.line-deep}"
    typography: "{typography.row-name}"
    rounded: "{rounded.none}"
    contrast: 13.86
  row-deep-arriving:
    textColor: "{colors.warm}"
    borderColor: "{colors.warm}"
    typography: "{typography.row-name}"
    rounded: "{rounded.none}"
    contrast: 8.72
  ledger-figure:
    textColor: "{colors.warm}"
    typography: "{typography.ledger-figure}"
    contrast: 8.72
  toggle-off-deep:
    backgroundColor: "transparent"
    borderColor: "{colors.on-deep-muted}"
    textColor: "{colors.canvas}"
    rounded: "{rounded.control}"
    size: "{spacing.toggle-box}"
    contrast: 13.86
    boxAgainstGround: 7.48
  toggle-on-deep:
    backgroundColor: "{colors.warm}"
    borderColor: "{colors.warm}"
    tickColor: "{colors.warm-ink}"
    textColor: "{colors.canvas}"
    rounded: "{rounded.control}"
    size: "{spacing.toggle-box}"
    contrast: 13.86
    boxAgainstGround: 8.72
    tickAgainstBox: 7.85
  toggle-off-canvas:
    backgroundColor: "transparent"
    borderColor: "{colors.ink-2}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    size: "{spacing.toggle-box}"
    contrast: 11.09
    boxAgainstGround: 5.21
  toggle-on-canvas:
    backgroundColor: "{colors.warm}"
    borderColor: "{colors.ink}"
    tickColor: "{colors.warm-ink}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    size: "{spacing.toggle-box}"
    contrast: 11.09
    boxAgainstGround: 11.09
    tickAgainstBox: 7.85
  written-row-deep:
    textColor: "{colors.canvas}"
    borderColor: "{colors.line-deep}"
    typography: "{typography.row-amount}"
    rounded: "{rounded.none}"
    contrast: 13.86
  written-row-note-deep:
    textColor: "{colors.on-deep-muted}"
    typography: "{typography.meta}"
    contrast: 7.48
  running-figure-deep:
    textColor: "{colors.warm}"
    typography: "{typography.row-amount}"
    contrast: 8.72
  running-figure-canvas:
    backgroundColor: "{colors.warm}"
    textColor: "{colors.warm-ink}"
    typography: "{typography.row-amount}"
    rounded: "{rounded.none}"
    padding: "16px"
    contrast: 7.85
  in-ledger-mark:
    backgroundColor: "{colors.warm}"
    borderColor: "{colors.ink}"
    tickColor: "{colors.warm-ink}"
    textColor: "{colors.ink}"
    typography: "{typography.meta}"
    rounded: "{rounded.control}"
    size: "20px"
    contrast: 11.09
  signup-progress-empty:
    borderColor: "{colors.line}"
    textColor: "{colors.ink-2}"
    typography: "{typography.meta}"
    contrast: 5.21
  signup-progress-filled:
    borderColor: "{colors.ink}"
    textColor: "{colors.ink-2}"
    typography: "{typography.meta}"
    contrast: 5.21
    ruleAgainstGround: 11.09
---

# Care4Students — Bright Ledger

The numbers here come from `.olympus/06-build-plan.md`. Where this file adds to or corrects the plan, *Deputy decisions* under Colour and Type says so. The token block above is normative. Prose never restates a token with a different value.

## Visual World

**Creative North Star: "Bright Ledger".** A student's open ledger on heavy paper, in daylight. The ground is warm off-white paper, ruled edge to edge with 1 px hairlines. The loudest things on the page are big plain figures in Plus Jakarta Sans, with tabular numerals that line up down the page. One object sits on the desk: the dragonfly, a thin die-cut paper mark. Partway down the home page the paper goes deep blue-green, and each grant is written in line by line. Then it returns to daylight and closes on the site's name, whole, sitting on the last ruled line.

It is not a cinema, a dashboard, a card grid, a neon brand or a game. Education4Students uses video, scrim and pill nav. Care4Students does the sums: rows, numerals, a daylight ground and one deep moment. Same palette and typeface, opposite means. Someone comparing ten pages would pick this one out as the one that looks like accounts kept by a very good friend.

**The One Rule Rule.** Everything hangs off a hairline. The rule runs from the hero's stat strip through every list into the Ledger and closes under the footer's wordmark.

**Doctrine and its argued departures.** `convenium-design-kinetic`. Kept: one hero moment, choreography before composition, 0.9 display leading, the duration and ease tokens, stagger, scrub. Departed from, in writing: a light canvas in place of a dark ground, because the brand family requires it and contrast comes from the one deep moment; two accents instead of one, because primary is action and warm is an event; Plus Jakarta Sans and Instrument Serif instead of a wide grotesque, because the family fixes the typeface; no viewport-height sections as a default, because the phone budgets cannot hold them; hero tracking −0.04 em against the doctrine's −0.03 em, because the three short hero words need it; 24 and 48 px added to the doctrine's space scale, for the grid gap and phone section rhythm.

## Type

**Plus Jakarta Sans** is the brand voice and carries all text and interface. **Instrument Serif italic** is the one counterpoint. It marks only the object of help, on exactly these words: "Student *Bonuses* & Grants", "Student *Housing* Help", "Find Your House *Buddy*", "Everything You *Need*", "Why Students *Choose* Us", plus pull quotes. All three hero words are Jakarta 800, upright. "Transform" is never italic.

**The hero is 18vw on phones and 12vw from 768 px up**, the two ends of the doctrine's 12–18vw. Phones get the top of the range because the words must reach across a narrow screen, and at 12vw they would leave the first screen looking timid. Desktop gets the bottom of it because three stacked lines must share the first screen with the nav and the stat strip. See *Hero against the doctrine* below for where the guard pulls it under.

### The ramp

Every fluid size carries a rem term and a vw term. Sizes in px at viewport width × height, computed by script from the token block.

| Role | CSS | Line / tracking | 320×568 | 390×844 | 1280×720 | 1440×900 |
|---|---|---|---|---|---|---|
| `hero-phone`, under 768 px | `clamp(3.25rem, 18vw, 5.5rem)` | 0.9 / −0.04em | 57.6 | 70.2 | — | — |
| `hero`, 768 px up | `clamp(3.25rem, min(12vw, 23svh), 12.5rem)` | 0.9 / −0.04em | — | — | 153.6 | 172.8 |
| `page-h1` | `clamp(2.25rem, 11vw, 5.5rem)` | 0.95 / −0.03em | 36 | 42.9 | 88 | 88 |
| `display` (`h2`) | `clamp(2.25rem, 5.5vw, 5.5rem)` | 0.95 / −0.03em | 36 | 36 | 70.4 | 79.2 |
| `ledger-figure-phone`, under 768 px | `clamp(3.5rem, 21vw, 9rem)` | 0.9 / −0.04em | 67.2 | 81.9 | — | — |
| `ledger-figure`, 768 px up | `clamp(5rem, 11vw, 11rem)` | 0.9 / −0.04em | — | — | 140.8 | 158.4 |
| `row-amount-phone`, under 768 px | `clamp(1.75rem, 8vw, 2.25rem)` | 1 / −0.02em | 28 | 31.2 | — | — |
| `row-amount`, 768 px up | `clamp(2rem, min(4.2vw, 7svh), 3.5rem)` | 1 / −0.02em | — | — | 50.4 | 56 |
| `stat-figure` | `clamp(2rem, 3vw, 3rem)` | 1 / −0.02em | 32 | 32 | 38.4 | 43.2 |
| `footer-wordmark` | `clamp(2.5rem, 12.6vw, 12.6rem)` | 0.85 / −0.04em | 40.3 | 49.1 | 161.3 | 181.4 |
| `lead` | `clamp(1.125rem, 1.2vw, 1.375rem)` | 1.5 / 0 | 18 | 18 | 18 | 18 |
| `pull-quote` | `clamp(1.375rem, 1.1rem + 1vw, 1.75rem)` | 1.35 / 0 | 22 | 22 | 28 | 28 |
| `body` | `clamp(1rem, 0.96rem + 0.2vw, 1.0625rem)` | 1.5 / 0 | 16 | 16.1 | 17 | 17 |
| `row-name` | `1.0625rem` | 1.3 / 0 | 17 | 17 | 17 | 17 |
| `input`, `button-label` | `1rem` | 1.5, 1 / 0 | 16 | 16 | 16 | 16 |
| `nav-link` | `0.9375rem` | 1 / 0 | 15 | 15 | 15 | 15 |
| `meta` | `0.875rem` | 1.5 / 0 | 14 | 14 | 14 | 14 |
| `label` (eyebrow), uppercase by CSS | `0.75rem` | 1.3 / +0.14em | 12 | 12 | 12 | 12 |
| `tab-label` | `0.6875rem`, `0.75rem` from 360 px | 1 / 0 | 11 | 12 | — | — |

### Hero against the doctrine

The doctrine's `--display-max` is "clamp to viewport, 12–18vw normal for the hero". Computed, not measured in a browser:

| Viewport | Hero px | Hero vw | Against 12–18vw |
|---|---|---|---|
| 320×568, 360×740, 390×844, 430×932 | 57.6, 64.8, 70.2, 77.4 | 18 | In range, at the top |
| 767×1024 | 88 (5.5rem cap, from 489 px) | 11.47 | Under, tablet portrait below the breakpoint |
| 768×1024, 1024×768, 1440×900 | 92.2, 122.9, 172.8 | 12 | In range, at the bottom |
| 1280×720, 1600×900 | 153.6, 192 | 12 | In range, 12vw binds |
| 1280×650, 1366×650 | 149.5, 149.5 | 11.7, 10.9 | Just under, the 23svh guard |
| 1536×730 | 167.9 | 10.9 | Just under, the 23svh guard |
| 1920×950 | 200 (12.5rem cap) | 10.4 | Under, the cap |
| 2560×1300 | 200 (12.5rem cap) | 7.8 | Under, the cap |

**The guard, measured in the fix phase:** the director ruled that the stat strip on the first screen wins. In a browser at 1280×720, 1366×650 and 1280×650 the strip's last cell ends at 720, 650 and 650 (the fold, with no tab bar on desktop) for every guard from 20svh to 23svh, and ends at 663 and 654 (a miss) at 24svh. `23svh` is the largest whole value that fits all three, so it is committed: hero 153.6 px at 1280×720 (12vw) and 172.8 px at 1440×900. The strip's height at those sizes is set by the right column (mark, lead, CTAs), not by the words, so the mark's size term became `100svh - 372px` (was 356px); at 1440×900 the mark stays at its `34vw` cap. Recorded in `run.json`.

### Rules that keep it true

**The Measured Numerals Rule.** Any € amount uses `font-variant-numeric: tabular-nums` at weight 400, 700 or 800, the weights where `tnum` was measured. Instrument Serif has no `tnum`, so an amount is never set in it as a figure; "€2,400" inside Lisa M.'s quote is reading text.

**The Largest Figure Rule.** On home, €5,040 at `ledger-figure` keeps the largest type in its section. The running figure stays at `row-amount`, always.

**Masks** carry `padding-bottom: .25em; margin-bottom: -.25em`, and `padding-inline: .08em` with matching negative margin wherever serif italic can overhang, so "g" and "pp" are never clipped.

**Text zoom.** Rem bounds move with text size, so hero words and the wordmark carry `overflow-wrap: anywhere`: text-only zoom wraps them instead of clipping them. Browser zoom reports a narrower width and needs nothing extra.

### Loading

Self-hosted latin subset, `@fontsource` 5.3.0. `public/fonts/` holds woff2 copies, so the preload URL and the `@font-face` URL are the same. Three preloads: `plus-jakarta-sans-latin-800-normal.woff2`, `-400-`, `instrument-serif-latin-400-italic.woff2`, 45.8 KB together. `font-display: swap`. Weights 500, 600 and 700 load on use. Fallback faces, derived from font metrics and Windows' Arial and Georgia. Android's Roboto was named but not measured.

| Face | Source | `size-adjust` | `ascent-override` | `descent-override` | `line-gap-override` |
|---|---|---|---|---|---|
| Jakarta Fallback 600–800 | Arial Bold, Roboto Bold | 105% | 98.9% | 21.1% | 0% |
| Jakarta Fallback 400–500 | Arial, Roboto | 104.2% | 99.6% | 21.3% | 0% |
| Serif Fallback italic | Georgia Italic | 77.4% | 127.9% | 40.1% | 0% |

### Deputy decisions on type

The plan left these open or inconsistent with the rem+vw requirement. Each keeps the plan's numbers at every width it tabulated.

- `ledger-figure-phone` was a bare `21vw`; now `clamp(3.5rem, 21vw, 9rem)`. Only the cap differs, from 686 px up, so it can no longer exceed the desktop figure.
- `footer-wordmark` was a bare `12.6vw`; now `clamp(2.5rem, 12.6vw, 12.6rem)`. The cap sits at the 1600 px content maximum.
- Filled because nothing else named them: `pull-quote`, `body`'s fluid form of "16–17 px", `row-name`, `button-label`, `nav-link`, heading weights of 800 (already preloaded), and `serif-accent` at 1em inside its heading.

## Colour

Paper, ink, one action colour, one event colour, one deep moment. Ratios are WCAG 2.x, computed by script from these hexes on 2026-10-31 and re-checked against this file. Every ratio in these tables is that script's output.

**The Closed Palette Rule.** Every colour is in the token block. Nothing is composed at build time on public pages: no `/90` hovers, no tints, no gradients. A pairing not written below is not permitted.

**The Written Down Rule.** Warm means "this is written down": the Sign Up cell in nav and tab bar, one closing CTA per page, the Ledger figure, the Ledger's arriving line, and the visitor's own figure and ticks. Nowhere else.

**The Deep Once Rule.** `deep` is the Ledger's ground on `/` and "Your ledger", which continues it, and nowhere else. `mint` is dragonfly strokes on `deep`, never a glow.

### Legal: text

| Foreground | Background | Ratio | Use |
|---|---|---|---|
| `ink` | `canvas` | 11.09 | Reading text, headings, row amounts |
| `ink` | `surface` | 12.00 | Inputs, Sheet, tab bar |
| `ink` | `line` | 8.79 | Dropdown row on hover (`--accent`) |
| `ink-2` | `canvas` | 5.21 | Secondary text |
| `ink-2` | `surface` | 5.64 | Secondary text, input placeholder |
| `primary-text` | `canvas` | 4.62 | Small teal text, links, eyebrows, "Apply Now" |
| `primary-text` | `surface` | 5.00 | Links in Sheet and cards |
| `depth` | `canvas` | 6.22 | The mark on canvas; text if needed |
| `depth` | `surface` | 6.73 | The mark in the sidebar |
| `destructive` | `canvas` | 6.04 | Error text, alert |
| `destructive` | `surface` | 6.54 | Error text, "Log out" row |
| `destructive` | `line` | 4.79 | "Log out" row on hover |
| `canvas` | `depth` | 6.22 | Nav bar, CTA band, secondary button |
| `canvas` | `deep` | 13.86 | Ledger rows, written-in rows, toggle labels |
| `on-deep-muted` | `deep` | 7.48 | Descriptions and notes on deep |
| `warm` | `deep` | 8.72 | Ledger figure, arriving line, running figure |
| `warm` | `depth` | 3.91 | Large type only, ≥ 24 px; otherwise fill only |

### Legal: labels on fills

| Foreground | Background | Ratio | Use |
|---|---|---|---|
| `ink` | `primary` | 4.62 | Primary button, sidebar active row |
| `warm-ink` | `warm` | 7.85 | Warm CTA, Sign Up cell, running figure cell on canvas |
| `canvas` | `destructive` | 6.04 | Destructive button, badge |

A filled button on `canvas` is identified by its own label, so the fill-to-ground ratio (`primary` 2.40, `warm` 1.59) is not what makes it a button and is allowed there. Such a fill may never be the only cue. See the banned list.

### Legal: non-text, ≥ 3:1

| Foreground | Background | Ratio | Use |
|---|---|---|---|
| `ink-2` | `canvas` | 5.21 | Input border, toggle box off |
| `ink-2` | `surface` | 5.64 | Input border on surface |
| `ink` | `canvas` | 11.09 | Toggle box on, tick mark border, current tab rule, filled signup rule |
| `on-deep-muted` | `deep` | 7.48 | Toggle box off |
| `warm` | `deep` | 8.72 | Toggle box on |
| `warm-ink` | `warm` | 7.85 | The tick inside a box |
| `primary` | `deep` | 5.77 | Primary button fill on deep; a fill only, never text |
| `mint` | `deep` | 9.79 | Dragonfly strokes |
| `canvas` | `depth` | 6.22 | The mark in the depth bar |
| `ink` | `primary` | 4.62 | The hero mark under the words at full colour; ≥ 3:1 sampled in shade |

### Focus rings, 2 px, offset 2 px

| Ring | Lies on | Ratio | Where |
|---|---|---|---|
| `primary-text` | `canvas` | 4.62 | Default |
| `primary-text` | `surface` | 5.00 | Inputs, Sheet, tab bar, cards |
| `primary-text` | `line` | 3.67 | Dropdown row on hover; ring only |
| `warm` | `depth` | 3.91 | Nav bar, CTA band |
| `warm` | `deep` | 8.72 | Ledger, Your ledger |
| `warm-ink` | `warm` | 7.85 | Warm tab cell only, inset, because it has no ground beside it |

### Worst case on the ink-wash plate

The plate's pass test caps its 99th-percentile pixel at `line-deep`, so these are the floor for anything on `deep` when the plate is present.

| Foreground | Background | Ratio |
|---|---|---|
| `canvas` | `line-deep` | 8.50 |
| `on-deep-muted` | `line-deep` | 4.59 |
| `warm` | `line-deep` | 5.35 |
| `mint` | `line-deep` | 6.01 |
| `primary` | `line-deep` | 3.54 |

### Decorative only, never the only cue for a control

| Foreground | Background | Ratio | Use |
|---|---|---|---|
| `line` | `canvas` | 1.26 | Hairlines, empty signup rule |
| `line` | `surface` | 1.37 | Tab bar rules, Sheet rows |
| `line-deep` | `deep` | 1.63 | Hairlines on deep |

### Banned, measured so nobody rediscovers them

| Foreground | Background | Ratio | Why |
|---|---|---|---|
| `primary` | `canvas` | 2.40 | Fails as text, including at display size |
| `primary` | `surface` | 2.60 | Fails as text |
| `canvas` | `primary` | 2.40 | The old white-on-teal failure |
| `surface` | `primary` | 2.60 | The old white-on-teal failure |
| `primary` | `depth` | 2.59 | Fails on the bar and band |
| `warm` | `canvas` | 1.59 | Never text, never a lone cue |
| `warm` | `surface` | 1.72 | Never text |
| `warm` | `primary` | 1.51 | Never adjacent as meaning |
| `primary-text` | `warm` | 2.91 | So a ring never sits on warm |
| `mint` | `canvas` | 1.42 | The old mark's failure |
| `mint` | `surface` | 1.53 | Same |
| `on-deep-muted` | `depth` | 3.35 | Fails as body text on the band |
| `ink-2` | `line` | 4.13 | Why `--muted` is not `line` |
| `ink-2` | `deep` | 2.66 | Light-page text does not carry onto deep |
| `ink-2` | `warm` | 3.28 | Fails as a label |
| `ink` | `deep` | 1.25 | Same |
| `ink` | `depth` | 1.78 | Why the nav's links change |
| `depth` | `deep` | 2.23 | Depth mark or text on the Ledger |
| `destructive` | `deep` | 2.30 | No error text on deep |

### Measured, passes, still not permitted

| Foreground | Background | Ratio | Why not |
|---|---|---|---|
| `ink` | `warm` | 6.98 | `warm-ink` is the label colour; two would drift |
| `mint` | `depth` | 4.39 | Mint is on deep only |
| `surface` | `depth` | 6.73 | `canvas` is the light on depth |
| `surface` | `deep` | 15.01 | `canvas` is the light on deep |

### Tokens in CSS

`hsl(var(--x))` needs triplets that land exactly on the hex. The plan's whole-number triplets do not for seven tokens (`--primary-text` would compute `#0e7a86`, which would fail AC-D4's literal check), so these are the committed values. Script-verified to round-trip.

| Token | Triplet | Token | Triplet |
|---|---|---|---|
| `canvas` | `60 14% 96%` | `depth` | `195 40% 32%` |
| `surface` | `0 0% 100%` | `deep` | `195 55% 13%` |
| `ink` | `210 29% 22%` | `on-deep-muted` | `198 18% 71%` |
| `ink-2` | `207.7 12.5% 40.8%` | `line-deep` | `196.4 33.3% 25.9%` |
| `line` | `210 11.8% 86.7%` | `warm` | `44.9 92.7% 52%` |
| `primary` | `185 78% 42%` | `warm-ink` | `46.6 100% 11.4%` |
| `primary-text` | `185.5 81.1% 29%` | `mint` | `174.5 79.3% 56.5%` |
| `destructive` | `3 71% 41%` | | |

**shadcn mapping.**

| Variable | Token | | Variable | Token |
|---|---|---|---|---|
| `--background` | `canvas` | | `--accent` | `line` |
| `--foreground` | `ink` | | `--accent-foreground` | `ink` |
| `--card`, `--popover` | `surface` | | `--destructive` | `destructive` |
| `--card-foreground`, `--popover-foreground` | `ink` | | `--destructive-foreground` | `canvas` |
| `--primary` | `primary` | | `--border` | `line` |
| `--primary-foreground` | `ink` | | `--input` | `ink-2` |
| `--secondary` | `depth` | | `--ring` | `primary-text` |
| `--secondary-foreground` | `canvas` | | `--radius` | `0.25rem` |
| `--muted` | `canvas` | | `--sidebar-background` | `surface` |
| `--muted-foreground` | `ink-2` | | `--sidebar-foreground`, `--sidebar-accent-foreground` | `ink` |
| `--sidebar-primary` | `primary` | | `--sidebar-primary-foreground` | `ink` |
| `--sidebar-accent` | `canvas` | | `--sidebar-border` | `line` |
| `--sidebar-ring` | `primary-text` | | `--focus` (new, scoped) | `primary-text`; `warm` on depth and deep |

Retire `--teal`, `--teal-light`, `--navy`, `--navy-light`, every `--gradient-*`, `--shadow-glow`, `--shadow-button`, `.glass`, `.glass-dark` and `.transition-bounce`, plus `gradient-hero` and `gradient-subtle` from public pages. **No dark theme:** the `.dark` block goes, since nothing sets that class, and `sonner.tsx` is passed `theme="light"`.

### Deputy decisions on colour

Each closes a gap the plan left, within its own rules. The plan is otherwise followed exactly.

- **`--input` is `ink-2`, not `line`.** The plan maps `--input` to `line` and also says `line` is "never the only cue for a control". An input's border is its cue, and `line` measures 1.26 on canvas. `ink-2` measures 5.21.
- **`destructive` is new, `#b3261e`.** Login and signup alerts, "Log out" and the dashboard's "Danger Zone" use `text-destructive`. Today's `#ef4444` measures 3.48 on canvas and 3.76 under white. It is used only for errors, and warm never stands in for it.
- **`--muted` is `canvas` and `--accent` is `line`,** which the plan did not map. `--muted` cannot be `line`, because `--muted-foreground` on it would be 4.13.
- **The mark changes colour in the depth bar.** The plan says depth stroke in the nav and a depth bar past 80 px, which would hide it. It takes `currentColor`: `depth` on canvas, `canvas` on the bar.
- **`/bonuses` has no `deep`, so the visitor's warm sits in a fill there.** The plan's figure is "warm on deep", but `/bonuses` is on canvas, where warm text measures 1.59, and BRAND keeps the deep moment on `/`. On canvas the figure is `warm-ink` on a `warm` cell (7.85), and toggle boxes and row marks are warm fills with an `ink` border and `warm-ink` tick.
- **`text-primary` is remapped.** The dashboard sets real figures in it, such as "€8,640/year" at 2.60 on white, and cannot be relaid out. One rule in `index.css` points the `.text-primary` utility at `primary-text` (5.00 on white), which also covers any public page still using it.

## Layout

A 12-column grid with a 24 px gap, gutter `clamp(16px, 2.8vw, 40px)`, content to 1600 px with rules running full bleed. Section rhythm is 48 px on phones and `clamp(5rem, 10vh, 9rem)` above. Amounts lead rows. No viewport-height sections except the hero's `min-height: 100svh` and the pinned Ledger's `100dvh`. Always `min-height`, always `svh` or `dvh`. Reading columns are 68 characters.

| Width | What changes |
|---|---|
| 320–359 | Hero 57.6–64 px. CTAs stacked. Tab labels 11 px. Mark 198–223 px behind the words |
| 360–767 (primary) | Hero 64.8–88 px. CTAs side by side. Top bar 56 px, tab bar 64 px plus safe area. Footer two columns of 44 px rows. Ledger *stacked-phone* |
| 768–1023 | Desktop nav, name `sr-only` up to 899. No tab bar. Hero's right column appears. Ledger *stacked-wide* |
| 1024 up, fine pointer, ≥ 640 high | Ledger *pinned*, Lenis, frames, footer rule scrub |
| 1024 up, otherwise | Ledger *stacked-wide*, native scroll, poster |
| Above 1600 | Hero caps at 200 px, content at 1600 px, rules still full bleed |

**Ledger states.** *pinned* when the guard matches: two columns, figure left, rows right at `row-ledger-pinned`. *stacked-wide* at ≥ 768 px when it does not: same two columns at final state, free row height. *stacked-phone* under 768 px: one column, amount first in the row, name left and "Apply Now" right on the second line.

`overflow-x: hidden` on `html` or `body` is forbidden, because it breaks pinning. Use `overflow-x: clip` on sections.

## Elevation & Depth

Flat. No shadows, bordered cards, backdrop blur or gradients on public pages. Depth is conveyed by the one change of ground and the dragonfly's own light. The ink-wash plate sits under `deep` only if it passes its test, with `background-color: deep` always beneath it. Dashboard cards keep their existing shadows, because the dashboard's layout is out of scope.

## Shapes

Radius 0 on rows, sections, the nav bar, the Sheet and tab cells. 4 px on controls: buttons, inputs, toggle boxes, the nav's Sign Up block. Never a pill. 1 px rules, 2 px on hover and in the current tab. With `--radius` at `0.25rem`, shadcn's `lg` is 4 px, `md` 2 px and `sm` 0.

## Components

Exact colours, type roles and contrast for every component are in the token block. This section covers what tokens cannot.

### Buttons

Height 48 px, padding 16 px, gap 8 px. Hover, inside `@media (hover: hover)`: label underline only, never a colour change. Press: `scale(.97)` in 120 ms, origin centre. Primary is the default; `button-primary-on-deep` is "Explore Bonuses" and "Create Your Free Profile" in the deep section. Warm is the one closing CTA per page and "Sign Up". Outline is "How It Works".

The critique measured the two hero CTAs at 320 px of the 328 available at 360 with these label and padding sizes. `build-home` re-measures on the real fonts.

### Rows

The whole row is one `AuthCta` anchor on the Ledger, its accessible name reading name, amount, "Apply Now". Rule 1 px at rest. Hover: 2 px, sweeping in 400 ms on `ease-in-out`, drawn as a pseudo-element's `transform` so nothing shifts; `ink` on canvas, `canvas` on deep. Rows respond with the rule, never with scale.

### Navigation

Bar transparent on canvas, past 80 px a full-bleed square depth bar in 150 ms. The phone bar never hides. Tab bar: fixed, five text-only cells, rules between them, no icons, no enter animation. Hidden on `/dashboard/*`, while an input has focus, and with an open dialog via `body:has([role="dialog"])`, because shadcn's Sheet is `z-50`. Sheet rows ≥ 48 px, opening from the bottom.

### Gamification states

The personal ledger has **4 facts, 1 figure, 0 points.**

| State | On `deep`, home | On `canvas`, `/bonuses` |
|---|---|---|
| **Toggle row** | Native checkbox, `appearance: none`, in a ≥ 48 px ruled row; whole row is the label. Rule `line-deep` | Same. Rule `line` |
| **Toggle off** | 24 px box, 2 px `on-deep-muted` border (7.48), no fill. Label `canvas` (13.86) | 24 px box, 2 px `ink-2` border (5.21), no fill. Label `ink` (11.09) |
| **Toggle on** | Box and border `warm` (8.72), tick `warm-ink` (7.85). Label unchanged, weight unchanged | Box `warm`, 2 px `ink` border (11.09), tick `warm-ink` (7.85). Label unchanged |
| **Toggle press** | `scale(.97)`, 120 ms | Same |
| **Toggle focus** | `warm` ring on the box, offset 2 px (8.72) | `primary-text` ring on the box, offset 2 px (4.62) |
| **Written-in row** | Rule `line-deep` draws by `scaleX`, 400 ms; then name and amount settle from `translateY(.5em)` and opacity 0, 300 ms. Text `canvas` (13.86), amount at `row-amount` tabular. Warm is not used here. Desktop reserves five slots so nothing below moves | Not rendered: the rows below are the ledger |
| **Row match** | n/a | 20 px warm box, `ink` border, `warm-ink` tick, and "In your ledger" in `ink` at `meta` (11.09) |
| **Running figure** | "Up to €N" in `warm` (8.72) at `row-amount`, weight 700, tabular. "Up to" takes the same size and colour as the figure | The same string in `warm-ink` on a square `warm` cell (7.85), padding 16 px |
| **Figure rolls** | 400 ms on change, retargets from its current value if interrupted | Same |
| **Empty** | No figure. "Tick what's true for you." in `on-deep-muted` (7.48) | Same string in `ink-2` (5.21) |
| **Notes** | "An estimate, not a promise." always beside the figure, "Saved only in this browser." under the toggles: `on-deep-muted` at `meta` (7.48) | `ink-2` at `meta` (5.21) |
| **Clear** | Text button, `canvas`, underlined, ≥ 44 px high, only when something is ticked | `primary-text`, same |

Range 1,476 to 19,316. The figure never reaches `ledger-figure`. Its digits are `aria-hidden`; the true string is in a polite live region updated 500 ms after the last change. Forced colours restore the native checkbox (`appearance: auto`).

**Signup progress**, on canvas. A rule under the `h1` with four ticks. Empty segment 1 px `line` (decorative: the text carries the state), filled segment 2 px `ink` (11.09). "2 of 4 lines written" in `ink-2` at `meta` (5.21). "3 bonuses in your ledger" in `ink` at `meta` (11.09). No warm: it is the form's state, not the visitor's money. It never blocks submit.

### Other routes

Eyebrow, `h1`, lead, CTA where one exists, rule; then ledger rows and native `<details>` with summary rows ≥ 56 px. Inputs are `surface` with `ink-2` border and visible labels, 16 px minimum. Errors are `destructive` text; the field border stays `ink-2`, and the message is what carries the error.

## Gamification

**Target behaviour.** A student finds out which grants might apply to them, in a few seconds, with no account. The reward is the information.

**Loop.** Tick a fact that is true → the mapped rows are written in and the figure moves → the ledger is visibly yours → the next goal stays on screen: the facts still unticked, and "Create Your Free Profile".

**Motivation.** Ownership and feedback only. No scarcity, loss or chance.

**Mechanics.** One: a checklist with a running figure. Signup has a second, a four-line progress rule.

### Numbers

4 facts. 1 figure. 0 points. All of this comes from the plan's *Personal ledger*.

| Fact | Writes in | `maxAmount` |
|---|---|---|
| `under24` | Familienbeihilfe | 1,476 |
| `away` | Wohnbeihilfe | 3,600 |
| `uniWien` | Stipendium der Universität Wien | 7,200 |
| `need` | Studienbeihilfe, ÖH Sozialfonds | 5,040, 2,000 |
| none | Leistungsstipendium: it depends on grades, so it is never written in and never summed | 1,500, unused |

| Number | Value |
|---|---|
| Figure | The sum of `maxAmount` over written rows, range 1,476 to 19,316, at `row-amount`, never `ledger-figure` |
| Tick stroke | 150 ms |
| Row rule, then text | 400 ms, then 300 ms |
| Figure roll | 400 ms, retargets from its current value |
| Press | `scale(.97)`, 120 ms |
| Live region | 500 ms after the last change |
| Storage | `c4s.ledger.v1`, value `{"v":1,"facts":["need",…]}`, in tick order. Removed when nothing is ticked |
| Animations setting | "Turn animations off" (N14), a quiet checkbox under the toggles on `/` and `/bonuses`. `c4s.ledger.still`, value `1`, only while on. "Clear" removes it too |
| Signup lines | Name non-empty, email valid, password ≥ 6, confirm equal to password and not empty |

**XP, levels, awards and streaks: none.** The plan refuses them, so the skill's XP formula, award table and streak rules do not apply. Refused: streaks, levels, XP, badges, leaderboards, countdowns, scarcity, popups, confetti, sound, pre-ticked boxes, a sign-up wall.

### Celebration tiers

| Tier | Event | Treatment | Duration |
|---|---|---|---|
| small | A tick, a fact removed | Tick stroke, row written in, figure rolls | 150, 400 + 300, 400 ms |
| medium | None | — | — |
| large | None | — | — |

Reduced motion and "Turn animations off" both land on the end state instantly, and the live region still speaks.

### States

| Skill's state | Here |
|---|---|
| First run | Nothing ticked, no figure, "Tick what's true for you.", nothing locked |
| Partway through | Figure and rows; unticked facts remain the next goal |
| Level-up, achievement, streak saved, streak broken | Refused, so they do not exist |
| Maximum | All four ticked: €19,316, and "Create Your Free Profile" is the next goal |
| Failed save | Storage blocked or full: the ledger works for the session in memory, and "Saved only in this browser." is hidden because it would no longer be true |
| Reset | "Clear", and unticking the last fact, both remove the stored value. Focus moves to the first toggle |
| Malformed or old value | Ignored, then overwritten on the next change |

## Media

**The dragonfly** is one master SVG, at most 8 stroke-only paths with no fill, in `currentColor`. It is the fallback for everything else and it must be recognisable at 32 px and 400 px. It keeps the mark's silhouette as drawn, without correction.

**The 3D mark** is a thin die-cut paper object from hosted Blender, in daylight with no bloom or glow, shipped as 16 pre-rendered 960×960 WebP frames on a 2D canvas. There is **no runtime WebGL.** Frame 00 is the flat-on rest pose. Teal is `#18b1bf`, the pale membrane and book inlays `#e8f1f1`, which is a material colour inside the render and not an interface token. The books stay visible in the lower wings.

**Hero, desktop:** frame 00 as an ordinary `<img width height>`, `alt="Care4Students Dragonfly"`, canvas `aria-hidden`. **Hero, phone:** `poster-phone.webp` at `62vw`, bleeding `-6vw` off the right.

**Type crossing media.** Only on phones, only the three hero words, and only across the mark. Never lead, CTA or stats. **No scrim:** a scrim is Education4Students' device. Legibility belongs to the picture's own floor: mark pixels under the words keep luminance ≥ 0.2125, so `ink` holds 3.00 in shade and 4.62 at full colour. It is sampled at build.

**Ink-wash plates** on `deep` only, by CSS `background-image` under a media query so a phone downloads one. A failed or missing plate is invisible over flat `deep`.

**Zero-generated state is first class.** `DRAGONFLY_FRAMES = 0` renders the line art, in `ink` strokes on desktop and `primary` strokes behind the words on phones (`ink` on `primary` 4.62), and the Ledger is flat `deep`.

**Icons:** `lucide-react` is removed from public section bodies and stays on `/dashboard`. No photography, video or stock.

## Motion

**Libraries.** GSAP 3.15.0 with ScrollTrigger for the pin, scrub and synced counter of beat 4 and the frames of beat 2. `@gsap/react` 2.1.2 for `useGSAP` cleanup. Lenis 1.3.27 for wheel feel on `/` at the guard, `syncTouch` false. All three sit in one dynamic chunk imported only when the guard matches on `/`. **Everything else, including the whole phone experience, is CSS and about 40 lines of IntersectionObserver.** `transform` and `opacity` only, plus `stroke-dashoffset` on SVG. Interruptible state is a CSS transition, never a keyframe. Nothing starts from `scale(0)`.

### Beat sheet

| # | Beat | Owner | Trigger | What moves | Duration | Hands off to | Phone | Reduced |
|---|---|---|---|---|---|---|---|---|
| 0 | Nav | CSS | Past 80 px | Transparent to depth bar | `micro` | Hero | Same; never hides | No transition |
| 1 | Hero settle | CSS | `document.fonts.ready`, capped at 1200 ms | Words at full opacity from first paint, settle from `.06em`, stagger 60 ms; stat rule draws | `scene` | Dragonfly | Same | Static, rule drawn |
| 2 | **Dragonfly banks** | GSAP | Hero, `top top` to `bottom top`, scrub 1, no pin | Canvas crossfades frames by fraction | Hero height | Stat rule extends full bleed | Poster, no scroll link | Frame 00 |
| 3 | List rules | CSS, IO | Enters view, once | Rules draw left to right; text still | `move`, stagger 60 ms | Ledger | Same | Static |
| 4 | **The Ledger** | GSAP | See below | | | Your ledger | See below | Final state |
| 5 | Your ledger | CSS | Visitor ticks | Tick, row rule, text, figure | 150, 400, 300, 400 ms | Why | Same | Instant |
| 6 | Why checks | CSS, IO | Enters view, once | Six strokes draw | `move`, stagger 60 ms | Quotes | Same | Static |
| 7 | Quotes, CTA band | None | None | Nothing: these are for reading and for a close | — | Footer | Same | Same |
| 8 | Footer rule | GSAP | Enters view, scrub 1 | Closing rule draws under the wordmark | Own height | End | Static, drawn | Static, drawn |
| — | Subpages | CSS | Load, once | `h1` settle; rule draws | `scene`, `move` | — | Same | Static |

Below-the-fold `h2`s may use a masked rise, once on entry.

### The dragonfly sequence

16 frames, `start: "top top"`, `end: "bottom top"`, `scrub: 1`, native scroll, **no pin**, runway equal to the hero's own height. Frames are ≤ 30 KB each and ≤ 480 KB together. Frames 01–15 fetch after `load` and idle, at the guard only, skipped on `navigator.connection.saveData`, and decoded before the canvas replaces the poster; until all 16 decode, the poster stays. `dragonflyFrames.ts` exports 16 or 0; 0 skips the beat. Phones, coarse pointers and reduced motion never request frames 01–15.

### The Ledger

**Pinned at the guard:** 100dvh on `deep`, `end: "+=220%"`, scrub 1, `invalidateOnRefresh`.

| Progress | What happens |
|---|---|
| 0–35% | Counter €0 → €5,040 as Studienbeihilfe is written with its description |
| 35–90% | The other five arrive in turn, rule then masked line. The arriving line is `warm`, then settles to `canvas`. Row scale, no count |
| 90–100% | "Apply Now" appears on all six, "Explore Bonuses" under the closing rule, the mint mark draws once. Nothing moves after this |

**Phone:** rows stacked on `deep`. IntersectionObserver, `rootMargin: "0px 0px -10% 0px"`, once per row: rule draws by `scaleX`, 400 ms; text settles from `.5em`, 300 ms. Figure counts once on entry, 900 ms, by `requestAnimationFrame`. Hidden states are added by JS after mount, only if the observer exists and motion is allowed. No GSAP, pin, scrub or rail. `beforeprint` reveals everything.

**Counter:** digits `aria-hidden`, the true string "€5,040/year" in the DOM beside them, ending exactly on it with `textContent` unchanged.

### Polish

Press `scale(.97)` in 120 ms on buttons, CTAs and toggles. Sheet opens in 300 ms on `ease-out` and closes in 200 ms. Tab bar and nav have no enter animation, because they are used constantly. No layout shift on press or focus. Figures stay tabular through every state. Polish adds no dependency, string or beat.

**`ease-in-out` is reserved for the row-rule hover sweep.** Everything else takes `ease-out`, or none when scrubbed.

### Reduced-motion end state

`prefers-reduced-motion` lands every beat on its final state: `h1` at computed opacity 1, all rules drawn, all six rows with "Apply Now", frame 00 or the line art, no Lenis, no motion chunk. `from` states exist only inside `gsap.matchMedia`, so outside the guard, or if the chunk fails, the page simply stays final.

## Accessibility

**Focus.** `:focus-visible`, 2 px, offset 2 px, through a scoped `--focus` variable: `primary-text` by default, `warm` inside depth and deep grounds (`data-ground`). Warm controls keep the offset so the ring lies on the ground. The warm tab cell uses an inset `warm-ink` ring, which is where a token changes with context. Ratios are in *Focus rings*.

**Structure.** One `h1` per route, three spans on the hero with `textContent` unchanged; `/login` gets a real `h1`. `nav`, `main` and `footer` landmarks. The tab bar is a `nav` with `aria-current`.

**Widgets.** Native `<details>` for folds. Imprint is open by default, all open in print. Radix accordion on `/faq`, Radix Dialog as the Sheet, native checkbox for toggles.

**The Ledger and keyboard.** Rows are real links in the DOM from the start. `focusin` on any row while the pin is unfinished jumps scroll to the pin's end immediately, so focus only lands on the finished frame. `pointer-events: none` until a row has arrived.

**Targets.** 0 under 24 px, ≥ 44 px for primary actions and tab cells, ≥ 48 px for toggles and Sheet rows.

**`forced-colors: active`:** rules become `CanvasText`, focus stays visible, toggles restore native. **Print:** reveals complete, folds open, rules visible.

## Known Deployment Debt

Each of these also goes in `09-handoff.md`. The first three lead it, as the owner's first decision.

1. **Unsourced aggregates promoted to the first screen.** €2,400+, 5,000+, 2 weeks: no source in the repo, and this design makes them louder.
2. **€5,040 is stale and set largest.** It does not match BGBl. II 221/2026. Copy is frozen.
3. **The running figure is a new, louder claim.** "Up to €19,316" contains that €5,040, adds annual sums to a one-off range, and includes a merit-based scholarship that being a Uni Wien student does not secure. Removing the figure and keeping the written rows is the one-line fix.
4. **Hero under the doctrine's range on ordinary desktops.** Near 9.5vw on 16:9 laptop windows; see *Hero against the doctrine*.
5. **Testimonials and 1,200+ unverified;** 2025 deadlines and dates past, kept small on purpose.
6. **Legal.** Placeholder Imprint values and statutes that this project reads as German, not reviewed. Whether a fold suits an Austrian imprint is not assessed.
7. **Mocks with no on-screen disclosure.** Auth and contact are mocks, and frozen copy leaves nowhere to say so.
8. **Dragonfly origin and rights unknown.**
9. **Android fallback metrics not measured.** Roboto is named, not measured, so CLS on Android may differ.
10. **Dashboard keeps composed and raw colours.** `bg-primary/10`, `text-green-500`, `text-yellow-500`, `text-red-500` and existing shadows remain, because its layout is out of scope. The Closed Palette Rule applies to public pages.
11. **`og:image` stays a 1.1 MB PNG,** `public/dragonfly.png`.
12. **Netlify not verifiable before push.** `_redirects` is checked in `vite preview` only.
13. **Lenis on `/` and native scroll elsewhere** may feel inconsistent on a wheel. Accepted, named for `finish-review`.
14. **Generated assets not yet produced.** A02's 0-credit quote is documented, not measured. If it fails, the hero ships on line art.

## Amendments

### 2026-11-01: framed video, generated images and animated cards

**Reason.** The owner asked for them, and this file refused them. Motion-scan flagged the conflict and the media-plan phase rules on it here, rather than planning around it.

**The user's words,** as relayed by the main session in `.olympus/00-run-plan.md`: "Add more animations and assets. Use higgsfield to generate images and videos and also find assets online. Use remotion to add more posters and animated cards." and "use videos 480p for framed banners and images as much required to make remotion animations. budget 130 credits."

**Status.** Takes effect when the user approves Gate 1 of the media pass. The earlier rules stay in place above and below, as the record; where they conflict with this section, this section wins. Files, sizes and tests: `.olympus/06-build-plan.md`, *Media and motion pass*.

**What changes:**

| Earlier rule | Now |
|---|---|
| *Media:* "No photography, video or stock." | **Framed banners and rendered media are allowed,** as below. Generated paper-object stills and free-licence textures or public-domain plans may be inputs to a render. Photography of people, rooms or real places stays out |
| *Don't:* "No video, scrim, pill nav or glass" | **Video is allowed only as a framed banner.** Scrim, pill nav and glass stay refused, as does a full-bleed or hero video |
| *Don't:* "No bordered cards ... on public pages" | **Allowed only for the 1 px frame around a media file.** A card holds a render, never copy. Rows are never wrapped in a box, and a grid of content cards stays refused |
| *Elevation:* no shadows | Interface unchanged. A soft contact shadow inside a rendered picture is the object's own light, like the dragonfly's |
| *Closed Palette Rule* | Interface unchanged. Inside a render, the material colours from the 3D mark may appear: teal `#18b1bf`, pale `#e8f1f1`, and paper near `canvas`. `warm`, `mint` and `deep` are not used in renders |
| *New strings,* N14 on `/` and `/bonuses` only | N14 also appears under the banner on `/housing`, `/find-buddy` and `/how-it-works`. It now stops all clips too. No new string |
| *Other routes:* "Assets on every row: fonts and `DragonflyMark`" | The media map in the plan replaces this for the routes it names |
| "One object on the desk" | Holds for the dragonfly, which still appears only on the hero, as nav, footer and 404 mark. A paper motif inside a frame is not a second object on the desk |

**What a framed banner is.** A 16:9 window at most 854 CSS px wide, never larger than its 480p source, composited in a Remotion frame on the paper ground. 1 px `line` border, radius 0, no shadow. At most one per route, in the header of `/bonuses`, `/housing`, `/find-buddy` and `/how-it-works` only. Never on `/`, never on `deep`, never behind type. Silent. The only baked word is the route's eyebrow, which is also in HTML.

**What an animated card is.** A 4:3 tile at most 240 CSS px wide, inside an existing row, on `/` Everything You Need and `/how-it-works` only. Same frame. No text in it. It plays once for 4 s per entry, on desktop widths; a phone gets its poster.

**What does not change.** Direction, palette tokens, type ramp, routes, frozen copy. The Deep Once Rule, the Written Down Rule, the Largest Figure Rule. No GSAP on a phone. The page reads as finished with zero media, which remains the test: delete every file and each route still stands.

**Never in a frame:** any digit or currency sign, and every claim on the Never render list in `.olympus/05-asset-manifest.md`. People, faces, rooms that could read as listings, and the dragonfly in anything generated.

**Debt.** Item 11 closes once the share image ships. Items 1, 2, 3 and 5 are unchanged, and this pass does not make them louder.

### 2026-11-04: the desk hero (concept B, Desk Ledger)

**Reason.** The user picked concept B at Gate hero of trail `hero-pass`, and this file refuses parts of it. The `hero-plan` phase amends the rules here, rather than planning around them.

**The user's words,** as relayed by the main session in `.olympus/00-run-plan.md`:
- "make a new animated hero banner (find assets, 3d objects) use higgsfield to generate images and videos. Dragonfly should be the branding build around but more related to the students."
- "actually look for available free assets use only neccessary generation 60 credits"
- "find a video for scroll animating in hero banner as well"
- Their pick at Gate hero: "b".

**Status.** Takes effect now; the pick was the user's approval. The earlier rules stay in place above and below as the record, and where they conflict with this section, this section wins, for the hero of `/` only. Files, sizes and tests are in `.olympus/06-build-plan.md`, *Hero pass*, and `.olympus/05-asset-manifest.md`, *Hero pass* (A45–A56).

**What changes:**

| Earlier rule | Now |
|---|---|
| *Visual World:* "One object sits on the desk: the dragonfly"; and the 2026-11-01 row "'One object on the desk' holds for the dragonfly" | **In the hero only, a top-down student's desk sits under the dragonfly**: a laptop, a notebook, books, a lamp and a backpack. They are CC0 models, rendered offline as matte paper in the material colours. The dragonfly stays the only brand object, the only thing composited in code, the only one with alt text, and the only one that moves on its own. Everywhere else the rule holds as written |
| *Media:* "No photography, video or stock" (2026-11-01: "Photography of people, rooms or real places stays out") | **Free-licence (CC0) 3D models are allowed as render inputs,** with the licence recorded in `src/assets/hero-pass/LICENCES.md`. Photography of any kind stays out of the hero, and so do people, real places and AAU imagery |
| 2026-11-01: "Video is allowed only as a framed banner ... as does a full-bleed or hero video" refused; a framed banner is "Never on `/`" | **One scroll-scrubbed hero clip is allowed on `/`**, only from 1280 px, with a fine pointer, at least 640 px high, motion allowed, no `saveData`, no slow connection and no "Turn animations off". It never plays and never loops: scroll sets its frame. It is unframed, because its ground is the page's `canvas`, and its left edge is feathered. It never sits behind the words, no scrim is used, and it carries no information. Framed banners keep their 2026-11-01 rules |
| *Media:* "Hero, desktop: frame 00 as an ordinary `<img>`"; "Hero, phone: `poster-phone.webp` at `62vw`, bleeding `-6vw`"; *Type crossing media:* "Only on phones, only the three hero words, and only across the mark" | **Desktop:** the dragonfly at `clamp(112px, 9vw, 160px)`, resting on the notebook in the desk. **Phone:** a 390×183 desk still under the words, with the dragonfly at about 94 px on it. **Nothing crosses the hero words at any width.** The type-crossing rule is no longer used; it stays here as the record |
| *Motion*, beat 2 and *The dragonfly sequence:* "native scroll, **no pin**, runway equal to the hero's own height"; frames 01–15 at 960² | **From 1280 px inside that guard, the hero pins for `+=60%` of the viewport**, native scroll, `scrub: 1`. The desk clip and the dragonfly's lift, bank and landing share one timeline. From 1024 to 1279 px there is no beat 2: the poster stays and the dragonfly rests. The bank frames are A55, at 384², same pose, still ≤ 30 KB each |
| *Don't:* "make a second deep moment, or bring `deep` or a pin to another route" | Unchanged, and still true: the hero's pin is on `/`, and the hero is not `deep`. `/` now has two pins, the hero's short one and the Ledger's |
| *Closed Palette Rule* inside renders (2026-11-01: teal, pale, paper near `canvas`) | Unchanged. The desk uses teal `#18b1bf`, pale `#e8f1f1`, cream `#fbfaf6`, and a ground of exactly `canvas` `#f6f6f3`. No `warm`, `mint`, `deep` or `ink` in the render |

**What does not change.**
- **Rules kept:** "There is no runtime WebGL" (the desk is rendered offline). No GSAP on a phone. Frozen copy, routes, palette tokens and the type ramp. The stat strip on the first screen. The Deep Once Rule. The dragonfly never inside rendered or generated media.
- **The test** that every route reads as finished with zero media: delete every hero file and the hero shows today's line-art state. `HERO_DESK_FRAMES = 0` restores today's hero exactly.

**Never in the desk render:** any glyph, digit or currency sign; any book title or keyboard legend; a person or a hand; a building; an AAU mark, arch window or photograph; the dragonfly. Nothing on the *Never render* lists in `.olympus/05-asset-manifest.md`.

**Not amended, because nothing conflicts.** `PRD.md` and `AGENTS.md` allow "free-licence sources only" with the licence recorded, and this pass plans 0 paid credits. A paid row would need their amendment first.

### 2026-11-04, later: university and Klagenfurt photos

**Reason.** The user asked for real places after the desk hero was planned, and the two amendments above keep them out. This section rules on that here, rather than planning around it.

**The user's words,** as relayed by the main session: "but add imagery from uni and klagenfurt (it is a product for uni, you can use the licensed images)".

**Status.** Takes effect now, and the user's words are the approval. Where this section conflicts with anything above, including the 2026-11-04 desk hero amendment, this section wins. Files, licences and tests: `.olympus/05-asset-manifest.md` and `.olympus/06-build-plan.md`, both under *Hero pass addendum* (A57–A64, H7–H10, AC-H24–H29).

**What changes:**

| Earlier rule | Now |
|---|---|
| *Media:* "No photography, video or stock"; 2026-11-01: "Photography of people, rooms or real places stays out"; 2026-11-04: "Photography of any kind stays out of the hero, and so do people, real places and AAU imagery" | **Photos of real places in Klagenfurt are allowed**: the university campus, Lakeside Park, the city and the Wörthersee. Two ways only. **(1) Inside the desk render,** as printed photos lying on the desk: a postcard, a print in the notebook, a print beside the laptop, a folded map, and the laptop's screen. These may be public domain or CC0 only. **(2) One framed photo** in *Why Students Choose Us* on `/`. It may be CC BY-SA, credited under the photo. Photos stay out of every other route and section |
| 2026-11-04, *Never in the desk render:* "a building; an AAU mark, arch window or photograph" | **Buildings, the lake and the city may appear inside the printed photos.** Still never in any frame: an AAU logo, wordmark, design mark or legible name sign; any legible glyph, including map labels and signage; a person or a hand; the dragonfly |
| The desk render's material: flat colour, every source texture dropped | **The printed photos are the one texture,** on matte card, graded the same way toward cream (saturation × 0.80, 6 % toward `#fbfaf6`), so they sit in the paper world |
| 2026-11-01: "Allowed only for the 1 px frame around a media file" | The framed photo uses exactly that frame: 1 px `line`, radius 0, no shadow, nothing set over it |
| Copy: no new strings beyond N1–N14 | **Two new strings, on `/` only:** N15, the licence credit under the framed photo, and N16, its `alt`. The credit is a condition of the licence. It is always visible, `t-meta` in `ink-2`, with links in `primary-text`. It is never hidden, truncated or shown only on hover |

**People.** No identifiable person, unless the licence page states a model release or the person is incidental in a landscape. None of the planned photos shows one. AAU's press photos of students (manifest A64, refs A7–A9) wait for AAU's written confirmation of model consent.

**AAU.** Its logo, wordmark and design marks are never used. No caption, alt or copy may say or suggest that AAU endorses, partners with or uses Care4Students. AAU's press photos may appear only once AAU consents in writing. Until then they stay **off, behind a build-time switch** (`VITE_AAU_PRESS`), and never in the public build.

**What does not change.**
- Direction, palette tokens, the type ramp, routes and frozen copy.
- One brand object: the dragonfly stays the only thing composited in code and the only thing that moves on its own.
- The test that every route reads as finished with zero media: without its photo, *Why* is today's section.

## Do's and Don'ts

### Do

- **Do** hang everything off a 1 px hairline, from the stat strip through the Ledger to the wordmark.
- **Do** let amounts lead rows, in tabular figures, so they stack into a column a thumb can compare by scrolling alone.
- **Do** keep `primary-text` for every small piece of teal, and `primary` for fills with an `ink` label.
- **Do** keep warm to its list: Sign Up, one closing CTA per page, the Ledger's arriving line and figure, the visitor's own figure and ticks.
- **Do** put "An estimate, not a promise." beside the running figure every time it shows, and "Up to" at the figure's own size.
- **Do** test every section with zero generated assets, no motion chunk and storage disabled. It must still read as finished.
- **Do** keep the hero words readable in their first painted frame: a settle, never a reveal from nothing.
- **Do** keep past dates, Deadline and Eligible on one small line, so a 2025 date never gets scale.

### Don't

- **Don't** drift into a card grid. No bordered cards, shadows, radii above 4 px, or a row wrapped in a box on public pages.
- **Don't** drift into a reskin. No video, scrim, pill nav or glass; if a section could sit on Education4Students unchanged, it is wrong.
- **Don't** drift into a game. No streaks, levels, XP, badges, leaderboards, countdowns, scarcity, popups, confetti, sound, pre-ticked boxes or sign-up wall.
- **Don't** set white on teal, `primary` text on light, warm text on canvas, or a ring on warm. Their ratios are above.
- **Don't** sum the six bonuses in the Ledger, or let any figure outrank €5,040 in its section.
- **Don't** make a second deep moment, or bring `deep` or a pin to another route. Mint is strokes on `deep`, never a glow.
- **Don't** set any € amount in Instrument Serif as a figure, or use the serif beyond its five words and pull quotes.
- **Don't** add uniform fade-up-on-scroll, scroll-hijacking, a custom cursor, magnetic buttons, or a GSAP request on a phone.
- **Don't** use `line` as the only cue for a control, compose a colour with `/90` on a public page, or use `overflow-x: hidden` on `html` or `body`.
- **Don't** describe these figures as verified or sourced anywhere, in the UI or in any handoff.
