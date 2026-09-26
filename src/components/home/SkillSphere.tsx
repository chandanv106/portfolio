"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/hooks";

type Item = { label: string; color: string };

// Tags spread evenly over a sphere (Fibonacci lattice) and projected with CSS.
// It spins on its own; the pointer steers it, and dragging flings it.
export function SkillSphere({ items }: { items: Item[] }) {
  const wrap = useRef<HTMLDivElement>(null);
  const nodes = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const tags = nodes.current.filter((n): n is HTMLSpanElement => !!n);
    const n = tags.length;
    const golden = Math.PI * (3 - Math.sqrt(5));
    const pts = tags.map((_, i) => {
      const y = 1 - (i / (n - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      return [Math.cos(golden * i) * r, y, Math.sin(golden * i) * r];
    });

    const still = prefersReducedMotion();
    const base = { x: 0.0016, y: 0.0035 };
    const spin = { ...base };
    const steer = { x: 0, y: 0 };
    const radiusFor = (w: number) => w * (w < 520 ? 0.34 : 0.4);
    let radius = radiusFor(el.clientWidth);
    let visible = true;
    let frame = 0;
    let drag: { x: number; y: number } | null = null;

    const draw = () => {
      const cx = Math.cos(spin.x);
      const sx = Math.sin(spin.x);
      const cy = Math.cos(spin.y);
      const sy = Math.sin(spin.y);
      tags.forEach((tag, i) => {
        const [x, y, z] = pts[i];
        const y1 = y * cx - z * sx;
        const z1 = y * sx + z * cx;
        const x2 = x * cy + z1 * sy;
        const z2 = -x * sy + z1 * cy;
        pts[i] = [x2, y1, z2];
        const depth = (z2 + 1) / 2; // 0 = back, 1 = front
        tag.style.transform = `translate3d(${x2 * radius}px, ${y1 * radius}px, 0) translate(-50%, -50%) scale(${0.55 + depth * 0.6})`;
        tag.style.opacity = String(0.18 + depth * 0.82);
        tag.style.zIndex = String(Math.round(depth * 100));
      });
    };

    const loop = () => {
      if (visible) {
        if (!drag) {
          spin.x += (base.x + steer.x - spin.x) * 0.04;
          spin.y += (base.y + steer.y - spin.y) * 0.04;
        }
        draw();
      }
      frame = requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      if (drag) {
        spin.y = (e.clientX - drag.x) * 0.004;
        spin.x = -(e.clientY - drag.y) * 0.004;
        drag = { x: e.clientX, y: e.clientY };
        return;
      }
      if (e.pointerType !== "mouse") return;
      steer.y = ((e.clientX - r.left) / r.width - 0.5) * 0.03;
      steer.x = -((e.clientY - r.top) / r.height - 0.5) * 0.03;
    };
    const onDown = (e: PointerEvent) => {
      drag = { x: e.clientX, y: e.clientY };
      el.setPointerCapture(e.pointerId);
    };
    const onUp = () => (drag = null);
    const onLeave = () => {
      steer.x = 0;
      steer.y = 0;
    };

    const ro = new ResizeObserver(() => {
      radius = radiusFor(el.clientWidth);
      draw();
    });
    ro.observe(el);
    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
    io.observe(el);

    if (still) {
      draw();
    } else {
      frame = requestAnimationFrame(loop);
      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerdown", onDown);
      el.addEventListener("pointerup", onUp);
      el.addEventListener("pointercancel", onUp);
      el.addEventListener("pointerleave", onLeave);
    }

    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      io.disconnect();
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [items]);

  return (
    <div
      ref={wrap}
      data-cursor="drag"
      data-cursor-label="Drag"
      className="relative mx-auto aspect-square w-full max-w-[640px] touch-pan-y select-none"
      aria-hidden="true"
    >
      <div className="absolute inset-[12%] rounded-full bg-[radial-gradient(circle,rgba(255,107,44,0.14),transparent_65%)]" />
      {items.map((item, i) => (
        <span
          key={item.label}
          ref={(node) => {
            nodes.current[i] = node;
          }}
          className="absolute left-1/2 top-1/2 whitespace-nowrap rounded-full border px-3 py-1.5 text-[13px] font-bold will-change-transform md:px-4 md:py-2 md:text-[15px]"
          style={{ color: item.color, borderColor: `${item.color}55`, background: `${item.color}14` }}
        >
          {item.label}
        </span>
      ))}
    </div>
  );
}
