#!/usr/bin/env node
/**
 * Responsive/visual checks in a real browser at true device widths.
 * Development tool — not part of the build.
 *
 *   node scripts/shots.mjs            # screenshots at every breakpoint
 *   node scripts/shots.mjs --audit    # + layout assertions, exits non-zero on failure
 *
 * Uses puppeteer-core against the Chrome already installed on this machine, so
 * nothing extra is downloaded. Device metrics are set through the DevTools
 * protocol rather than --window-size, because headless Chrome silently clamps
 * its window to ~500px wide and would otherwise render a 500px layout and crop
 * the screenshot down to the width you asked for — which looks exactly like an
 * overflow bug that isn't there.
 */
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import puppeteer from 'puppeteer-core';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const BASE = process.env.BASE_URL ?? 'http://localhost:4173/';
const OUT = process.env.OUT_DIR ?? '/tmp/shots';
const audit = process.argv.includes('--audit');
const withTiles = process.argv.includes('--tiles');
// Reveal-on-scroll only fires for elements that enter the viewport, so a
// full-page screenshot would capture everything below the fold still faded
// out. The site honours prefers-reduced-motion by never hiding anything, so
// emulating it gives an honest picture AND exercises that code path.
const motion = process.argv.includes('--motion');

/** The widths the brief names, with realistic viewport heights. */
const VIEWPORTS = [
  { w: 360, h: 800, dpr: 3, label: 'android-small' },
  { w: 390, h: 844, dpr: 3, label: 'iphone' },
  { w: 768, h: 1024, dpr: 2, label: 'tablet-portrait' },
  { w: 834, h: 1112, dpr: 2, label: 'ipad-air' },
  { w: 1024, h: 768, dpr: 2, label: 'tablet-landscape' },
  { w: 1440, h: 900, dpr: 2, label: 'desktop' },
];

const LOCALES = ['uk', 'ro', 'en'];

await mkdir(OUT, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ['--hide-scrollbars', '--disable-gpu'],
});

const failures = [];

function fail(msg) {
  failures.push(msg);
  console.log(`  FAIL  ${msg}`);
}

for (const vp of VIEWPORTS) {
  for (const locale of LOCALES) {
    // Only sweep all three languages on the primary phone width; elsewhere uk.
    if (locale !== 'uk' && vp.w !== 390) continue;

    // A fresh, isolated storage context per check. Sharing one profile meant a
    // ?lang=en visit left "en" in localStorage and the next check — the one
    // verifying the Ukrainian default — legitimately came back English.
    const context = await browser.createBrowserContext();
    const page = await context.newPage();
    await page.setViewport({
      width: vp.w,
      height: vp.h,
      deviceScaleFactor: 1,
      isMobile: vp.w < 768,
      hasTouch: vp.w < 768,
    });

    if (!withTiles) {
      // Block map tiles: they are slow and, blocked, we also see the failure
      // state a guest with no signal gets.
      await page.setRequestInterception(true);
      page.on('request', (req) => {
        if (req.url().includes('tile.openstreetmap.org')) req.abort().catch(() => {});
        else req.continue().catch(() => {});
      });
    }

    if (!motion) {
      await page.emulateMediaFeatures([
        { name: 'prefers-reduced-motion', value: 'reduce' },
      ]);
    }

    const url = locale === 'uk' ? BASE : `${BASE}?lang=${locale}`;
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 }).catch(() => {});
    // Let reveal animations settle so screenshots show the resting state.
    await new Promise((r) => setTimeout(r, 900));

    const name = `${vp.w}x${vp.h}-${locale}`;
    await page.screenshot({ path: join(OUT, `${name}.png`), fullPage: true });

    if (audit) {
      const report = await page.evaluate(() => {
        const docWidth = document.documentElement.clientWidth;
        const overflowing = [];
        for (const el of document.querySelectorAll('body *')) {
          const r = el.getBoundingClientRect();
          if (r.width === 0 && r.height === 0) continue;
          // 1px of slack for sub-pixel rounding.
          if (r.right > docWidth + 1 || r.left < -1) {
            overflowing.push({
              tag: el.tagName.toLowerCase(),
              cls: el.className?.toString().slice(0, 60),
              left: Math.round(r.left),
              right: Math.round(r.right),
            });
          }
        }

        // Interactive controls must be big enough to hit one-handed.
        const small = [];
        for (const el of document.querySelectorAll('a, button, input, textarea')) {
          const r = el.getBoundingClientRect();
          if (r.width === 0 && r.height === 0) continue;
          if (el.classList.contains('skip-link')) continue;
          if (r.height < 24 || r.width < 24) {
            small.push({
              tag: el.tagName.toLowerCase(),
              cls: el.className?.toString().slice(0, 40),
              w: Math.round(r.width),
              h: Math.round(r.height),
            });
          }
        }

        // Nothing may be left invisible once the page has settled.
        const hidden = [];
        for (const el of document.querySelectorAll('.reveal:not(.is-visible)')) {
          hidden.push(el.className.toString().slice(0, 50));
        }

        return {
          hidden: hidden.slice(0, 5),
          docWidth,
          scrollWidth: document.documentElement.scrollWidth,
          overflowing: overflowing.slice(0, 8),
          small: small.slice(0, 8),
          htmlLang: document.documentElement.lang,
          h1: document.querySelector('h1')?.textContent?.trim(),
        };
      });

      if (report.docWidth !== vp.w) {
        fail(`${name}: laid out at ${report.docWidth}px, expected ${vp.w}px`);
      }
      if (report.scrollWidth > report.docWidth + 1) {
        fail(`${name}: horizontal scroll (scrollWidth ${report.scrollWidth} > ${report.docWidth})`);
      }
      for (const o of report.overflowing) {
        fail(`${name}: <${o.tag} class="${o.cls}"> spans ${o.left}..${o.right}`);
      }
      for (const s of report.small) {
        fail(`${name}: tap target <${s.tag} class="${s.cls}"> is ${s.w}x${s.h}`);
      }
      for (const h of report.hidden) {
        fail(`${name}: element still hidden after settle: "${h}"`);
      }
      if (report.htmlLang !== locale) {
        fail(`${name}: <html lang> is "${report.htmlLang}", expected "${locale}"`);
      }
      console.log(`  ok    ${name}  (${report.docWidth}px, h1 "${report.h1?.slice(0, 30)}")`);
    } else {
      console.log(`  ok    ${name}`);
    }

    await page.close();
    await context.close();
  }
}

await browser.close();

if (audit) {
  console.log(failures.length === 0 ? '\nAll layout checks passed.' : `\n${failures.length} failure(s).`);
  process.exit(failures.length === 0 ? 0 : 1);
}
