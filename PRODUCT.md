# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Guests invited to the wedding of Андрій (Andrei / Andrew) and Ельфіда (Elfida) on
3 October 2026 at Biserica „Harul", Stănești (Станівці), Chernivtsi oblast, Ukraine.
Four audiences, all confirmed, all real:

- **Local village and regional guests** — family, neighbours and the church community
  around Stănești and Chernivtsi. Ukrainian-speaking, arriving on phones over patchy
  rural mobile data.
- **Romanian-speaking relatives** — Romanian is a first language for part of the family,
  not a courtesy translation. Stănești is in a historically Romanian-speaking area.
- **Diaspora and international family** — relatives abroad, many of whom will open the
  link without travelling. English exists for them, and German for the part of that
  family who read it more comfortably than any of the other three.
- **Older guests with low technology confidence** — people for whom a QR code is
  unfamiliar. Every important action has to be large, obvious and reachable in one tap.

The situation is always the same: a person holding a printed paper invitation, pointing a
phone camera at it, standing somewhere with imperfect signal, wanting to know when, where,
and how to get there.

## Product Purpose

A single web page that carries everything a guest needs from a printed invitation, in the
guest's own language. Success is a guest who scans the code once and leaves knowing the
date, the place, and how to navigate to it — including guests who never scroll, never
enable JavaScript, and never find the map useful.

The site is the destination of a **permanently printed QR code**. It has no funnel, no
conversion, and no second visit to optimise for. Being correct and still working is the
entire job.

## Positioning

Not a product; a durable artefact tied to a physical object that cannot be reissued. The
constraint that shapes every decision is that the paper is printed before the site can be
corrected, and the URL can never change afterwards.

## Operating Context

- Reached almost exclusively by scanning a QR code on paper, on a phone, in portrait.
- Rural Ukraine: intermittent mobile data, and a real chance that scripts, tiles or
  third-party resources fail to load.
- **Address data for Stănești is thin in both Google Maps and OpenStreetMap.** A searchable
  address string cannot be relied on; coordinates are the source of truth.
- Maintained by the couple themselves, from a laptop, using a small number of documented
  commands — not by a developer. See `docs/MAINTENANCE.md`.
- Published by pushing to `main`; GitHub Actions rebuilds and redeploys. A failed build
  leaves the previous site up.

## Capabilities and Constraints

**Confirmed functionality**

- One page: hero, verse, details, schedule, gallery, location, footer.
- Four languages — **Romanian (default)**, Ukrainian, English, German. Language lives in a URL query
  parameter (`?lang=uk`), never a path segment, because GitHub Pages cannot rewrite URLs
  and a path-based locale would 404 on refresh or on a shared link.
- The bare URL — the one behind the printed QR code — renders in Romanian. The default is
  deliberately fixed rather than sniffed from the phone's OS, so every scan of the printed
  code behaves identically, including when a guest hands their phone to someone else.
- Interactive map (Leaflet + OpenStreetMap) plus directions deep links for Google Maps and
  Waze, and a one-tap copy-coordinates action.
- All copy, dates, venue, links and photo references live in `src/content/` as typed data.
  Photographs are swapped by dropping files into one folder and running one command.

**Hard constraints**

| Constraint | Why |
|---|---|
| The canonical URL `https://andrewandelfida.github.io/` can never change | It is printed on paper. The org must not be renamed or deleted, the repo must not be renamed or made private, Pages must stay enabled. |
| Fully static output; no server, database, subscription or API key | Nothing that can expire, bill, or be discontinued between now and long after the wedding. |
| The location section must work with JavaScript disabled or the map broken | Address, raw coordinates and directions links are prerendered text and real links, never only inside the map widget. |
| Scripture is never machine-translated or reconstructed from memory | Ecclesiastes 4:9 must be the literal published wording of Ohienko (uk), Cornilescu (ro) and WEB (en). If exact wording is not supplied, it is marked TODO and flagged — never invented. |
| No third-party CDNs, including for fonts | One less thing that has to still exist in ten years, and one less round trip on a slow connection. |

**Deliberately not built**

- **No RSVP.** Removed at the couple's request: there is no reply form, and no contact panel.
  The reply itself happens off the site — the schedule closes with the card's reply-by date and
  the couple's two phone numbers as `tel:` links, one named line each, which is the whole of the
  contact surface.

**Product facts still open**

- The exact wording of Ecclesiastes 4:9 in the three published translations named in the
  brief is **not yet verified** against physical copies. The current text came from the
  design bundle and is close to, but not word-for-word identical with, those editions.
- The German reading of Ecclesiastes 4:9 is the one scripture string that did not come from
  the couple at all: the brief named no German edition, so it follows Schlachter 2000 and
  needs checking against a printed copy before it is trusted.
- The `// [new]` interface strings (map labels, skip link, Waze button) have not had a
  native-speaker review. Neither have the `// [couple-uk]`, `// [couple-en]` and
  `// [couple-de]` strings, which are translations of the couple's own Romanian wording.
- **The whole German column is a translation, not supplied copy.** German was added after
  the site shipped, so there was no design handoff to port it from and nothing in it is
  pinned by the prototype. It uses formal address (Sie) throughout. It is the language most
  worth a native speaker's read before the link is shared widely.

## Brand Commitments

- Names appear **groom first**, in the exact strings supplied: Андрій та Ельфіда ·
  Andrei și Elfida · Andrew & Elfida.
- The visual design in `docs/design/` is a supplied, binding design bundle — the source of
  truth for layout, palette, typography and spacing. Departures from it are permitted only
  for legibility and are documented in place.
- Copy taken verbatim from that bundle is marked `// [design]`; anything written for the
  build is marked `// [new]`, so the couple can always tell the difference.

## Evidence on Hand

- `docs/design/README.md`, `docs/design/site.js`, `Concept-C7-Terracotta-Block.dc.html` —
  the supplied design bundle, including the authoritative trilingual copy.
- Venue coordinates `48.0850197, 26.0520467`, and the canonical Google Maps CID link
  `https://maps.google.com/?cid=10979324914211926916`. The coordinates are no longer shown
  to guests, at the couple's request, but every directions link still targets them.
- **13 photographs of the couple**, supplied and published (one hero portrait, twelve
  gallery images). Originals live outside the repository.
- The floral line drawing used as the page backdrop (`assets-src/backdrop.svg`).
- No testimonials, endorsements, guest counts, or third-party claims exist or should ever
  be fabricated for this site.

## Product Principles

1. **The paper cannot be recalled.** Anything the printed QR depends on — the URL, the
   hosting model, the org and repo names — is immutable. Treat it as such.
2. **Degrade to text, never to nothing.** Every critical fact is prerendered HTML. Scripts,
   tiles and fonts are enhancements; losing them loses polish, not information.
3. **Coordinates over addresses.** In this village the address is not reliably resolvable.
   Navigation is built on numbers a guest can see, select and copy.
4. **Legibility outranks palette fidelity.** Where the supplied colours fail WCAG AA, they
   are darkened and the change is recorded — never waived.
5. **The couple must be able to maintain it without a developer.** Content is data, photos
   are a folder, and every routine task is one documented command.
6. **Nothing that expires.** No key, quota, plan or third-party service stands between a
   guest and the page.

## Accessibility & Inclusion

- **WCAG 2.1 AA is a requirement, not a target** — verified mechanically across every
  text/background pair, including composited opacity. Eight pairs in the supplied palette
  failed and were darkened.
- Usable one-handed in portrait; verified at 360, 390, 768, 834, 1024 and 1440 px.
- Fully keyboard operable, semantic landmarks, visible focus, `prefers-reduced-motion`
  honoured, alt text in the active language, `<html lang>` set per locale.
- Fonts must render full Ukrainian Cyrillic, Romanian diacritics with comma-below
  (`ș` `ț`) — not cedilla, verified by pixel comparison, because the wrong glyph is a
  spelling error to a Romanian reader — and German umlauts.
- Lighthouse mobile ≥ 95 for performance and accessibility, because the audience is on
  rural mobile data and older devices.

## Lifecycle

After 3 October 2026 the site is **frozen exactly as it is** — kept online unchanged as a
record of the invitation. There is no post-wedding content plan, no photo gallery update,
and no takedown. Longevity therefore outranks every other non-correctness concern: future
work must not introduce anything that requires maintenance, renewal, or a living account to
keep the page reachable.
