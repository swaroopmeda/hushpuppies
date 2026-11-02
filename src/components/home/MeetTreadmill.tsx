'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { Art } from '@/components/Art';
import * as art from '@/data/art';
import { Photo } from '@/components/Photo';
import { PupBuddy } from '@/components/PupBuddy';
import type { PuppyCardData } from '@/lib/data';
import { prefersReducedMotion } from '@/lib/motion';

const DOOR_COLOURS = ['#a24a1a', '#5a3a28', '#d4893f', '#b8644a', '#7a4a2e'];
const OPEN_LINE = 0.36;

const metaFor = (p: PuppyCardData) =>
  [p.name ? p.breed : '', p.genderLabel.toLowerCase(), p.age, p.hasVideo ? 'with video' : ''].filter(Boolean).join(', ');

// On wide screens the hall pins and vertical scroll walks past a row of doors.
export function MeetTreadmill({ puppies }: { puppies: PuppyCardData[] }) {
  const [pinned, setPinned] = useState(false);
  const [distance, setDistance] = useState(0);
  const range = useRef<HTMLDivElement>(null);
  const hall = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const media = matchMedia('(min-width: 1024px)');
    const update = () => setPinned(media.matches && !prefersReducedMotion());
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (!pinned) return;
    const measure = () => setDistance(Math.max(0, track.current!.scrollWidth - innerWidth));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track.current!);
    addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      removeEventListener('resize', measure);
    };
  }, [pinned]);

  useEffect(() => {
    const list = track.current!;
    if (!pinned) {
      list.style.transform = '';
      return;
    }
    let frame = 0;
    let x = 0;
    const tick = () => {
      frame = requestAnimationFrame(tick);
      const box = range.current!.getBoundingClientRect();
      const span = Math.max(1, box.height - innerHeight);
      const target = -Math.min(1, Math.max(0, -box.top / span)) * distance;
      x += (target - x) * 0.18;
      list.style.transform = `translate3d(${x.toFixed(1)}px, 0, 0)`;
      hall.current?.style.setProperty('--floor-x', `${x.toFixed(1)}px`);
      const line = OPEN_LINE * innerWidth;
      for (const door of list.children as HTMLCollectionOf<HTMLElement>) {
        const open = door.offsetLeft + x < line;
        if (door.dataset.open !== String(open)) door.dataset.open = String(open);
      }
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [pinned, distance]);

  return (
    <section
      data-pup-scene="true"
      data-tone="light"
      data-pinned={pinned || undefined}
      className="tp-scene tp-meet"
      style={{ '--sky-top': '#fff1d8', '--sky-bottom': '#fbe3b4' } as CSSProperties}
      aria-labelledby="meet-title"
    >
      <div
        ref={range}
        data-pin-range="true"
        style={{ height: pinned ? `calc(100vh + ${Math.round(distance * 0.8)}px)` : undefined, '--pinned': pinned ? 1 : 0 } as CSSProperties}
      >
        <div className="tp-meet__stage">
          <header className="tp-meet__head gutter">
            <div>
              <h2 id="meet-title" className="font-plush text-huge">
                Meet the pups
              </h2>
              <p className="text-lede mt-3 max-w-[44ch] text-[var(--ink-soft)]">Real puppies, real photos, looking for their families right now.</p>
            </div>
            <Link className="btn btn-primary shrink-0" href="/puppies">
              See all available puppies
            </Link>
          </header>
          <div ref={hall} className="tp-meet__hall">
            <ol ref={track} className="tp-meet__track" data-treadmill="true" aria-label="Puppies looking for a family">
              {puppies.map((p, i) => (
                <li key={p.slug} className="tp-door" data-open="true">
                  <Link href={`/puppies/${p.slug}`} className="tp-door__link" style={{ '--door': DOOR_COLOURS[i % DOOR_COLOURS.length] } as CSSProperties}>
                    <span className="tp-door__plate">
                      <span className="font-plush tp-door__name">{p.displayName}</span>
                      <span className="tp-door__meta">{metaFor(p)}</span>
                    </span>
                    <span className="tp-door__frame">
                      <span className="tp-door__room">
                        <Photo media={p.cover} sizes="(min-width: 1024px) 15rem, 44vw" />
                      </span>
                      <span aria-hidden="true" className="tp-door__way">
                        <span className="tp-door__leaf">
                          <Art svg={art.doorPeephole} />
                          <span className="tp-door__knob" />
                        </span>
                      </span>
                      <span className="tp-door__tag font-scrawl">Available</span>
                    </span>
                  </Link>
                </li>
              ))}
              <li className="tp-door tp-door--all" data-open="true">
                <Link href="/puppies" className="tp-door__link">
                  <span className="tp-door__frame tp-door__frame--all">
                    <span className="font-plush tp-door__all">Meet them all</span>
                  </span>
                </Link>
              </li>
            </ol>
            <div aria-hidden="true" className="tp-meet__floor" />
            <PupBuddy stop act={pinned ? 'treadmill' : undefined} className="tp-meet__teddy" />
          </div>
        </div>
      </div>
    </section>
  );
}
