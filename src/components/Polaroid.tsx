import type { CSSProperties } from 'react';
import { Photo } from '@/components/Photo';
import type { Media } from '@/lib/data';

const TILTS = [-2.2, 1.6, -0.9, 2.4, -1.5, 0.8, -2.6, 1.2];
const TAPES = ['#f6d79a', '#f9cdbf', '#cfe5f6', '#f6d79a', '#e9dcc4'];
const TAPE_SPOTS = [['center'], ['left'], ['right'], ['tl', 'tr'], ['center'], ['right'], ['left'], ['center']];

export function Polaroid({ photo, index, sizes }: { photo: Media; index: number; sizes: string }) {
  const n = index % TILTS.length;
  return (
    <span className="tp-polaroid" style={{ '--tilt': `${TILTS[n]}deg`, '--tape': TAPES[index % TAPES.length], '--i': index } as CSSProperties}>
      {TAPE_SPOTS[n].map((spot) => (
        <span key={spot} aria-hidden="true" className={`tp-tape tp-tape--${spot}`} />
      ))}
      <span className="tp-polaroid__photo">
        <Photo media={photo} sizes={sizes} intrinsic />
      </span>
      <span className="tp-polaroid__caption font-scrawl">{photo.caption}</span>
    </span>
  );
}
