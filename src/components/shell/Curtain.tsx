'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { Art } from '@/components/Art';
import * as art from '@/data/art';
import { prefersReducedMotion } from '@/lib/motion';

const PRINTS = [art.curtainPrint0, art.curtainPrint1, art.curtainPrint2, art.curtainPrint3, art.curtainPrint4];
const COVER_MS = 300;
const LIFT_MS = 460;

// Full-page blanket that plays once on load and covers every route change.
export function Curtain() {
  const router = useRouter();
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);
  const lift = useRef<() => void>(() => {});

  useEffect(() => {
    const el = ref.current!;
    const root = document.documentElement;
    const timers: number[] = [];
    const later = (fn: () => void, ms: number) => timers.push(window.setTimeout(fn, ms));
    const setState = (state: string) => {
      el.dataset.state = state;
      if (state === 'idle') delete root.dataset.curtain;
      else root.dataset.curtain = state;
    };

    lift.current = () => {
      if (el.dataset.state !== 'covered') return;
      setState('lifting');
      dispatchEvent(new Event('tp:arrived'));
      later(() => setState('idle'), LIFT_MS);
    };

    if (el.dataset.state === 'intro') later(() => setState('idle'), 1080);

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = (e.target as Element).closest?.('a[href]') as HTMLAnchorElement | null;
      if (!link || (link.target && link.target !== '_self')) return;
      const url = new URL(link.href, location.href);
      if (url.origin !== location.origin || /^\/(api|media|_next)(\/|$)/.test(url.pathname)) return;
      if (url.pathname === location.pathname || prefersReducedMotion()) return;
      e.preventDefault();
      e.stopPropagation();
      router.prefetch(url.pathname + url.search);
      setState('covering');
      later(() => {
        setState('covered');
        router.push(url.pathname + url.search + url.hash);
        later(() => lift.current(), 6000);
      }, COVER_MS);
    };

    document.addEventListener('click', onClick, true);
    return () => {
      document.removeEventListener('click', onClick, true);
      timers.forEach(clearTimeout);
    };
  }, [router]);

  useEffect(() => {
    lift.current();
  }, [pathname]);

  return (
    <div ref={ref} className="tp-curtain" data-state="intro" aria-hidden="true">
      <div className="tp-curtain__blanket">
        <Art svg={art.curtainTop} />
        <div className="tp-curtain__stage">
          <div className="tp-curtain__prints">
            {PRINTS.map((print, i) => (
              <Art key={i} svg={print} />
            ))}
          </div>
          <div className="tp-curtain__runner">
            <Art svg={art.runner} />
          </div>
          <p className="tp-curtain__note font-scrawl">every puppy is family</p>
        </div>
        <Art svg={art.curtainBottom} />
      </div>
    </div>
  );
}
