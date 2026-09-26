"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { onReveal } from "@/lib/reveal";
import { buildShapes, mulberry32, type ShapePoints } from "./heroShapes";

const WHITE = new THREE.Color("#f4f2ee");
const ACCENT = new THREE.Color("#ff6b2c");

const INTRO = 2.1; // seconds for the first gathering
const MORPH = 1.25; // seconds each particle takes to fly to its new place
const STAGGER = 0.6; // reshaping sweeps from top to bottom over this long
const SWIRL = 0.34; // how far particles billow out mid-flight
const SHOCK = 4; // strength of the burst when you click

type Sim = {
  n: number;
  base: Float32Array; // where each particle rests, mid-morph included
  from: Float32Array;
  to: Float32Array;
  fromCol: Float32Array;
  toCol: Float32Array;
  colors: Float32Array[]; // one set per shape
  offset: Float32Array; // pushed by the pointer, springs back
  vel: Float32Array;
  swirl: Float32Array;
  delay: Float32Array;
  shape: number; // -1 until the intro starts
  start: number;
  dur: number;
  settled: boolean;
};

type Pointer = {
  x: number;
  y: number;
  present: boolean;
  strength: number;
  sx: number;
  sy: number;
  tiltX: number;
  tiltY: number;
  shock: { x: number; y: number } | null;
};

const raycaster = new THREE.Raycaster();
const ndc = new THREE.Vector2();
const inverse = new THREE.Matrix4();
const origin = new THREE.Vector3();
const direction = new THREE.Vector3();

function dotTexture() {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(0.3, "rgba(255,255,255,0.85)");
    g.addColorStop(0.6, "rgba(255,255,255,0.18)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createSim(n: number, shapes: ShapePoints[]): Sim {
  const rnd = mulberry32(7);
  const colors = shapes.map(() => new Float32Array(n * 3));
  const swirl = new Float32Array(n * 3);
  const delay = new Float32Array(n);
  const cloud = new Float32Array(n * 3);

  for (let i = 0; i < n; i++) {
    const i3 = i * 3;
    const bright = 0.5 + 0.5 * rnd();
    shapes.forEach((shape, k) => {
      const accent = shape.accent[i] === 1;
      const c = accent ? ACCENT : WHITE;
      const level = accent ? 0.85 + 0.15 * bright : bright;
      colors[k][i3] = c.r * level;
      colors[k][i3 + 1] = c.g * level;
      colors[k][i3 + 2] = c.b * level;
    });

    const sx = rnd() * 2 - 1;
    const sy = (rnd() * 2 - 1) * 0.5;
    const sz = rnd() * 2 - 1;
    const len = Math.hypot(sx, sy, sz) || 1;
    swirl[i3] = sx / len;
    swirl[i3 + 1] = sy / len;
    swirl[i3 + 2] = sz / len;

    // Particles are sorted top to bottom, so this sweeps downwards.
    delay[i] = (i / n) * STAGGER + rnd() * 0.15;

    // The intro starts from a wide cloud around (and beyond) the frame.
    const theta = rnd() * Math.PI * 2;
    const phi = Math.acos(rnd() * 2 - 1);
    const r = 2.4 + rnd() * 1.6;
    cloud[i3] = Math.sin(phi) * Math.cos(theta) * r * 1.4;
    cloud[i3 + 1] = Math.cos(phi) * r * 0.8;
    cloud[i3 + 2] = Math.sin(phi) * Math.sin(theta) * r;
  }

  return {
    n,
    base: cloud.slice(),
    from: cloud,
    to: new Float32Array(n * 3),
    fromCol: new Float32Array(n * 3), // black, so the intro fades in
    toCol: new Float32Array(n * 3),
    colors,
    offset: new Float32Array(n * 3),
    vel: new Float32Array(n * 3),
    swirl,
    delay,
    shape: -1,
    start: 0,
    dur: INTRO,
    settled: true,
  };
}

// Thousands of glowing points that assemble into a phone, a dashboard, a
// database and a globe in turn. The pointer (or a finger) pushes them aside
// and they spring back; a click bursts them and moves to the next shape.
function Particles({ mobile, shape, onNext }: { mobile: boolean; shape: number; onNext: () => void }) {
  const points = useRef<THREE.Points>(null);
  const sim = useRef<Sim | null>(null);
  const target = useRef(shape);
  const revealed = useRef(false);
  const next = useRef(onNext);
  const pointer = useRef<Pointer>({ x: 0, y: 0, present: false, strength: 0, sx: 0, sy: 0, tiltX: 0, tiltY: 0, shock: null });
  const gl = useThree((state) => state.gl);

  const count = mobile ? 2600 : 6000;
  const shapes = useMemo(() => buildShapes(count), [count]);
  const positions = useMemo(() => new Float32Array(count * 3), [count]);
  const colors = useMemo(() => new Float32Array(count * 3), [count]);
  const texture = useMemo(() => dotTexture(), []);

  useEffect(() => {
    target.current = shape;
  }, [shape]);

  useEffect(() => {
    next.current = onNext;
  }, [onNext]);

  // Hold the intro until the preloader or page curtain lifts.
  useEffect(
    () =>
      onReveal(() => {
        revealed.current = true;
      }),
    []
  );

  useEffect(() => () => texture.dispose(), [texture]);

  useEffect(() => {
    const p = pointer.current;
    const canvas = gl.domElement;
    const move = (x: number, y: number) => {
      p.x = x;
      p.y = y;
      p.present = true;
    };
    const onPointer = (e: PointerEvent) => {
      if (e.pointerType === "mouse" || e.pointerType === "pen") move(e.clientX, e.clientY);
    };
    const onTouch = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (touch) move(touch.clientX, touch.clientY);
    };
    const release = () => {
      p.present = false;
    };
    const onTilt = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return;
      p.tiltX = Math.max(-1, Math.min(1, e.gamma / 30));
      p.tiltY = Math.max(-1, Math.min(1, (45 - e.beta) / 30));
    };
    const onClick = (e: MouseEvent) => {
      if (e.target instanceof Element && e.target.closest("a, button, input, textarea, select, label, [role='button']")) return;
      const r = canvas.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) return;
      p.shock = { x: e.clientX, y: e.clientY };
      next.current();
    };

    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("touchstart", onTouch, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });
    window.addEventListener("touchend", release, { passive: true });
    window.addEventListener("touchcancel", release, { passive: true });
    document.documentElement.addEventListener("mouseleave", release);
    window.addEventListener("click", onClick);
    // iOS needs a permission prompt for motion; only listen where it's free.
    const tiltFree = "DeviceOrientationEvent" in window && !("requestPermission" in DeviceOrientationEvent);
    if (tiltFree) window.addEventListener("deviceorientation", onTilt, { passive: true });

    return () => {
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("touchstart", onTouch);
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("touchend", release);
      window.removeEventListener("touchcancel", release);
      document.documentElement.removeEventListener("mouseleave", release);
      window.removeEventListener("click", onClick);
      if (tiltFree) window.removeEventListener("deviceorientation", onTilt);
    };
  }, [gl]);

  useFrame((state, delta) => {
    const pts = points.current;
    if (!pts) return;
    if (!sim.current || sim.current.n !== count) sim.current = createSim(count, shapes);
    const s = sim.current;
    const p = pointer.current;

    pts.visible = revealed.current;
    if (!revealed.current) return;

    const dt = Math.min(delta, 1 / 30);
    const t = state.clock.elapsedTime;
    const posAttr = pts.geometry.getAttribute("position") as THREE.BufferAttribute;
    const colAttr = pts.geometry.getAttribute("color") as THREE.BufferAttribute;
    const pos = posAttr.array as Float32Array;
    const col = colAttr.array as Float32Array;

    // Start the intro, or a morph when the target shape changes.
    const want = target.current % shapes.length;
    if (s.shape === -1 || want !== s.shape) {
      if (s.shape !== -1) {
        s.from.set(s.base);
        s.fromCol.set(col);
      }
      s.to.set(shapes[want].pos);
      s.toCol.set(s.colors[want]);
      s.dur = s.shape === -1 ? INTRO : MORPH;
      s.shape = want;
      s.start = t;
      s.settled = false;
    }

    if (!s.settled) {
      const u = t - s.start;
      let done = true;
      for (let i = 0; i < s.n; i++) {
        let k = (u - s.delay[i]) / s.dur;
        if (k < 1) done = false;
        k = k < 0 ? 0 : k > 1 ? 1 : k;
        const e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
        const bulge = Math.sin(Math.PI * e) * SWIRL;
        for (let a = i * 3; a < i * 3 + 3; a++) {
          s.base[a] = s.from[a] + (s.to[a] - s.from[a]) * e + s.swirl[a] * bulge;
          col[a] = s.fromCol[a] + (s.toCol[a] - s.fromCol[a]) * e;
        }
      }
      colAttr.needsUpdate = true;
      s.settled = done;
    }

    // Pointer over the canvas in -1..1, smoothed. Without one, phone tilt
    // (Android) or nothing steers the turn.
    const rect = state.gl.domElement.getBoundingClientRect();
    const hasRect = rect.width > 0 && rect.height > 0;
    let nx = p.tiltX;
    let ny = p.tiltY;
    if (p.present && hasRect) {
      nx = ((p.x - rect.left) / rect.width) * 2 - 1;
      ny = -(((p.y - rect.top) / rect.height) * 2 - 1);
    }
    const ease = 1 - Math.exp(-dt * 4);
    p.sx += (Math.max(-1.2, Math.min(1.2, nx)) - p.sx) * ease;
    p.sy += (Math.max(-1.2, Math.min(1.2, ny)) - p.sy) * ease;
    p.strength += ((p.present ? 1 : 0) - p.strength) * (1 - Math.exp(-dt * 6));

    const { width: vw, height: vh } = state.viewport;
    pts.scale.setScalar(Math.min(vw, vh) * (mobile ? 0.3 : 0.29));
    pts.position.set(
      (mobile ? 0 : vw * 0.19) + p.sx * 0.1,
      (mobile ? vh * 0.12 : 0.02) + Math.sin(t * 0.7) * 0.03 + p.sy * 0.05,
      0
    );
    pts.rotation.y += (Math.sin(t * 0.28) * 0.3 + p.sx * 0.42 - pts.rotation.y) * ease;
    pts.rotation.x += (Math.sin(t * 0.19) * 0.07 - p.sy * 0.2 - pts.rotation.x) * ease;
    pts.updateMatrixWorld();
    inverse.copy(pts.matrixWorld).invert();

    // A screen point as a ray in the particles' own (local) space.
    const localRay = (clientX: number, clientY: number) => {
      ndc.set(((clientX - rect.left) / rect.width) * 2 - 1, -(((clientY - rect.top) / rect.height) * 2 - 1));
      raycaster.setFromCamera(ndc, state.camera);
      origin.copy(raycaster.ray.origin).applyMatrix4(inverse);
      direction.copy(raycaster.ray.direction).transformDirection(inverse);
    };

    // Click: kick everything near the click outwards.
    if (p.shock && hasRect) {
      localRay(p.shock.x, p.shock.y);
      for (let i = 0; i < s.n; i++) {
        const i3 = i * 3;
        const rx = s.base[i3] + s.offset[i3] - origin.x;
        const ry = s.base[i3 + 1] + s.offset[i3 + 1] - origin.y;
        const rz = s.base[i3 + 2] + s.offset[i3 + 2] - origin.z;
        const along = rx * direction.x + ry * direction.y + rz * direction.z;
        const qx = rx - direction.x * along;
        const qy = ry - direction.y * along;
        const qz = rz - direction.z * along;
        const d2 = qx * qx + qy * qy + qz * qz;
        const kick = (SHOCK * Math.exp(-d2 / 0.3)) / (Math.sqrt(d2) + 0.02);
        s.vel[i3] += qx * kick;
        s.vel[i3 + 1] += qy * kick;
        s.vel[i3 + 2] += qz * kick;
      }
    }
    p.shock = null;

    // Pointer pushes particles off its ray; springs pull them home.
    const radius = mobile ? 0.34 : 0.26;
    const radius2 = radius * radius;
    const repel = 160 * p.strength;
    const repelling = repel > 0.5 && hasRect;
    if (repelling) localRay(p.x, p.y);
    const damp = Math.pow(0.86, dt * 60);

    for (let i = 0; i < s.n; i++) {
      const i3 = i * 3;
      let fx = -34 * s.offset[i3];
      let fy = -34 * s.offset[i3 + 1];
      let fz = -34 * s.offset[i3 + 2];
      if (repelling) {
        const rx = s.base[i3] + s.offset[i3] - origin.x;
        const ry = s.base[i3 + 1] + s.offset[i3 + 1] - origin.y;
        const rz = s.base[i3 + 2] + s.offset[i3 + 2] - origin.z;
        const along = rx * direction.x + ry * direction.y + rz * direction.z;
        const qx = rx - direction.x * along;
        const qy = ry - direction.y * along;
        const qz = rz - direction.z * along;
        const d2 = qx * qx + qy * qy + qz * qz;
        if (d2 < radius2) {
          const d = Math.sqrt(d2) + 1e-4;
          const f = (repel * (radius - d)) / d;
          fx += qx * f;
          fy += qy * f;
          fz += qz * f;
        }
      }
      const vx = (s.vel[i3] + fx * dt) * damp;
      const vy = (s.vel[i3 + 1] + fy * dt) * damp;
      const vz = (s.vel[i3 + 2] + fz * dt) * damp;
      s.vel[i3] = vx;
      s.vel[i3 + 1] = vy;
      s.vel[i3 + 2] = vz;
      s.offset[i3] += vx * dt;
      s.offset[i3 + 1] += vy * dt;
      s.offset[i3 + 2] += vz * dt;
      pos[i3] = s.base[i3] + s.offset[i3];
      pos[i3 + 1] = s.base[i3 + 1] + s.offset[i3 + 1];
      pos[i3 + 2] = s.base[i3 + 2] + s.offset[i3 + 2];
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={points} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} usage={THREE.DynamicDrawUsage} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} usage={THREE.DynamicDrawUsage} />
      </bufferGeometry>
      <pointsMaterial
        size={mobile ? 0.06 : 0.07}
        map={texture}
        vertexColors
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
        toneMapped={false}
      />
    </points>
  );
}

export default function HeroScene({
  active,
  mobile,
  shape,
  onNext,
}: {
  active: boolean;
  mobile: boolean;
  shape: number;
  onNext: () => void;
}) {
  return (
    <Canvas
      flat
      dpr={[1, mobile ? 1.5 : 1.75]}
      camera={{ position: [0, 0, 6], fov: 35 }}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      frameloop={active ? "always" : "never"}
    >
      <Particles mobile={mobile} shape={shape} onNext={onNext} />
      <Sparkles count={mobile ? 24 : 50} scale={[10, 5, 3]} size={mobile ? 2.2 : 2.8} speed={0.25} opacity={0.4} color="#f4f2ee" />
    </Canvas>
  );
}
