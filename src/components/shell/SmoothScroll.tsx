'use client';

import Lenis from 'lenis';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '@/lib/motion';

export function SmoothScroll() {
  const pathname = usePathname();
  const lenis = useRef<Lenis | null>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const instance = new Lenis({ lerp: 0.12, anchors: { offset: -80 } });
    lenis.current = instance;
    let frame = requestAnimationFrame(function raf(time) {
      instance.raf(time);
      frame = requestAnimationFrame(raf);
    });
    return () => {
      cancelAnimationFrame(frame);
      instance.destroy();
    };
  }, []);

  useEffect(() => {
    if (!location.hash) lenis.current?.scrollTo(0, { immediate: true, force: true });
  }, [pathname]);

  return null;
}
