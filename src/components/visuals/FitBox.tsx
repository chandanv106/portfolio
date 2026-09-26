"use client";

import { useEffect, useRef, type ReactNode } from "react";

// Lays its children out at a fixed design size and scales them to fit the
// box, so the illustrations look identical on a phone card and a desktop hero.
export function FitBox({ width, height, children }: { width: number; height: number; children: ReactNode }) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const o = outer.current;
    const i = inner.current;
    if (!o || !i) return;
    const ro = new ResizeObserver(() => {
      const scale = Math.min(o.clientWidth / width, o.clientHeight / height);
      i.style.transform = `translate(-50%, -50%) scale(${scale})`;
      i.style.opacity = "1";
    });
    ro.observe(o);
    return () => ro.disconnect();
  }, [width, height]);

  return (
    <div ref={outer} className="absolute inset-0 overflow-hidden">
      <div
        ref={inner}
        className="absolute left-1/2 top-1/2 origin-center opacity-0 transition-opacity duration-500"
        style={{ width, height, transform: "translate(-50%, -50%) scale(0.7)" }}
      >
        {children}
      </div>
    </div>
  );
}
