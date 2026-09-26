"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { FINE_POINTER, REDUCED_MOTION, useMediaQuery } from "@/lib/hooks";

type CursorState = "default" | "link" | "view" | "drag" | "hide";

// A dot that tracks the pointer and a ring that trails it. Hovering
// something interactive morphs the ring:
//   links/buttons          -> filled circle that inverts what's under it
//   [data-cursor="view"]   -> accent disc with a label ("View")
//   [data-cursor="drag"]   -> accent disc with "Drag"
// Only on mouse/trackpad devices, and never with reduced motion.
export function Cursor() {
  const fine = useMediaQuery(FINE_POINTER);
  const reduced = useMediaQuery(REDUCED_MOTION);
  const enabled = fine && !reduced;

  const root = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (!enabled) return;
    const el = root.current;
    const ringEl = ring.current;
    const dotEl = dot.current;
    const labelEl = label.current;
    if (!el || !ringEl || !dotEl || !labelEl) return;

    document.documentElement.classList.add("has-cursor");
    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ringPos = { ...target };
    const dotPos = { ...target };
    let shown = false;
    let frame = 0;

    const setState = (state: CursorState, text = "") => {
      if (el.dataset.state !== state) el.dataset.state = state;
      if (labelEl.textContent !== text) labelEl.textContent = text;
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      target.x = e.clientX;
      target.y = e.clientY;
      if (!shown) {
        shown = true;
        ringPos.x = dotPos.x = target.x;
        ringPos.y = dotPos.y = target.y;
        el.dataset.visible = "true";
      }
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target as Element | null;
      if (!t || !t.closest) return;
      const tagged = t.closest<HTMLElement>("[data-cursor]");
      if (tagged) {
        setState(tagged.dataset.cursor as CursorState, tagged.dataset.cursorLabel ?? "");
        return;
      }
      if (t.closest("a, button, [role='button'], summary, label")) {
        setState("link");
        return;
      }
      setState("default");
    };

    const onDown = () => (el.dataset.down = "true");
    const onUp = () => delete el.dataset.down;
    const onLeave = () => {
      shown = false;
      el.dataset.visible = "false";
    };

    const loop = () => {
      ringPos.x += (target.x - ringPos.x) * 0.17;
      ringPos.y += (target.y - ringPos.y) * 0.17;
      dotPos.x += (target.x - dotPos.x) * 0.55;
      dotPos.y += (target.y - dotPos.y) * 0.55;
      ringEl.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0)`;
      dotEl.style.transform = `translate3d(${dotPos.x}px, ${dotPos.y}px, 0)`;
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(frame);
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("mouseover", onOver);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, [enabled]);

  // A new page may mount under a still pointer; drop any hover state.
  useEffect(() => {
    if (root.current) root.current.dataset.state = "default";
  }, [pathname]);

  if (!enabled) return null;

  return (
    <div ref={root} className="cursor" data-state="default" data-visible="false" aria-hidden="true">
      <div ref={ring} className="cursor-ring">
        <div className="cursor-ring-inner">
          <span ref={label} className="cursor-label" />
        </div>
      </div>
      <div ref={dot} className="cursor-dot">
        <div className="cursor-dot-inner" />
      </div>
    </div>
  );
}
