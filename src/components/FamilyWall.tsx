'use client';

import type { CSSProperties } from 'react';
import { Art } from '@/components/Art';
import { Polaroid } from '@/components/Polaroid';
import { usePhotoViewer } from '@/components/PhotoViewer';
import { wallPaw } from '@/data/art';
import type { Media } from '@/lib/data';

export function FamilyWall({ photos }: { photos: Media[] }) {
  const { open, viewer } = usePhotoViewer(photos, 'Photo viewer');
  return (
    <div>
      <ul className="tp-wall" aria-label="Photos from TeddyPups families">
        {photos.map((photo, i) => (
          <li key={photo.url} className="tp-wall__item" data-reveal="true" style={{ '--d': `${(i % 4) * 60}ms` } as CSSProperties}>
            <button type="button" className="tp-wall__print" aria-label={`Open photo ${i + 1} of ${photos.length}`} onClick={() => open(i)}>
              <Polaroid photo={photo} index={i} sizes="(min-width: 1024px) 24vw, (min-width: 640px) 32vw, 46vw" />
              <Art svg={wallPaw} />
            </button>
          </li>
        ))}
      </ul>
      {viewer}
    </div>
  );
}
