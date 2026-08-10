import { useI18n } from './i18n/useI18n';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { Hero } from './components/Hero';
import { Verse } from './components/Verse';
import { Story } from './components/Story';
import { Gallery } from './components/Gallery';
import { Schedule } from './components/Schedule';
import { Location } from './components/Location';
import { Footer } from './components/Footer';

/**
 * One scrolling page.
 *
 * The design handoff describes nine sections; the RSVP block is deliberately
 * not built. Its only purpose was to host a reply form, and an olive
 * "confirm your attendance" panel with no way to reply — and no contact
 * details to fall back on — would be a dead end for guests. Re-adding it means
 * restoring a <Rsvp /> section here and its styles in sections.css.
 *
 * Landmark structure: banner (the language bar) → main (everything the guest
 * came for) → contentinfo (the footer). Headings run h1 → h2 → h3 with no
 * levels skipped, so the page can be navigated entirely by heading.
 */
export default function App() {
  const { t } = useI18n();

  return (
    <>
      <a className="skip-link" href="#main">
        {t('skip_link')}
      </a>

      {/*
        The sticky positioning lives on <header>, not on the bar inside it.
        A sticky element can only travel within its parent's content box, and a
        <header> that contains nothing but the bar is exactly the bar's height —
        so it had no room to move and scrolled away on the first swipe.
      */}
      <header className="site-header">
        <LanguageSwitcher />
      </header>

      <main id="main">
        <Hero />
        <Verse />
        <Story />
        <Gallery />
        <Schedule />
        <Location />
      </main>

      <Footer />
    </>
  );
}
