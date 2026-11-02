'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { Media } from '@/lib/data';

// Full-screen gallery built on <dialog>, so focus trapping and Escape come for free.
export function usePhotoViewer(photos: Media[], label: string) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [at, setAt] = useState<number | null>(null);
  const count = photos.length;
  const go = useCallback((i: number) => setAt(((i % count) + count) % count), [count]);

  useEffect(() => {
    if (at === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(at + 1);
      if (e.key === 'ArrowLeft') go(at - 1);
    };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, [at, go]);

  const open = (i: number) => {
    setAt(i);
    dialog.current?.showModal();
  };

  const photo = at === null ? null : photos[at];

  const viewer = (
    <dialog
      ref={dialog}
      aria-label={label}
      className="m-0 h-dvh max-h-none w-screen max-w-none bg-cocoa/95 p-0 text-milk backdrop:bg-cocoa/70"
      onClose={() => setAt(null)}
      onClick={(e) => e.target === dialog.current && dialog.current?.close()}
      data-lenis-prevent="true"
    >
      {photo && at !== null && (
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between gutter pt-4">
            <span className="text-sm font-semibold text-milk/80">
              {at + 1} / {count}
            </span>
            <button type="button" onClick={() => dialog.current?.close()} className="h-11 rounded-full bg-milk px-5 font-semibold text-cocoa">
              Close
            </button>
          </div>
          <div className="relative min-h-0 flex-1 gutter py-4">
            <div className="relative size-full">
              {photo.kind === 'video' ? (
                <video key={photo.url} src={photo.url} poster={photo.poster?.url} controls autoPlay muted playsInline className="mx-auto size-full object-contain" />
              ) : (
                <Image key={photo.url} src={photo.url} alt={photo.alt} fill sizes="100vw" className="object-contain" />
              )}
            </div>
          </div>
          {photo.caption && <p className="font-scrawl pb-2 text-center text-lg">{photo.caption}</p>}
          {count > 1 && (
            <div className="flex justify-center gap-3 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
              <button type="button" onClick={() => go(at - 1)} aria-label="Previous photo" className="grid size-12 place-items-center rounded-full bg-milk text-xl font-bold text-cocoa">
                ‹
              </button>
              <button type="button" onClick={() => go(at + 1)} aria-label="Next photo" className="grid size-12 place-items-center rounded-full bg-milk text-xl font-bold text-cocoa">
                ›
              </button>
            </div>
          )}
        </div>
      )}
    </dialog>
  );

  return { open, viewer };
}
