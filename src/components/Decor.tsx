/**
 * The two decorative motifs that recur through the design: a terracotta
 * diamond (a square rotated 45°) and a hairline–diamond–hairline rule.
 *
 * Both are purely ornamental, so they are hidden from assistive technology —
 * a screen reader announcing "image, diamond" between every section would be
 * noise, not information.
 */

export function Diamond({ className = '' }: { className?: string }) {
  return <span className={`diamond ${className}`} aria-hidden="true" />;
}

export function Rule({ className = '' }: { className?: string }) {
  return (
    <div className={`rule ${className}`} aria-hidden="true">
      <span className="rule__line" />
      <Diamond />
      <span className="rule__line" />
    </div>
  );
}
