#!/usr/bin/env node
/* =============================================================================
   QR CODE

     index.html <link rel="canonical">  →  public/qr.svg
                                        →  public/qr.png

   The square that goes on the printed invitation. Scanning it opens the site
   and nothing else — see WHAT THE SYMBOL CONTAINS below.

   NOTE the output lives in public/ and NOT in public/images/, for the same
   reason the backdrop does: `npm run images` deletes that directory wholesale.

   WHAT THE SYMBOL CONTAINS
   Exactly the bytes of the canonical URL. A QR symbol has no metadata layer,
   no tracking field and no room for anything the encoder was not handed — so
   generating it here, rather than pasting the address into a free web
   generator, is the whole guarantee. Those services routinely encode a
   shortlink on their own domain that redirects to you, which lets them count
   scans, retarget the destination later, or let it expire. A printed
   invitation cannot be recalled, so the address in the ink has to be ours.

   WHY THE URL IS READ AND NOT TYPED
   From index.html's canonical tag, so a change of address can never leave a
   stale QR in public/ pointing at the old one. Same reason the colour is read
   from tokens.css. Both would otherwise be a second place to remember.

   Run `npm run qr` after changing the canonical URL or --c-olive-deep.
   ========================================================================== */

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import QRCode from 'qrcode';
import sharp from 'sharp';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const INDEX = join(ROOT, 'index.html');
const TOKENS = join(ROOT, 'src', 'styles', 'tokens.css');
const OUT_DIR = join(ROOT, 'public');

/**
 * Error correction — how much of the symbol can be destroyed and still read.
 *
 * Measured for THIS url, which is 34 bytes. Levels do not each cost a version;
 * capacity comes in steps, and this address happens to sit in a step where the
 * top two levels share one:
 *
 *     level   recovers   version   modules
 *     L       ~7%        3         29×29
 *     M       ~15%       3         29×29
 *     Q       ~25%       4         33×33
 *     H       ~30%       4         33×33     ← here
 *
 * So H is free. It occupies exactly the grid Q would, and no printed size is
 * given up for it — the four extra modules over M are the only cost, and that
 * is worth paying for something that goes on paper and has to survive a
 * thumbprint, a fold near the edge and the dot gain of the stationer's press.
 *
 * If the URL ever gets longer this table stops being true. Re-run and read the
 * version the script prints before assuming the trade is still free.
 */
const ECC = 'H';

/**
 * Corner radius, as a fraction of one module.
 *
 * Applied per corner, not per module: a corner is rounded only where both of
 * the edges meeting there face open ground (see toPath). A run of adjacent
 * dark modules therefore keeps perfectly straight sides and softens only at
 * its ends, and the finder rings read as clean rounded-corner frames rather
 * than as a scalloped chain of beads. Rounding every module independently
 * instead pinches a notch at every join, which at print size reads as texture
 * and noise.
 *
 * 0.25 is "slightly rounded" and is well inside what decoders tolerate — they
 * threshold the image and sample each module at its centre, so ink removed at
 * the corners is invisible to them until it starts blurring diagonal
 * neighbours together. Raising this softens the look; past about 0.5 lone
 * modules become full circles and the symbol reads as dots.
 */
const ROUNDING = 0.25;

/**
 * The mandatory clear border, in modules. Four is the spec minimum and is not
 * decoration — decoders use it to find the symbol's edge. Whoever lays out the
 * invitation must not crop into it.
 */
const QUIET = 4;

/** Roughly the longest edge of the PNG, in pixels. Rounded to whole modules. */
const TARGET_PX = 1440;

/* -------------------------------------------------------------------------- */

/** Pull a colour straight out of the token file so the two can never drift. */
async function token(name) {
  const css = await readFile(TOKENS, 'utf8');
  const match = css.match(new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{6})`));
  if (!match) throw new Error(`could not find --${name} in ${relative(ROOT, TOKENS)}`);
  return match[1];
}

/** The one address the invitation points at. */
async function canonicalUrl() {
  const html = await readFile(INDEX, 'utf8');
  const match = html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i);
  if (!match) throw new Error(`no <link rel="canonical"> in ${relative(ROOT, INDEX)}`);
  return match[1];
}

/**
 * One module as a path, rounded only on the corners that face open ground.
 *
 * A corner belongs to two edges. If either edge is shared with a neighbouring
 * dark module, that corner is interior — the two modules are meant to read as
 * one continuous shape, so it stays square and the join is seamless. Only when
 * both edges face empty space is the corner genuinely on the outline.
 *
 *     ██        ████        ██
 *     ██        ████        ████
 *     4 corners  the join   the inner corner of the elbow
 *     rounded    stays      stays square; the 5 outer ones round
 *                square
 *
 * Concave corners — where the outline turns inward, as in the elbow above —
 * are left sharp. Filleting those too is possible but reads as bloat at this
 * size, and it is the convex corners that carry the softness.
 */
function toPath(on, x, y) {
  const up = on(x, y - 1);
  const down = on(x, y + 1);
  const left = on(x - 1, y);
  const right = on(x + 1, y);

  const tl = !up && !left ? ROUNDING : 0;
  const tr = !up && !right ? ROUNDING : 0;
  const br = !down && !right ? ROUNDING : 0;
  const bl = !down && !left ? ROUNDING : 0;

  const X = x + QUIET;
  const Y = y + QUIET;
  const arc = (r, ex, ey) => (r ? `A${r} ${r} 0 0 1 ${ex} ${ey}` : '');

  return (
    `M${X + tl} ${Y}` +
    `H${X + 1 - tr}` + arc(tr, X + 1, Y + tr) +
    `V${Y + 1 - br}` + arc(br, X + 1 - br, Y + 1) +
    `H${X + bl}` + arc(bl, X, Y + 1 - bl) +
    `V${Y + tl}` + arc(tl, X + tl, Y) +
    `Z`
  );
}

/** The whole symbol as one path on a transparent ground. */
function toSvg({ modules }, colour) {
  const { size, data } = modules;
  const span = size + QUIET * 2;
  const on = (x, y) => x >= 0 && y >= 0 && x < size && y < size && !!data[y * size + x];

  // One <path> rather than several hundred elements: every module is the same
  // colour, so they may as well be one subpath list. Roughly a fifth smaller
  // and it gives the invitation a single node to style or mask.
  const d = [];
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (on(x, y)) d.push(toPath(on, x, y));
    }
  }

  // No background rect: the ground is whatever the invitation puts behind it.
  // shape-rendering is left at the default — crispEdges would square off the
  // very corners we are here to round.
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${span} ${span}" ` +
    `width="${span}" height="${span}" fill="${colour}" role="img" ` +
    `aria-label="QR code linking to the invitation website">` +
    `<path d="${d.join('')}"/>` +
    `</svg>\n`
  );
}

async function main() {
  const url = await canonicalUrl();
  const colour = await token('c-olive-deep');

  const qr = QRCode.create(url, { errorCorrectionLevel: ECC });
  const span = qr.modules.size + QUIET * 2;
  const svg = toSvg(qr, colour);

  // Whole pixels per module, so no module lands on a half pixel and softens.
  const scale = Math.max(1, Math.round(TARGET_PX / span));
  const png = await sharp(Buffer.from(svg), { density: 72 * scale })
    .resize(span * scale, span * scale, { fit: 'fill' })
    .png()
    .toBuffer();

  await mkdir(OUT_DIR, { recursive: true });
  await writeFile(join(OUT_DIR, 'qr.svg'), svg);
  await writeFile(join(OUT_DIR, 'qr.png'), png);

  console.log(`  url      ${url}`);
  console.log(`  colour   ${colour}`);
  console.log(`  symbol   version ${qr.version}, ECC ${ECC}, ${qr.modules.size} modules + ${QUIET} quiet`);
  console.log(`  qr.svg   ${span}×${span} units, transparent`);
  console.log(`  qr.png   ${span * scale}×${span * scale} px, transparent`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
