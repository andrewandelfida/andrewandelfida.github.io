import { useI18n } from '../i18n/useI18n';
import { useReveal } from '../hooks/useReveal';

/**
 * The solid terracotta band — the signature block of this design variant.
 *
 * Marked up as a <figure>/<blockquote>/<figcaption> so the reference is
 * properly associated with the quotation rather than floating above it.
 */
export function Verse() {
  const { t } = useI18n();
  const ref = useReveal();

  return (
    <section className="section section--verse" aria-labelledby="verse-ref">
      <figure ref={ref} className="verse__inner">
        <figcaption className="verse__ref-row">
          <span className="verse__ref-line" aria-hidden="true" />
          <span className="verse__ref" id="verse-ref">
            {t('verse_ref')}
          </span>
          <span className="verse__ref-line" aria-hidden="true" />
        </figcaption>
        <blockquote className="verse__quote">{t('verse_text')}</blockquote>
      </figure>
    </section>
  );
}
