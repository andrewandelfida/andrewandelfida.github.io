import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App';
import { I18nProvider } from './i18n/useI18n';
import { DEFAULT_LOCALE, resolveInitialLocale } from './i18n/locale';
import './styles/index.css';

const container = document.getElementById('root');
if (!container) throw new Error('#root is missing from index.html');

const tree = (
  <StrictMode>
    <I18nProvider>
      <App />
    </I18nProvider>
  </StrictMode>
);

/**
 * The page is prerendered in Ukrainian at build time (see scripts/prerender.mjs),
 * so a guest sees the full invitation before any JavaScript runs.
 *
 * If this visit is also Ukrainian we hydrate that markup — cheap, and no
 * flicker. If the guest asked for Romanian or English, the prerendered text is
 * the wrong language, so we render fresh rather than hydrate: a hydration
 * mismatch across every string on the page would be slower AND noisier than
 * simply rendering once.
 */
if (resolveInitialLocale() === DEFAULT_LOCALE && container.hasChildNodes()) {
  hydrateRoot(container, tree);
} else {
  createRoot(container).render(tree);
}
