import Link from 'next/link';
import type { CSSProperties } from 'react';
import { Photo } from '@/components/Photo';
import { pawNav } from '@/data/art';
import type { PuppyCardData } from '@/lib/data';
import { maskUrl, sketchFor, type Doodle } from '@/lib/sketch';

const STATUS: Record<string, string> = { available: 'Available', reserved: 'Reserved', rehomed: 'Gone home' };
const SIZES = '(min-width: 1536px) 17rem, (min-width: 1024px) 22vw, (min-width: 640px) 30vw, 46vw';
const PAW = pawNav.inner.match(/ d="([^"]+)"/)?.[1] ?? '';

function DoodleMark({ d }: { d: Doodle }) {
  const line = { fill: 'none', stroke: d.ink, strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;
  return (
    <g transform={`translate(${d.x.toFixed(2)} ${d.y.toFixed(2)}) rotate(${d.rot.toFixed(1)}) scale(${d.size.toFixed(2)})`}>
      <g className="tp-sketch__doodle">
        {d.kind === 'sparkle' && <path d="M0 -6c.6 3.6 2.4 5.4 6 6-3.6.6-5.4 2.4-6 6-.6-3.6-2.4-5.4-6-6 3.6-.6 5.4-2.4 6-6z" fill={d.ink} />}
        {d.kind === 'heart' && <path d="M0 5C-4.6 1.8-6.4-.8-6.4-3.2c0-1.9 1.5-3.3 3.3-3.3 1.3 0 2.4.7 3.1 1.9.7-1.2 1.8-1.9 3.1-1.9 1.8 0 3.3 1.4 3.3 3.3C6.4-.8 4.6 1.8 0 5z" {...line} />}
        {d.kind === 'dashes' && <path d="M-5 -5l4 2M-6 0h5M-5 5l4 -2" {...line} />}
        {d.kind === 'swirl' && <path d="M0 0c1.6-.6 2.4 1.4.8 2.6-2 1.4-4.6-.4-4-3 .7-3 4.8-3.8 6.8-1.2 2.4 3-0.2 7.4-3.8 7.2" {...line} />}
        {d.kind === 'dots' && (
          <g fill={d.ink}>
            <circle cx="-4" cy="1" r="1.2" />
            <circle cx="0" cy="-2" r="1.2" />
            <circle cx="4" cy="1" r="1.2" />
          </g>
        )}
        {d.kind === 'paw' && <path d={PAW} transform="scale(.17) translate(-32 -34)" fill={d.ink} opacity={0.85} />}
      </g>
    </g>
  );
}

type PuppySketchProps = { pup: PuppyCardData; index?: number; small?: boolean; eager?: boolean };

export function PuppySketch({ pup, index = 0, small, eager }: PuppySketchProps) {
  const sketch = sketchFor(pup.slug);
  const mask = maskUrl(sketch.mask);
  const status = STATUS[pup.status] ?? 'Available';
  return (
    <Link
      href={`/puppies/${pup.slug}`}
      className={`tp-sketch${small ? ' tp-sketch--small' : ''}`}
      data-reveal="true"
      style={{ '--tilt': `${sketch.tilt.toFixed(2)}deg`, '--d': `${(index % 8) * 70}ms`, '--wash': sketch.wash.color } as CSSProperties}
      aria-label={`${pup.displayName}${pup.name ? `, ${pup.breed}` : ''}, ${pup.genderLabel.toLowerCase()}${pup.age ? `, ${pup.age}` : ''}, ${status.toLowerCase()}`}
    >
      <span className="tp-sketch__frame">
        <svg aria-hidden="true" viewBox="0 0 100 100" className="tp-sketch__wash" style={{ translate: `${sketch.wash.dx.toFixed(1)}% ${sketch.wash.dy.toFixed(1)}%` }}>
          <path d={sketch.wash.d} />
        </svg>
        <span className="tp-sketch__photo" style={{ maskImage: mask, WebkitMaskImage: mask }}>
          <Photo media={pup.cover} sizes={SIZES} alt="" eager={eager} />
        </span>
        <svg aria-hidden="true" viewBox="0 0 100 100" className="tp-sketch__ink">
          <path d={sketch.outline} pathLength={1} className="tp-sketch__line" />
          <path d={sketch.retrace} pathLength={1} className="tp-sketch__line tp-sketch__line--retrace" />
          {sketch.doodles.map((d, i) => (
            <DoodleMark key={i} d={d} />
          ))}
        </svg>
        {!small && <span className="tp-sketch__sticker font-scrawl">{status}</span>}
        {pup.hasVideo && !small && <span className="tp-sketch__video">▶ video</span>}
        {small && <span className="tp-sketch__sticker tp-sketch__sticker--home font-scrawl">gone home ♥</span>}
      </span>
      <span className="tp-sketch__name font-plush">{pup.displayName}</span>
      {!small && (
        <span className="tp-sketch__meta">
          {pup.name ? `${pup.breed} · ` : ''}
          {pup.genderLabel.toLowerCase()}
          {pup.age ? ` · ${pup.age}` : ''}
        </span>
      )}
    </Link>
  );
}
