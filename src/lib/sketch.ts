// Generates the hand-drawn look of a puppy card. Everything is seeded from the
// slug, so a card renders the same on the server and the client.

type Point = [number, number];
type Rng = () => number;

const WASHES = ['#f2be6b', '#f9cdbf', '#bfddf5', '#fbe3b4', '#e8c39a'];
const INKS = ['#c2622b', '#a24a1a', '#2a170e', '#d4893f'];
export const DOODLES = ['sparkle', 'heart', 'dashes', 'swirl', 'dots', 'paw'] as const;
export type DoodleKind = (typeof DOODLES)[number];

export type Doodle = { kind: DoodleKind; x: number; y: number; rot: number; size: number; ink: string };

const fixed = (n: number) => n.toFixed(2);

// FNV-1a hash of the slug, used to seed a mulberry32 generator.
function seeded(text: string): Rng {
  let hash = 0x811c9dc5;
  for (const ch of text) hash = Math.imul(hash ^ ch.charCodeAt(0), 0x1000193);
  let state = hash >>> 0;
  return () => {
    let t = (state = (state + 0x6d2b79f5) >>> 0);
    t = Math.imul(t ^ (t >>> 15), 1 | t);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 0x100000000;
  };
}

// A wobbly circle: three sine waves bend the radius around the centre.
function blob(rng: Rng, radius: number, wobble: number, count = 40, start = 0, sweep = 2 * Math.PI): Point[] {
  const phase = [6.28 * rng(), 6.28 * rng(), 6.28 * rng()];
  const squash = 1 + (rng() - 0.5) * 0.05;
  const points: Point[] = [];
  for (let i = 0; i < count; i++) {
    const angle = start + (i / (sweep >= 2 * Math.PI ? count : count - 1)) * sweep;
    const r =
      radius +
      wobble *
        (0.55 * Math.sin(2 * angle + phase[0]) + 0.3 * Math.sin(3 * angle + phase[1]) + 0.15 * Math.sin(5 * angle + phase[2]));
    points.push([50 + Math.cos(angle) * r * squash, 50 + (Math.sin(angle) * r) / squash]);
  }
  return points;
}

// Catmull-Rom spline through the points, written as cubic Beziers.
function smoothPath(points: Point[], closed: boolean) {
  const n = points.length;
  const at = (i: number) => points[closed ? (i + n) % n : Math.min(n - 1, Math.max(0, i))];
  let d = `M${fixed(points[0][0])} ${fixed(points[0][1])}`;
  const segments = closed ? n : n - 1;
  for (let i = 0; i < segments; i++) {
    const [p0, p1, p2, p3] = [at(i - 1), at(i), at(i + 1), at(i + 2)];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${fixed(c1[0])} ${fixed(c1[1])} ${fixed(c2[0])} ${fixed(c2[1])} ${fixed(p2[0])} ${fixed(p2[1])}`;
  }
  return closed ? `${d}Z` : d;
}

export function maskUrl(path: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="${path}" fill="#000"/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

export function sketchFor(slug: string) {
  const rng = seeded(slug);
  const mask = smoothPath(blob(rng, 45.5, 2.6), true);
  const outline = smoothPath(blob(rng, 47.8, 3.1), true);
  const retraceStart = rng() * Math.PI * 2;
  const retrace = smoothPath(blob(rng, 49, 3.4, 30, retraceStart, Math.PI * (1.15 + 0.5 * rng())), false);
  const wash = {
    d: smoothPath(blob(rng, 46.5, 3.6), true),
    dx: (rng() - 0.5) * 9,
    dy: 3 + 4 * rng(),
    color: WASHES[Math.floor(rng() * WASHES.length)],
  };
  const tilt = (rng() - 0.5) * 5;

  const zones = [
    [0.86, 1.08],
    [1.16, 1.42],
    [-0.08, 0.16],
  ]
    .map((z) => ({ z, k: rng() }))
    .sort((a, b) => a.k - b.k)
    .map((e) => e.z);

  const count = 2 + Math.floor(2 * rng());
  const doodles: Doodle[] = [];
  const used = new Set<DoodleKind>();
  for (let i = 0; i < count; i++) {
    let kind = DOODLES[Math.floor(rng() * DOODLES.length)];
    if (used.has(kind)) kind = DOODLES.find((k) => !used.has(k))!;
    used.add(kind);
    const [from, to] = zones[i];
    const angle = Math.PI * (from + rng() * (to - from));
    const reach = 55 + 4 * rng();
    doodles.push({
      kind,
      x: 50 + Math.cos(angle) * reach,
      y: 50 + Math.sin(angle) * reach,
      rot: (rng() - 0.5) * 50,
      size: 0.85 + 0.35 * rng(),
      ink: INKS[Math.floor(rng() * INKS.length)],
    });
  }

  return { mask, outline, retrace, wash, tilt, doodles };
}
