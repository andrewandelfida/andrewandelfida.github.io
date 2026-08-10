import { HERO_IMAGE, WEDDING_DATE_ISO } from '../content/wedding';
import { useI18n } from '../i18n/useI18n';
import { useReveal } from '../hooks/useReveal';
import { Diamond } from './Decor';
import { Photo } from './Photo';

/**
 * The hero: doves, names, the invitation line, the couple's portrait, the date.
 *
 * A <section> rather than a <header>: the sticky language bar is already the
 * page's banner landmark, and a second one would leave a screen reader user
 * with two "banner" regions and no way to tell them apart. The <h1> holding
 * the two names is what labels this section.
 */
export function Hero() {
  const { t } = useI18n();
  const dovesRef = useReveal<HTMLImageElement>();
  const portraitRef = useReveal();
  const ruleRef = useReveal();

  return (
    <section className="hero" aria-labelledby="hero-names">
      <img
        ref={dovesRef}
        className="hero__doves"
        // Line art, so an indexed PNG beats WebP/AVIF here by a wide margin
        // (9.7 KB vs 30.6 KB at the same size). Three widths cover 1× through
        // 3× displays without shipping a 440px file to a phone showing it at 96px.
        src="/doves-olive-300.png"
        srcSet="/doves-olive-200.png 200w, /doves-olive-300.png 300w, /doves-olive-440.png 440w"
        sizes="(max-width: 640px) 96px, (max-width: 1000px) 15vw, 150px"
        // Purely ornamental: the couple's names follow immediately in text.
        alt=""
        aria-hidden="true"
        width={440}
        height={293}
        // Above the fold and tiny — fetch it with the document, not lazily.
        // React 18 drops the camelCase prop, so use the real DOM attribute.
        {...{ fetchpriority: 'high' }}
      />

      <p className="hero__eyebrow">{t('eyebrow_families')}</p>

      <h1 className="hero__names" id="hero-names">
        <span className="hero__name">{t('name_groom')}</span>
        <span className="hero__connector">{t('connector')}</span>
        <span className="hero__name">{t('name_bride')}</span>
      </h1>

      <p className="hero__invite">{t('hero_invite')}</p>

      <div ref={portraitRef} className="hero__portrait">
        <Photo
          image={HERO_IMAGE}
          className="photo--arch"
          fixedRatio
          placeholderLabel="couple portrait · 4:5"
          // The arch is 220px wide until the viewport reaches 500px, then 44vw,
          // capping at 360px from 818px up.
          sizes="(max-width: 500px) 220px, (max-width: 818px) 44vw, 360px"
        />
      </div>

      <div ref={ruleRef} className="rule rule--hero hero__rule" aria-hidden="true">
        <span className="rule__line" />
        <Diamond />
        <span className="rule__line" />
      </div>

      <p className="hero__date">
        {/* A machine-readable date alongside the localised display string, so
            the wedding day is unambiguous to browsers and crawlers. */}
        <time className="hero__date-text" dateTime={WEDDING_DATE_ISO}>
          {t('date_full')}
        </time>
        <Diamond />
        <span className="hero__date-time">{t('time_lead')}</span>
      </p>

      <div className="hero__scroll" aria-hidden="true">
        <span className="hero__scroll-label">{t('scroll_hint')}</span>
        <span className="hero__scroll-line" />
      </div>
    </section>
  );
}
