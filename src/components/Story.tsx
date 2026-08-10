import { useI18n } from '../i18n/useI18n';
import { useReveal } from '../hooks/useReveal';
import { Rule } from './Decor';

export function Story() {
  const { t } = useI18n();
  const ref = useReveal();

  return (
    <section className="section" aria-labelledby="story-head">
      <div ref={ref} className="story">
        <p className="kicker">{t('story_kicker')}</p>
        <h2 className="h2 story__head" id="story-head">
          {t('story_head')}
        </h2>
        <Rule className="story__rule" />
        <p className="body-copy">{t('story_body')}</p>
      </div>
    </section>
  );
}
