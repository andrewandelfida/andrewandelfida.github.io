import { useEffect, useLayoutEffect, useRef } from 'react';

/**
 * useLayoutEffect has no meaning during the build-time prerender and React
 * warns about it, so fall back to useEffect there. On the client — the only
 * place this hook does anything — it stays a layout effect, which is what
 * prevents a flash of content appearing before it animates in.
 */
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/**
 * Reveal-on-scroll, implemented so it can never hide content permanently.
 *
 * The element renders VISIBLE. Only after JavaScript has run, confirmed
 * IntersectionObserver exists and confirmed the guest has not asked for
 * reduced motion do we add the class that hides it — and at that point we are
 * certain we can also remove it again. A guest with JS disabled, on an old
 * browser, or hitting a script error sees the whole invitation.
 *
 * useLayoutEffect runs before the browser paints, so there is no flash of the
 * content appearing, hiding, then animating back in.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduced || !('IntersectionObserver' in window)) return;

    el.classList.add('reveal');

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );

    observer.observe(el);
    observerRef.current = observer;

    return () => {
      observer.disconnect();
      observerRef.current = null;
      // If this ever unmounts mid-animation, leave the element visible.
      el.classList.remove('reveal');
    };
  }, []);

  // Safety net: if something goes wrong and an element is still hidden after
  // the page has settled, show it. Content is never worth losing to an effect.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const timer = window.setTimeout(() => {
      if (el.classList.contains('reveal') && !el.classList.contains('is-visible')) {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight) el.classList.add('is-visible');
      }
    }, 3000);
    return () => window.clearTimeout(timer);
  }, []);

  return ref;
}
