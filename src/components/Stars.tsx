import type { CSSProperties } from 'react';
import { twinkle } from '@/data/art';
import starsJson from '@/data/stars.json';

const parse = (style: string) =>
  Object.fromEntries(
    style
      .split(';')
      .filter(Boolean)
      .map((rule) => {
        const at = rule.indexOf(':');
        const key = rule.slice(0, at);
        return [key.startsWith('--') ? key : key.replace(/-([a-z])/g, (_, c) => c.toUpperCase()), rule.slice(at + 1)];
      }),
  ) as CSSProperties;

// Twinkling night sky shared by the FAQ section and the footer.
export function Stars() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      {(starsJson as { className: string; style: string }[]).map((star, i) => (
        <svg
          key={i}
          viewBox={(twinkle.attrs as Record<string, string>).viewBox ?? (twinkle.attrs as Record<string, string>).viewbox}
          className={star.className}
          style={parse(star.style)}
          dangerouslySetInnerHTML={{ __html: twinkle.inner }}
        />
      ))}
    </div>
  );
}
