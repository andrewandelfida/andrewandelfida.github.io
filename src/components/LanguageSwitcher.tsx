import { LOCALES } from '../content/types';
import { STRINGS } from '../content/strings';
import { useI18n } from '../i18n/useI18n';

/**
 * The sticky language switcher.
 *
 * Each button is labelled in its OWN language ("Українська", "Română",
 * "English", "Deutsch") for screen readers, with `lang` set accordingly, so the
 * label is pronounced correctly rather than read as if it were the current
 * language.
 */
export function LanguageSwitcher() {
  const { locale, setLocale, t } = useI18n();

  return (
    <div className="langbar">
      <div className="langbar__group" role="group" aria-label={t('lang_switch_label')}>
        {LOCALES.map((code, i) => (
          <span key={code} style={{ display: 'contents' }}>
            {i > 0 && <span className="langbar__divider" aria-hidden="true" />}
            <button
              type="button"
              className="langbar__btn"
              lang={code}
              aria-pressed={code === locale}
              aria-label={STRINGS[code].langName}
              onClick={() => setLocale(code)}
            >
              {STRINGS[code].langShort}
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}
