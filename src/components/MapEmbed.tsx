import { useEffect, useRef, useState } from 'react';
import { MAP_LINKS, VENUE } from '../content/wedding';
import { useI18n } from '../i18n/useI18n';

type Status = 'idle' | 'loading' | 'ready' | 'error';

/**
 * An OpenStreetMap map, via Leaflet, loaded only when it is nearly on screen.
 *
 * Deliberate choices, all pointing at "must still work in 2036 with nobody
 * maintaining it":
 *   · OpenStreetMap + Leaflet — no API key, no billing account, no quota that
 *     can lapse. A Google Maps embed would need a key that can be revoked or
 *     start costing money.
 *   · Dynamically imported — Leaflet and its CSS are ~45 KB gzipped and would
 *     otherwise sit in the critical path for a village where the map is the
 *     least important thing on the page.
 *   · Loaded on approach via IntersectionObserver, so opening the invitation
 *     costs nothing until the guest actually scrolls to "getting there".
 *   · The map is ENHANCEMENT ONLY. The address, the coordinates and every
 *     directions link live in the surrounding markup as plain text and real
 *     links. If this component never runs, nothing important is lost.
 */
export function MapEmbed() {
  const { t } = useI18n();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<{ remove: () => void } | null>(null);
  const [status, setStatus] = useState<Status>('idle');

  useEffect(() => {
    const el = containerRef.current;
    if (!el || mapRef.current) return;

    let cancelled = false;

    async function init() {
      if (cancelled || !el) return;
      setStatus('loading');
      try {
        const [leaflet] = await Promise.all([import('leaflet'), import('leaflet/dist/leaflet.css')]);
        if (cancelled || !el) return;

        const L = leaflet.default ?? leaflet;

        const map = L.map(el, {
          center: [VENUE.lat, VENUE.lng],
          zoom: 15,
          // A map inside a long scrolling page must not swallow the scroll
          // gesture. Guests can still pinch-zoom, drag, or use the +/- buttons.
          scrollWheelZoom: false,
          attributionControl: true,
        });

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: `&copy; <a href="${MAP_LINKS.osmCopyright}" target="_blank" rel="noopener">OpenStreetMap</a>`,
        }).addTo(map);

        // A CSS-drawn marker: matches the design's olive diamond pin and costs
        // no extra image request.
        L.marker([VENUE.lat, VENUE.lng], {
          icon: L.divIcon({
            className: '',
            html: '<span class="map__marker"></span>',
            iconSize: [16, 16],
            iconAnchor: [8, 16],
          }),
          keyboard: false,
          alt: t('loc_venue'),
        }).addTo(map);

        mapRef.current = map;
        setStatus('ready');
      } catch {
        // Tiles blocked, offline, or the chunk failed to load. Fall back to
        // the placeholder plus a message pointing at the text directions.
        if (!cancelled) setStatus('error');
      }
    }

    // No IntersectionObserver (very old browser): just load it.
    if (!('IntersectionObserver' in window)) {
      void init();
      return () => {
        cancelled = true;
      };
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          observer.disconnect();
          void init();
        }
      },
      { rootMargin: '300px' }
    );
    observer.observe(el);

    return () => {
      cancelled = true;
      observer.disconnect();
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [t]);

  return (
    <div className="map">
      {/* Leaflet takes this element over once it loads. Until then — and
          forever, if it never does — the design's grid placeholder shows. */}
      <div
        ref={containerRef}
        className="map__canvas"
        role="img"
        aria-label={t('map_label')}
      />
      {status !== 'ready' && (
        <div className="map__placeholder" aria-hidden={status !== 'error'}>
          <span className="map__pin" />
          <span className="map__caption">
            {status === 'error' ? t('map_error') : status === 'loading' ? t('map_loading') : t('loc_venue')}
          </span>
        </div>
      )}
    </div>
  );
}
