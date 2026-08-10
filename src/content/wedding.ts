/* =============================================================================
   THE WEDDING — single source of truth for every fact on this site.

   Everything the couple might want to change lives here or in strings.ts:
     · this file  — dates, venue, coordinates, links, which photos appear
     · strings.ts — all wording, in all three languages

   No component hardcodes any of it.
   ========================================================================== */

import type { ScheduleEntry, WeddingImage } from './types';

/** Canonical site URL. This exact string is encoded in the printed QR code. */
export const SITE_URL = 'https://andrewandelfida.github.io/';

export const VENUE = {
  /** Decimal degrees, WGS84. The reliable identifier for this rural venue. */
  lat: 48.0850197,
  lng: 26.0520467,
  /** Rendered as selectable text and offered by the "copy coordinates" button. */
  get coords(): string {
    return `${this.lat}, ${this.lng}`;
  },
} as const;

/**
 * Directions deep links.
 *
 * Address search is unreliable here — OpenStreetMap and Google both have thin
 * data for Stănești — so every link targets raw coordinates rather than a
 * place-name query. The CID link is the one canonical Google place record.
 */
export const MAP_LINKS = {
  googleDirections: `https://www.google.com/maps/dir/?api=1&destination=${VENUE.lat},${VENUE.lng}`,
  waze: `https://waze.com/ul?ll=${VENUE.lat},${VENUE.lng}&navigate=yes`,
  googlePlace: 'https://maps.google.com/?cid=10979324914211926916',
  /** Attribution target required by the OpenStreetMap tile usage policy. */
  osmCopyright: 'https://www.openstreetmap.org/copyright',
} as const;

/** Machine-readable date for <time> elements and structured data. */
export const WEDDING_DATE_ISO = '2026-10-03';
export const CEREMONY_START_ISO = '2026-10-03T11:00:00+03:00';
export const RECEPTION_START_ISO = '2026-10-03T13:00:00+03:00';

export const SCHEDULE: ScheduleEntry[] = [
  { time: '11:00', titleKey: 'sch1_title', venueKey: 'sch1_venue', noteKey: 'sch1_note' },
  { time: '13:00', titleKey: 'sch2_title', venueKey: 'sch2_venue', noteKey: 'sch2_note' },
];


/* -----------------------------------------------------------------------------
   PHOTOS

   To swap a photo:
     1. Drop the original into  photos-src/hero/  or  photos-src/gallery/
     2. Run  npm run images
     3. Make sure the `src` below matches the filename (without extension)

   Until a matching processed file exists, the design's hatched placeholder box
   is rendered instead — so the site always looks intentional, never broken.

   `aspect` only shapes that placeholder. Real photos use their true dimensions,
   so swapping a portrait for a landscape reflows correctly on its own.
-------------------------------------------------------------------------------- */

export const HERO_IMAGE: WeddingImage = {
  src: 'hero/photo_2026-08-07_21-56-19',
  alt: {
    uk: 'Андрій та Ельфіда разом',
    ro: 'Andrei și Elfida împreună',
    en: 'Andrew and Elfida together',
  },
  aspect: 'portrait',
  // The only image above the fold, and the page's largest contentful paint.
  priority: true,
};

export const GALLERY_IMAGES: WeddingImage[] = [
  {
    src: 'gallery/IMG_20260611_215455_628',
    alt: { uk: 'Андрій та Ельфіда', ro: 'Andrei și Elfida', en: 'Andrew and Elfida' },
    aspect: 'portrait',
  },
  {
    src: 'gallery/IMG_20260611_215509_106',
    alt: { uk: 'Андрій та Ельфіда', ro: 'Andrei și Elfida', en: 'Andrew and Elfida' },
    aspect: 'portrait',
  },
  {
    src: 'gallery/IMG_20260611_215612_520',
    alt: { uk: 'Андрій та Ельфіда', ro: 'Andrei și Elfida', en: 'Andrew and Elfida' },
    aspect: 'portrait',
  },
  {
    src: 'gallery/photo_2026-07-16_23-13-08 (2)',
    alt: { uk: 'Андрій та Ельфіда', ro: 'Andrei și Elfida', en: 'Andrew and Elfida' },
    aspect: 'portrait',
  },
  {
    src: 'gallery/photo_2026-07-16_23-37-17',
    alt: { uk: 'Андрій та Ельфіда', ro: 'Andrei și Elfida', en: 'Andrew and Elfida' },
    aspect: 'portrait',
  },
  {
    src: 'gallery/photo_2026-07-23_15-11-39',
    alt: { uk: 'Андрій та Ельфіда', ro: 'Andrei și Elfida', en: 'Andrew and Elfida' },
    aspect: 'portrait',
  },
  {
    src: 'gallery/photo_2026-07-23_18-33-10',
    alt: { uk: 'Андрій та Ельфіда', ro: 'Andrei și Elfida', en: 'Andrew and Elfida' },
    aspect: 'landscape',
  },
  {
    src: 'gallery/photo_2026-07-23_18-33-51',
    alt: { uk: 'Андрій та Ельфіда', ro: 'Andrei și Elfida', en: 'Andrew and Elfida' },
    aspect: 'portrait',
  },
  {
    src: 'gallery/photo_2026-08-01_15-24-42',
    alt: { uk: 'Андрій та Ельфіда', ro: 'Andrei și Elfida', en: 'Andrew and Elfida' },
    aspect: 'portrait',
  },
  {
    src: 'gallery/photo_2026-08-01_17-40-27',
    alt: { uk: 'Андрій та Ельфіда', ro: 'Andrei și Elfida', en: 'Andrew and Elfida' },
    aspect: 'portrait',
  },
  {
    src: 'gallery/photo_2026-08-07_21-56-19',
    alt: { uk: 'Андрій та Ельфіда', ro: 'Andrei și Elfida', en: 'Andrew and Elfida' },
    aspect: 'portrait',
  },
  {
    src: 'gallery/photo_2026-08-07_21-56-48',
    alt: { uk: 'Андрій та Ельфіда', ro: 'Andrei și Elfida', en: 'Andrew and Elfida' },
    aspect: 'portrait',
  },
];
