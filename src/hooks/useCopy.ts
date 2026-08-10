import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Copy-to-clipboard with a "Copied ✓" confirmation that resets itself.
 *
 * `navigator.clipboard` needs a secure context and is missing on some older
 * in-app browsers, so there is a `document.execCommand` fallback. If both
 * fail we report failure rather than showing a tick that lied — a guest who
 * thinks they have the coordinates but does not is worse off than one who
 * knows to select the text by hand.
 */
export function useCopy(resetAfterMs = 1800) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = useCallback(
    async (text: string): Promise<boolean> => {
      let ok = false;

      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(text);
          ok = true;
        }
      } catch {
        ok = false;
      }

      if (!ok) {
        // Legacy path: a temporary off-screen textarea plus execCommand.
        try {
          const el = document.createElement('textarea');
          el.value = text;
          el.setAttribute('readonly', '');
          el.style.position = 'absolute';
          el.style.left = '-9999px';
          document.body.appendChild(el);
          el.select();
          ok = document.execCommand('copy');
          document.body.removeChild(el);
        } catch {
          ok = false;
        }
      }

      if (ok) {
        setCopied(true);
        window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => setCopied(false), resetAfterMs);
      }
      return ok;
    },
    [resetAfterMs]
  );

  return { copied, copy };
}
