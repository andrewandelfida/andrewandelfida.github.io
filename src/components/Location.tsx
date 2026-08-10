import { MAP_LINKS, VENUE } from '../content/wedding';
import { useI18n } from '../i18n/useI18n';
import { useReveal } from '../hooks/useReveal';
import { useCopy } from '../hooks/useCopy';
import { MapEmbed } from './MapEmbed';

/**
 * Getting there.
 *
 * Stănești is a small village, and both Google's and OpenStreetMap's address
 * data for it is thin — searching the address string is not reliable. Guests
 * will be driving in with patchy signal. So this section is built around the
 * COORDINATES as the authoritative identifier, and around being readable
 * before anyone arrives:
 *
 *   · Venue, full address and the raw coordinates are always-visible, real,
 *     selectable text — never trapped inside the map widget.
 *   · The coordinate pair is `user-select: all`, so one tap selects it whole.
 *   · A one-tap copy button, for pasting into whatever app the guest prefers.
 *   · Every directions link targets lat/lng, not a place-name search.
 *   · All of the above is plain HTML in the prerendered page. With JavaScript
 *     off, or the map failing, or Leaflet's CDN-free chunk never arriving,
 *     this section still tells a guest exactly where to drive.
 */
export function Location() {
  const { t } = useI18n();
  const ref = useReveal();
  const { copied, copy } = useCopy();

  return (
    <section className="section section--wash" aria-labelledby="loc-head">
      <div className="location__inner">
        <div className="location__header">
          <h2 className="h2" id="loc-head">
            {t('loc_head')}
          </h2>
        </div>

        <div ref={ref} className="location__cols">
          <MapEmbed />

          <div className="location__details">
            <p className="location__venue">{t('loc_venue')}</p>

            {/* A real postal address, in the reading order a driver expects. */}
            <address className="location__address">
              {t('loc_addr1')}
              <br />
              {t('loc_addr2')}
            </address>

            <div className="coords">
              <span className="coords__label" id="coords-label">
                {t('loc_coords_label')}
              </span>
              <p className="coords__value" aria-labelledby="coords-label">
                {VENUE.coords}
              </p>
            </div>

            <div className="location__actions">
              <a
                className="btn btn--solid"
                href={MAP_LINKS.googleDirections}
                target="_blank"
                rel="noopener"
              >
                {t('loc_dir_btn')}
              </a>
              <button
                type="button"
                className="btn btn--outline"
                onClick={() => void copy(VENUE.coords)}
              >
                {copied ? t('loc_copy_done') : t('loc_copy_btn')}
              </button>
            </div>

            <div className="location__links">
              <a
                className="location__link"
                href={MAP_LINKS.googlePlace}
                target="_blank"
                rel="noopener"
              >
                {t('loc_maps_btn')}
              </a>
              <a className="location__link" href={MAP_LINKS.waze} target="_blank" rel="noopener">
                {t('loc_waze_btn')}
              </a>
            </div>

            <p className="location__note">{t('loc_signal_note')}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
