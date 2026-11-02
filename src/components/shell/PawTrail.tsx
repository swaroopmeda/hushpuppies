'use client';

import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '@/lib/motion';

const LIFETIME = 900;
const SPACING = 90;

// Leaves fading paw prints behind a mouse cursor.
export function PawTrail() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (prefersReducedMotion() || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const canvas = ref.current!;
    const ctx = canvas.getContext('2d')!;
    const prints: { x: number; y: number; angle: number; born: number; side: number }[] = [];
    let last: { x: number; y: number } | null = null;
    let side = 1;
    let frame = 0;

    const resize = () => {
      canvas.width = innerWidth * devicePixelRatio;
      canvas.height = innerHeight * devicePixelRatio;
      ctx.scale(devicePixelRatio, devicePixelRatio);
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      if (!last) last = { x: e.clientX, y: e.clientY };
      const dx = e.clientX - last.x;
      const dy = e.clientY - last.y;
      if (Math.hypot(dx, dy) < SPACING) return;
      side = -side;
      prints.push({ x: e.clientX, y: e.clientY, angle: Math.atan2(dy, dx) + Math.PI / 2, born: performance.now(), side });
      last = { x: e.clientX, y: e.clientY };
      if (!frame) frame = requestAnimationFrame(draw);
    };
    const draw = () => {
      const now = performance.now();
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      while (prints.length && now - prints[0].born > LIFETIME) prints.shift();
      for (const p of prints) {
        ctx.save();
        ctx.translate(p.x + Math.cos(p.angle) * 9 * p.side, p.y + Math.sin(p.angle) * 9 * p.side);
        ctx.rotate(p.angle);
        ctx.globalAlpha = 0.28 * (1 - (now - p.born) / LIFETIME);
        ctx.fillStyle = '#a24a1a';
        ctx.beginPath();
        ctx.ellipse(0, 2, 5.5, 4.6, 0, 0, Math.PI * 2);
        for (const [x, y] of [[-6, -3], [-2, -7], [2, -7], [6, -3]]) {
          ctx.moveTo(x + 2, y);
          ctx.ellipse(x, y, 2, 2.6, 0, 0, Math.PI * 2);
        }
        ctx.fill();
        ctx.restore();
      }
      frame = prints.length ? requestAnimationFrame(draw) : 0;
    };

    resize();
    addEventListener('resize', resize);
    addEventListener('pointermove', onMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener('resize', resize);
      removeEventListener('pointermove', onMove);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[70] size-full" />;
}
