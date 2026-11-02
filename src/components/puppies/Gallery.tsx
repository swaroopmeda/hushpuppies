'use client';

import { useState } from 'react';
import { Photo } from '@/components/Photo';
import { usePhotoViewer } from '@/components/PhotoViewer';
import type { Media } from '@/lib/data';

export function Gallery({ name, media }: { name: string; media: Media[] }) {
  const [at, setAt] = useState(0);
  const { open, viewer } = usePhotoViewer(media, `${name} photos`);
  const count = media.length;
  const current = media[at];
  const still = current.kind === 'video' ? current.poster ?? current : current;
  const step = (by: number) => setAt((at + by + count) % count);

  return (
    <div>
      <div className="tp-storypage relative aspect-[4/5] md:aspect-[5/6]">
        <button type="button" className="absolute inset-0 block size-full" aria-label={`Open ${name}, photo ${at + 1} of ${count} full screen`} onClick={() => open(at)}>
          <Photo media={still} sizes="(min-width: 1024px) 55vw, 100vw" priority={at === 0} alt={current.alt} />
          {current.kind === 'video' && <span className="absolute inset-0 grid place-items-center text-5xl text-milk drop-shadow">▶</span>}
        </button>
        {count > 1 && (
          <div className="absolute inset-x-4 bottom-4 flex justify-between">
            <button type="button" onClick={() => step(-1)} className="grid size-12 place-items-center rounded-full border-2 border-cocoa bg-milk/95 text-xl font-bold" aria-label="Previous photo">
              ‹
            </button>
            <span className="self-center rounded-full bg-cocoa/80 px-3 py-1 text-sm font-semibold text-milk">
              {at + 1} / {count}
            </span>
            <button type="button" onClick={() => step(1)} className="grid size-12 place-items-center rounded-full border-2 border-cocoa bg-milk/95 text-xl font-bold" aria-label="Next photo">
              ›
            </button>
          </div>
        )}
      </div>
      {count > 1 && (
        <ul className="mt-3 flex gap-3 overflow-x-auto px-1 pb-2 pt-2 [scrollbar-width:thin]" aria-label={`All photos of ${name}`}>
          {media.map((item, i) => (
            <li key={item.url} className="shrink-0">
              <button
                type="button"
                onClick={() => setAt(i)}
                aria-label={`${name}, ${item.kind === 'video' ? 'video' : 'photo'} ${i + 1} of ${count}`}
                aria-current={i === at}
                className={`relative block h-24 w-20 overflow-hidden rounded-[0.9rem] border-[3px] transition-transform duration-300 md:h-28 md:w-24 ${
                  i === at ? '-rotate-3 -translate-y-1 border-toffee-deep' : 'border-cocoa/30 hover:-rotate-2 hover:border-cocoa'
                }`}
              >
                <Photo media={item.kind === 'video' ? item.poster ?? item : item} sizes="6rem" alt="" />
                {item.kind === 'video' && <span className="absolute inset-0 grid place-items-center bg-cocoa/30 text-lg text-milk">▶</span>}
              </button>
            </li>
          ))}
        </ul>
      )}
      {viewer}
    </div>
  );
}
