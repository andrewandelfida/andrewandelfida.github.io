#!/usr/bin/env node
/** One-off: screenshot the location section with real OpenStreetMap tiles. */
import puppeteer from 'puppeteer-core';

const BASE = process.env.BASE_URL ?? 'http://localhost:4173/';
const browser = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true,
  args: ['--disable-gpu', '--hide-scrollbars'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1100, height: 900, deviceScaleFactor: 2 });
await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
await page.goto(BASE, { waitUntil: 'networkidle2' });
await page.evaluate(() => document.querySelector('.map')?.scrollIntoView({ block: 'center' }));
await new Promise((r) => setTimeout(r, 6000));

const el = await page.$('.location__cols');
await el?.screenshot({ path: '/tmp/shots/map-live.png' });
console.log('→ /tmp/shots/map-live.png');
await browser.close();
