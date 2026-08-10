import { INFO_CARDS } from '../content/wedding';
import type { StringKey } from '../content/strings';
import { useI18n } from '../i18n/useI18n';
import { useReveal } from '../hooks/useReveal';
import { Diamond } from './Decor';

export function Info() {
  const { t } = useI18n();
  const ref = useReveal();

  return (
    <section className="section" aria-labelledby="info-head">
      <div className="info__header">
        <h2 className="h2" id="info-head">
          {t('info_head')}
        </h2>
      </div>

      <div ref={ref}>
        <ul className="info__cards">
          {INFO_CARDS.map((card) => (
            <li className="info__card" key={card.titleKey}>
              <Diamond />
              <h3 className="info__title">{t(card.titleKey as StringKey)}</h3>
              <p className="info__body">{t(card.bodyKey as StringKey)}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
