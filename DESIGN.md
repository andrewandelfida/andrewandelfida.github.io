---
name: Андрій та Ельфіда — Wedding Invitation
description: A pressed-card visual system in olive ink and Carpathian terracotta on cream stock.
colors:
  olive-ink: "#4e5539"
  olive-body: "#5f6450"
  olive-mid: "#636a4a"
  cream: "#f7f3e9"
  cream-2: "#efeadb"
  wash: "#f1e4da"
  terracotta: "#c07c5a"
  terracotta-text: "#9e5330"
  verse-band: "#ae603c"
  verse-rule: "#e9c4b0"
  hairline: "#d3d4bb"
  header-border: "#e4dfcf"
  switch-border: "#cfd0b6"
  switch-divider: "#d7d8c1"
  slot-fill: "#e7e9d7"
  slot-border: "#cdd2b3"
  slot-label: "#666a54"
  slot-hatch: "#dfe2cd"
  map-grid: "#dde0ca"
  selection-text: "#2a2e1f"
typography:
  display:
    fontFamily: "Playfair Display, Georgia, Times New Roman, serif"
    fontSize: "clamp(46px, 10vw, 104px)"
    fontWeight: 500
    lineHeight: 0.98
    letterSpacing: "0.05em"
  headline:
    fontFamily: "Playfair Display, Georgia, Times New Roman, serif"
    fontSize: "clamp(26px, 4.4vw, 44px)"
    fontWeight: 500
    lineHeight: 1.12
    letterSpacing: "0.03em"
  title:
    fontFamily: "Playfair Display, Georgia, Times New Roman, serif"
    fontSize: "clamp(20px, 2.8vw, 26px)"
    fontWeight: 600
    letterSpacing: "0.04em"
  quote:
    fontFamily: "Playfair Display, Georgia, Times New Roman, serif"
    fontSize: "clamp(22px, 3.6vw, 40px)"
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: "normal"
  body:
    fontFamily: "Montserrat, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "clamp(15px, 1.9vw, 18px)"
    fontWeight: 300
    lineHeight: 1.9
    letterSpacing: "normal"
  label:
    fontFamily: "Montserrat, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "clamp(10px, 1.4vw, 12px)"
    fontWeight: 500
    letterSpacing: "0.34em"
  script:
    fontFamily: "Marck Script, Segoe Script, cursive"
    fontSize: "clamp(18px, 2.6vw, 24px)"
    fontWeight: 400
    letterSpacing: "normal"
rounded:
  none: "0"
  card: "6px"
  pill: "999px"
  pin: "3px 3px 3px 0"
  focus: "2px"
  arch: "999px 999px 14px 14px"
spacing:
  "1": "4px"
  "2": "6px"
  "3": "8px"
  "4": "12px"
  "5": "16px"
  "6": "20px"
  "7": "24px"
  "8": "32px"
  "9": "44px"
  "10": "60px"
  "11": "90px"
  "12": "130px"
components:
  button-solid:
    backgroundColor: "{colors.olive-ink}"
    textColor: "{colors.cream}"
    rounded: "{rounded.pill}"
    padding: "12px 22px"
    height: "44px"
  button-solid-hover:
    backgroundColor: "{colors.olive-mid}"
    textColor: "{colors.cream}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.olive-ink}"
    rounded: "{rounded.pill}"
    padding: "12px 22px"
    height: "44px"
  button-outline-hover:
    backgroundColor: "{colors.olive-ink}"
    textColor: "{colors.cream}"
  lang-pill:
    backgroundColor: "transparent"
    textColor: "{colors.olive-mid}"
    rounded: "{rounded.pill}"
    padding: "7px 14px"
  lang-pill-active:
    backgroundColor: "transparent"
    textColor: "{colors.olive-ink}"
    rounded: "{rounded.pill}"
    padding: "7px 14px"
  verse-band:
    backgroundColor: "{colors.verse-band}"
    textColor: "{colors.cream}"
    rounded: "{rounded.none}"
    padding: "clamp(80px, 14vw, 150px) clamp(22px, 6vw, 60px)"
  photo-arch:
    backgroundColor: "{colors.slot-fill}"
    rounded: "{rounded.arch}"
    width: "clamp(220px, 44vw, 360px)"
  photo-slot-empty:
    backgroundColor: "{colors.slot-fill}"
    textColor: "{colors.slot-label}"
    rounded: "{rounded.none}"
  timeline-node:
    backgroundColor: "{colors.cream}"
    rounded: "999px"
    size: "11px"
---

# Design System: Андрій та Ельфіда — Wedding Invitation

## Overview

**Creative North Star: "The Pressed Invitation"**

The page is the card. Everything on screen behaves as though it were struck onto
cream stock in two passes of ink — olive for the text, Carpathian terracotta for the
ornament — and nothing appears that a press could not have produced. There are no
gradients standing in for light, no drop shadows standing in for paper, no rounded
rectangles standing in for surfaces. Rules are hairlines. Ornaments are diamonds. The
one moment of colour is a solid block, the way a second ink plate covers a panel.

The mood is **warm and hand-made** and **reverent and unhurried**. Body text runs at a
1.9 line-height and uppercase runs are tracked as wide as 0.34em, which makes the page
physically slow to read — deliberately. A guest arrives here by pointing a phone at a
printed invitation, and the screen's job is to feel like a continuation of the paper in
their other hand, not a departure from it. Warmth comes from the pigments and from the
script face used at exactly two moments; formality comes from the serif, the symmetry,
and the space.

Composition works by **interruption**. Long stretches of centred cream are broken twice:
once by an arched portrait, once by a solid terracotta band carrying the verse. Those two
gestures carry the entire structure of the page. Everything else is typography and air.

**Key Characteristics:**

- Cream ground, olive ink, a single terracotta interruption
- A floral watermark behind the cream, at the strongest opacity that still clears AA
- Serif display, sans body, script signature — three voices, never a fourth
- Hairline borders only; no border is thicker than 1px anywhere in the system
- Symmetrical and centred by default; asymmetry must be earned by function
- Fluid throughout — the system has **no width breakpoints at all**
- Ornament is limited to one shape: a 45°-rotated square

## Colors

An earth palette: pigments that exist as physical materials, warmed by a cream ground that
is never pure white and never pure grey.

### Primary

- **Olive Ink** (`#4e5539`): The ink the card is printed in. Every heading, every name, the
  solid button fill, the timeline node border, the map pin, and the focus ring. The darkest
  value in the system and the default for anything that must be read without effort.
- **Olive Second Impression** (`#5f6450`): Paragraph body copy and the underlined location
  links. A lighter pull of the same ink — one step back from headings, never used for
  display type.
- **Olive Third Impression** (`#636a4a`): Eyebrows, italic subtitles, captions, inactive
  language pills, and the hero's script connector. The quietest of the three olives, and the
  floor of the text hierarchy — nothing legible sits below it.

### Secondary

- **Carpathian Terracotta** (`#c07c5a`): The second ink plate. Diamonds, hairline rules,
  the map border, the arch border, the scroll-hint gradient, and `::selection`. Purely
  ornamental in every appearance.
- **Fired Clay** (`#ae603c`): The solid verse band — the one saturated field on the page.
- **Clay Ink** (`#9e5330`): Terracotta when it must carry text, used once, for the script
  tagline in the footer.
- **Clay Hairline** (`#e9c4b0`): The pale rules flanking the verse reference, visible only
  against the band.

### Neutral

- **Cream Stock** (`#f7f3e9`): The page ground, and the light text colour on the terracotta
  band and olive buttons. The stock the whole card is printed on.
- **Cream Fold** (`#efeadb`): A slightly deeper cream for secondary surfaces.
- **Clay Wash** (`#f1e4da`): The tinted ground under the gallery and location sections — the
  terracotta at its faintest, used to separate zones without a border.
- **Hairline** (`#d3d4bb`), **Header Rule** (`#e4dfcf`), **Switch Rule** (`#cfd0b6`),
  **Switch Divider** (`#d7d8c1`): the graded family of 1px divider tones. Each is tuned to
  the surface it sits on; none is ever used as a fill.

### Tertiary

- **Slot Fill** (`#e7e9d7`), **Slot Rule** (`#cdd2b3`), **Slot Label** (`#666a54`),
  **Slot Hatch** (`#dfe2cd`): the placeholder vocabulary shown where a photograph will go.
  A pale olive field, a 1px rule, a 135° hatch at 11–12px pitch, and a mono caption. Its
  purpose is to look *unfinished*, never *broken*.
- **Map Grid** (`#dde0ca`): the grid-paper rules inside the map frame — the resting state
  shown while the map loads, and what remains if the tiles never arrive.
- **Selection Ink** (`#2a2e1f`): text inside a selection highlight, which is painted in
  terracotta. A near-black olive rather than pure black, so highlighting a phrase does not
  introduce a colour the palette does not contain.

### Named Rules

**The Single Interruption Rule.** Terracotta appears as a solid field exactly once in the
document — the verse band. A second saturated block would turn an interruption into a
pattern and the composition would lose its only structural accent.

**The Decorative-Only Rule.** `#c07c5a` never carries text. It is exempt from contrast
requirements precisely because it is only ever a diamond, a rule, or a border. Terracotta
that must be read is `#9e5330`.

**The Measured Deviation Rule.** A palette value may be darkened to reach contrast; it may
never be lightened for taste. Every deviation records its original value and its measured
ratio in a comment beside it, and `npm run check:contrast` re-verifies all 35 pairs. Eight
values in this palette are darkened originals; the hue and the light-to-dark hierarchy of
the source design survive intact.

## Typography

**Display Font:** Playfair Display (with Georgia, Times New Roman, serif)
**Body Font:** Montserrat (with system-ui, -apple-system, Segoe UI, sans-serif)
**Script Font:** Marck Script (with Segoe Script, cursive)
**Mono Font:** ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas — coordinates and
placeholder captions only

**Character:** A high-contrast transitional serif carries every word that matters — names,
headings, venue, verse — while a geometric sans at weight 300 handles everything
instrumental. The script appears twice and never elsewhere. The pairing is formal without
being cold: Playfair supplies the ceremony, Montserrat's light weight and long leading
supply the calm.

### Hierarchy

- **Display** (500, `clamp(46px, 10vw, 104px)`, 0.98 line-height, 0.05em): The couple's
  names, stacked one per line with the script connector between them. The only place this
  size appears.
- **Headline** (500, `clamp(26px, 4.4vw, 44px)`, 1.12, 0.03em): Section headings. The
  gallery heading is the one variant — uppercase at `clamp(24px, 4vw, 40px)` with 0.04em.
- **Title** (600, `clamp(20px, 2.8vw, 26px)`, 0.04em): Venue names. The schedule's times run
  larger at `clamp(28px, 5vw, 40px)` with a 1.0 line-height, set as numerals in the display
  face — the timeline's anchor points.
- **Quote** (400 italic, `clamp(22px, 3.6vw, 40px)`, 1.45): Scripture on the terracotta band,
  and the model for any long-form italic serif passage.
- **Body** (300, `clamp(15px, 1.9vw, 18px)`, 1.9): All prose. Measure is bounded by a 620px
  container, not by a character count. `text-wrap: pretty` throughout.
- **Label** (500, `clamp(10px, 1.4vw, 12px)`, 0.34em, uppercase): Eyebrows above section
  headings. Related tracked-capital roles step down in spacing as they gain size: verse
  reference and kickers at 0.3em, date rows and card labels at 0.22–0.24em, section titles
  at 0.16–0.18em, buttons at 0.14em.
- **Subtitle** (400 italic serif, `clamp(14px, 1.9vw, 17px)`): The line beneath a section
  heading, always in the third olive.

### Named Rules

**The Three Voices Rule.** Playfair *speaks* (names, headings, venue, verse), Montserrat
*labels* (eyebrows, body, controls, notes), Marck Script *signs* — and it signs exactly
twice: the connector between the two names, and the footer tagline. A fourth face is not
merely discouraged, it is unavailable: the fonts ship as content-derived subsets, so a new
face means a new download on a rural connection.

**The Spaced Capital Rule.** No uppercase run is set without tracking. The floor is 0.14em
and the ceiling is 0.34em, and the two move inversely with size — the smaller the type, the
wider the letter-spacing. Uppercase at normal tracking is not part of this system.

**The Comma-Below Rule.** `ș` and `ț` must render with a comma below, never a cedilla. A
cedilla is a spelling error to a Romanian reader, not a stylistic variant. Any change to the
type stack is verified by pixel comparison (`npm run check:glyphs`) before it ships.

**The Full-Alphabet Rule.** Every shipped weight must render both full Ukrainian Cyrillic
and Romanian diacritics. A weight that exists in only one script cannot be used, because the
same component renders in all three languages.

## Layout

Everything is centred. A single column runs the length of the document, and each section
sets its own maximum width from a small set of measures: 520px for the schedule timeline,
620px for prose and section headers, 1000px for the location,
1040px for the gallery, 760px for the verse. Sections are separated by vertical padding of
`clamp(72px, 12vw, 130px)` and inset horizontally by `clamp(22px, 6vw, 60px)`; the verse
band takes more air still at `clamp(80px, 14vw, 150px)`.

The spacing scale is twelve steps — 4, 6, 8, 12, 16, 20, 24, 32, 44, 60, 90, 130 — widening
as it climbs, so small adjustments stay fine-grained and large gaps stay decisive.

Two sections depart from the centre line, both for functional reasons. The **schedule** is a
left-aligned vertical timeline: a 1px terracotta line with 11px cream nodes ringed in olive,
inset by `clamp(30px, 7vw, 56px)`. The **location** is a two-column flex row that collapses
to one when either column would fall below its `280px`/`300px` basis. The **gallery** is CSS
multi-column masonry — `columns: clamp(150px, 23vw, 230px)` with `break-inside: avoid` —
which reflows to whatever proportions the photographs actually have.

The hero occupies exactly one screen: `calc(100svh - 49px)`, subtracting the sticky language
bar.

### Named Rules

**The No-Breakpoint Rule.** This system contains **no width-based media queries whatsoever**.
Every size, every gap and every measure is a `clamp()` or a flex basis, so the layout is
continuous rather than stepped and there is no width at which it is untested. Adding a
`@media (min-width: …)` block means the design has failed to express itself fluidly — fix the
clamp instead.

**The Small-Viewport Rule.** The hero measures in `svh`, never `vh` and never `dvh`. `vh`
overflows behind mobile browser chrome and hides the date; `dvh` resizes as the address bar
collapses and makes the page jump mid-scroll. `svh` is the only unit that is correct while
the browser bar is expanded and stable while it is not.

**The Centre Line Rule.** Centred is the default. A section may break alignment only when
its content is genuinely sequential (the timeline) or genuinely paired (the location), and
never for visual variety alone.

## Elevation & Depth

The system is **flat, and its depth is tonal**. Separation between zones comes from ground
colour — cream, then clay wash, then a solid terracotta field — and from 1px rules whose tone
is tuned to the surface beneath them. No surface is lifted off the page, and no element uses
a shadow to imply a layer.

There is exactly one shadow token in the entire system, and it is used in exactly one place:
the map pin. That is the single spot where literal depth is meaningful — a pin must read as
standing *above* a map rather than being drawn *on* it.

This is the current state rather than a permanent prohibition. Layering may be introduced
later if it earns its place; it simply has not been needed yet.

### Shadow Vocabulary

- **Pin drop** (`box-shadow: 0 4px 10px -4px #4e553988`): the map marker and its placeholder
  pin, and nothing else. A short, tight, olive-tinted shadow — the ink colour at 53% alpha,
  never a neutral black.

## Shapes

The form language is **square by default, with two deliberate exceptions**.

Radius is `0` everywhere unless a component has a stated reason otherwise. Cards take a
barely-perceptible `6px`. Interactive controls — buttons, language pills, the skip link — take
a full `999px` pill, which is the only shape in the system that reads as "press me". The hero
portrait takes the arch: `999px 999px 14px 14px`, a semicircular top on square feet.

Two further radii exist and neither is a surface treatment. `3px 3px 3px 0` on a 16px square
rotated 45° produces the map pin's teardrop — three softened corners and one sharp point aimed
at the venue; it belongs to the pin and its placeholder. `2px` is applied by `:focus-visible`
so the focus ring rounds very slightly on otherwise square elements; it is deliberately weaker
than any component radius, so a focused pill stays a pill.

Borders are always `1px`. There is no 2px border anywhere; the timeline node's `1.5px` ring is
the sole deviation, and exists because an 11px circle needs it to read.

Ornament is a single shape used at three sizes: a square rotated 45°, at 5px in the hero date
row, 6px in the standard rule and 9px in the footer. Paired with a
hairline on each side it becomes the section rule — a 60px line, a diamond, a 60px line.

### Named Rules

**The Arch Rule.** `999px 999px 14px 14px` belongs to the hero portrait alone. It is the
page's one architectural gesture and it stops being architectural the moment a second element
borrows it.

**The Hairline Rule.** Every border is 1px, in a tone selected for the surface it sits on
rather than a single generic grey. A thicker border is a signal this system does not have.

**The One Ornament Rule.** There is exactly one decorative shape. New sections do not get new
motifs; they get the diamond at whichever of the four sizes fits.

## Components

### Buttons

- **Shape:** Full pill (`999px`), 1px transparent border so that solid and outline variants
  occupy identical space.
- **Size:** `min-height: 44px`, padding `12px 22px`. Uppercase 12px, 0.14em tracking.
- **Solid:** Olive Ink ground, Cream Stock text. The primary action — one per view.
- **Outline:** Transparent ground, Olive Ink text and border.
- **Hover:** Solid lightens to the third olive; outline inverts to the solid treatment.
  Both transition `background` and `color` over 0.25s ease; neither moves, scales, or lifts.
- **Focus:** 2px Olive Ink outline at 2px offset — inverted to Cream Stock inside the verse
  band, where the olive ring would vanish.

### Language Switcher

The one persistent control: a sticky bar at `rgba(247, 243, 233, 0.86)` with an 8px backdrop
blur, falling back to solid cream where `backdrop-filter` is unsupported. Inside sits a
pill-bordered group of three text pills separated by 1px 14px-tall dividers.

- **Inactive:** Olive Third Impression, weight 400.
- **Active:** Olive Ink, weight 600, `aria-pressed="true"`.
- **Type:** 11px, 0.18em tracking, 7px/14px padding.
- **Target:** the drawn pill is 28px tall, but each button carries a transparent
  `::after` that lifts the touchable area to 44px. It fits inside the bar's own padding, so
  the design is unchanged and the rule below still holds.
- **Sticky:** the positioning belongs to the `<header>`, not to the bar. A sticky element can
  only travel inside its parent's content box, and a header sized to the bar gives it nowhere
  to go — the bar scrolled away on the first swipe. The bar's height is taken *from*
  `--header-h` rather than growing out of its padding, because the hero subtracts that token
  and `scroll-padding-top` offsets anchor jumps by it.

### Browser Surfaces

The chrome the page did not draw is themed from the palette rather than left to the browser:
`::selection` paints terracotta with Selection Ink, the caret inherits the text olive, focus
rings are 2px Olive Ink (inverted to cream on the verse band), the scrollbar is
`thin` in Hairline on Cream Stock, and `color-scheme: light` stops a dark-mode OS
recolouring any of it. Schedule times use `tabular-nums` so 11:00 and 13:00 align in the
timeline.

### Photo Slots

Every photograph and every placeholder share one box, so a portrait can be replaced by a
landscape without the layout changing shape.

- **Filled:** `object-fit: cover` on a Slot Fill ground, with an average-colour tint behind
  it while it loads.
- **Empty:** 1px Slot Rule border, a 135° hatch at 11–12px pitch, and a centred 10px
  monospace label in Slot Label. This state is a designed state — it should read as a
  photograph not yet taken, never as an image that failed.
- **Arch variant:** 1px terracotta border, the arch radius, locked to `4 / 5`, and the label
  moved to the bottom with 22px of padding.

### Timeline

A 1px terracotta line inset `clamp(6px, 2vw, 14px)` from the left, running from the first
node to the last. Each entry is an 11px cream circle with a 1.5px Olive Ink ring, then a
display-face time, a tracked-capital title, a serif venue and a 13px note. Entries are
separated by `clamp(38px, 6vw, 54px)`.

### Map

- **Container:** 1px terracotta border, `6px` radius, Slot Fill ground overlaid with a 26px
  grid-paper pattern (`#dde0ca` 1px lines on both axes).
- **Resting state:** that grid, an olive pin, and a monospace caption — visible before the map
  loads, and permanent if it never does.
- **Marker:** a 16px Olive Ink square rotated 45° with a `3px 3px 3px 0` radius, the pin drop
  shadow, and `display: block` — Leaflet injects it as a `<span>`, and an inline element
  silently discards width and height.
- **Chrome:** Leaflet's controls are re-tinted to the palette — cream backgrounds, olive
  glyphs, hairline borders, 10px attribution.

### Backdrop

A floral line drawing sits behind the entire invitation like a watermark in the paper —
the only illustration in a system that otherwise contains no imagery at all.

- **Ink:** Olive Ink composited onto Cream Stock at **7%**, producing `#ebe8dd`. The
  compositing happens when the asset is generated, not in CSS, because an opaque
  low-contrast image encodes to ~10 KB where the same drawing with transparency costs
  ~139 KB.
- **Placement:** a fixed layer behind all content, `min(124vw, 1180px)` wide, centred. It
  does not scroll, so it reads as a property of the paper rather than of the page.
- **Edges:** masked to an inscribed ellipse that fades to nothing, so the image has no
  boundary. This is structural, not decorative — lossy encoding shifts the image's baked-in
  ground by a level or two, and a straight edge between two near-identical flats is exactly
  what the eye reads as a band.
- **Coverage:** only the cream sections. The clay wash and the terracotta verse band set
  their own grounds and cover it, which is what keeps the page from feeling uniformly busy.

### Named Rules

**The Watermark Ceiling Rule.** The backdrop ink sits at 7% and cannot go higher. Every
stroke darkens the ground behind whatever text crosses it, and two pairs have almost no
headroom left: at 9% the footer tagline falls to 4.46:1 and fails AA. 7% is the strongest
the drawing can be while the page still passes. Below 5% it is invisible on a phone in
daylight, so the usable range is one band wide.

**The 44px Rule.** Every interactive target clears 44px in its smallest dimension. Inline
links that cannot take a min-height take `6px` of vertical padding instead. The audience uses
this one-handed, in portrait, sometimes in gloves.

**The Never-Dim Rule.** State is never expressed as opacity on text. Dimming composites the
foreground toward the background and silently destroys contrast — `opacity: .5` on the
language pills measured **2.28:1**. Quiet-versus-current is expressed with colour and weight,
both above 4.5:1. This applies to any future disabled, inactive, secondary or placeholder
state.

**The Visible-Without-Script Rule.** Reveal-on-scroll hides content only after JavaScript has
confirmed it can also un-hide it. Nothing in this system is styled `opacity: 0` or
`display: none` at rest and revealed later by a script that might not run.

## Do's and Don'ts

### Do:

- **Do** put every new value in `src/styles/tokens.css` first. No component may hardcode a
  hex, a font stack, or a type size — if a value is worth using it is worth naming.
- **Do** run `npm run check:contrast` after touching any colour. It checks 35 pairs including
  composited opacity, and it is the reason the palette can be trusted.
- **Do** express a new size as a `clamp()` between a 360px phone and a 1440px desktop.
- **Do** reach for the diamond, the hairline rule, or tonal ground when a new section needs
  separation.
- **Do** darken a colour to meet AA and record the original value and the measured ratio in a
  comment beside it.
- **Do** design the empty state and the loaded state as the same box, so replacing a portrait
  with a landscape reflows rather than breaks.
- **Do** keep the third olive (`#636a4a`) as the floor of the text hierarchy. Anything quieter
  than that is not text, it is decoration.

### Don't:

- **Don't** add a width-based media query. Fix the `clamp()`.
- **Don't** use `#c07c5a` for text. Use `#9e5330`.
- **Don't** introduce a second solid terracotta field. There is one, and it holds the verse.
- **Don't** express state with `opacity` on anything containing text.
- **Don't** add a fourth typeface, or a weight outside the shipped ranges — Playfair 400–600
  normal and 400–500 italic, Montserrat 300–600, Marck Script 400. The subsets contain nothing
  else.
- **Don't** use `vh` or `dvh` for full-height layout. `svh`, always.
- **Don't** reach for a shadow as the default way to separate two surfaces — use tonal ground
  or a hairline. Elevation is not forbidden here, but it is currently unused outside the map
  pin, so introducing it is a system-level decision rather than a local one.
- **Don't** raise the backdrop's ink opacity above 7%, or place body text on a section that
  shows the backdrop without re-running `npm run check:contrast` — the watermark is part of
  the background those pairs are measured against.
- **Don't** set uppercase without letter-spacing, or below 0.14em.
- **Don't** exceed a 1px border. The 1.5px timeline node ring is the system's only exception
  and it is not a precedent.
- **Don't** let a new element be visible only after JavaScript runs.
