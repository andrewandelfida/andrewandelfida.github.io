#!/usr/bin/env node
/**
 * Verifies the self-hosted fonts really cover the languages this site is
 * printed for — in every weight and style that actually ships.
 *
 *   npm run check:glyphs      (needs the built site being served)
 *
 * The fonts are subset to exactly the characters the content uses, which makes
 * them small but means a copy edit can introduce a character no font covers.
 * That is the main thing this script guards against. It checks:
 *
 *  1 · COVERAGE — every character used anywhere in src/content/ renders in
 *      every shipped face. This is the check that fails if someone edits the
 *      copy and forgets to re-run `npm run fonts`.
 *
 *  2 · THE FONT IS ACTUALLY USED — document.fonts.check() for each family,
 *      weight and style against real Ukrainian and Romanian strings, catching
 *      a missing file or wrong path where text silently renders in Times.
 *
 *  3 · COMMA-BELOW, NOT CEDILLA — Romanian requires ș/ț (U+0219/U+021B, comma
 *      below), not ş/ţ (U+015F/U+0163, cedilla). We render both pairs and
 *      compare pixels: if a font lacks the comma-below glyph the browser
 *      substitutes the cedilla one and the renderings come out IDENTICAL.
 *      Different bitmaps prove the correct glyph is present.
 */
import puppeteer from 'puppeteer-core';
import { readdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const BASE = process.env.BASE_URL ?? 'http://localhost:4173/';
const ROOT = fileURLToPath(new URL('..', import.meta.url));

const failures = [];
let passed = 0;

function check(name, ok, detail = '') {
  if (ok) {
    passed++;
    console.log(`  ok    ${name}`);
  } else {
    failures.push(`${name}${detail ? ` — ${detail}` : ''}`);
    console.log(`  FAIL  ${name}${detail ? ` — ${detail}` : ''}`);
  }
}

/** Every printable character that appears in the content files. */
async function contentCharacters() {
  const dir = join(ROOT, 'src', 'content');
  const chars = new Set();
  for (const name of await readdir(dir)) {
    if (!name.endsWith('.ts')) continue;
    for (const ch of await readFile(join(dir, name), 'utf8')) {
      const cp = ch.codePointAt(0) ?? 0;
      if (cp >= 0x20 && cp !== 0x7f) chars.add(ch);
    }
  }
  return [...chars].sort().join('');
}

/** Every family/weight/style combination the design actually ships. */
const FACES = [
  ["'Playfair Display'", 400, 'normal'],
  ["'Playfair Display'", 500, 'normal'],
  ["'Playfair Display'", 600, 'normal'],
  ["'Playfair Display'", 400, 'italic'],
  ["'Playfair Display'", 500, 'italic'],
  ["'Montserrat'", 300, 'normal'],
  ["'Montserrat'", 400, 'normal'],
  ["'Montserrat'", 500, 'normal'],
  ["'Montserrat'", 600, 'normal'],
  ["'Marck Script'", 400, 'normal'],
];

const text = await contentCharacters();
console.log(`\nContent uses ${[...text].length} distinct characters`);

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ['--disable-gpu', '--hide-scrollbars', '--font-render-hinting=none'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1200, height: 900, deviceScaleFactor: 2 });
await page.goto(BASE, { waitUntil: 'networkidle2' });

/* --- 1 · every content character is covered by every shipped face --------- */
console.log('\nSubset covers every character used in the content');
{
  const results = await page.evaluate(
    async (faces, chars) => {
      await document.fonts.ready;
      const out = [];
      for (const [family, weight, style] of faces) {
        const spec = `${style} ${weight} 40px ${family}`;
        await document.fonts.load(spec, chars).catch(() => {});

        // check() is all-or-nothing for a string, so to name the offenders we
        // fall back to testing character by character when it reports a gap.
        const missing = [];
        if (!document.fonts.check(spec, chars)) {
          for (const ch of chars) {
            if (!document.fonts.check(spec, ch)) missing.push(ch);
          }
        }
        out.push({ family, weight, style, missing });
      }
      return out;
    },
    FACES,
    text
  );

  for (const r of results) {
    const label = `${r.family.replace(/'/g, '')} ${r.weight}${r.style === 'italic' ? ' italic' : ''}`;
    check(
      `${label} covers all ${[...text].length} characters`,
      r.missing.length === 0,
      r.missing.length ? `missing: ${r.missing.slice(0, 20).join(' ')}` : ''
    );
  }
}

/* --- 2 · the intended font is genuinely applied --------------------------- */
console.log('\nFonts loaded and used (document.fonts.check)');
{
  const results = await page.evaluate(async (faces) => {
    await document.fonts.ready;
    const out = [];
    for (const [family, weight, style] of faces) {
      const spec = `${style} ${weight} 40px ${family}`;
      await Promise.all([
        document.fonts.load(spec, 'Stănești').catch(() => {}),
        document.fonts.load(spec, 'Ельфіда').catch(() => {}),
      ]);
      out.push({
        family,
        weight,
        style,
        ro: document.fonts.check(spec, 'Stănești'),
        uk: document.fonts.check(spec, 'Ельфіда'),
      });
    }
    return out;
  }, FACES);

  for (const r of results) {
    const label = `${r.family.replace(/'/g, '')} ${r.weight}${r.style === 'italic' ? ' italic' : ''}`;
    check(`${label} — "Stănești"`, r.ro);
    check(`${label} — "Ельфіда"`, r.uk);
  }
}

/* --- 3 · comma-below, not cedilla ---------------------------------------- */
console.log('\nRomanian ș/ț use comma-below, not cedilla');
{
  const results = await page.evaluate(async (faces) => {
    await document.fonts.ready;

    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 120;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    function render(t, family, weight, style) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#000';
      ctx.textBaseline = 'middle';
      ctx.font = `${style} ${weight} 80px ${family}`;
      ctx.fillText(t, 10, 60);
      return Array.from(ctx.getImageData(0, 0, canvas.width, canvas.height).data);
    }

    function differs(a, b) {
      if (a.length !== b.length) return true;
      let diff = 0;
      for (let i = 3; i < a.length; i += 4) if (a[i] !== b[i]) diff++;
      return diff > 20;
    }

    const out = [];
    for (const [family, weight, style] of faces) {
      const sComma = render('ș', family, weight, style);
      const sCedil = render('ş', family, weight, style);
      const tComma = render('ț', family, weight, style);
      const tCedil = render('ţ', family, weight, style);
      const blank = render(' ', family, weight, style);

      out.push({
        family,
        weight,
        style,
        sDistinct: differs(sComma, sCedil),
        tDistinct: differs(tComma, tCedil),
        sRendered: differs(sComma, blank),
        tRendered: differs(tComma, blank),
      });
    }
    return out;
  }, FACES);

  for (const r of results) {
    const label = `${r.family.replace(/'/g, '')} ${r.weight}${r.style === 'italic' ? ' italic' : ''}`;
    check(`${label} — ș renders`, r.sRendered);
    check(`${label} — ț renders`, r.tRendered);
    check(`${label} — ș is comma-below, distinct from cedilla ş`, r.sDistinct);
    check(`${label} — ț is comma-below, distinct from cedilla ţ`, r.tDistinct);
  }
}

/* --- A visual sheet, for a human to eyeball ------------------------------- */
await page.evaluate((faces) => {
  document.body.innerHTML = '';
  document.body.style.cssText = 'background:#F7F3E9;color:#4E5539;padding:32px;margin:0';
  for (const [family, weight, style] of faces) {
    const row = document.createElement('div');
    row.style.cssText = 'margin-bottom:18px;border-bottom:1px solid #D3D4BB;padding-bottom:12px';
    const label = document.createElement('div');
    label.style.cssText = 'font:400 11px ui-monospace,monospace;color:#636A4A;letter-spacing:.1em';
    label.textContent = `${family} ${weight} ${style}`;
    const sample = document.createElement('div');
    sample.style.cssText = `font-family:${family};font-weight:${weight};font-style:${style};font-size:34px;margin-top:6px`;
    sample.textContent = 'Stănești · Ельфіда · Andrei și Elfida · ăâîșț · ЄІЇҐі';
    row.append(label, sample);
    document.body.append(row);
  }
}, FACES);
await new Promise((r) => setTimeout(r, 400));
await page.screenshot({ path: '/tmp/shots/glyph-sheet.png', fullPage: true });
console.log('\nVisual sheet → /tmp/shots/glyph-sheet.png');

await browser.close();

console.log(`\n${passed} passed, ${failures.length} failed.`);
if (failures.length) {
  console.error('\nFailures:');
  for (const f of failures) console.error(`  · ${f}`);
  process.exit(1);
}
