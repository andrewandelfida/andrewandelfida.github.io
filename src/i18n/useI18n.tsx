import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { STRINGS, type StringKey } from '../content/strings';
import type { Locale, Localized } from '../content/types';
import {
  applyLocaleToDocument,
  localeFromUrl,
  rememberLocale,
  resolveInitialLocale,
  writeLocaleToUrl,
} from './locale';

interface I18nValue {
  locale: Locale;
  setLocale: (next: Locale) => void;
  /** Look up a string in the active language. */
  t: (key: StringKey) => string;
  /** Pick the active language out of a {uk, ro, en} object — e.g. image alt text. */
  pick: <T>(value: Localized<T>) => T;
}

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => resolveInitialLocale());

  // Reflect the initial choice into the URL straight away, so the address bar
  // is always shareable — even for a guest who arrived at the bare domain.
  useEffect(() => {
    applyLocaleToDocument(locale);
    writeLocaleToUrl(locale);
    rememberLocale(locale);
  }, [locale]);

  // Honour Back/Forward, and any other navigation that rewrites the query.
  useEffect(() => {
    const onPopState = () => {
      const fromUrl = localeFromUrl();
      if (fromUrl) setLocaleState(fromUrl);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const setLocale = useCallback((next: Locale) => setLocaleState(next), []);

  const value = useMemo<I18nValue>(() => {
    const strings = STRINGS[locale];
    return {
      locale,
      setLocale,
      t: (key) => strings[key],
      pick: (localized) => localized[locale],
    };
  }, [locale, setLocale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used inside <I18nProvider>');
  return ctx;
}
