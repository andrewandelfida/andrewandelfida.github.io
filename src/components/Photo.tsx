import manifest from '../content/image-manifest.json';
import { ASPECT_RATIO, type WeddingImage } from '../content/types';
import { useI18n } from '../i18n/useI18n';

interface ManifestEntry {
  width: number;
  height: number;
  widths: number[];
  formats: string[];
  color: string;
  /**
   * A 20px-wide blurred copy of the photo as a WebP data URI, written by
   * `npm run images`. Optional because a manifest generated before this existed
   * simply falls back to `color`.
   */
  lqip?: string;
}

const IMAGES = manifest as Record<string, ManifestEntry | undefined>;

/** Human label for the placeholder box, matching the design's mono captions. */
const RATIO_LABEL: Record<string, string> = {
  portrait: '3:4',
  landscape: '4:3',
  square: '1:1',
};

interface PhotoProps {
  image: WeddingImage;
  /** Extra classes, e.g. "photo--arch" for the hero. */
  className?: string;
  /** The `sizes` attribute — how wide this slot is at each viewport width. */
  sizes: string;
  /** Overrides the placeholder caption (the hero uses "couple portrait · 4:5"). */
  placeholderLabel?: string;
  /**
   * Fixed aspect ratio for the box. The hero arch is always 4:5 by design; the
   * gallery leaves this unset so each photo uses its own true proportions.
   */
  fixedRatio?: boolean;
}

/**
 * Renders a photograph — or, until the photograph exists, the design's hatched
 * placeholder in exactly the same box.
 *
 * Everything that prevents layout shift lives here: explicit width/height, an
 * aspect-ratio taken from the real file, and a blurred preview of the photo
 * itself while the bytes arrive. Swapping a portrait original for a landscape
 * one changes the manifest, and the box follows — no component needs editing.
 */
export function Photo({ image, className = '', sizes, placeholderLabel, fixedRatio }: PhotoProps) {
  const { pick } = useI18n();
  const entry = IMAGES[image.src];

  // --- No processed file yet: show the design's placeholder slot. -----------
  if (!entry || entry.widths.length === 0) {
    const ratio = ASPECT_RATIO[image.aspect];
    return (
      <div
        className={`photo photo--empty ${className}`}
        style={fixedRatio ? undefined : { aspectRatio: `${ratio}` }}
        // Decorative until it holds a real photo — announcing "3:4" helps no one.
        aria-hidden="true"
      >
        <span className="photo__label">{placeholderLabel ?? RATIO_LABEL[image.aspect]}</span>
      </div>
    );
  }

  // --- Real photo. ---------------------------------------------------------
  /*
   * Percent-encode the path.
   *
   * `srcset` splits candidates on commas and separates the URL from its width
   * descriptor on whitespace. A photo straight off a phone is often called
   * something like "photo_2026-07-16 (2).jpg", and that single space
   * invalidates EVERY candidate in the list — silently. The browser then falls
   * back to the plain `src`, so the guest downloads a full-size JPEG instead of
   * a small AVIF, and nothing anywhere reports a problem.
   *
   * encodeURI leaves parentheses alone (harmless in a URL); commas have to go
   * separately because they are the candidate separator.
   */
  const url = (w: number, ext: string) =>
    encodeURI(`/images/${image.src}-${w}.${ext}`).replace(/,/g, '%2C');

  const srcSet = (ext: string) => entry.widths.map((w) => `${url(w, ext)} ${w}w`).join(', ');

  // Largest generated width is the <img> fallback for very old browsers.
  const largest = entry.widths[entry.widths.length - 1] ?? entry.width;
  const scale = largest / entry.width;

  return (
    <div
      className={`photo ${className}`}
      style={{
        backgroundColor: entry.color,
        ...(fixedRatio ? {} : { aspectRatio: `${entry.width} / ${entry.height}` }),
      }}
    >
      <picture>
        <source type="image/avif" srcSet={srcSet('avif')} sizes={sizes} />
        <source type="image/webp" srcSet={srcSet('webp')} sizes={sizes} />
        <img
          className="photo__img"
          /*
           * The blurred preview goes on the <img> itself, not on the wrapper.
           *
           * An <img> with no decoded data yet paints its own background, and the
           * moment the real photo decodes it paints over it — so the preview
           * appears and disappears with no JavaScript involved at all. On the
           * wrapper it would need either a fade or a class toggle to get out of
           * the way, which means the photos would depend on hydration.
           *
           * Falls back to the wrapper's average colour where a WebP data URI
           * cannot be decoded (iOS Safari before 14).
           */
          style={entry.lqip ? { backgroundImage: `url("${entry.lqip}")` } : undefined}
          src={url(largest, 'jpg')}
          srcSet={srcSet('jpg')}
          sizes={sizes}
          alt={pick(image.alt)}
          // Explicit intrinsic size: the browser reserves the right box before
          // a single byte of image data arrives, so nothing ever jumps.
          width={largest}
          height={Math.round(entry.height * scale)}
          loading={image.priority ? 'eager' : 'lazy'}
          decoding={image.priority ? 'sync' : 'async'}
          // React 18 does not forward the camelCase `fetchPriority` prop, so it
          // would be silently dropped. Spread the real lowercase DOM attribute.
          {...(image.priority ? { fetchpriority: 'high' } : {})}
        />
      </picture>
    </div>
  );
}

/** True once a photo has been processed — lets the hero preload itself. */
export function hasPhoto(src: string): boolean {
  return Boolean(IMAGES[src]);
}
