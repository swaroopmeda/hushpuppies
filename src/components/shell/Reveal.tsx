'use client';

import type { ReactNode } from 'react';
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { prefersReducedMotion } from '@/lib/motion';

const curtainDown = () => document.documentElement.dataset.curtain === 'covered';

// Marks [data-reveal] elements as they scroll in; the CSS handles the animation.
export function Reveal({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current!;
    const pending = () => root.querySelectorAll<HTMLElement>('[data-reveal]:not([data-revealed])');

    if (prefersReducedMotion()) {
      const showAll = () => pending().forEach((el) => (el.dataset.revealed = 'true'));
      showAll();
      const mutations = new MutationObserver(showAll);
      mutations.observe(root, { childList: true, subtree: true });
      return () => mutations.disconnect();
    }

    const show = (el: HTMLElement) => {
      el.dataset.revealed = 'true';
      io.unobserve(el);
    };
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && show(e.target as HTMLElement)),
      { rootMargin: '0px 0px -6% 0px', threshold: 0.08 },
    );
    const arm = (el: HTMLElement) => {
      if (el.dataset.armed) return io.observe(el);
      const box = el.getBoundingClientRect();
      if (box.top < innerHeight && box.bottom > 0 && !curtainDown()) {
        el.dataset.revealed = 'true';
        return;
      }
      el.dataset.armed = 'true';
      io.observe(el);
    };
    pending().forEach(arm);
    const mutations = new MutationObserver(() => pending().forEach(arm));
    mutations.observe(root, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mutations.disconnect();
    };
  }, [pathname]);

  return <div ref={ref}>{children}</div>;
}
