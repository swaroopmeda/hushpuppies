'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { Photo } from '@/components/Photo';
import type { PuppyCardData } from '@/lib/data';
import { prefersReducedMotion } from '@/lib/motion';

// x%, width rem, peek height, tilt deg
const SEATS = [
  [9, 8.6, 0.62, -5],
  [22.5, 10.4, 0.8, 3],
  [35, 9.2, 0.7, -2],
  [65, 9.4, 0.74, 3],
  [77.5, 10.6, 0.82, -3],
  [91, 8.4, 0.6, 4],
];
const PAUSES = [1900, 2500, 1700, 2300, 2000, 2800, 1800];

const seatStyle = (i: number) => {
  const [x, w, peek, tilt] = SEATS[i];
  return { '--x': `${x}%`, '--w': `${w}rem`, '--peek': peek, '--tilt': `${tilt}deg`, '--i': i } as CSSProperties;
};

// Puppies duck behind the quilt and swap with friends waiting off stage.
export function HeroLineup({ friends }: { friends: PuppyCardData[] }) {
  const [seated, setSeated] = useState(() => friends.slice(0, SEATS.length).map((_, i) => i));
  const [motion, setMotion] = useState<Record<number, 'duck' | 'pop' | undefined>>({});
  const [tag, setTag] = useState<number | null>(null);
  const [nextUp, setNextUp] = useState(SEATS.length);
  const list = useRef<HTMLUListElement>(null);
  const seatedRef = useRef(seated);
  seatedRef.current = seated;

  useEffect(() => {
    if (prefersReducedMotion() || friends.length <= SEATS.length) return;
    let timers: number[] = [];
    let visible = true;
    let beat = 0;
    let queue = friends.map((_, i) => i).filter((i) => !seatedRef.current.includes(i));
    const later = (fn: () => void, ms: number) => timers.push(window.setTimeout(fn, ms));
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0.35 });
    io.observe(list.current!);

    const swap = () => {
      if (document.hidden || !visible) return later(swap, 900);
      const seat = Math.floor(Math.random() * SEATS.length);
      const incoming = queue.shift()!;
      setMotion((m) => ({ ...m, [seat]: 'duck' }));
      later(() => {
        const outgoing = seatedRef.current[seat];
        setSeated((s) => s.map((f, i) => (i === seat ? incoming : f)));
        queue.push(outgoing);
        setNextUp(queue[0]);
        setMotion((m) => ({ ...m, [seat]: 'pop' }));
        setTag(seat);
        later(() => setTag((t) => (t === seat ? null : t)), 1800);
        later(() => setMotion((m) => ({ ...m, [seat]: undefined })), 700);
      }, 360);
      later(swap, PAUSES[beat++ % PAUSES.length]);
    };
    later(swap, 2600);

    return () => {
      timers.forEach(clearTimeout);
      timers = [];
      io.disconnect();
    };
  }, [friends]);

  return (
    <>
      <ul ref={list} className="tp-lineup" aria-label="Some of the puppies in our showroom">
        {seated.map((friendIndex, i) => {
          const pup = friends[friendIndex];
          return (
            <li key={i} className="tp-lineup__seat" style={seatStyle(i)}>
              <Link
                href={`/puppies/${pup.slug}`}
                className="tp-lineup__pup"
                data-pup-friend="true"
                data-state={motion[i]}
                aria-label={`Meet ${pup.displayName}, ${pup.breed}`}
              >
                <span className="tp-lineup__photo">
                  <Photo media={pup.cover} sizes="11rem" eager priority={i < 2} />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
      <ul aria-hidden="true" className="tp-lineup tp-lineup--tags">
        {seated.map((friendIndex, i) => (
          <li key={i} className="tp-lineup__seat" style={seatStyle(i)}>
            <span className="tp-lineup__ghost" data-tag={tag === i ? 'show' : undefined}>
              <span className="tp-lineup__name font-scrawl">{friends[friendIndex].displayName}</span>
            </span>
          </li>
        ))}
      </ul>
      <span aria-hidden="true" className="tp-lineup__wings" data-for={nextUp}>
        <Photo media={friends[nextUp % friends.length].cover} sizes="11rem" alt="" eager />
      </span>
    </>
  );
}
