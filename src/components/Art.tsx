import type { CSSProperties } from 'react';

export type ArtData = { attrs: Record<string, string>; inner: string };

const parseStyle = (style?: string) =>
  style
    ? (Object.fromEntries(
        style
          .split(';')
          .filter(Boolean)
          .map((rule) => {
            const at = rule.indexOf(':');
            const key = rule.slice(0, at).trim();
            const prop = key.startsWith('--') ? key : key.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
            return [prop, rule.slice(at + 1).trim()];
          }),
      ) as CSSProperties)
    : undefined;

// Renders a drawing from src/data/art.ts as inline SVG.
export function Art({ svg, className, label }: { svg: ArtData; className?: string; label?: string }) {
  const { attrs, inner } = svg;
  return (
    <svg
      viewBox={attrs.viewBox ?? attrs.viewbox}
      fill={attrs.fill}
      stroke={attrs.stroke}
      width={attrs.width}
      height={attrs.height}
      preserveAspectRatio={attrs.preserveAspectRatio ?? attrs.preserveaspectratio}
      className={[attrs.class, className].filter(Boolean).join(' ') || undefined}
      style={parseStyle(attrs.style)}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
      dangerouslySetInnerHTML={{ __html: inner }}
    />
  );
}
