#!/usr/bin/env node
/* =============================================================================
   PRERENDER

   Renders the React app to static HTML at build time and bakes it into
   dist/index.html.

   Why bother, for a one-page site?

     · WITHOUT JAVASCRIPT the page would otherwise be an empty <div>. The brief
       requires the location section to stay useful with JS disabled or broken
       — for guests driving to a village with patchy signal, the address and
       coordinates must survive a failed script load. Prerendering makes the
       whole invitation plain HTML.
     · LARGEST CONTENTFUL PAINT lands on the first response instead of waiting
       for a JS bundle to download, parse and execute on a phone on 3G.
     · The printed QR code has to work for years. Static HTML is the most
       durable thing we can put behind it.

   The client then hydrates that markup (see src/main.tsx).
   ========================================================================== */

import { readFile, writeFile, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const DIST = join(ROOT, 'dist');
const SSR_DIR = join(ROOT, 'dist-ssr');
const TEMPLATE = join(DIST, 'index.html');
const MANIFEST = join(ROOT, 'src', 'content', 'image-manifest.json');

const ROOT_DIV = '<div id="root"></div>';

async function main() {
  const entry = join(SSR_DIR, 'entry-server.js');
  if (!existsSync(entry)) throw new Error(`SSR bundle missing: ${entry}`);
  if (!existsSync(TEMPLATE)) throw new Error(`Client build missing: ${TEMPLATE}`);

  const { render } = await import(pathToFileURL(entry).href);
  const { html } = render();

  if (!html || html.length < 500) {
    throw new Error(`Prerender produced suspiciously little HTML (${html?.length ?? 0} chars)`);
  }

  let template = await readFile(TEMPLATE, 'utf8');
  if (!template.includes(ROOT_DIV)) {
    throw new Error('Could not find <div id="root"></div> in the built index.html');
  }

  template = template.replace(ROOT_DIV, `<div id="root">${html}</div>`);
  template = await inlineStylesheet(template);

  // If the couple's hero photo has been processed, preload it: it is the
  // page's largest contentful paint and the one image above the fold.
  const heroPreload = await buildHeroPreload();
  if (heroPreload) template = template.replace('</head>', `    ${heroPreload}\n  </head>`);

  await writeFile(TEMPLATE, template);
  await rm(SSR_DIR, { recursive: true, force: true });

  console.log(`Prerendered ${(html.length / 1024).toFixed(1)} KB of HTML into dist/index.html`);
  if (heroPreload) console.log('Added a preload for the hero photograph.');
}

/**
 * Inline the main stylesheet into the document.
 *
 * It is the only render-blocking resource on the page, and on a simulated slow
 * mobile connection that round trip alone cost ~1.8s of first paint. The whole
 * stylesheet is a few kilobytes gzipped — smaller than the request overhead of
 * fetching it separately — so inlining strictly wins here.
 *
 * Leaflet's stylesheet is deliberately NOT inlined: it belongs to the map's
 * async chunk and must stay out of the critical path.
 */
async function inlineStylesheet(template) {
  const linkRe = /<link[^>]+rel="stylesheet"[^>]*href="(\/assets\/[^"]+\.css)"[^>]*>/g;
  const links = [...template.matchAll(linkRe)];
  if (links.length === 0) {
    console.warn('No stylesheet link found to inline — leaving the document as built.');
    return template;
  }

  for (const [tag, href] of links) {
    const cssPath = join(DIST, href.replace(/^\//, ''));
    if (!existsSync(cssPath)) continue;
    const css = await readFile(cssPath, 'utf8');
    template = template.replace(tag, `<style>${css}</style>`);
    console.log(`Inlined ${href} (${(css.length / 1024).toFixed(1)} KB) — no render-blocking CSS.`);
  }
  return template;
}

async function buildHeroPreload() {
  try {
    const manifest = JSON.parse(await readFile(MANIFEST, 'utf8'));
    const hero = manifest['hero/couple'];
    if (!hero?.widths?.length) return null;

    const srcset = hero.widths.map((w) => `/images/hero/couple-${w}.avif ${w}w`).join(', ');
    const sizes = '(max-width: 500px) 220px, (max-width: 818px) 44vw, 360px';
    return (
      `<link rel="preload" as="image" type="image/avif" ` +
      `imagesrcset="${srcset}" imagesizes="${sizes}" fetchpriority="high">`
    );
  } catch {
    return null;
  }
}

main().catch((err) => {
  console.error(`\nprerender failed: ${err.message}`);
  process.exit(1);
});
