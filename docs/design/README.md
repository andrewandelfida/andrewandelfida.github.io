# Handoff: Wedding Invitation Site — "C7 · Terracotta color-block" variant

## Overview
A single-page, trilingual (Ukrainian / Romanian / English) wedding invitation website for
**Andrei & Elfida** (groom-first display order), wedding on **Saturday, 3 October 2026** at
**Biserica „Harul", Stănești (Станівці), Chernivtsi region, Ukraine**. The page presents the
couple, a scripture verse, their story, a photo gallery, the day's schedule, directions to the
venue, practical guest info, and an RSVP form. This handoff documents the **C7** design — the
boldest of the color explorations: it keeps the olive/sage/cream family and layers in a
**terracotta** second accent, most prominently as a full-width solid terracotta verse band.

## About the Design Files
The files in this bundle are **design references created in HTML** — prototypes that show the
intended look and behavior. They are **not** production code to copy directly. They were authored
as "Design Components" (a custom `<x-dc>` runtime used by the design tool); ignore that wrapper and
the `support.js` / `<script type="text/x-dc">` scaffolding — it is not part of the design.

Your task is to **recreate this design in the target codebase's environment** (React, Vue, Svelte,
Astro, SwiftUI, plain HTML/CSS, etc.) using its established patterns, component library, and
i18n solution. If no codebase exists yet, choose an appropriate stack — a static-site framework
(Astro, Next.js static export, or plain Vite + a small i18n lib) suits a one-page invitation well.

The real, portable design lives in:
- **The inline styles** on each element (colors, spacing, typography, layout).
- **`site.js`** — the single source of truth for all copy in three languages plus the runtime
  behaviors (language switch, copy-to-clipboard, reveal-on-scroll, RSVP submit, attend toggle).

## Fidelity
**High-fidelity (hifi).** Colors, typography, spacing, and interactions are final. Recreate the UI
faithfully. The only deliberate placeholders are the **photos** (diagonal-hatch boxes labeled with
aspect ratios) and the **map** (a grid box with a pin) — see Assets.

---

## Design Tokens

### Colors
| Token | Hex | Role |
|---|---|---|
| Deep olive | `#4E5539` | Primary text, headings, RSVP section background, primary buttons |
| Mid olive | `#8A9367` | Eyebrows, secondary text, italic accents, link hover |
| Body olive | `#6C7059` | Paragraph body copy |
| Sage (legacy accent) | `#B7BE9B` | *Replaced by terracotta in this variant — do not reintroduce* |
| Warm cream | `#F7F3E9` | Page background, light text on dark blocks |
| Cream 2 | `#EFEADB` | (base variant alt background — replaced by terracotta wash here) |
| **Terracotta** | **`#C07C5A`** | **Second accent: diamonds, hairline rules, script accents, slot/map borders, RSVP field labels & outline buttons, `::selection`** |
| Terracotta deep | `#B5643F` | **Solid verse-band background** (section 2) |
| Terracotta wash | `#F1E4DA` | Gallery + Location section backgrounds |
| Verse rule | `#E9C4B0` | Hairline rules inside the terracotta verse band |
| Verse ref label | `#FBEADF` | Verse eyebrow text on the terracotta band |
| Verse band text | `#FBEFE7` / `#F7F3E9` | Body / quote text on the terracotta band |
| Hairline | `#D3D4BB` | Thin dividers, language-switch border variants |
| Photo slot fill | `#E7E9D7` | Placeholder background for photos/map |
| Photo slot border | `#cdd2b3` | Placeholder photo borders |
| Photo slot label | `#9aa07f` | Monospace aspect-ratio labels |
| RSVP field bg | `#5a5f47` | Inputs on the olive RSVP block |
| RSVP field border | `#6f7458` | Input borders on the olive RSVP block |
| Signal-note text | `#8a8f74` | Muted footnote under directions |

### Typography (all Google Fonts; support Cyrillic + Romanian diacritics)
- **Playfair Display** — names, section headings, verse, venue, address, schedule times.
  Weights 400/500/600; italic used for the verse, invite line, and address. UPPERCASE for names
  & most headings; letter-spacing `.02em`–`.05em`; line-height `.95`–`1.45`.
- **Marck Script** (cursive) — the connector word ("та / și / &") and the footer verse tagline. 400.
- **Montserrat** — everything sans: eyebrows/metadata (500–600, UPPERCASE, letter-spacing
  `.16em`–`.34em`, 10–15px) and body paragraphs (300–400, 14–18px, line-height 1.8–1.9).
- **ui-monospace** (system mono) — placeholder captions on photo/map slots (10–11px, `.1em`).

Font sizes are **fluid** via `clamp()`. Key ramps (min, preferred, max):
- Names H1: `clamp(46px, 10vw, 104px)`
- Section H2: `clamp(26px, 4.4vw, 44px)`
- Verse: `clamp(22px, 3.6vw, 40px)`
- Schedule time: `clamp(28px, 5vw, 40px)`
- Body: `clamp(15px, 1.9vw, 18px)`

### Spacing
Scale (px): `4 · 6 · 8 · 12 · 16 · 20 · 24 · 32 · 44 · 60 · 90 · 130`.
Section vertical padding: `clamp(72px, 12vw, 130px)` (verse band uses `clamp(80px, 14vw, 150px)`).
Section horizontal padding: `clamp(22px, 6vw, 60px)`.
Content max-widths: `1000px` (location), `760px` (verse), `620px` (headers/story),
`520px` (schedule/RSVP), `1040px` (gallery).

### Border radius
`0` · `6px` (cards, fields, map) · `999px` (pills, buttons, circles) ·
arched photo `999px 999px 14px 14px` · schedule dots `50%`.

### Shadows
Used sparingly. Map pin: `0 4px 10px -4px #4E553988`. No blanket drop-shadows on cards.

### Decorative motifs (recurring)
- **Diamond**: a small square rotated 45° (`transform:rotate(45deg)`), terracotta `#C07C5A`,
  sizes 5–9px. Used as bullets/separators.
- **Hairline + diamond + hairline** rule: two 1px lines flanking a diamond, centered.
- **Diagonal hatch** photo placeholder fill:
  `repeating-linear-gradient(135deg,#dfe2cd 0,#dfe2cd 1px,transparent 1px,transparent 12px)`.

---

## Screens / Views
Single scrolling page. Sticky language switcher on top, then nine stacked sections.

### 0 · Language switcher (sticky header)
- Sticky, `top:0`, `z-index:40`, centered. Background `rgba(247,243,233,.86)` + `backdrop-filter:blur(8px)`, bottom border `1px #e4dfcf`.
- A pill group (border `1px #cfd0b6`, radius 999px, cream bg) with three buttons **УКР / ROM / ENG**, 1px divider between each.
- Active language: full opacity, `font-weight:600`, `aria-pressed="true"`. Inactive: `opacity:.5`.
- Font 11px, letter-spacing `.18em`, olive text.

### 1 · Hero
- Full-height: `min-height:calc(100svh - 49px)`, centered column, text-align center.
- **Doves+heart image** (`doves-olive.png`), `width:clamp(96px,15vw,150px)`.
- Eyebrow "Разом зі своїми родинами" (mid-olive, `.34em`).
- **H1 names**, three lines: `АНДРІЙ` / connector `та` (Marck Script, mid-olive, `.5em`) / `ЕЛЬФІДА`. Deep olive, weight 500, line-height `.98`.
- Italic invite line (Playfair italic, mid-olive, `max-width:34ch`).
- **Arched couple photo placeholder**: `width:clamp(220px,44vw,360px)`, `aspect-ratio:4/5`, border `1px #C07C5A`, radius `999px 999px 14px 14px`, hatch fill, caption "couple portrait · 4:5" bottom-centered.
- Rule: hairline–diamond–hairline (terracotta).
- Date row: "СУБОТА · 3 ЖОВТНЯ 2026" (olive) · terracotta diamond · "О 11:00" (mid-olive). Uppercase, `.24em`, `flex-wrap:wrap`.
- Scroll hint "Гортайте вниз" + a 34px vertical gradient line (terracotta → transparent).

### 2 · Verse — SOLID TERRACOTTA BAND (the signature of this variant)
- `background:#B5643F`, text `#FBEFE7`, padding `clamp(80px,14vw,150px)`, centered, `max-width:760px`.
- Eyebrow rule: `#E9C4B0` hairlines flanking "ЕКЛЕЗІЯСТ 4:9" (`#FBEADF`, 12px, `.3em`).
- Blockquote: Playfair italic 400, `clamp(22px,3.6vw,40px)`, line-height 1.45, color `#F7F3E9`.

### 3 · Story
- Cream bg, centered, `max-width:620px`. Kicker "Наша історія" → H2 "Дорога, що привела нас сюди" → terracotta hairline–diamond–hairline rule → body paragraph (body olive, line-height 1.9).

### 4 · Gallery
- `background:#F1E4DA` (terracotta wash). Centered header: H2 "Миті разом" (uppercase) + italic subtitle.
- **Masonry** via CSS `columns:clamp(150px,23vw,230px)`, `column-gap:clamp(10px,1.4vw,16px)`. 8 placeholder tiles with varied aspect ratios (3:4, 4:3, 1:1, 4:5…), `break-inside:avoid`, hatch fill, mono ratio labels.

### 5 · Schedule
- Cream bg. Centered header: H2 "Розклад дня" + italic subtitle "Обидві частини — у Biserica „Harul"".
- **Vertical timeline**, `max-width:520px`, `padding-left:clamp(30px,7vw,56px)`. A 1px terracotta line runs top→bottom; two entries each with a hollow circle node (cream fill, `1.5px #4E5539` border, radius 50%).
- Entry: big Playfair time (`11:00` / `13:00`), uppercase mid-olive title, Playfair venue, small body note.

### 6 · Location
- `background:#F1E4DA`. Centered H2 "Як дістатися". Two-column flex (`gap:clamp(24px,4vw,44px)`, wraps on mobile).
- **Map placeholder** (`flex:1 1 300px`, `min-height:260px`): grid-line background (`linear-gradient` 26px grid), terracotta border, centered olive diamond pin + mono caption.
- **Details column** (`flex:1 1 280px`): venue (Playfair 600), italic address (two lines), a coordinates card (cream, border `1px #dcdcc6`, radius 6) showing `48.0850197, 26.0520467` (mono, `user-select:all`).
  - Buttons: **"Прокласти маршрут"** (solid olive pill, links to `https://www.google.com/maps/dir/?api=1&destination=48.0850197,26.0520467`) and **"Копіювати координати"** (outline olive pill, copies the coords string via `navigator.clipboard`, label swaps to "Скопійовано ✓" for 1.8s).
  - Text link **"Відкрити в Google Maps"** → `https://maps.google.com/?cid=10979324914211926916`.
  - Muted signal-note footnote.

### 7 · Practical info
- Cream bg. Centered H2 "Корисна інформація". Three centered cards (`flex:1 1 240px; max-width:280px`), each: terracotta diamond, uppercase H3, body paragraph. Topics: Dress code / Parking / Accommodation.

### 8 · RSVP — OLIVE BLOCK
- `background:#4E5539`, text cream. Centered, `max-width:520px`.
- `doves-sage.png` (84px, `opacity:.9`), H2 "Підтвердіть участь", subline "…dай відповідь · до 19 вересня 2026" (terracotta text).
- **Form** (`data-rsvp`), fields column `gap:20px`:
  - Name text input; field labels are terracotta `#C07C5A`, uppercase `.16em`.
  - **Attend toggle** (`data-attend-group`): two buttons Yes/No, outline `1px #C07C5A`. Selected → `background:#4E5539; color:#F7F3E9`, others reset to transparent/cream. A hidden input mirrors `yes`/`no`.
  - Number input (guests, min 0 max 12 default 1).
  - Diet textarea.
  - Submit: cream pill, olive text, uppercase `.2em`, weight 600.
  - Inputs on this block: `background:#5a5f47`, border `1px #6f7458`, radius 6, cream text.
  - On submit: `preventDefault`, fade fields to `opacity:.45`, reveal a bordered thank-you note ("Дякуємо! Ми отримали вашу відповідь.").

### 9 · Footer
- Cream bg, centered. Terracotta diamond → names (Playfair 500, uppercase) → date line "3 жовтня 2026 · Станівці" (uppercase mid-olive) → Marck Script verse tagline in terracotta ("Двом краще, ніж одному").

---

## Interactions & Behavior
All wired in `site.js` (`window.WEDDING.init(document)` on load):
- **Language switch** — `[data-lang]` buttons swap every `[data-i18n]` text node and `[data-i18n-ph]`
  placeholder from the `DICT` object, set `<html lang>`, update pressed/opacity states, and persist
  the choice to `localStorage["wed_lang"]` (restored on next load; default `uk`).
- **Copy coordinates** — `[data-copy]` writes `48.0850197, 26.0520467` to the clipboard and
  temporarily swaps the button label to the localized "Copied ✓".
- **RSVP submit** — `form[data-rsvp]` submits are intercepted (no backend); shows a localized
  thank-you and dims the fields. **A real implementation needs a backend / form service here.**
- **Attend toggle** — segmented Yes/No described above.
- **Reveal on scroll** — `[data-reveal]` elements start at `opacity:0; translateY(18px)` and animate
  to visible via `IntersectionObserver` (threshold `.12`, transition `.9s cubic-bezier(.22,.61,.36,1)`).
  **Respects `prefers-reduced-motion: reduce`** — no hiding/animation when set.

### Responsive behavior
Fully fluid — `clamp()` for type/spacing and `flex-wrap`/CSS `columns` for layout; no JS breakpoints.
Two-column areas (location) and card rows (info) wrap to single column on narrow screens.
The design targets **mobile 390px as primary**, tested through tablet 834px and desktop 1440px.

## State Management
Minimal, all client-side:
- `lang: "uk" | "ro" | "en"` — current language (persisted to localStorage).
- `attend: "yes" | "no" | ""` — RSVP toggle value (hidden input).
- `rsvpSubmitted: boolean` — toggles the thank-you note / dims fields.
- RSVP field values (name, guests, diet) — plus a real **data-fetch/POST** to store submissions,
  which the prototype stubs out.

## i18n
`site.js` `DICT` holds every string in `uk` / `ro` / `en` keyed by the `data-i18n` names used in the
markup. Port these keys into the target i18n system verbatim (they include the exact copy, with
Ukrainian as default). Display order is **groom first** in all languages
(Andrei și Elfida / Андрій та Ельфіда / Andrew & Elfida).

## Assets
Included in this bundle (transparent PNG line-art, sage/olive tones — part of the fixed identity):
- `doves-olive.png` — doves + heart, hero mark.
- `doves-sage.png` — doves + heart, lighter, used on the RSVP block.
- `site.js` — trilingual dictionary + all runtime behaviors (the real logic to reimplement).

**Still needed from the couple (currently placeholders):**
- Real photographs for the hero portrait (4:5) and gallery tiles (mixed ratios).
- An embedded map (Google Maps embed or a static map image) to replace the grid placeholder.
  Venue: `48.0850197, 26.0520467`, CID link `https://maps.google.com/?cid=10979324914211926916`.
- A backend or form service for RSVP submissions.
- **Site URL is not yet set** — it will be needed for the printed invitation's QR code.

Fonts load from Google Fonts: **Playfair Display**, **Marck Script**, **Montserrat**
(ensure Cyrillic + Latin-Ext subsets for Romanian diacritics).

## Files
- `Concept-C7-Terracotta-Block.dc.html` — the C7 design prototype (this variant).
- `site.js` — shared trilingual dictionary + behaviors.
- `doves-olive.png`, `doves-sage.png` — hero / RSVP marks.

Key hex to remember: base olive **#4E5539 / #8A9367**, cream **#F7F3E9**, and the two terracottas
**#C07C5A** (accent) + **#B5643F** (solid verse band).
