import { WEDDING_DATE_ISO } from '../content/wedding';
import { useI18n } from '../i18n/useI18n';
import { Diamond } from './Decor';

export function Footer() {
  const { t } = useI18n();

  return (
    <footer className="footer">
      <Diamond />
      <p className="footer__names">{t('footer_names')}</p>
      <p className="footer__date">
        <time dateTime={WEDDING_DATE_ISO}>{t('footer_date')}</time>
      </p>
      <p className="footer__verse">{t('footer_verse')}</p>
    </footer>
  );
}
