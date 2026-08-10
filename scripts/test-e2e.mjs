#!/usr/bin/env node
/**
 * End-to-end checks against the built site.
 *
 *   npm run build && npm run serve   (in another shell)
 *   node scripts/test-e2e.mjs
 *
 * Covers the behaviours that screenshots cannot: language routing through the
 * query parameter, the map's lazy load and its failure path, the clipboard,
 * keyboard access, and the no-JavaScript rendering that the printed QR code
 * ultimately depends on.
 */
import puppeteer from 'puppeteer-core';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const BASE = process.env.BASE_URL ?? 'http://localhost:4173/';

let passed = 0;
const failures = [];

function check(name, condition, detail = '') {
  if (condition) {
    passed++;
    console.log(`  ok    ${name}`);
  } else {
    failures.push(`${name}${detail ? ` — ${detail}` : ''}`);
    console.log(`  FAIL  ${name}${detail ? ` — ${detail}` : ''}`);
  }
}

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ['--disable-gpu', '--hide-scrollbars'],
});

async function newPage({ js = true, blockTiles = true } = {}) {
  const context = await browser.createBrowserContext();
  const page = await context.newPage();
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  if (!js) await page.setJavaScriptEnabled(false);
  if (blockTiles) {
    await page.setRequestInterception(true);
    page.on('request', (r) =>
      r.url().includes('tile.openstreetmap.org')
        ? r.abort().catch(() => {})
        : r.continue().catch(() => {})
    );
  }
  return { page, context };
}

/* ---------------------------------------------------------------------------
   1 · Language routing through the query parameter
------------------------------------------------------------------------------ */
console.log('\nLanguage routing');
{
  const { page, context } = await newPage();

  await page.goto(BASE, { waitUntil: 'networkidle2' });
  check('default language is Ukrainian', (await page.$eval('html', (h) => h.lang)) === 'uk');
  check(
    'bare URL rewrites itself to ?lang=uk (shareable)',
    page.url().includes('lang=uk'),
    page.url()
  );

  // Switch to Romanian by clicking the switcher.
  await page.click('.langbar__btn[lang="ro"]');
  await new Promise((r) => setTimeout(r, 200));
  check('clicking ROM sets <html lang="ro">', (await page.$eval('html', (h) => h.lang)) === 'ro');
  check('URL updates to ?lang=ro', page.url().includes('lang=ro'), page.url());
  check(
    'H1 shows Romanian names, groom first',
    (await page.$eval('h1', (h) => h.textContent.replace(/\s+/g, ''))) === 'ANDREIșiELFIDA'
  );

  // The critical GitHub Pages property: a hard reload of a deep link must not 404.
  const resp = await page.reload({ waitUntil: 'networkidle2' });
  check('hard refresh on ?lang=ro returns 200', resp?.status() === 200, String(resp?.status()));
  check(
    'language survives the refresh',
    (await page.$eval('html', (h) => h.lang)) === 'ro'
  );

  await page.close();
  await context.close();
}

/* ---------------------------------------------------------------------------
   2 · Shared deep links land in the right language for a first-time visitor
------------------------------------------------------------------------------ */
{
  for (const [lang, expected] of [
    ['ro', 'ANDREIșiELFIDA'],
    ['en', 'ANDREW&ELFIDA'],
    ['uk', 'АНДРІЙтаЕЛЬФІДА'],
  ]) {
    const { page, context } = await newPage();
    await page.goto(`${BASE}?lang=${lang}`, { waitUntil: 'networkidle2' });
    const h1 = await page.$eval('h1', (h) => h.textContent.replace(/\s+/g, ''));
    check(`fresh visitor to ?lang=${lang} sees the right names`, h1 === expected, h1);
    await page.close();
    await context.close();
  }
}

/* ---------------------------------------------------------------------------
   3 · The invitation works with JavaScript disabled
------------------------------------------------------------------------------ */
console.log('\nNo JavaScript');
{
  const { page, context } = await newPage({ js: false });
  await page.goto(BASE, { waitUntil: 'domcontentloaded' });

  const text = await page.evaluate(() => document.body.innerText);
  check('names render', text.includes('АНДРІЙ') && text.includes('ЕЛЬФІДА'));
  check('verse renders', text.includes('Двом краще'));
  check('venue renders', text.includes('Biserica'));
  check('full address renders', text.includes('Станівці'));
  check('raw coordinates render as text', text.includes('48.0850197, 26.0520467'));
  check('schedule renders', text.includes('11:00') && text.includes('13:00'));

  const hrefs = await page.$$eval('a[href]', (as) => as.map((a) => a.href));
  check(
    'Google directions link present',
    hrefs.some((h) => h.includes('maps/dir/?api=1&destination=48.0850197,26.0520467'))
  );
  check('Waze link present', hrefs.some((h) => h.includes('waze.com/ul?ll=48.0850197')));
  check('Google place (CID) link present', hrefs.some((h) => h.includes('cid=10979324914211926916')));

  const hidden = await page.$$eval('.reveal', (els) => els.length);
  check('nothing is hidden by reveal-on-scroll without JS', hidden === 0, `${hidden} hidden`);

  await page.close();
  await context.close();
}

/* ---------------------------------------------------------------------------
   4 · Map: lazy-loads on approach, and degrades safely when tiles fail
------------------------------------------------------------------------------ */
console.log('\nMap');
{
  // 4a. Not loaded until scrolled near.
  const { page, context } = await newPage({ blockTiles: false });
  const tileRequests = [];
  page.on('request', (r) => {
    if (r.url().includes('tile.openstreetmap.org')) tileRequests.push(r.url());
  });
  await page.goto(BASE, { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 500));
  check('no map tiles requested on first paint', tileRequests.length === 0, `${tileRequests.length}`);

  await page.evaluate(() => document.querySelector('.map')?.scrollIntoView());
  await new Promise((r) => setTimeout(r, 3500));

  const leafletUp = await page.evaluate(() => !!document.querySelector('.leaflet-container'));
  check('Leaflet initialises once the map is scrolled into view', leafletUp);
  check('map tiles are requested only then', tileRequests.length > 0, `${tileRequests.length} tiles`);

  // Assert the marker is actually PAINTED, not merely present. Leaflet injects
  // it as a <span>, and an inline element ignores width/height — the marker
  // once shipped invisible while passing an exists-in-the-DOM check.
  const marker = await page.evaluate(() => {
    const el = document.querySelector('.map__marker');
    if (!el) return null;
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    return { w: r.width, h: r.height, display: cs.display, opacity: cs.opacity, bg: cs.backgroundColor };
  });
  check('venue marker exists', marker !== null);
  check(
    'venue marker has a visible size',
    !!marker && marker.w >= 8 && marker.h >= 8,
    marker ? `${Math.round(marker.w)}x${Math.round(marker.h)} display:${marker.display}` : 'absent'
  );
  check(
    'venue marker is not transparent',
    !!marker && Number(marker.opacity) > 0 && !/rgba\(0, 0, 0, 0\)/.test(marker.bg),
    marker ? `${marker.bg} @ ${marker.opacity}` : 'absent'
  );

  const attrib = await page.evaluate(
    () => document.querySelector('.leaflet-control-attribution')?.textContent ?? ''
  );
  check('OpenStreetMap attribution present', attrib.includes('OpenStreetMap'), attrib.slice(0, 40));

  await page.close();
  await context.close();
}
{
  // 4b. Tiles blocked — the section must still be fully useful.
  const { page, context } = await newPage({ blockTiles: true });
  await page.goto(BASE, { waitUntil: 'networkidle2' });
  await page.evaluate(() => document.querySelector('.map')?.scrollIntoView());
  await new Promise((r) => setTimeout(r, 2000));

  const text = await page.evaluate(() => document.body.innerText);
  check('with tiles blocked, coordinates still visible', text.includes('48.0850197, 26.0520467'));
  check('with tiles blocked, address still visible', text.includes('Станівці'));

  await page.close();
  await context.close();
}

/* ---------------------------------------------------------------------------
   5 · Copy coordinates
------------------------------------------------------------------------------ */
console.log('\nClipboard');
{
  const { page, context } = await newPage();
  await context.overridePermissions(BASE, ['clipboard-read', 'clipboard-write']);
  await page.goto(BASE, { waitUntil: 'networkidle2' });

  const btn = await page.evaluateHandle(() =>
    [...document.querySelectorAll('button')].find((b) => b.className.includes('btn--outline'))
  );
  await btn.asElement()?.click();
  await new Promise((r) => setTimeout(r, 300));

  const clip = await page.evaluate(() => navigator.clipboard.readText());
  check('copy button writes the coordinate pair', clip === '48.0850197, 26.0520467', clip);

  const label = await page.evaluate(
    () => [...document.querySelectorAll('button')].find((b) => b.className.includes('btn--outline'))?.textContent
  );
  check('button confirms with "Скопійовано ✓"', label?.includes('Скопійовано'), label);

  await page.close();
  await context.close();
}

/* ---------------------------------------------------------------------------
   6 · Keyboard and accessibility basics
------------------------------------------------------------------------------ */
console.log('\nKeyboard & semantics');
{
  const { page, context } = await newPage();
  await page.goto(BASE, { waitUntil: 'networkidle2' });

  await page.keyboard.press('Tab');
  const first = await page.evaluate(() => ({
    cls: document.activeElement?.className,
    text: document.activeElement?.textContent,
  }));
  check('first Tab reaches the skip link', first.cls?.includes('skip-link'), JSON.stringify(first));

  const outline = await page.evaluate(() => {
    const el = document.querySelector('.langbar__btn');
    el.focus();
    const cs = getComputedStyle(el);
    return { w: cs.outlineWidth, style: cs.outlineStyle };
  });
  check('focused control has a visible outline', outline.style !== 'none' && parseFloat(outline.w) > 0, JSON.stringify(outline));

  const structure = await page.evaluate(() => {
    // <header>/<footer> map to banner/contentinfo unless they are inside a
    // sectioning element. React renders into #root, so they are not direct
    // children of <body> — that does not change their role.
    const sectioning = 'article, aside, main, nav, section';
    const scoped = (tag) =>
      [...document.querySelectorAll(tag)].filter((el) => !el.parentElement?.closest(sectioning)).length;
    return {
    h1: document.querySelectorAll('h1').length,
    main: document.querySelectorAll('main').length,
    banners: scoped('header'),
    footers: scoped('footer'),
    levels: [...document.querySelectorAll('h1,h2,h3')].map((h) => Number(h.tagName[1])),
    imgsNoAlt: [...document.querySelectorAll('img')].filter((i) => !i.hasAttribute('alt')).length,
    };
  });
  check('exactly one <h1>', structure.h1 === 1, String(structure.h1));
  check('exactly one <main>', structure.main === 1);
  check('exactly one banner landmark', structure.banners === 1, String(structure.banners));
  check('exactly one contentinfo landmark', structure.footers === 1);
  check('every <img> has an alt attribute', structure.imgsNoAlt === 0, String(structure.imgsNoAlt));

  let skips = 0;
  for (let i = 1; i < structure.levels.length; i++) {
    if (structure.levels[i] - structure.levels[i - 1] > 1) skips++;
  }
  check('no heading levels are skipped', skips === 0, JSON.stringify(structure.levels));

  // interestingOnly prunes landmark containers, which is exactly what we want
  // to assert here, so ask for the full tree.
  const ax = await page.accessibility.snapshot({ interestingOnly: false });
  const roles = [];
  (function walk(node) {
    if (!node) return;
    roles.push(node.role);
    (node.children ?? []).forEach(walk);
  })(ax);
  check('accessibility tree exposes a banner', roles.includes('banner'), roles.slice(0, 8).join(','));
  check('accessibility tree exposes a main', roles.includes('main'));
  check('accessibility tree exposes a contentinfo', roles.includes('contentinfo'));

  await page.close();
  await context.close();
}

/* ---------------------------------------------------------------------------
   7 · No console errors anywhere
------------------------------------------------------------------------------ */
console.log('\nConsole hygiene');
{
  const { page, context } = await newPage({ blockTiles: false });
  const problems = [];
  page.on('console', (m) => {
    if (m.type() === 'error' || m.type() === 'warning') problems.push(`${m.type()}: ${m.text()}`);
  });
  page.on('pageerror', (e) => problems.push(`pageerror: ${e.message}`));

  await page.goto(BASE, { waitUntil: 'networkidle2' });
  await page.evaluate(() => document.querySelector('.map')?.scrollIntoView());
  await new Promise((r) => setTimeout(r, 3000));
  await page.click('.langbar__btn[lang="en"]');
  await new Promise((r) => setTimeout(r, 500));

  const real = problems.filter((p) => !p.includes('favicon'));
  check('no console errors or warnings', real.length === 0, real.slice(0, 3).join(' | '));

  await page.close();
  await context.close();
}

await browser.close();

console.log(`\n${passed} passed, ${failures.length} failed.`);
if (failures.length) {
  console.error('\nFailures:');
  for (const f of failures) console.error(`  · ${f}`);
  process.exit(1);
}
