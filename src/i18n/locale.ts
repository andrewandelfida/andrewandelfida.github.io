/* =============================================================================
   LOCALE RESOLUTION

   Language lives in a URL QUERY PARAM (?lang=uk|ro|en|de), not a path segment.

   Why: GitHub Pages serves static files with no server-side rewrites, so a
   path like /ro/ would 404 on refresh or deep-link unless we hand-maintain
   directories or an SPA 404 shim. A query param is immune to that, and it
   makes a chosen language shareable — someone can send "?lang=ro" to a
   Romanian-speaking relative and it just works, on any device, forever.

   localStorage is a secondary convenience only: it remembers a returning
   guest's choice, but the URL always wins when it names a language.
   ========================================================================== */

import { isLocale, type Locale } from '../content/types';
import { STRINGS } from '../content/strings';

export const DEFAULT_LOCALE: Locale = 'ro';
export const QUERY_KEY = 'lang';
const STORAGE_KEY = 'wed_lang';

/** localStorage throws in private mode / with cookies blocked. Never let that break the page. */
function safeGet(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* ignore — the URL is the real source of truth */
  }
}

/**
 * Priority: explicit ?lang → remembered choice → Romanian.
 *
 * Deliberately NOT sniffing navigator.language. The invitation's default
 * language is Romanian, and the URL behind the printed QR code has to behave
 * the same way on every phone that scans it — a guest handing their phone to
 * someone else should not get a different language because of an OS setting.
 * Guests who want another language pick it once, and the choice is then in
 * both the URL and localStorage.
 */
export function resolveInitialLocale(search?: string): Locale {
  // Runs during the build-time prerender too, where there is no window.
  // The prerendered HTML is always the default language.
  if (typeof window === 'undefined') return DEFAULT_LOCALE;

  const fromUrl = new URLSearchParams(search ?? window.location.search).get(QUERY_KEY);
  if (isLocale(fromUrl)) return fromUrl;

  const stored = safeGet(STORAGE_KEY);
  if (isLocale(stored)) return stored;

  return DEFAULT_LOCALE;
}

/** Read the locale currently named by the URL, if any (used on back/forward). */
export function localeFromUrl(search: string = window.location.search): Locale | null {
  const value = new URLSearchParams(search).get(QUERY_KEY);
  return isLocale(value) ? value : null;
}

/**
 * Write the locale into the URL without adding a history entry, so the Back
 * button still leaves the site rather than cycling through languages.
 */
export function writeLocaleToUrl(locale: Locale): void {
  const url = new URL(window.location.href);
  url.searchParams.set(QUERY_KEY, locale);
  window.history.replaceState(window.history.state, '', url);
}

export function rememberLocale(locale: Locale): void {
  safeSet(STORAGE_KEY, locale);
}

/**
 * Keep the document itself in the right language: <html lang> drives screen
 * reader pronunciation, hyphenation and font language features, and the title
 * and description are what a shared link previews as.
 */
export function applyLocaleToDocument(locale: Locale): void {
  const s = STRINGS[locale];
  document.documentElement.lang = locale;
  document.title = s.doc_title;

  const desc = document.querySelector('meta[name="description"]');
  if (desc) desc.setAttribute('content', s.meta_description);

  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute('content', s.doc_title);

  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc) ogDesc.setAttribute('content', s.meta_description);

  const ogLocale = document.querySelector('meta[property="og:locale"]');
  if (ogLocale) ogLocale.setAttribute('content', locale);
}
