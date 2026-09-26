// Particle blueprints for the hero. Each shape is `n` points in a local box of
// roughly x ±1.35, y ±1 (z adds depth), plus a per-point accent flag. Points
// are sorted top to bottom, so particle i sits at a similar height in every
// shape and the morphs flow instead of scrambling.

export type ShapePoints = { pos: Float32Array; accent: Uint8Array };

type Add = (x: number, y: number, z: number, accent?: boolean) => void;
type Rand = () => number;
type Part = [weight: number, fill: (n: number, add: Add, rnd: Rand) => void];
type Vec = [number, number, number];

const TAU = Math.PI * 2;
const DEG = Math.PI / 180;

export function mulberry32(seed: number): Rand {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const jit = (rnd: Rand, amount: number) => (rnd() * 2 - 1) * amount;

// n split into k nearly equal whole numbers
const split = (n: number, k: number) => Array.from({ length: k }, (_, i) => Math.floor(n / k) + (i < n % k ? 1 : 0));

// ---------- flat primitives (in the XY plane at depth z) ----------

// A point on a rounded rectangle's outline, s in [0, 1) by arc length.
function perimeterPoint(w: number, h: number, r: number, s: number): [number, number] {
  const sw = w - 2 * r;
  const sh = h - 2 * r;
  const arc = (Math.PI / 2) * r;
  const hw = w / 2;
  const hh = h / 2;
  let d = s * (2 * sw + 2 * sh + 4 * arc);
  if (d < sw) return [-hw + r + d, hh];
  d -= sw;
  if (d < arc) return [hw - r + Math.cos(Math.PI / 2 - d / r) * r, hh - r + Math.sin(Math.PI / 2 - d / r) * r];
  d -= arc;
  if (d < sh) return [hw, hh - r - d];
  d -= sh;
  if (d < arc) return [hw - r + Math.cos(-d / r) * r, -hh + r + Math.sin(-d / r) * r];
  d -= arc;
  if (d < sw) return [hw - r - d, -hh];
  d -= sw;
  if (d < arc) return [-hw + r + Math.cos(-Math.PI / 2 - d / r) * r, -hh + r + Math.sin(-Math.PI / 2 - d / r) * r];
  d -= arc;
  if (d < sh) return [-hw, -hh + r + d];
  d -= sh;
  return [-hw + r + Math.cos(Math.PI - d / r) * r, hh - r + Math.sin(Math.PI - d / r) * r];
}

function outline(add: Add, n: number, rnd: Rand, cx: number, cy: number, z: number, w: number, h: number, r: number, accent = false, zSpread = 0.004) {
  for (let i = 0; i < n; i++) {
    const [x, y] = perimeterPoint(w, h, r, (i + rnd()) / n);
    add(cx + x + jit(rnd, 0.004), cy + y + jit(rnd, 0.004), z + jit(rnd, zSpread), accent);
  }
}

function fill(add: Add, n: number, rnd: Rand, cx: number, cy: number, z: number, w: number, h: number, r: number, accent = false) {
  const hw = w / 2 - r;
  const hh = h / 2 - r;
  for (let placed = 0, tries = 0; placed < n && tries < n * 30; tries++) {
    const x = (rnd() - 0.5) * w;
    const y = (rnd() - 0.5) * h;
    const dx = Math.max(Math.abs(x) - hw, 0);
    const dy = Math.max(Math.abs(y) - hh, 0);
    if (dx * dx + dy * dy > r * r) continue;
    add(cx + x, cy + y, z + jit(rnd, 0.006), accent);
    placed++;
  }
}

function disc(add: Add, n: number, rnd: Rand, cx: number, cy: number, z: number, r: number, accent = false) {
  for (let i = 0; i < n; i++) {
    const a = rnd() * TAU;
    const d = Math.sqrt(rnd()) * r;
    add(cx + Math.cos(a) * d, cy + Math.sin(a) * d, z + jit(rnd, 0.004), accent);
  }
}

function circle(add: Add, n: number, rnd: Rand, cx: number, cy: number, z: number, r: number, accent = false) {
  for (let i = 0; i < n; i++) {
    const a = ((i + rnd()) / n) * TAU;
    add(cx + Math.cos(a) * r + jit(rnd, 0.003), cy + Math.sin(a) * r + jit(rnd, 0.003), z, accent);
  }
}

function line(add: Add, n: number, rnd: Rand, x1: number, y1: number, x2: number, y2: number, z: number, accent = false) {
  for (let i = 0; i < n; i++) {
    const t = (i + rnd()) / n;
    add(x1 + (x2 - x1) * t + jit(rnd, 0.004), y1 + (y2 - y1) * t + jit(rnd, 0.004), z + jit(rnd, 0.004), accent);
  }
}

function cluster(add: Add, n: number, rnd: Rand, [cx, cy, cz]: Vec, r: number, accent = false) {
  for (let i = 0; i < n; i++) add(cx + jit(rnd, r), cy + jit(rnd, r), cz + jit(rnd, r), accent);
}

// ---------- 3D primitives ----------

// Circle in the XZ plane at height y.
function rim(add: Add, n: number, rnd: Rand, y: number, r: number, accent = false) {
  for (let i = 0; i < n; i++) {
    const a = ((i + rnd()) / n) * TAU;
    add(Math.cos(a) * r, y + jit(rnd, 0.004), Math.sin(a) * r, accent);
  }
}

function tube(add: Add, n: number, rnd: Rand, y0: number, y1: number, r: number) {
  for (let i = 0; i < n; i++) {
    const a = rnd() * TAU;
    add(Math.cos(a) * r, y0 + (y1 - y0) * rnd(), Math.sin(a) * r);
  }
}

function cap(add: Add, n: number, rnd: Rand, y: number, r: number) {
  for (let i = 0; i < n; i++) {
    const a = rnd() * TAU;
    const d = Math.sqrt(rnd()) * r;
    add(Math.cos(a) * d, y + jit(rnd, 0.004), Math.sin(a) * d);
  }
}

function sphere(add: Add, n: number, r: number) {
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - ((i + 0.5) / n) * 2;
    const rr = Math.sqrt(1 - y * y);
    add(Math.cos(i * golden) * rr * r, y * r, Math.sin(i * golden) * rr * r);
  }
}

// A point on a ring tilted about X, then Z.
function ringPoint(r: number, tiltX: number, tiltZ: number, a: number): Vec {
  const x = Math.cos(a) * r;
  const z = Math.sin(a) * r;
  const y1 = -z * Math.sin(tiltX);
  const z1 = z * Math.cos(tiltX);
  return [x * Math.cos(tiltZ) - y1 * Math.sin(tiltZ), x * Math.sin(tiltZ) + y1 * Math.cos(tiltZ), z1];
}

// Dashed when duty < 1: only that fraction of each of 16 dashes is drawn.
function ring(add: Add, n: number, rnd: Rand, r: number, tiltX: number, tiltZ: number, duty: number, accent = false) {
  for (let placed = 0; placed < n; ) {
    const a = rnd() * TAU;
    if (duty < 1 && ((a / TAU) * 16) % 1 > duty) continue;
    const [x, y, z] = ringPoint(r, tiltX, tiltZ, a);
    add(x + jit(rnd, 0.004), y + jit(rnd, 0.004), z + jit(rnd, 0.004), accent);
    placed++;
  }
}

// Globe coordinates, turned so Hyderabad faces the camera.
const FACE_LON = 78.5;
function geo(lat: number, lon: number, r: number): Vec {
  const la = lat * DEG;
  const lo = (lon - FACE_LON) * DEG;
  return [Math.cos(la) * Math.sin(lo) * r, Math.sin(la) * r, Math.cos(la) * Math.cos(lo) * r];
}

function arc(add: Add, n: number, rnd: Rand, a: [number, number], b: [number, number], r: number, lift: number) {
  const A = geo(a[0], a[1], 1);
  const B = geo(b[0], b[1], 1);
  const dot = Math.min(1, Math.max(-1, A[0] * B[0] + A[1] * B[1] + A[2] * B[2]));
  const om = Math.acos(dot);
  const so = Math.sin(om) || 1e-6;
  for (let i = 0; i < n; i++) {
    const t = (i + rnd()) / n;
    const k1 = Math.sin((1 - t) * om) / so;
    const k2 = Math.sin(t * om) / so;
    const h = r * (1 + lift * Math.sin(Math.PI * t));
    add((A[0] * k1 + B[0] * k2) * h, (A[1] * k1 + B[1] * k2) * h, (A[2] * k1 + B[2] * k2) * h, true);
  }
}

// ---------- the four shapes ----------

// A phone running a social feed: stories, a post, a floating tab bar.
// Screen parts float in front of the body so it looks layered as it turns.
function phone(): Part[] {
  return [
    [15, (n, add, rnd) => outline(add, n, rnd, 0, 0, 0.05, 1, 2, 0.17)],
    [7, (n, add, rnd) => outline(add, n, rnd, 0, 0, -0.05, 1, 2, 0.17)],
    [5, (n, add, rnd) => outline(add, n, rnd, 0, 0, 0, 1, 2, 0.17, false, 0.05)],
    [2, (n, add, rnd) => fill(add, n, rnd, 0, 0.87, 0.08, 0.28, 0.075, 0.037)],
    [2, (n, add, rnd) => {
      const [a, b] = split(n, 2);
      line(add, a, rnd, -0.4, 0.875, -0.3, 0.875, 0.08);
      fill(add, b, rnd, 0.33, 0.875, 0.08, 0.12, 0.035, 0.012);
    }],
    [8, (n, add, rnd) => split(n, 4).forEach((m, i) => circle(add, m, rnd, -0.3 + i * 0.2, 0.66, 0.16, 0.07, i < 2))],
    [2, (n, add, rnd) => {
      const [a, b] = split(n, 2);
      disc(add, a, rnd, -0.33, 0.47, 0.2, 0.04);
      line(add, b, rnd, -0.26, 0.47, -0.02, 0.47, 0.2);
    }],
    [26, (n, add, rnd) => fill(add, n, rnd, 0, 0.04, 0.24, 0.84, 0.74, 0.04)],
    [3, (n, add, rnd) => {
      const [a, b, c] = split(n, 3);
      disc(add, a, rnd, -0.36, -0.42, 0.2, 0.032, true);
      circle(add, b, rnd, -0.26, -0.42, 0.2, 0.03);
      circle(add, c, rnd, -0.16, -0.42, 0.2, 0.03);
    }],
    [2, (n, add, rnd) => {
      const [a, b] = split(n, 2);
      line(add, a, rnd, -0.4, -0.53, 0.22, -0.53, 0.18);
      line(add, b, rnd, -0.4, -0.6, 0.02, -0.6, 0.18);
    }],
    [6, (n, add, rnd) => outline(add, n, rnd, 0, -0.8, 0.16, 0.84, 0.17, 0.085)],
    [2, (n, add, rnd) => split(n, 4).forEach((m, i) => disc(add, m, rnd, [-0.3, -0.15, 0.15, 0.3][i], -0.8, 0.16, 0.022))],
    [4, (n, add, rnd) => disc(add, n, rnd, 0, -0.8, 0.3, 0.085, true)],
    [1, (n, add, rnd) => line(add, n, rnd, -0.15, -0.94, 0.15, -0.94, 0.06)],
    [12, (n, add, rnd) => fill(add, n, rnd, 0, 0, 0.02, 0.9, 1.9, 0.14)],
  ];
}

// A SaaS dashboard in a browser window: sidebar, KPI cards, a rising chart.
function dashboard(): Part[] {
  const chart = (x: number) => -0.52 + 0.4 * ((x + 0.68) / 1.86) + 0.07 * Math.sin(5 * x) + 0.045 * Math.sin(11 * x + 1);
  return [
    [13, (n, add, rnd) => outline(add, n, rnd, 0, 0, 0, 2.7, 1.8, 0.12)],
    [5, (n, add, rnd) => fill(add, n, rnd, 0, 0, -0.06, 2.64, 1.74, 0.1)],
    [2, (n, add, rnd) => line(add, n, rnd, -1.35, 0.69, 1.35, 0.69, 0)],
    [2, (n, add, rnd) => split(n, 3).forEach((m, i) => disc(add, m, rnd, -1.21 + i * 0.1, 0.8, 0.02, 0.03, i === 0))],
    [3, (n, add, rnd) => outline(add, n, rnd, 0.15, 0.8, 0.02, 1.2, 0.09, 0.045)],
    [2, (n, add, rnd) => line(add, n, rnd, -0.86, 0.69, -0.86, -0.9, 0)],
    [4, (n, add, rnd) =>
      split(n, 5).forEach((m, i) => line(add, m, rnd, -1.24, 0.52 - i * 0.15, i === 0 ? -0.98 : -1.04, 0.52 - i * 0.15, 0.08, i === 0))],
    [8, (n, add, rnd) => split(n, 3).forEach((m, i) => outline(add, m, rnd, -0.47 + i * 0.72, 0.47, 0.16, 0.6, 0.3, 0.06))],
    [4, (n, add, rnd) => split(n, 3).forEach((m, i) => fill(add, m, rnd, -0.59 + i * 0.72, 0.45, 0.18, 0.24, 0.07, 0.02))],
    [5, (n, add, rnd) => outline(add, n, rnd, 0.25, -0.33, 0.06, 2.04, 1, 0.07)],
    [2, (n, add, rnd) => split(n, 3).forEach((m, i) => line(add, m, rnd, -0.7, -0.12 - i * 0.22, 1.2, -0.12 - i * 0.22, 0.06))],
    [11, (n, add, rnd) => {
      for (let i = 0; i < n; i++) {
        const x = -0.68 + ((i + rnd()) / n) * 1.86;
        add(x, chart(x) + jit(rnd, 0.005), 0.26, true);
      }
    }],
    // area under the line, densest near the line
    [17, (n, add, rnd) => {
      for (let placed = 0; placed < n; ) {
        const x = -0.68 + rnd() * 1.86;
        const top = chart(x);
        const y = -0.78 + rnd() * (top + 0.78);
        if (rnd() > Math.pow((y + 0.78) / (top + 0.78), 1.6)) continue;
        add(x, y, 0.22);
        placed++;
      }
    }],
  ];
}

// Three stacked database cylinders with status lights, and an event stream
// orbiting them.
function database(): Part[] {
  const R = 0.78;
  const H = 0.44;
  const parts: Part[] = [];
  [0.8, 0.22, -0.36].forEach((top) => {
    const bottom = top - H;
    const mid = top - H / 2;
    parts.push([7, (n, add, rnd) => rim(add, n, rnd, top, R)]);
    parts.push([5, (n, add, rnd) => rim(add, n, rnd, bottom, R)]);
    parts.push([8, (n, add, rnd) => tube(add, n, rnd, bottom, top, R)]);
    parts.push([1.5, (n, add, rnd) =>
      split(n, 3).forEach((m, i) => {
        const a = 1.1 + i * 0.13;
        cluster(add, m, rnd, [Math.cos(a) * R * 1.01, mid, Math.sin(a) * R * 1.01], 0.012, true);
      })]);
    parts.push([1.5, (n, add, rnd) => {
      for (let j = 0; j < n; j++) {
        const a = 1.7 + rnd() * 0.6;
        add(Math.cos(a) * R * 1.01, mid + jit(rnd, 0.008), Math.sin(a) * R * 1.01);
      }
    }]);
  });
  parts.push([6, (n, add, rnd) => cap(add, n, rnd, 0.8, R)]);
  parts.push([7, (n, add, rnd) => ring(add, n, rnd, 1.18, 0.32, 0.12, 0.55, true)]);
  return parts;
}

const HYDERABAD: [number, number] = [17.4, 78.5];
const CITIES: [number, number][] = [
  [51.5, -0.1], // London
  [25.2, 55.3], // Dubai
  [1.35, 103.8], // Singapore
  [-33.9, 151.2], // Sydney
  [35.7, 139.7], // Tokyo
];

// A dotted globe with live connections fanning out from Hyderabad.
function globe(): Part[] {
  const R = 0.88;
  return [
    [46, (n, add) => sphere(add, n, R)],
    [12, (n, add, rnd) =>
      split(n, 3).forEach((m, i) => {
        const lo = (i * 60) * DEG;
        for (let j = 0; j < m; j++) {
          const a = ((j + rnd()) / m) * TAU;
          add(Math.cos(a) * Math.sin(lo) * R, Math.sin(a) * R, Math.cos(a) * Math.cos(lo) * R);
        }
      })],
    [6, (n, add, rnd) => split(n, 3).forEach((m, i) => rim(add, m, rnd, Math.sin([-35, 0, 35][i] * DEG) * R, Math.cos([-35, 0, 35][i] * DEG) * R))],
    [18, (n, add, rnd) => split(n, CITIES.length).forEach((m, i) => arc(add, m, rnd, HYDERABAD, CITIES[i], R, 0.22))],
    [3, (n, add, rnd) => {
      const [hub, ...rest] = split(n, CITIES.length + 1);
      cluster(add, hub, rnd, geo(HYDERABAD[0], HYDERABAD[1], R * 1.02), 0.035, true);
      rest.forEach((m, i) => cluster(add, m, rnd, geo(CITIES[i][0], CITIES[i][1], R * 1.02), 0.02));
    }],
    [11, (n, add, rnd) => ring(add, n, rnd, 1.24, 0.38, -0.18, 1)],
    [4, (n, add, rnd) => split(n, 3).forEach((m, i) => cluster(add, m, rnd, ringPoint(1.24, 0.38, -0.18, 0.8 + i * 2.1), 0.03, true))],
  ];
}

function build(parts: Part[], n: number, seed: number): ShapePoints {
  const rnd = mulberry32(seed);
  const xyz: number[] = [];
  const acc: number[] = [];
  const add: Add = (x, y, z, accent = false) => {
    xyz.push(x, y, z);
    acc.push(accent ? 1 : 0);
  };

  const total = parts.reduce((sum, [w]) => sum + w, 0);
  let used = 0;
  parts.forEach(([w, fillPart], i) => {
    const count = i === parts.length - 1 ? n - used : Math.floor((n * w) / total);
    used += count;
    if (count > 0) fillPart(count, add, rnd);
  });

  // Top up (a fill can fall a little short) by echoing existing points.
  const made = acc.length;
  for (let i = made; i < n; i++) {
    const j = Math.floor(rnd() * made);
    add(xyz[j * 3] + jit(rnd, 0.01), xyz[j * 3 + 1] + jit(rnd, 0.01), xyz[j * 3 + 2] + jit(rnd, 0.01), acc[j] === 1);
  }

  const order = Array.from({ length: acc.length }, (_, i) => i);
  const key = order.map((i) => xyz[i * 3 + 1] + (rnd() - 0.5) * 0.08);
  order.sort((a, b) => key[b] - key[a]);

  const pos = new Float32Array(n * 3);
  const accent = new Uint8Array(n);
  for (let j = 0; j < n; j++) {
    const i = order[j];
    pos[j * 3] = xyz[i * 3];
    pos[j * 3 + 1] = xyz[i * 3 + 1];
    pos[j * 3 + 2] = xyz[i * 3 + 2];
    accent[j] = acc[i];
  }
  return { pos, accent };
}

// In the same order as profile.crafts: mobile apps, SaaS, backends, real-time.
export function buildShapes(n: number): ShapePoints[] {
  return [phone(), dashboard(), database(), globe()].map((parts, i) => build(parts, n, 101 + i * 17));
}
