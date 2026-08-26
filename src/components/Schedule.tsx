import {
  CEREMONY_START_ISO,
  RECEPTION_START_ISO,
  RSVP_CONTACTS,
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
          sitting in a footnote. The phone numbers follow immediately: a request
          with a deadline needs somewhere to send the reply. Here they are tel:
          links, which is the one thing the printed card cannot offer.

          Both of us are listed, one per line, and each number is named. A guest
          holding two bare numbers has to guess whose is whose; a guest who wants
          to reach the bride should not have to ring the groom to find out. The
          list is a real <ul>, so a screen reader announces "list, 2 items"
          instead of running two phone numbers together in one sentence.
        */}
        <div className="schedule__rsvp">
          <Rule />
          <p className="body-copy schedule__rsvp-text">{t('rsvp_note')}</p>
          <p className="schedule__rsvp-lead">{t('rsvp_phone_lead')}</p>
          <ul className="schedule__rsvp-contacts">
            {RSVP_CONTACTS.map((contact) => (
              <li key={contact.tel} className="schedule__rsvp-contact">
                <span className="schedule__rsvp-name">{t(contact.nameKey)}</span>
                <span className="schedule__rsvp-sep" aria-hidden="true">
                  ·
                </span>
                <a
                  className="schedule__rsvp-phone"
                  href={`tel:${contact.tel}`}
                  aria-label={`${t('rsvp_phone_label')} ${contact.display}`}
                >
                  {contact.display}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
