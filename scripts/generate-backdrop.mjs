#!/usr/bin/env node
/* =============================================================================
   PAGE BACKDROP

     assets-src/backdrop.svg  →  public/backdrop.avif
                              →  public/backdrop.webp

   NOTE the output lives in public/ and NOT in public/images/. That directory
   belongs to the photo pipeline, which deletes and rebuilds it wholesale on
   every `npm run images` — the backdrop would vanish the first time the couple
   added a photograph.

   The floral line drawing that sits behind the whole invitation, like a
   watermark in the paper.

   WHY THIS IS A RASTER AND NOT THE SVG
   The original is 5,095 hand-drawn paths — 1.9 MB, and still 518 KB after
   gzip. Optimising it far enough to ship (svgo at one decimal place) shatters
   the artwork into visible facets. At the opacity this is used, a raster is
   indistinguishable and about sixty times smaller.

   WHY THE OPACITY IS BAKED IN AND THE IMAGE IS OPAQUE
   A transparent PNG/AVIF of fine line art is expensive to compress (~139 KB)
   because every stroke edge carries an alpha gradient. Compositing the ink
   onto the cream here instead produces an opaque, very-low-contrast image that
   AVIF encodes in a few kilobytes. The trade is that the backdrop is tied to
   the cream page colour — which is why both colours are read from tokens.css
   below rather than typed twice.

   Run `npm run backdrop` after changing --c-cream, --c-olive-deep, or INK_OPACITY.
   ========================================================================== */

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';
import sharp from 'sharp';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const SRC = join(ROOT, 'assets-src', 'backdrop.svg');
const OUT_DIR = join(ROOT, 'public');
const TOKENS = join(ROOT, 'src', 'styles', 'tokens.css');

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

/**
 * How strongly the drawing reads against the page.
 *
 * 0.07 is not a taste call with room either side — it is very nearly the
 * ceiling. Every stroke darkens the ground behind whatever text crosses it,
 * and two pairs on the cream sections have almost no contrast headroom left:
 *
 *     opacity   ground     footer tagline   eyebrows
 *     0.05      #efebe0    4.72:1           4.78:1
 *     0.07      #ebe8dd    4.58:1           4.64:1     ← here
 *     0.09      #e8e5d9    4.46:1  FAILS    4.51:1
 *     0.11      #e4e2d6    4.32:1  FAILS    4.38:1  FAILS
 *
 * Below 0.05 the drawing is invisible on a phone in daylight. Raising this
 * breaks WCAG AA, and `npm run check:contrast` will say so.
 */
const INK_OPACITY = 0.07;

/** Wide enough for a 1200px CSS backdrop on a 2× display without being silly. */
const WIDTH = 1600;

/* -------------------------------------------------------------------------- */

/** Pull a colour straight out of the token file so the two can never drift. */
async function token(name) {
  const css = await readFile(TOKENS, 'utf8');
  const match = css.match(new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{6})`));
  if (!match) throw new Error(`could not find --${name} in ${relative(ROOT, TOKENS)}`);
  return match[1];
}

const toRgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const toHex = (rgb) => '#' + rgb.map((v) => v.toString(16).padStart(2, '0')).join('');
const mix = (a, b, t) => a.map((v, i) => Math.round(v * (1 - t) + b[i] * t));

async function main() {
  if (!existsSync(SRC)) {
    console.error(`Missing ${relative(ROOT, SRC)} — nothing to build.`);
    process.exit(1);
  }
  if (!existsSync(CHROME)) {
    console.error(`Google Chrome not found at ${CHROME}.\nIt is used to rasterise the SVG.`);
    process.exit(1);
  }

  const cream = await token('c-cream');
  const olive = await token('c-olive-deep');
  const ink = toHex(mix(toRgb(cream), toRgb(olive), INK_OPACITY));

  const raw = await readFile(SRC, 'utf8');
  const svg = raw
    // The artwork ships on an opaque white plate. Drop it — we supply the ground.
    .replace(/<rect[^>]*fill:\s*#FFFFFF[^>]*\/>/i, '')
    // Not one of the 5,095 paths declares a fill, so a single attribute on the
    // root recolours the entire drawing.
    .replace('<svg ', `<svg fill="${ink}" `);

  if (svg === raw) throw new Error('SVG did not match the expected shape — refusing to guess');

  const height = Math.round((WIDTH * 30) / 40); // the artwork's 40×30 viewBox
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: ['--disable-gpu', '--hide-scrollbars'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: WIDTH, height, deviceScaleFactor: 1 });
  await page.setContent(
    `<body style="margin:0;background:${cream}">` +
      svg.replace('<svg ', `<svg style="width:${WIDTH}px;height:${height}px;display:block" `) +
      `</body>`,
    { waitUntil: 'load' }
  );
  const png = await page.screenshot();
  await browser.close();

  await mkdir(OUT_DIR, { recursive: true });

  // 4:4:4 matters here: the whole image IS faint chroma detail, and subsampling
  // smears the strokes into the ground.
  const avif = await sharp(png).avif({ quality: 60, effort: 9, chromaSubsampling: '4:4:4' }).toBuffer();
  const webp = await sharp(png).webp({ quality: 80 }).toBuffer();

  await writeFile(join(OUT_DIR, 'backdrop.avif'), avif);
  await writeFile(join(OUT_DIR, 'backdrop.webp'), webp);

  /*
   * The flat ground cannot survive lossy encoding exactly: both AVIF and WebP
   * work in YUV, and the round trip back to RGB lands a level or so off. That
   * matters because the image stops partway across the page, and a straight
   * edge between two almost-identical flats is exactly what the eye picks up
   * as a band. Lossless AVIF holds the colour but costs 379 KB — forty times
   * this file, for a watermark.
   *
   * So base.css fades the whole backdrop layer out at its edges, and the
   * boundary disappears with it. What is checked here is only that the drift
   * stays small enough for that fade to hide: a large shift would mean the
   * encoder is doing something else wrong.
   */
  const drift = async (buf, label) => {
    const px = await sharp(buf).extract({ left: 0, top: 0, width: 8, height: 8 }).raw().toBuffer();
    const got = [px[0], px[1], px[2]];
    const want = toRgb(cream);
    const worst = Math.max(...got.map((v, i) => Math.abs(v - want[i])));
    return { label, got: toHex(got), worst };
  };

  const drifts = [await drift(avif, 'avif'), await drift(webp, 'webp')];
  const worst = Math.max(...drifts.map((d) => d.worst));

  console.log(`ground   ${cream}   ink ${ink} (${olive} at ${INK_OPACITY * 100}%)`);
  console.log(`avif     ${(avif.length / 1024).toFixed(1).padStart(5)} KB   ground ${drifts[0].got} (${drifts[0].worst}/255 off)`);
  console.log(`webp     ${(webp.length / 1024).toFixed(1).padStart(5)} KB   ground ${drifts[1].got} (${drifts[1].worst}/255 off)`);

  const TOLERANCE = 3;
  if (worst > TOLERANCE) {
    console.error(
      `\nGround drifted by ${worst}/255, over the ${TOLERANCE}/255 the edge fade can hide.\n` +
        `Raise the encoder quality or check that --c-cream is still a flat colour.`
    );
    process.exit(1);
  }

  console.log(`\n→ ${relative(ROOT, join(OUT_DIR, 'backdrop.avif'))} + .webp`);
}

main().catch((err) => {
  console.error(`\ngenerate-backdrop failed: ${err.message}`);
  process.exit(1);
});
