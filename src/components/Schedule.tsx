import { CEREMONY_START_ISO, RECEPTION_START_ISO, SCHEDULE } from '../content/wedding';
import type { StringKey } from '../content/strings';
import { useI18n } from '../i18n/useI18n';
import { useReveal } from '../hooks/useReveal';

const START_ISO = [CEREMONY_START_ISO, RECEPTION_START_ISO];

/**
 * The day's timeline. An ordered list, because the order of the two events is
 * the point — a screen reader should say "1 of 2", not read two loose blocks.
 */
export function Schedule() {
  const { t } = useI18n();
  const ref = useReveal();

  return (
    <section className="section" aria-labelledby="schedule-head">
      <div className="section__header schedule__header">
        <h2 className="h2" id="schedule-head">
          {t('schedule_head')}
        </h2>
        <p className="subtitle">{t('schedule_sub')}</p>
      </div>

      <div ref={ref}>
        <ol className="schedule__list">
          <span className="schedule__line" aria-hidden="true" />
          {SCHEDULE.map((entry, i) => (
            <li className="schedule__item" key={entry.time}>
              <span className="schedule__node" aria-hidden="true" />
              <time className="schedule__time" dateTime={START_ISO[i]}>
                {entry.time}
              </time>
              <p className="schedule__title">{t(entry.titleKey as StringKey)}</p>
              <p className="schedule__venue">{t(entry.venueKey as StringKey)}</p>
              <p className="schedule__note">{t(entry.noteKey as StringKey)}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
