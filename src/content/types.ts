/** The three languages the invitation is published in. Ukrainian is default. */
export const LOCALES = ['uk', 'ro', 'en'] as const;
export type Locale = (typeof LOCALES)[number];

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (LOCALES as readonly string[]).includes(value);
}

/** A value that exists in all three languages. */
export type Localized<T = string> = Record<Locale, T>;

/**
 * Orientation of a photo.
 *
 * The brief specifies 'portrait' | 'landscape'; 'square' is added because the
 * design ships 1:1 gallery tiles. Any {portrait|landscape} value stays valid.
 *
 * This only decides the shape of the PLACEHOLDER box shown before a real file
 * exists. Once a photo is processed by `npm run images`, its true pixel
 * dimensions come from the generated manifest, so replacing a portrait file
 * with a landscape one reflows correctly with no code change.
 */
export type Aspect = 'portrait' | 'landscape' | 'square';

/** Fallback aspect ratios used to size a slot before a real photo exists. */
export const ASPECT_RATIO: Record<Aspect, number> = {
  portrait: 3 / 4,
  landscape: 4 / 3,
  square: 1,
};

export interface WeddingImage {
  /**
   * Base name of the photo, WITHOUT extension or size suffix — this is the
   * filename the couple drops into `photos-src/`.
   *
   *   photos-src/gallery/first-dance.jpg
   *      → src: 'gallery/first-dance'
   *
   * Leave the name of a photo that does not exist yet: the design's hatched
   * placeholder is rendered in its place until the file is added.
   */
  src: string;
  /** Alt text per language. Shown in whichever language the guest is reading. */
  alt: Localized;
  aspect: Aspect;
  /**
   * Only the hero portrait sets this. It makes the image load eagerly at high
   * fetch priority and be preloaded; everything else lazy-loads below the fold.
   */
  priority?: boolean;
}

/** One entry in the schedule timeline. */
export interface ScheduleEntry {
  /** Wall-clock time, shown verbatim. Not localised — 11:00 reads the same. */
  time: string;
  titleKey: string;
  venueKey: string;
  noteKey: string;
}

/** One "good to know" card. */
export interface InfoCard {
  titleKey: string;
  bodyKey: string;
}
