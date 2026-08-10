import { renderToString } from 'react-dom/server';
import App from './App';
import { I18nProvider } from './i18n/useI18n';
import { STRINGS } from './content/strings';
import { DEFAULT_LOCALE } from './i18n/locale';

/**
 * Build-time render. Produces the static HTML that ships in dist/index.html,
 * so the invitation is readable with JavaScript disabled, on a failed script
 * load, and on the very first paint over a slow rural connection.
 *
 * Rendered in the default language (Ukrainian); the client swaps language on
 * demand from the ?lang query parameter.
 */
export function render(): { html: string; title: string; description: string } {
  const html = renderToString(
    <I18nProvider>
      <App />
    </I18nProvider>
  );

  const s = STRINGS[DEFAULT_LOCALE];
  return { html, title: s.doc_title, description: s.meta_description };
}
