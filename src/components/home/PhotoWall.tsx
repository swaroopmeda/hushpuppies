'use client';

import Link from 'next/link';
import type { CSSProperties } from 'react';
import { Polaroid } from '@/components/Polaroid';
import { PupBuddy } from '@/components/PupBuddy';
import { usePhotoViewer } from '@/components/PhotoViewer';
import type { Media } from '@/lib/data';

const SHOWN = 8;
const DELAYS = [330, 0, 550, 110, 660, 220, 770, 440];

export function PhotoWall({ photos }: { photos: Media[] }) {
  const { open, viewer } = usePhotoViewer(photos, 'Photo viewer');

  return (
    <>
      <div className="tp-photowall">
        <div className="tp-photowall__wall">
          <ul className="tp-photowall__prints" aria-label="Photos from TeddyPups families">
            {photos.slice(0, SHOWN).map((photo, i) => (
              <li key={photo.url} data-reveal="true" style={{ '--d': `${DELAYS[i]}ms` } as CSSProperties}>
                <button
                  type="button"
                  className="tp-photowall__print"
                  aria-label={`Open photo ${i + 1} of ${photos.length}${photo.caption ? `: ${photo.caption}` : ''}`}
                  onClick={() => open(i)}
                >
                  <Polaroid photo={photo} index={i} sizes="(min-width: 1024px) 18vw, (min-width: 640px) 28vw, 42vw" />
                </button>
              </li>
            ))}
          </ul>
          <div className="tp-facade__ground">
            <span aria-hidden="true" className="tp-facade__door" />
            <span aria-hidden="true" className="tp-lamp">
              <span className="tp-lamp__light" />
            </span>
            <Link className="btn btn-primary tp-facade__cta" href="/happy-families">
              See every happy family
            </Link>
            <PupBuddy stop className="tp-dusk__teddy" />
          </div>
        </div>
        <div aria-hidden="true" className="tp-street__pavement" />
      </div>
      {viewer}
    </>
  );
}
