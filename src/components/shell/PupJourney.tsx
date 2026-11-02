'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { Art } from '@/components/Art';
import { pupBow, pupPeek, pupSit, pupSnug, walkFrames } from '@/data/art';
import { prefersReducedMotion } from '@/lib/motion';

const SVG_WIDTH = 300;
const SVG_HEIGHT = 240;
const HEADER_GAP = 10;
const BLEND = 0.2; // share of the viewport either side of a scene boundary spent walking
const SCALE_UP = 1.12; // the roaming pup is a touch larger than the stop that holds his place
const WALK_RATE = 0.5; // walk frames per animation frame
const DESKTOP = 1024;
const LANE_SCALE = 0.42;
const LANE_ANCHOR = 159; // height in the peek pose where the paws rest on the edge
const POSES = { sit: pupSit, peek: pupPeek, bow: pupBow, snug: pupSnug };
type Pose = keyof typeof POSES | 'walk';

const clamp = (n: number, min = 0, max = 1) => Math.min(max, Math.max(min, n));
const smoother = (t: number) => t * t * t * (t * (6 * t - 15) + 10);

// Phones have no room to walk, so Teddy peeks up from the bottom edge instead,
// switching sides for each scene. The first and last stops keep their own pup.
function peekFromEdges(stops: HTMLElement[], root: HTMLElement, layer: HTMLElement, actor: HTMLElement, body: HTMLElement) {
  const lanes = stops.filter((s) => s.dataset.lane === 'true');
  const scenes = [...document.querySelectorAll<HTMLElement>('#main [data-pup-scene]')].filter((s) => !lanes.some((l) => s.contains(l)));
  if (!scenes.length) return;

  root.dataset.pup = 'lane';
  layer.hidden = false;
  ([...body.children] as HTMLElement[]).forEach((el) => (el.hidden = el.dataset.pose !== 'peek'));
  const bar = document.querySelector<HTMLElement>('[data-whatsapp-bar]');
  let frame = 0;
  let side = 0;
  let sink = 1;

  const tick = () => {
    frame = requestAnimationFrame(tick);
    const mid = innerHeight / 2;
    const active = scenes.findIndex((scene) => {
      const r = scene.getBoundingClientRect();
      return r.top <= mid && r.bottom > mid;
    });
    const wanted = active < 0 ? side : active % 2;
    const hide = active < 0 || wanted !== side;
    sink += ((hide ? 1 : 0) - sink) * 0.14;
    if (hide && sink > 0.96) side = wanted;
    if (active >= 0) scenes[active].matches('.tp-home') && (scenes[active].dataset.visited = 'true');

    const barTop = bar?.getClientRects().length ? bar.getBoundingClientRect().top : innerHeight;
    const y = barTop - LANE_ANCHOR * LANE_SCALE + sink * 110;
    const x = side === 0 ? 16 - 70 * LANE_SCALE : innerWidth - 16 - 230 * LANE_SCALE;
    actor.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
    body.style.transform = side === 0 ? `scale(${LANE_SCALE})` : `translateX(${SVG_WIDTH * LANE_SCALE}px) scale(${-LANE_SCALE}, ${LANE_SCALE})`;
  };
  frame = requestAnimationFrame(tick);

  return () => {
    cancelAnimationFrame(frame);
    delete root.dataset.pup;
    layer.hidden = true;
  };
}

// Teddy walks from stop to stop as the page scrolls. He belongs to the scene at
// the middle of the viewport and crosses over as each boundary passes it. Stops
// are read live from the DOM, so pinned sections need no special handling.
export function PupJourney() {
  const pathname = usePathname();
  const layer = useRef<HTMLDivElement>(null);
  const actor = useRef<HTMLDivElement>(null);
  const body = useRef<HTMLDivElement>(null);
  const walker = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    if (prefersReducedMotion()) return;
    const stops = [...document.querySelectorAll<HTMLElement>('[data-pup-stop]')].filter((s) => s.getClientRects().length);
    if (innerWidth < DESKTOP) return peekFromEdges(stops, root, layer.current!, actor.current!, body.current!);
    if (stops.length < 2) return;

    root.dataset.pup = 'true';
    layer.current!.hidden = false;
    const poses = [...body.current!.children] as HTMLElement[];
    const scenes = stops.map((s) => s.closest<HTMLElement>('[data-pup-scene]') ?? s.closest<HTMLElement>('footer') ?? s);
    const header = document.getElementById('site-header');
    let frame = 0;
    let lastX = 0;
    let lastScroll = scrollY;
    let lastScrollAt = 0;
    let facing = 1;
    let step = 0;
    let shownFrame = -1;
    let pose: Pose = 'sit';

    const show = (next: Pose) => {
      if (next === pose) return;
      pose = next;
      poses.forEach((el) => (el.hidden = el.dataset.pose !== next));
    };

    const place = (stop: HTMLElement, onScreen: boolean) => {
      const r = stop.getBoundingClientRect();
      const base = r.width / SVG_WIDTH;
      const basket = stop.dataset.act === 'basket';
      const s = basket ? base : base * SCALE_UP;
      const anchorY = stop.dataset.pose === 'peek' ? 159 : 228;
      const x = r.left + (SVG_WIDTH / 2) * (base - s);
      const y = r.top + anchorY * (base - s);
      const top = (header?.offsetHeight ?? 76) + HEADER_GAP;
      return { x, y: onScreen ? clamp(y, top, innerHeight - SVG_HEIGHT * s - HEADER_GAP) : y, s };
    };

    const tick = (now: number) => {
      frame = requestAnimationFrame(tick);
      const vh = innerHeight;
      const mid = vh * 0.5;
      const blend = vh * BLEND;

      // Find the stop we are leaving: the last whose scene has not fully handed over.
      let k = 0;
      let t = 0;
      for (let i = 0; i < stops.length - 1; i++) {
        const boundary = scenes[i + 1] === scenes[i] ? stops[i + 1].getBoundingClientRect().top : scenes[i + 1].getBoundingClientRect().top;
        const progress = clamp((mid + blend - boundary) / (blend * 2));
        k = i;
        t = progress;
        if (progress < 1) break;
        k = i + 1;
        t = 0;
      }

      const behind = (i: number) => stops[i]?.dataset.behind === 'true';
      const from = place(stops[k], !behind(k));
      const to = k + 1 < stops.length ? place(stops[k + 1], !behind(k + 1)) : from;
      const e = smoother(t);
      const x = from.x + (to.x - from.x) * e;
      const y = from.y + (to.y - from.y) * e - Math.sin(e * Math.PI) * 48;
      const s = from.s + (to.s - from.s) * e;

      const dx = x - lastX;
      if (Math.abs(dx) > 0.8) facing = dx > 0 ? 1 : -1;
      lastX = x;
      if (Math.abs(scrollY - lastScroll) > 0.5) lastScrollAt = now;
      lastScroll = scrollY;

      // On the treadmill he only walks while the page is being scrolled.
      const travelling = t > 0.01 && t < 0.99;
      const treadmill = !travelling && stops[k].dataset.act === 'treadmill' && now - lastScrollAt < 160;
      const walking = travelling || treadmill;
      show(walking ? 'walk' : ((stops[k].dataset.pose as Pose) ?? 'sit'));
      if (walking) {
        step += WALK_RATE;
        const index = Math.floor(step) % walkFrames.length;
        if (index !== shownFrame) {
          shownFrame = index;
          walker.current!.innerHTML = walkFrames[index];
        }
      }

      actor.current!.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      body.current!.style.transform = (travelling ? facing : 1) < 0 ? `translateX(${SVG_WIDTH * s}px) scale(${-s}, ${s})` : `scale(${s})`;

      layer.current!.dataset.front = String(!behind(e > 0.5 ? k + 1 : k) || travelling);
      const arrived = stops[e > 0.5 ? k + 1 : k]?.closest<HTMLElement>('.tp-home');
      if (arrived) arrived.dataset.visited = 'true';
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      delete root.dataset.pup;
      if (layer.current) layer.current.hidden = true;
    };
  }, [pathname]);

  return (
    <div ref={layer} aria-hidden="true" className="pup-layer" hidden data-front="true">
      <div ref={actor} className="pup-actor">
        <div ref={body} className="pup-actor__body">
          {(Object.keys(POSES) as (keyof typeof POSES)[]).map((name) => (
            <div key={name} data-pose={name} hidden={name !== 'sit'}>
              <Art svg={POSES[name]} />
            </div>
          ))}
          <div data-pose="walk" hidden>
            <svg ref={walker} viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`} style={{ overflow: 'visible' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
