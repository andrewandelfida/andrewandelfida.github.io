import {
  CEREMONY_START_ISO,
  RECEPTION_START_ISO,
  RSVP_PHONE,
  SCHEDULE,
} from '../content/wedding';
import type { StringKey } from '../content/strings';
import { useI18n } from '../i18n/useI18n';
import { useReveal } from '../hooks/useReveal';
import { Rule } from './Decor';

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

        {/*
          The one thing on the printed card that asks the guest to act, and the
          one with a deadline — so it closes the day's programme rather than
          sitting in a footnote. The phone number follows immediately: a request
          with a deadline needs somewhere to send the reply. Here it is a tel:
          link, which is the one thing the printed card cannot offer.
        */}
        <div className="schedule__rsvp">
          <Rule />
          <p className="body-copy schedule__rsvp-text">{t('rsvp_note')}</p>
          <p className="schedule__rsvp-contact">
            <span className="schedule__rsvp-lead">{t('rsvp_phone_lead')}</span>{' '}
            <a
              className="schedule__rsvp-phone"
              href={`tel:${RSVP_PHONE.tel}`}
              aria-label={`${t('rsvp_phone_label')} ${RSVP_PHONE.display}`}
            >
              {RSVP_PHONE.display}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
