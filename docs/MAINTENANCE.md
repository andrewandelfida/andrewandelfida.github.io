# Maintaining the invitation site

Everything you need to change this website after it has been built, written so you can follow it
without knowing how any of it works.

**The live site:** https://andrewandelfida.github.io/
**Where the code lives:** https://github.com/andrewandelfida/andrewandelfida.github.io

---

## Contents

- [The one rule](#the-one-rule)
- [Before you start (first time only)](#before-you-start-first-time-only)
- [Swapping the photographs](#swapping-the-photographs)
- [Changing the background drawing](#changing-the-background-drawing)
- [Changing the wording](#changing-the-wording)
- [Changing dates, times and the venue](#changing-dates-times-and-the-venue)
- [Changing the schedule](#changing-the-schedule)
- [Changing colours, fonts and spacing](#changing-colours-fonts-and-spacing)
- [Checking your work before publishing](#checking-your-work-before-publishing)
- [Publishing](#publishing)
- [When something goes wrong](#when-something-goes-wrong)
- [Undoing a change](#undoing-a-change)
- [Things that must never change](#things-that-must-never-change)
- [Long-term care](#long-term-care)
- [Reference](#reference)

---

## The one rule

> **Anything you push to the `main` branch becomes the live website, automatically, within about
> two minutes.**

There is no separate "publish" button and no server to log into. You edit a file, you push, and
GitHub rebuilds and republishes the site for you.

If the build fails, **the old site stays up**. A broken change can never take the site down — the
worst case is that your change simply doesn't appear, and GitHub emails you about it.

---

## Before you start (first time only)

You need [Node.js](https://nodejs.org) version 20 or newer, and Git.

```bash
git clone https://github.com/andrewandelfida/andrewandelfida.github.io.git
cd andrewandelfida.github.io
npm install
```

To see the site on your own machine while you work:

```bash
npm run dev
```

Then open the address it prints (usually `http://localhost:5173`). It updates as you save files.

---

## Swapping the photographs

This is the main thing that will happen after the photoshoot, and it is designed so you never have
to edit code.

### The short version

1. Put your photos in `photos-src/`, named to match the list below.
2. Run `npm run images`
3. Run `git add -A && git commit -m "Add wedding photos" && git push`

### The full version

**Step 1 — put your originals in `photos-src/`**

Straight off the camera or phone is fine. JPEG, PNG, HEIC or TIFF, any size — bigger is better,
the script shrinks them for you. Photos taken sideways are rotated automatically.

```
photos-src/
  hero/
    couple.jpg        ← the portrait inside the arch at the top of the page
  gallery/
    01.jpg            ← the gallery, shown in this order
    02.jpg
    03.jpg
    04.jpg
    05.jpg
    06.jpg
    07.jpg
    08.jpg
```

The names matter — they must match the list in `src/content/wedding.ts`. If you would rather use
your own names (`ceremony.jpg`, `first-dance.jpg`…), that is fine: see
[Using different filenames](#using-different-filenames) below.

**Step 2 — build the web-sized versions**

```bash
npm run images
```

You will see something like:

```
  gallery/01               4032×3024  →  6 widths × 3 formats  (312 KB total)
  hero/couple              3024×4032  →  6 widths × 3 formats  (287 KB total)

Processed 9 photo(s).
```

This creates every size and format a phone or laptop might need (AVIF, WebP and JPEG at six
widths) in `public/images/`, and records each photo's real dimensions so the page can reserve
exactly the right space for it.

**Step 3 — look at it**

```bash
npm run dev
```

**Step 4 — publish**

```bash
git add -A
git commit -m "Add wedding photos"
git push
```

### Things worth knowing about photos

**A landscape photo can replace a portrait one.** The gallery reads each photo's true proportions
and re-flows around it. Nothing breaks and no code needs changing.

**The photo at the top is always shown as a tall 4:5 portrait**, inside the arch shape. A landscape
photo put there will be cropped to fit, centred. Choose one that survives that crop.

**Your originals are not stored in GitHub.** Only the small web versions are. This keeps the site
fast, but it means:

> ⚠ **Keep your original photographs somewhere safe of your own** — an external drive, a photo
> library, cloud storage. GitHub is not your backup.

**If a photo is missing, the site does not break.** It shows the design's hatched placeholder box
in its place. So you can add photos one at a time as they come in.

### Using different filenames

Open `src/content/wedding.ts` and edit the `src` values:

```ts
export const GALLERY_IMAGES: WeddingImage[] = [
  {
    src: 'gallery/first-look',        // ← matches photos-src/gallery/first-look.jpg
    alt: { uk: 'Перший погляд', ro: 'Prima privire', en: 'The first look' },
    aspect: 'portrait',
  },
  …
];
```

- `src` — the filename **without** the extension, including the folder.
- `alt` — what a blind visitor's screen reader announces. Worth writing properly.
- `aspect` — `'portrait'`, `'landscape'` or `'square'`. This only decides the shape of the
  placeholder box shown *before* the photo exists; once the real photo is there its own
  proportions are used.

### Adding or removing gallery photos

There is nothing special about eight. Add or delete entries in the `GALLERY_IMAGES` list and add
or delete the matching files. The masonry layout adjusts on its own.

### ⚠ The one dangerous command

`npm run images` **rebuilds `public/images/` from scratch** using whatever is in `photos-src/`. It
deletes what was there before, so that a photo you removed doesn't linger on the live site.

That means: **whatever is in `photos-src/` when you run it becomes the entire gallery.**

Because `photos-src/` is not stored in GitHub, it will be empty on a freshly cloned copy. The
script knows this and will refuse to run rather than wipe your published photos:

```
Refusing to run: photos-src/ is empty, but 9 photo(s) are currently published.
```

If you see that, you have not lost anything — put your originals back in `photos-src/` before
running it again. You only ever need this command when you are *changing* photos.

To deliberately remove all photos and go back to the placeholder design:

```bash
npm run images -- --force
```

---

## Changing the background drawing

The pale floral drawing behind the whole page is built from a single file:

```
assets-src/backdrop.svg
```

To change it, put a different drawing there under the same name and run:

```bash
npm run backdrop
```

Then check it, commit and push:

```bash
npm run build
npm run serve          # look at it at http://localhost:4173
git add -A && git commit -m "New background drawing" && git push
```

### What the command does for you

- **Recolours the drawing** to the page's olive. The file can be any colour — black line art is
  fine — it does not need to be prepared in advance.
- **Removes a white background** if the drawing has one, so the cream page shows through.
- **Takes the colours from `src/styles/tokens.css`**, so the background always matches the page.
  If you change the cream or the olive, run `npm run backdrop` again.
- **Shrinks it drastically.** The drawing supplied was 1.9 MB; what actually gets sent to a
  guest's phone is about 10 KB.

### What kind of drawing works

**Line art only.** The drawing is printed very faintly — at 7% strength — so that text stays
readable on top of it. Anything solid, dark, or photographic disappears into a smudge at that
strength.

That 7% is not a preference, it is the ceiling. Two pieces of text on the site sit close to the
minimum readable contrast, and at 9% they drop below the accessibility standard. If you try to
make the background stronger, `npm run check:contrast` will fail and tell you which text broke.

### If you don't want a background at all

Delete the `body::before` block in [`src/styles/base.css`](../src/styles/base.css). It is one
self-contained rule, clearly commented, and nothing else depends on it.

---

## Changing the wording

**All the words on the site, in all four languages, are in one file:**
[`src/content/strings.ts`](../src/content/strings.ts)

Each entry appears four times — once under `uk` (Ukrainian), once under `ro` (Romanian), once
under `en` (English) and once under `de` (German). Find the one you want and edit all four.

> Romanian is the language the site opens in, so if you only have time to check one, check that
> one. See “The default language” in the README if you ever want to change which it is.

```ts
story_head: 'Дорога, що привела нас сюди',       // in the uk section
story_head: 'Drumul care ne-a adus aici',        // in the ro section
story_head: 'The road that brought us here',     // in the en section
story_head: 'Der Weg, der uns hierher geführt hat', // in the de section
```

If you change one language and forget another, the site will not build — it checks that all four
are complete. That is deliberate; it stops a half-translated page reaching guests.

### ⚠ After editing text, run this

```bash
npm run fonts
```

**Why:** the fonts have been cut down to contain only the letters this site actually uses. That is
what makes them small enough to load quickly on a village mobile connection. If your new wording
introduces a character that wasn't there before, it needs adding to the fonts — otherwise it will
appear in a mismatched fallback typeface.

To check whether anything is missing:

```bash
npm run serve          # in one terminal
npm run check:glyphs   # in another
```

### The comments in that file

- `// [design]` — wording that came from the original design brief. Think before changing it.
- `// [new]` — wording written during the build (map labels, the Waze button, the "skip to
  content" link). Safe to reword.
- `// [couple]` — your own words, used exactly as you gave them.
- `// [couple-uk]` / `// [couple-en]` — translations of a `[couple]` string. They carry the same
  meaning, but nobody has checked the wording. Worth a second pair of eyes.

### ⚠ The Bible verse

The Ecclesiastes 4:9 text is at the top of `strings.ts` under a clearly marked warning. It was
copied exactly as supplied and is *close to* but not word-for-word identical with the published
Ohienko / Cornilescu / WEB editions. If you want the exact printed wording of a particular
translation, paste it in there — but please copy it from an actual Bible rather than from memory
or a translation tool.

---

## Changing dates, times and the venue

[`src/content/wedding.ts`](../src/content/wedding.ts) holds the facts.

**The venue's coordinates** — used by the map, the "get directions" button, the Waze link and the
copy-to-clipboard button. They are no longer printed on the page, but they are still what every
route actually targets, so this is the one number that must be right. Change it in one place:

```ts
export const VENUE = {
  lat: 48.0850197,
  lng: 26.0520467,
};
```

**Machine-readable dates** — these are what browsers and calendars read. If the date changes, these
must change too:

```ts
export const WEDDING_DATE_ISO = '2026-10-03';
export const CEREMONY_START_ISO = '2026-10-03T11:00:00+03:00';
export const RECEPTION_START_ISO = '2026-10-03T13:00:00+03:00';
```

> The date that guests *see* ("СУБОТА · 3 ЖОВТНЯ 2026") is separate — it lives in `strings.ts`,
> because it is worded differently in each language. **If the date changes, update both files.**
> The ones in `strings.ts` are `date_full`, `date_short`, `month_year`, `weekday`, `time_lead` and
> `footer_date`.

---

## Changing the schedule

The two entries — the ceremony at 11:00 and the meal at 13:00 — are in `wedding.ts`:

```ts
export const SCHEDULE: ScheduleEntry[] = [
  { time: '11:00', titleKey: 'sch1_title', venueKey: 'sch1_venue', noteKey: 'sch1_note' },
  { time: '13:00', titleKey: 'sch2_title', venueKey: 'sch2_venue', noteKey: 'sch2_note' },
];
```

- To change a **time**, edit `time` here (and the matching `*_ISO` value above).
- To change the **words**, edit `sch1_title`, `sch1_venue`, `sch1_note` etc. in `strings.ts`.
- To **add a third entry**, add a line here with new key names (`sch3_title`, …) and add those keys
  to all four languages in `strings.ts`. The timeline line, dot and spacing all adjust
  automatically.

---

## Changing colours, fonts and spacing

Every colour, text size and spacing value on the site is defined in one file:
[`src/styles/tokens.css`](../src/styles/tokens.css). Nothing else contains a colour code.

```css
--c-olive-deep: #4e5539;    /* headings and primary text */
--c-terracotta: #c07c5a;    /* the diamonds and hairlines */
--c-verse-band: #ae603c;    /* the solid terracotta band */
```

### ⚠ If you change a colour, check it is still readable

```bash
npm run check:contrast
```

This checks all 35 text-against-background combinations on the site against the WCAG AA
accessibility standard and tells you if any fail.

Several colours are marked `ADJUSTED` with a note explaining that they were darkened from the
original design because the original was too faint to read. Please don't revert those without
re-running the check — the palette is light, and it is easy to make text that looks elegant on a
designer's monitor and is invisible on a phone in daylight.

**This check also runs automatically on every publish, and will block a deploy that fails it.**

---

## Checking your work before publishing

You never *have* to run these — the site will publish anyway — but they catch mistakes.

Open two terminals. In the first:

```bash
npm run build
npm run serve
```

In the second:

```bash
npm run verify
```

That runs three sets of checks:

| Command | What it checks |
|---|---|
| `npm run check:contrast` | All 43 text/background pairs meet WCAG AA |
| `npm run test:e2e` | 46 checks: language switching, the map, the page working without JavaScript, keyboard access, no console errors |
| `npm run check:glyphs` | The fonts contain every character your text uses |

To see how it looks at every screen size:

```bash
npm run shots -- --audit
```

This saves screenshots to `/tmp/shots/` at six widths from a 360px phone to a 1440px desktop, and
fails if anything overflows the screen or any button is too small to tap. (It needs Google Chrome
installed.)

---

## Publishing

```bash
git add -A
git commit -m "Describe what you changed"
git push
```

Then watch it go out:

```bash
gh run watch
```

…or open <https://github.com/andrewandelfida/andrewandelfida.github.io/actions> in a browser.

A green tick means it is live. Give it another minute, then hard-refresh the site
(**Cmd+Shift+R** / **Ctrl+Shift+R**) — browsers cache the page for ten minutes.

---

## When something goes wrong

### The deploy failed (red ✗ in the Actions tab)

Click the failed run to see which step failed.

| Step that failed | What it means | Fix |
|---|---|---|
| **Check colour contrast** | A colour you changed is too faint to read | Run `npm run check:contrast` locally; it names the exact pair and the ratio it needs |
| **Type-check, build and prerender** | A file has a syntax error, or a translation is missing from one language | Run `npm run build` locally to see the same error with more detail |
| **Verify the built page contains real content** | The page built but came out empty | Something is badly wrong; see [Undoing a change](#undoing-a-change) |
| **Install dependencies** | Usually a temporary GitHub problem | Re-run the job from the Actions page |

**The live site is unaffected by a failed build.** Take your time.

### My change isn't showing up

1. Check the Actions tab shows a green tick for your commit.
2. Hard-refresh: **Cmd+Shift+R** (Mac) or **Ctrl+Shift+R** (Windows). The page is cached for ten
   minutes.
3. Try a private/incognito window — the site remembers your chosen language in your browser.

### The text looks wrong / letters are in the wrong font

You added a character the trimmed fonts don't contain. Run:

```bash
npm run fonts
git add -A && git commit -m "Update fonts" && git push
```

### The map doesn't appear

The map is deliberately optional. It loads only when you scroll to it, and if OpenStreetMap is
unreachable it stays as a plain grid with the venue name.

**This is not an emergency**: the venue name, the full address and all three directions links are
ordinary text and links on the page, and work regardless. That was designed for guests arriving in
a village with weak signal.

### I broke something and don't know what

See below.

---

## Undoing a change

Every version of the site is kept forever. To go back to how it was before your last change:

```bash
git revert HEAD
git push
```

This creates a *new* commit that undoes the last one — nothing is lost, and the site returns to the
previous state within two minutes.

To go back further, find the commit you want:

```bash
git log --oneline
```

```
89bb781 Record measured Lighthouse range in the README
4cacb0b Fix invisible map marker
dce2293 Pin deploy actions to Node 24-capable versions
fc70c5b Wedding invitation site for Andrei & Elfida
```

Then:

```bash
git revert <the-id>
git push
```

---

## Things that must never change

The QR code printed on the physical invitations encodes exactly:

```
https://andrewandelfida.github.io/
```

Paper cannot be updated. That address keeps working only while all of these stay true:

| Never | Why |
|---|---|
| Never rename or delete the **`andrewandelfida`** organisation on GitHub | The web address is built from the organisation name |
| Never rename the **`andrewandelfida.github.io`** repository | For an organisation site, the repository name *is* the domain |
| Never make the repository **private** | GitHub stops serving a private repository's site on a free plan |
| Never turn off **GitHub Pages** in Settings → Pages | Same result — the address goes dead |
| Never change the Pages **source** away from "GitHub Actions" | The site would be published from the wrong files |

Changing the *content* — the words, the photos, the colours, even deleting whole sections — is
completely safe. It is only those five things that the printed invitations depend on.

### Moving to your own domain later

You can add a custom domain (`andrii-ta-elfida.com`, say) to this same site whenever you like, and
**the printed QR codes will keep working**: GitHub permanently redirects the old
`andrewandelfida.github.io` address to the new one.

Printing the GitHub address now does not lock you out of upgrading later.

---

## Long-term care

This site was built to need nothing. There is no server, no database, no subscription, no API key
and no certificate to renew. Left completely alone it will keep working.

Two optional things, if you want the site to outlive the wedding:

**Once a year** — open the site and check it still loads. If GitHub ever changes something
fundamental, you will find out at a moment of your choosing rather than the week of an anniversary.

**After the wedding** — you may want to change the tenses ("we were married") or replace the
schedule with a thank-you. Everything above still applies; it is the same three files.

**If you ever stop wanting the site**, do not delete the repository — the printed invitations will
outlive it. Just replace the content. An invitation that says "thank you for celebrating with us"
is a much kinder thing for someone to find in 2035 than a 404.

---

## Reference

### Commands

| Command | What it does |
|---|---|
| `npm run dev` | Preview the site locally while you edit it |
| `npm run build` | Build the real site into `dist/` |
| `npm run serve` | Serve the built site at `http://localhost:4173`, behaving like GitHub Pages |
| `npm run images` | Turn `photos-src/` photos into web-ready sizes ⚠ *rebuilds from scratch* |
| `npm run fonts` | Rebuild the trimmed fonts — **run after editing any text** |
| `npm run backdrop` | Rebuild the floral background from `assets-src/backdrop.svg` |
| `npm run verify` | Run all the checks below |
| `npm run check:contrast` | Every text/background pair against WCAG AA |
| `npm run check:glyphs` | Fonts cover every character the text uses |
| `npm run test:e2e` | Language switching, map, no-JavaScript, keyboard access |
| `npm run shots -- --audit` | Screenshots + layout checks at six screen widths |

The last three need `npm run serve` running in another terminal, and Google Chrome installed.

### Which file do I edit?

| I want to change… | File |
|---|---|
| Any words, in any language | `src/content/strings.ts` |
| Which photos appear, and their alt text | `src/content/wedding.ts` |
| The venue coordinates or map links | `src/content/wedding.ts` |
| Dates and times (machine-readable) | `src/content/wedding.ts` |
| Dates as guests read them | `src/content/strings.ts` |
| The schedule entries | `src/content/wedding.ts` + `strings.ts` |
| The floral background drawing | `assets-src/backdrop.svg`, then `npm run backdrop` |
| Colours, text sizes, spacing | `src/styles/tokens.css` |
| The layout of a section | `src/styles/sections.css` |
| Which sections appear, and their order | `src/App.tsx` |

### Files you should not edit by hand

| File | Why |
|---|---|
| `src/styles/fonts.css` | Regenerated by `npm run fonts` |
| `src/content/image-manifest.json` | Regenerated by `npm run images` |
| `public/fonts/`, `public/images/` | Generated |
| `public/backdrop.avif`, `public/backdrop.webp` | Regenerated by `npm run backdrop` |
| `dist/` | The built site; rebuilt every time |

### How the site is put together

| | |
|---|---|
| Built with | Vite + React + TypeScript |
| Published as | Static HTML — the whole invitation is readable with JavaScript switched off |
| Map | OpenStreetMap via Leaflet — no API key, no billing, nothing that can expire |
| Language | Held in the web address (`?lang=ro`), so links are shareable and survive a refresh |
| Hosting | GitHub Pages, rebuilt automatically on every push to `main` |

The reasoning behind those choices is in the [main README](../README.md#why-some-decisions-were-made),
and the original design brief is in [`docs/design/README.md`](design/README.md).
