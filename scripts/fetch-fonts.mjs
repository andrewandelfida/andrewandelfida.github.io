#!/usr/bin/env node
/**
 * Downloads the three typefaces the design calls for, subset to exactly the
 * characters this invitation can render, and self-hosts them.
 *
 * WHY THIS EXISTS
 * Guests open this on rural Ukrainian mobile networks. A third-party font CDN
 * costs an extra DNS lookup, TLS handshake and round trip before any text can
 * paint, so the fonts are self-hosted. And because the page mixes scripts —
 * the Ukrainian text contains "с. Станівці (Stănești)" and "Biserica „Harul”",
 * which pull in Cyrillic, Latin AND Latin-Ext, and the German column adds
 * umlauts — Google's off-the-shelf subsets meant ten files and ~275 KB of fonts
 * for a single visit.
 *
 * All of the copy is static and known, so instead we ask Google Fonts for a
 * subset containing precisely the characters that can appear (the `text=`
 * parameter). That collapses ten files to four and cuts the payload by roughly
 * 80%.
 *
 * ⚠ IF YOU EDIT THE COPY, RE-RUN THIS: `npm run fonts`
 * The character set is derived from src/content/*.ts. A character that is not
 * in the subset falls back to a system font and will look wrong. To catch that,
 * `npm run check:glyphs` fails if any character used in the content is missing
 * from the shipped fonts.
 *
 * Output: public/fonts/*.woff2 + src/styles/fonts.css  (both committed)
 */
import { mkdir, writeFile, readdir, unlink, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const FONT_DIR = join(ROOT, 'public', 'fonts');
const CSS_OUT = join(ROOT, 'src', 'styles', 'fonts.css');
const CONTENT_DIR = join(ROOT, 'src', 'content');

/**
 * A safety baseline on top of whatever the content currently uses, so small
 * copy edits do not silently fall back to a system font before anyone
 * remembers to re-run this script.
 */
const BASELINE = [
  // Latin, both cases, plus digits
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  'abcdefghijklmnopqrstuvwxyz',
  '0123456789',
  // Romanian diacritics — comma-below forms (U+0218/0219, U+021A/021B),
  // never the cedilla ones.
  'ĂăÂâÎîȘșȚț',
  // German umlauts and eszett. ß is in the baseline although no current string
  // uses it, because the copy is formal German and the next edit easily could.
  'ÄäÖöÜüß',
  // Ukrainian alphabet, both cases
  'АБВГҐДЕЄЖЗИІЇЙКЛМНОПРСТУФХЦЧШЩЬЮЯ',
  'абвгґдежзиіїйклмнопрстуфхцчшщьюя',
  // Punctuation and symbols the design and UI use
  ' !"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~',
  '„“”‘’«»—–…·•✓×°№',
  ' ', // non-breaking space
];

/** Weights/styles that actually ship. One file each — no unicode-range split. */
const FACES = [
  {
    family: 'Playfair Display',
    spec: 'Playfair+Display:wght@400..600',
    style: 'normal',
    weight: '400 600',
    file: 'playfair-display-normal.woff2',
  },
  {
    family: 'Playfair Display',
    spec: 'Playfair+Display:ital,wght@1,400..500',
    style: 'italic',
    weight: '400 500',
    file: 'playfair-display-italic.woff2',
  },
  {
    family: 'Montserrat',
    spec: 'Montserrat:wght@300..600',
    style: 'normal',
    weight: '300 600',
    file: 'montserrat-normal.woff2',
  },
  {
    family: 'Marck Script',
    spec: 'Marck+Script',
    style: 'normal',
    weight: '400',
    file: 'marck-script-normal.woff2',
  },
];

// A modern desktop Chrome UA makes the API serve woff2 (and variable fonts).
const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

/** Every character that appears anywhere in the content files, plus baseline. */
async function collectCharacters() {
  const chars = new Set(BASELINE.join(''));

  for (const name of await readdir(CONTENT_DIR)) {
    if (!name.endsWith('.ts')) continue;
    const text = await readFile(join(CONTENT_DIR, name), 'utf8');
    // Taking every character in the file is a deliberate superset: it includes
    // identifiers and comments, which are ASCII we want anyway, and guarantees
    // no content character can be missed.
    for (const ch of text) chars.add(ch);
  }

  // Control characters and newlines are not glyphs.
  for (const ch of [...chars]) {
    const cp = ch.codePointAt(0) ?? 0;
    if (cp < 0x20 || cp === 0x7f) chars.delete(ch);
  }

  return [...chars].sort().join('');
}

async function main() {
  const text = await collectCharacters();
  process.stdout.write(`Character set: ${[...text].length} unique glyphs\n`);

  await mkdir(FONT_DIR, { recursive: true });
  await mkdir(join(ROOT, 'src', 'styles'), { recursive: true });
  for (const f of await readdir(FONT_DIR).catch(() => [])) {
    if (f.endsWith('.woff2')) await unlink(join(FONT_DIR, f));
  }

  const out = [];
  let total = 0;

  for (const face of FACES) {
    const url =
      `https://fonts.googleapis.com/css2?family=${face.spec}` +
      `&text=${encodeURIComponent(text)}&display=swap`;

    const res = await fetch(url, { headers: { 'User-Agent': UA } });
    if (!res.ok) throw new Error(`Google Fonts CSS ${res.status} for ${face.family}`);
    const css = await res.text();

    const src = css.match(/src:\s*url\(([^)]+)\)/);
    if (!src) throw new Error(`No font URL returned for ${face.family} ${face.style}`);

    const bin = await fetch(src[1], { headers: { 'User-Agent': UA } });
    if (!bin.ok) throw new Error(`Font download ${bin.status} for ${face.file}`);
    const buf = Buffer.from(await bin.arrayBuffer());
    await writeFile(join(FONT_DIR, face.file), buf);

    total += buf.length;
    process.stdout.write(`  ${face.file.padEnd(34)} ${(buf.length / 1024).toFixed(1)} KB\n`);

    out.push(
      `/* ${face.family} · ${face.style} ${face.weight} */\n` +
        `@font-face {\n` +
        `  font-family: '${face.family}';\n` +
        `  font-style: ${face.style};\n` +
        `  font-weight: ${face.weight};\n` +
        `  font-display: swap;\n` +
        `  src: url('/fonts/${face.file}') format('woff2');\n` +
        `}`
    );
  }

  const header =
    `/* GENERATED by scripts/fetch-fonts.mjs — do not edit by hand.\n` +
    `   Run \`npm run fonts\` to regenerate, and re-run it after editing any\n` +
    `   copy in src/content/, because these files are subset to exactly the\n` +
    `   characters that appear there. \`npm run check:glyphs\` verifies coverage. */\n\n`;

  await writeFile(CSS_OUT, header + out.join('\n\n') + '\n');
  process.stdout.write(`\n${FACES.length} files, ${(total / 1024).toFixed(1)} KB total\n`);
  process.stdout.write(`CSS → ${CSS_OUT}\n`);
}

main().catch((err) => {
  console.error(`\nfetch-fonts failed: ${err.message}`);
  process.exit(1);
});
