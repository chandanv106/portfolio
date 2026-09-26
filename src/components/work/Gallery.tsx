"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { getLenis } from "@/lib/scroll";
import type { Screen } from "@/data/projects";

// A strip of screens you can drag or swipe through; tapping one opens it
// full screen with next/previous and keyboard support.
export function Gallery({ screens, color }: { screens: Screen[]; color: string }) {
  const [open, setOpen] = useState<number | null>(null);
  const strip = useRef<HTMLDivElement>(null);

  // Mouse drag-to-scroll (touch already scrolls natively).
  useEffect(() => {
    const el = strip.current;
    if (!el) return;
    let start: { x: number; left: number } | null = null;
    let moved = false;
    const down = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      start = { x: e.clientX, left: el.scrollLeft };
      moved = false;
      el.style.scrollSnapType = "none";
    };
    const move = (e: PointerEvent) => {
      if (!start) return;
      const dx = e.clientX - start.x;
      if (Math.abs(dx) > 4) moved = true;
      el.scrollLeft = start.left - dx;
    };
    const up = () => {
      if (!start) return;
      start = null;
      el.style.scrollSnapType = "";
    };
    // Swallow the click that ends a drag so it doesn't open the lightbox.
    const click = (e: MouseEvent) => {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
        moved = false;
      }
    };
    el.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    el.addEventListener("click", click, true);
    return () => {
      el.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      el.removeEventListener("click", click, true);
    };
  }, []);

  const close = useCallback(() => setOpen(null), []);
  const step = useCallback((dir: number) => setOpen((i) => (i === null ? i : (i + dir + screens.length) % screens.length)), [screens.length]);

  useEffect(() => {
    if (open === null) return;
    const lenis = getLenis();
    lenis?.stop();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      lenis?.start();
    };
  }, [open, close, step]);

  useEffect(() => {
    if (open === null) return;
    gsap.fromTo("[data-lightbox-img]", { opacity: 0, scale: 0.96 }, { opacity: 1, scale: 1, duration: 0.5, ease: "expo.out" });
  }, [open]);

  return (
    <>
      <div
        ref={strip}
        data-cursor="drag"
        data-cursor-label="Drag"
        className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 [scrollbar-width:none] md:-mx-14 md:gap-6 md:px-14 [&::-webkit-scrollbar]:hidden"
      >
        {screens.map((s, i) => (
          <button
            key={s.src}
            type="button"
            onClick={() => setOpen(i)}
            className="group w-[82vw] shrink-0 snap-start text-left sm:w-[56vw] lg:w-[34vw]"
          >
            <span className="relative block aspect-[1080/1088] overflow-hidden rounded-[22px] bg-[#f2f2f4]">
              <Image
                src={s.src}
                alt={`${s.title}, light and dark themes`}
                fill
                sizes="(min-width: 1024px) 34vw, (min-width: 640px) 56vw, 82vw"
                className="object-cover transition-transform duration-700 ease-[var(--ease-expo)] group-hover:scale-[1.04]"
                draggable={false}
              />
            </span>
            <span className="mt-4 flex items-baseline gap-3">
              <span className="font-mono text-xs" style={{ color }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-lg font-bold">{s.title}</span>
            </span>
            <span className="mt-1 block pl-8 text-[15px] leading-relaxed text-paper/60">{s.caption}</span>
          </button>
        ))}
      </div>

      {open !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={screens[open].title}
          data-lenis-prevent
          className="fixed inset-0 z-[320] flex flex-col bg-ink/95 backdrop-blur-sm"
          onClick={close}
        >
          <div className="gutter flex items-center justify-between py-5">
            <span className="font-bold">
              {screens[open].title}{" "}
              <span className="font-mono text-sm text-mute">
                {open + 1} / {screens.length}
              </span>
            </span>
            <button type="button" onClick={close} className="rounded-full border border-line px-5 py-2 text-sm font-bold hover:border-paper">
              Close
            </button>
          </div>
          <div className="relative mx-auto w-full max-w-5xl flex-1" onClick={(e) => e.stopPropagation()}>
            <div data-lightbox-img className="absolute inset-4">
              <Image src={screens[open].src} alt={`${screens[open].title}, light and dark themes`} fill sizes="100vw" className="object-contain" />
            </div>
          </div>
          <div className="gutter flex items-center justify-between gap-4 py-5" onClick={(e) => e.stopPropagation()}>
            <button type="button" onClick={() => step(-1)} className="rounded-full border border-line px-5 py-2 text-sm font-bold hover:border-paper">
              ← Previous
            </button>
            <p className="hidden max-w-md text-center text-sm text-paper/60 md:block">{screens[open].caption}</p>
            <button type="button" onClick={() => step(1)} className="rounded-full border border-line px-5 py-2 text-sm font-bold hover:border-paper">
              Next →
            </button>
          </div>
        </div>
      )}
    </>
  );
}
