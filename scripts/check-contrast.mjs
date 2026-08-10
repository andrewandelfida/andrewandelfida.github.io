#!/usr/bin/env node
/**
 * WCAG 2.1 contrast audit for every text/background pair the site actually
 * renders. The sage/olive palette is light, so several pairs from the design
 * needed darkening — this script is the record of which, and the guard that
 * stops a future palette tweak from quietly breaking legibility.
 *
 * Run: npm run check:contrast
 * Exits non-zero if any pair fails its required ratio.
 */

const srgb = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);

function luminance(hex) {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.replace(/./g, '$&$&') : h, 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => srgb(v / 255));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function ratio(fg, bg) {
  const [a, b] = [luminance(fg), luminance(bg)].sort((x, y) => y - x);
  return (a + 0.05) / (b + 0.05);
}

// Keep these in sync with src/styles/tokens.css.
const T = {
  oliveDeep: '#4E5539',
  oliveBody: '#5F6450',
  oliveMid: '#636A4A',
  cream: '#F7F3E9',
  wash: '#F1E4DA',
  terracottaText: '#9E5330',
  verseBand: '#AE603C',
  verseRef: '#FFFFFF',
  slotFill: '#E7E9D7',
  slotLabel: '#666A54',
};

// "large" = >= 24px, or >= 18.66px bold → 3.0:1. Everything else 4.5:1.
// UI component boundaries (input borders, control outlines) → 3.0:1 per
// WCAG 1.4.11. Purely decorative graphics (the diamonds, the hairline rules,
// the photo-slot frames) are exempt and deliberately not listed here.
const CHECKS = [
  // --- on warm cream (page background) ---
  ['H1 names / H2 headings', T.oliveDeep, T.cream, 'large'],
  ['Body paragraph copy', T.oliveBody, T.cream, 'normal'],
  ['Eyebrow + small meta (uppercase 10-13px)', T.oliveMid, T.cream, 'normal'],
  ['Italic invite line / subtitles', T.oliveMid, T.cream, 'normal'],
  ['Hero connector "та / și / &"', T.oliveMid, T.cream, 'normal'],
  ['Schedule time (Playfair 28-40px)', T.oliveDeep, T.cream, 'large'],
  ['Schedule entry title', T.oliveMid, T.cream, 'normal'],
  ['Schedule note', T.oliveBody, T.cream, 'normal'],
  ['Info card heading', T.oliveDeep, T.cream, 'normal'],
  ['Info card body', T.oliveBody, T.cream, 'normal'],
  ['Footer script tagline (18-24px)', T.terracottaText, T.cream, 'normal'],
  ['Footer date line', T.oliveMid, T.cream, 'normal'],
  ['Lang switcher label', T.oliveDeep, T.cream, 'normal'],

  // --- on terracotta wash (gallery + location) ---
  ['H2 on wash', T.oliveDeep, T.wash, 'large'],
  ['Gallery subtitle italic on wash', T.oliveMid, T.wash, 'normal'],
  ['Venue name on wash', T.oliveDeep, T.wash, 'normal'],
  ['Address italic on wash', T.oliveMid, T.wash, 'normal'],
  ['Body copy on wash', T.oliveBody, T.wash, 'normal'],
  ['Signal-note footnote on wash', T.oliveMid, T.wash, 'normal'],
  ['Google Maps text link on wash', T.oliveBody, T.wash, 'normal'],
  ['Copy-coords outline label on wash', T.oliveDeep, T.wash, 'normal'],
  ['Copy-coords outline BORDER on wash', T.oliveDeep, T.wash, 'ui'],

  // --- coordinates card (cream card sitting on the wash) ---
  ['Coords label on cream card', T.oliveMid, T.cream, 'normal'],
  ['Coords value (mono, user-select:all)', T.oliveDeep, T.cream, 'normal'],

  // --- solid terracotta verse band ---
  ['Verse quote (22-40px)', T.cream, T.verseBand, 'large'],
  ['Verse reference eyebrow (12px)', T.verseRef, T.verseBand, 'normal'],

  ['Directions button label (olive pill)', T.cream, T.oliveDeep, 'normal'],
  ['Directions button pill vs wash', T.oliveDeep, T.wash, 'ui'],

  // --- placeholder photo slots (visible until real photos land) ---
  ['Mono aspect-ratio label on photo slot', T.slotLabel, T.slotFill, 'normal'],

  // --- focus ring ---
  ['Focus ring vs cream', T.oliveDeep, T.cream, 'ui'],
  ['Focus ring vs wash', T.oliveDeep, T.wash, 'ui'],
  ['Focus ring vs verse band', T.cream, T.verseBand, 'ui'],
];

/**
 * Compose a foreground over a background at some opacity.
 *
 * Checking token colours alone is not enough: a rule like `opacity: .5` on a
 * button silently halves its contrast, and the token still looks fine on
 * paper. That is exactly how the language switcher shipped at 2.28:1 in an
 * early build. Anything the CSS renders at less than full opacity belongs in
 * the list below, at its effective colour.
 */
function composite(fg, bg, alpha) {
  const parse = (h) => {
    const n = parseInt(h.replace('#', ''), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  };
  const [fr, fg_, fb] = parse(fg);
  const [br, bg_, bb] = parse(bg);
  const mix = (a, b) => Math.round(a * alpha + b * (1 - alpha));
  return (
    '#' +
    [mix(fr, br), mix(fg_, bg_), mix(fb, bb)]
      .map((v) => v.toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase()
  );
}

// Text the CSS renders at reduced opacity, checked at its EFFECTIVE colour.
CHECKS.push(
  [
    'Inactive language button (was opacity .5)',
    T.oliveMid,
    T.cream,
    'normal',
  ],
  [
    'Active language button',
    T.oliveDeep,
    T.cream,
    'normal',
  ],
  [
    'Solid-pill button label (composited check)',
    composite(T.cream, T.oliveDeep, 1),
    T.oliveDeep,
    'normal',
  ]
);

const MIN = { normal: 4.5, large: 3.0, ui: 3.0 };

let failed = 0;
const rows = CHECKS.map(([label, fg, bg, kind]) => {
  const r = ratio(fg, bg);
  const need = MIN[kind];
  const ok = r >= need;
  if (!ok) failed++;
  return { label, fg, bg, kind, r, need, ok };
});

const w = Math.max(...rows.map((r) => r.label.length));
for (const r of rows) {
  console.log(
    `${r.ok ? 'PASS' : 'FAIL'}  ${r.label.padEnd(w)}  ${r.fg} on ${r.bg}  ` +
      `${r.r.toFixed(2)}:1 (need ${r.need.toFixed(1)}, ${r.kind})`
  );
}
console.log(`\n${rows.length - failed}/${rows.length} pairs pass WCAG AA.`);
if (failed) {
  console.error(`${failed} pair(s) FAIL — darken the foreground before shipping.`);
  process.exit(1);
}
