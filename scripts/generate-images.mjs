#!/usr/bin/env node
/* =============================================================================
   PHOTO PIPELINE

   Turns the couple's original photographs into everything the site needs.

     photos-src/hero/couple.jpg      →  public/images/hero/couple-{w}.{avif,webp,jpg}
     photos-src/gallery/01.jpg       →  public/images/gallery/01-{w}.{avif,webp,jpg}
                                     →  src/content/image-manifest.json

   HOW THE COUPLE USES THIS
     1. Drop full-resolution originals into photos-src/hero/ or photos-src/gallery/
        (JPEG, PNG, HEIC, TIFF or WebP — any size, straight off the camera)
     2. npm run images
     3. Check the filenames match the `src` values in src/content/wedding.ts
     4. git add -A && git commit && git push   ← the site redeploys itself

   Originals stay out of git (see .gitignore); only the small derivatives are
   committed, so the repo stays light and Pages deploys stay fast.

   The manifest records each photo's TRUE dimensions, so a portrait swapped for
   a landscape simply reflows — no layout ever assumes an aspect ratio.
   ========================================================================== */

import { mkdir, readdir, writeFile, readFile, stat, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { basename, extname, join, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const SRC_DIR = join(ROOT, 'photos-src');
const OUT_DIR = join(ROOT, 'public', 'images');
const MANIFEST = join(ROOT, 'src', 'content', 'image-manifest.json');

const INPUT_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.tif', '.tiff', '.heic', '.heif']);

/**
 * Width ladder. The largest slot on the page is the hero arch at 360 CSS px,
 * so 1080 covers it at 3× DPR with headroom; the rest exist so slow rural
 * connections can pick something genuinely small.
 */
const WIDTHS = [240, 360, 480, 720, 960, 1280];

// AVIF first (smallest), WebP as the broad fallback, JPEG as the universal one.
const FORMATS = [
  { ext: 'avif', encode: (p) => p.avif({ quality: 55, effort: 6 }) },
  { ext: 'webp', encode: (p) => p.webp({ quality: 74 }) },
  { ext: 'jpg', encode: (p) => p.jpeg({ quality: 78, mozjpeg: true, progressive: true }) },
];

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else if (INPUT_EXT.has(extname(entry.name).toLowerCase())) out.push(full);
  }
  return out;
}

/** Average colour, used as the placeholder tint behind a photo while it loads. */
async function averageColour(pipeline) {
  const { data } = await pipeline.clone().resize(1, 1, { fit: 'cover' }).raw().toBuffer({
    resolveWithObject: true,
  });
  const [r = 0, g = 0, b = 0] = data;
  return '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('');
}

/**
 * How many photos are currently published.
 *
 * This exists because photos-src/ is deliberately NOT committed — it holds the
 * couple's full-size originals. On a fresh clone it is therefore empty, and a
 * naive run of this script would regenerate "nothing" over the top of a site
 * full of photographs. Refusing to do that is the difference between an
 * inconvenience and losing the wedding photos off the live site.
 */
async function publishedCount() {
  try {
    const manifest = JSON.parse(await readFile(MANIFEST, 'utf8'));
    return Object.keys(manifest).length;
  } catch {
    return 0;
  }
}

async function main() {
  const force = process.argv.includes('--force');
  const alreadyPublished = await publishedCount();
  const inputs = existsSync(SRC_DIR) ? (await walk(SRC_DIR)).sort() : [];

  if (inputs.length === 0) {
    // Nothing to build FROM. If something is already published, stop —
    // continuing would wipe public/images/ and blank the manifest.
    if (alreadyPublished > 0 && !force) {
      console.error(
        `\nRefusing to run: photos-src/ is empty, but ${alreadyPublished} photo(s) are ` +
          `currently published.\n\n` +
          `photos-src/ holds your original photographs and is intentionally not stored in\n` +
          `git, so it is empty on a fresh clone. Running now would delete every photo from\n` +
          `the live site.\n\n` +
          `  · To re-generate: put your originals back in photos-src/ and run this again.\n` +
          `  · To change nothing: you do not need this command. Just commit and push.\n` +
          `  · To genuinely remove all photos and return to the placeholder design:\n` +
          `        npm run images -- --force\n`
      );
      process.exit(1);
    }

    if (!existsSync(SRC_DIR)) {
      console.log(
        `No photos-src/ directory yet — nothing to process.\n` +
          `Create it and drop originals into photos-src/hero/ and photos-src/gallery/,\n` +
          `then run this again. Until then the site shows the design's placeholder boxes.`
      );
    } else {
      console.log('photos-src/ is empty — nothing to process.');
    }

    if (force && alreadyPublished > 0) {
      console.log(`--force given: removing ${alreadyPublished} published photo(s).`);
      await rm(OUT_DIR, { recursive: true, force: true });
    }
    await writeManifest({});
    return;
  }

  // Start from a clean output tree so deleted originals don't leave orphans
  // behind that would keep showing on the live site.
  await rm(OUT_DIR, { recursive: true, force: true });
  await mkdir(OUT_DIR, { recursive: true });

  const manifest = {};

  for (const input of inputs) {
    const rel = relative(SRC_DIR, input);
    const key = join(dirname(rel), basename(rel, extname(rel))).split(/[\\/]/).join('/');

    // .rotate() with no argument applies the EXIF orientation and strips it,
    // so a phone photo taken sideways is not served sideways.
    const pipeline = sharp(input, { failOn: 'none' }).rotate();
    const meta = await pipeline.metadata();
    const srcW = meta.width ?? 0;
    const srcH = meta.height ?? 0;
    if (!srcW || !srcH) {
      console.warn(`  skipped ${rel} — could not read its dimensions`);
      continue;
    }

    const outSubdir = join(OUT_DIR, dirname(key));
    await mkdir(outSubdir, { recursive: true });

    // Never upscale: a 900px original must not be served as a blurry 1280.
    // Take every ladder step the original can actually fill, and — if the
    // original is smaller than the top of the ladder — its own native width
    // too, so small photos still get a sharp largest version.
    const maxLadder = WIDTHS[WIDTHS.length - 1] ?? srcW;
    const widths = WIDTHS.filter((w) => w <= srcW);
    if (srcW < maxLadder) widths.push(srcW);
    const finalWidths = [...new Set(widths)].sort((a, b) => a - b);

    const bytes = [];
    for (const w of finalWidths) {
      const resized = pipeline.clone().resize({ width: w, withoutEnlargement: true });
      for (const fmt of FORMATS) {
        const file = join(OUT_DIR, `${key}-${w}.${fmt.ext}`);
        const info = await fmt.encode(resized.clone()).toFile(file);
        bytes.push(info.size);
      }
    }

    manifest[key] = {
      width: srcW,
      height: srcH,
      widths: finalWidths,
      formats: FORMATS.map((f) => f.ext),
      color: await averageColour(pipeline),
    };

    const total = bytes.reduce((a, b) => a + b, 0);
    console.log(
      `  ${key.padEnd(24)} ${srcW}×${srcH}  →  ${finalWidths.length} widths × ${FORMATS.length} formats  ` +
        `(${(total / 1024).toFixed(0)} KB total)`
    );
  }

  await writeManifest(manifest);
  console.log(`\nProcessed ${Object.keys(manifest).length} photo(s).`);
  console.log(`Manifest → ${relative(ROOT, MANIFEST)}`);
  console.log(`Commit both public/images/ and the manifest, then push to redeploy.`);
}

async function writeManifest(manifest) {
  await mkdir(dirname(MANIFEST), { recursive: true });
  const ordered = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)));
  await writeFile(MANIFEST, JSON.stringify(ordered, null, 2) + '\n');
}

// Keep a stat import used — a friendlier error if photos-src is a file, not a dir.
async function assertDir() {
  if (existsSync(SRC_DIR) && !(await stat(SRC_DIR)).isDirectory()) {
    throw new Error('photos-src exists but is not a directory');
  }
}

assertDir()
  .then(main)
  .catch((err) => {
    console.error(`\ngenerate-images failed: ${err.message}`);
    process.exit(1);
  });
