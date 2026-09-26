"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/hooks";
import { getLenis } from "@/lib/scroll";

// Two crossing tapes of scrolling text. They drift on their own, speed up
// with scroll velocity, and flip direction when you scroll back up.
export function Tapes({ rows }: { rows: string[][] }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const tracks = Array.from(el.querySelectorAll<HTMLElement>("[data-track]"));
    const offsets = tracks.map(() => 0);
    let direction = 1;
    let visible = true;

    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(el);

    const tick = (_: number, delta: number) => {
      if (!visible) return;
      const lenis = getLenis();
      const velocity = lenis?.velocity ?? 0;
      if (velocity > 0.5) direction = 1;
      else if (velocity < -0.5) direction = -1;
      const boost = Math.min(Math.abs(velocity) * 0.9, 24);

      tracks.forEach((track, i) => {
        const set = track.firstElementChild as HTMLElement | null;
        const width = set?.offsetWidth ?? 0;
        if (!width) return;
        const dir = (i % 2 === 0 ? -1 : 1) * direction;
        offsets[i] += dir * (0.06 * delta + boost);
        // keep the offset within one copy's width so the loop is seamless
        offsets[i] = ((offsets[i] % width) + width) % width;
        track.style.transform = `translate3d(${-offsets[i]}px, 0, 0)`;
      });
    };
    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      io.disconnect();
    };
  }, []);

  return (
    <div ref={root} className="relative z-10 -my-4 overflow-hidden py-16 md:py-24" aria-hidden="true">
      {rows.map((row, i) => (
        <div
          key={i}
          className={`relative w-[110%] -translate-x-[5%] py-3 md:py-5 ${
            i === 0
              ? "-rotate-[3deg] bg-accent text-ink shadow-[0_20px_60px_-20px_rgba(255,107,44,0.6)]"
              : "-mt-10 rotate-[2deg] border-y border-line bg-ink-2 text-paper md:-mt-14"
          }`}
        >
          <div data-track className="flex w-max will-change-transform">
            {[0, 1, 2, 3].map((copy) => (
              <div key={copy} className="flex shrink-0 items-center">
                {row.map((word) => (
                  <span key={word} className="flex items-center font-display text-4xl font-black uppercase md:text-7xl">
                    <span className="px-5 md:px-8">{word}</span>
                    <svg viewBox="0 0 24 24" className="size-5 shrink-0 md:size-8" fill="currentColor">
                      <path d="M12 0l2.6 9.4L24 12l-9.4 2.6L12 24l-2.6-9.4L0 12l9.4-2.6z" />
                    </svg>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
