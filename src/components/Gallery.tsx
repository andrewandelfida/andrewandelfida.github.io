import { GALLERY_IMAGES } from '../content/wedding';
import { useI18n } from '../i18n/useI18n';
import { useReveal } from '../hooks/useReveal';
import { Photo } from './Photo';

/**
 * The gallery is a CSS multi-column masonry, exactly as the design specifies.
 *
 * Columns (rather than grid) mean tiles of any proportion pack together without
 * anyone having to declare a row span — so the couple can drop in a mix of
 * portrait and landscape photographs and it simply works.
 */
export function Gallery() {
  const { t } = useI18n();
  const ref = useReveal();

  return (
    <section className="section section--wash" aria-labelledby="gallery-head">
      <div className="section__header">
        <h2 className="h2 gallery__head" id="gallery-head">
          {t('gallery_head')}
        </h2>
        <p className="subtitle">{t('gallery_sub')}</p>
      </div>

      <div ref={ref} className="gallery__grid">
        {GALLERY_IMAGES.map((image) => (
          <div className="gallery__item" key={image.src}>
            <Photo
              image={image}
              // Columns are clamp(150px, 23vw, 230px): roughly half the viewport
              // on a phone, 23vw through tablet, then fixed at 230px.
              sizes="(max-width: 652px) 46vw, (max-width: 1000px) 23vw, 230px"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
