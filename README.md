# Андрій та Ельфіда · Andrei și Elfida · Andrew & Elfida

The wedding invitation website for **3 October 2026**, Biserica „Harul”, Stănești (Станівці),
Chernivtsi region, Ukraine.

**Live at: https://andrewandelfida.github.io/**

That exact URL is what the printed QR code points to. Please read
[Keeping the QR code working](#keeping-the-qr-code-working) before renaming anything on GitHub.

> 📖 **[docs/MAINTENANCE.md](docs/MAINTENANCE.md) is the full maintenance guide** — step-by-step
> instructions for swapping photos, editing wording, publishing, and undoing a mistake. Start
> there. The rest of this README is a summary.

---

## ⚠ Three things to check before the invitations go to print

1. **The Bible verse.** The brief asked for Ecclesiastes 4:9 in Ohienko (Ukrainian), Cornilescu
   (Romanian) and WEB (English). The site uses the wording supplied in the design bundle, copied
   character for character and never machine-translated.

   **The Romanian is settled**: the printed invitation reads "se ridică unul pe altul", which is
   what the site says, so that is your chosen wording even though Cornilescu prints "se scoală
   unul pe altul". (The card punctuates it with a semicolon and « » quotation marks; the site
   uses a full stop and sets it in italic without quote marks. Same words.)

   **The Ukrainian and English are still unchecked** against Ohienko and WEB. If you want the
   exact printed wording of either, paste it in at the top of
   [`src/content/strings.ts`](src/content/strings.ts).

2. **The new interface wording.** Most of the copy comes straight from the design bundle and is
   marked `// [design]`. A handful of strings did not exist there — map labels, the "skip to
   content" link, the Waze button — and are marked `// [new]`. Those are worth a native speaker's
   glance before printing.

3. **The translated story.** The "Povestea noastră" paragraph is the couple's own Romanian
   wording, marked `// [couple]`. The Ukrainian and English versions are translations of it,
   marked `// [couple-uk]` and `// [couple-en]`, and nobody has checked them yet.

---

## The default language is Romanian

The bare URL — the one behind the printed QR code — opens in **Romanian**. Ukrainian and
English are one tap away, and `?lang=uk` / `?lang=en` are shareable links that open directly
in that language.

The default is fixed rather than guessed from the phone's settings, so every scan of the
printed code behaves the same way, including when a guest hands their phone to someone else.

To change it, edit `DEFAULT_LOCALE` in [`src/i18n/locale.ts`](src/i18n/locale.ts) — and also
update `<html lang>`, the title and the `og:` tags in `index.html`, which describe the default
language to link previews and crawlers before any script runs.

---

## Everyday tasks

> These are summaries. [docs/MAINTENANCE.md](docs/MAINTENANCE.md) covers each one in full, plus
> troubleshooting and how to roll back a change.

### Change any wording

All copy for all four languages is in one file: **[`src/content/strings.ts`](src/content/strings.ts)**.

Find the key, edit the Ukrainian, Romanian, English and German versions, then:

```bash
npm run fonts     # ← IMPORTANT, see below
npm run build
git add -A && git commit -m "Update wording" && git push
```

> **Why `npm run fonts` after editing text?**
> The fonts are cut down to contain only the characters this site actually uses — that is what
> makes them small enough for a phone on a rural mobile network. If you introduce a character
> that was not there before, it needs to be added to the fonts, or it will show up in a
> mismatched fallback typeface. Running `npm run fonts` rebuilds them.
> `npm run check:glyphs` will tell you if anything is missing.

### Change dates, the venue, coordinates or links

**[`src/content/wedding.ts`](src/content/wedding.ts)** — coordinates, map links, the schedule and
which photos appear. Nothing is hardcoded in the page itself.

### Swap the photographs

This is designed so you never have to touch code after the photoshoot.

1. Put the original, full-size photos here (straight off the camera is fine — JPEG, PNG, HEIC or
   TIFF, any size):

   ```
   photos-src/hero/couple.jpg      ← the portrait in the arch at the top
   photos-src/gallery/01.jpg       ← the gallery, in order
   photos-src/gallery/02.jpg
   …
   photos-src/gallery/08.jpg
   ```

2. Run:

   ```bash
   npm run images
   ```

   This creates every size and format the site needs (AVIF, WebP and JPEG at six widths) in
   `public/images/`, and records each photo's real dimensions.

3. Commit and push:

   ```bash
   git add -A && git commit -m "Add wedding photos" && git push
   ```

**Notes**

- The filenames must match the `src` values in `src/content/wedding.ts`. If you want different
  names, edit that list — it is one array.
- Until a photo exists, the site shows the design's hatched placeholder box in its place. It never
  looks broken, just unfinished.
- **A landscape photo can replace a portrait one and nothing breaks.** The layout reads each
  photo's true proportions, so the gallery re-flows on its own. The photo in the arch at the top
  is always shown as a 4:5 portrait and will be cropped to fit, so choose one that works that way.
- Originals are deliberately *not* committed to the repository (see `.gitignore`) — only the small
  web-sized versions are, which keeps the site fast and the repo small. **Keep your originals
  somewhere safe of your own.**
- To change the alt text a screen reader announces, edit the `alt` entries in
  `src/content/wedding.ts`.

### Change the background artwork

The floral drawing behind the page is generated from one file:

```
assets-src/backdrop.svg      ← replace this with your own line drawing
```

Then run:

```bash
npm run backdrop
git add -A && git commit -m "New backdrop" && git push
```

That produces `public/backdrop.avif` and `.webp`. A few things it does for you:

- **Recolours the drawing** to the page's olive, whatever colour the file itself uses. Any
  line art works; it does not need to be olive already.
- **Removes a white background plate** if the file has one, so the cream shows through.
- **Reads the colours from `tokens.css`**, so the backdrop always matches the page.

**Keep it line art.** The drawing is printed at 7% strength, which is the most it can be
before text on top of it stops meeting the contrast standard — `npm run check:contrast`
will fail if you push past that. Solid or dark artwork will not work at that strength.

### Publish changes

Push to `main`. That is all — GitHub rebuilds and republishes automatically, usually within a
couple of minutes.

```bash
git push
```

You can watch it at
<https://github.com/andrewandelfida/andrewandelfida.github.io/actions>, or from the terminal:

```bash
gh run watch
```

If the build fails, **the old site stays up** — a broken build is never published.

---

## Keeping the QR code working

The printed QR code encodes exactly:

```
https://andrewandelfida.github.io/
```

That address stays alive as long as all of the following remain true:

| Do not | Because |
|---|---|
| **Do not delete or rename the `andrewandelfida` organisation** | The whole address is derived from the org name. Renaming it breaks every printed invitation. |
| **Do not rename the `andrewandelfida.github.io` repository** | The repository name *is* the domain for an organisation Pages site. |
| **Do not make the repository private** | GitHub Pages stops serving a private repo on a free plan, and the URL goes dead. |
| **Do not disable GitHub Pages** in Settings → Pages | Same result. |

Deleting old *files* or changing the *content* is completely safe. It is only the org name, the
repo name and its visibility that the printed QR depends on.

### If you later want your own domain (e.g. `andriy-i-elfida.com`)

You can, and **the printed QR codes will keep working**. When a custom domain is added to this
same Pages site, GitHub issues a permanent redirect from `andrewandelfida.github.io` to the new
domain, so an old invitation still lands in the right place.

Printing the `github.io` address now does not lock you out of upgrading later. (Nothing needs
doing about this today.)

---

## How it is built

Static site — plain HTML, CSS and a small amount of JavaScript. No server, no database, no
subscription, nothing that can expire.

| | |
|---|---|
| Framework | Vite + React + TypeScript |
| Rendered | Prerendered to static HTML at build time, then hydrated |
| Styling | Plain CSS with custom properties; every token in one file |
| Map | OpenStreetMap via Leaflet — no API key, no billing, no quota |
| Hosting | GitHub Pages, deployed by GitHub Actions on push to `main` |

### Why some decisions were made

- **The page is prerendered.** A normal React app is an empty page until its JavaScript loads. The
  venue address and coordinates have to survive a failed script load on a patchy rural connection,
  so the whole invitation is baked into the HTML and works with JavaScript switched off entirely.
- **Language is in a query parameter** (`?lang=ro`), not a path like `/ro/`. GitHub Pages cannot
  rewrite URLs, so a path-based language would return a 404 on refresh or when someone opens a
  shared link directly. A query parameter is immune to that, and the links are shareable.
- **The location section never depends on the map.** The address, the raw coordinates and every
  directions link are real text and real links on the page. The map is an enhancement that loads
  only when you scroll to it; if it fails, nothing important is lost.
- **Coordinates are the source of truth, not the address.** Address data for Stănești is thin in
  both Google and OpenStreetMap, so every directions link targets `48.0850197, 26.0520467`
  directly, the coordinates are shown as selectable text, and there is a one-tap copy button.
- **Fonts are self-hosted and cut to size.** No third-party font CDN — one less thing that has to
  still exist in 2036, and one less network round trip on a slow connection.

### Deviations from the design bundle

The design in `docs/design/` is the source of truth for layout, palette, typography and spacing.
Three deliberate departures, all documented in the code where they occur:

1. **Some colours were darkened for legibility.** The brief required WCAG AA, and eight
   text/background pairs in the original palette failed — the mid-olive `#8A9367` scored 2.61:1 on
   the terracotta wash, and the language switcher's `opacity: .5` came out at 2.28:1. Hues are
   preserved and the light-to-dark hierarchy still reads as designed. Every change is marked
   `ADJUSTED` in [`src/styles/tokens.css`](src/styles/tokens.css) with its original value, and
   `npm run check:contrast` re-verifies all 35 pairs.
2. **The verse band is `#AE603C`, not `#B5643F`.** Its 12px reference line could not reach AA on
   the original even in pure white (4.32:1). A ~3% darkening was the smallest change that keeps
   the signature terracotta block intact.
3. **There is a floral backdrop the design bundle does not have.** The design is imagery-free
   cream; the couple asked for a drawing behind the page. It is composited onto the cream at 7%
   — measured as the strongest it can be while every text pair still meets AA — and faded out at
   its edges so it has no visible boundary. See `scripts/generate-backdrop.mjs`.
4. **The coordinates are no longer shown.** The location section used to print
   `48.0850197, 26.0520467` as selectable text; the couple asked for it to go. Every directions
   link and the copy button still use the exact pair, so navigation is unaffected.
5. **There is no RSVP section.** It was removed at the couple's request. It existed only to hold a
   reply form, and an olive "confirm your attendance" panel with no way to reply would be a dead
   end. To restore it, add a `<Rsvp />` section back in `src/App.tsx` — the note there explains
   what else it needs. What survives of it is one line at the end of the schedule: the card's
   reply-by date, and both of the couple's phone numbers as `tel:` links — one line each,
   named, because a guest holding two bare numbers cannot tell whose is whose. They live in
   `RSVP_CONTACTS` in [`src/content/wedding.ts`](src/content/wedding.ts) and are also printed on
   the card — change them in both places or neither. The names come from `rsvp_name_groom` /
   `rsvp_name_bride`, so each language shows the form it uses elsewhere (Андрій / Andrei /
   Andrew).

---

## Running it locally

```bash
npm install         # once
npm run dev         # development server with live reload
```

To build and preview exactly what gets published:

```bash
npm run build
npm run serve       # http://localhost:4173
```

`npm run serve` compresses responses and sets caching headers the way GitHub Pages does, so
performance measured against it is realistic.

### Checks

```bash
npm run check:contrast   # every text/background pair against WCAG AA
npm run check:glyphs     # fonts cover every character the content uses
npm run test:e2e         # language routing, map, no-JS rendering, keyboard access
npm run verify           # all of the above
npm run shots -- --audit # screenshots + layout assertions at every breakpoint
```

The browser-based checks need the site running (`npm run serve`) in another terminal, and use the
Google Chrome already installed on the machine.

### Current results

| | |
|---|---|
| Lighthouse mobile — Performance | **96** (desktop: 100) |
| Lighthouse mobile — Accessibility | **100** |
| Lighthouse mobile — Best Practices | **100** |
| Lighthouse mobile — SEO | **100** |
| WCAG AA contrast pairs | **43 / 43** |
| End-to-end checks | **46 / 46** |
| Font/glyph checks | **70 / 70** |

Measured against the live site at https://andrewandelfida.github.io/.

---

## Project layout

```
src/
  content/          ← EDIT THESE
    strings.ts        all copy, all four languages
    wedding.ts        dates, venue, coordinates, links, photo list
    types.ts          shared types
    image-manifest.json  generated by `npm run images` — do not edit
  styles/
    tokens.css        every colour, size and spacing value
    base.css          reset, focus styles, reduced motion
    sections.css      the page's styles
    fonts.css         generated by `npm run fonts` — do not edit
  components/       one file per section of the page
  i18n/             language handling
  hooks/

scripts/
  fetch-fonts.mjs     downloads + subsets the fonts
  generate-images.mjs turns your photos into web-ready sizes
  generate-backdrop.mjs turns assets-src/backdrop.svg into the page backdrop
  prerender.mjs       bakes the page into static HTML at build time
  serve.mjs           local preview that behaves like GitHub Pages
  check-contrast.mjs  WCAG AA audit
  check-glyphs.mjs    font coverage audit
  test-e2e.mjs        browser tests
  shots.mjs           responsive screenshots

photos-src/         ← PUT YOUR PHOTOS HERE (not committed)
assets-src/         backdrop.svg — the source of the floral background
public/             fonts, images, the backdrop and icons served as-is
docs/design/        the original design bundle
.github/workflows/  the deploy workflow
```
