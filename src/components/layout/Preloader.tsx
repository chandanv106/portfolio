"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/hooks";
import { releaseReveal } from "@/lib/reveal";
import { getLenis } from "@/lib/scroll";

// First visit only: count to 100, then lift like a curtain onto the hero.
// Repeat visits in the same session are skipped before first paint by the
// boot script in the root layout (it adds `html.seen`).
export function Preloader() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    const html = document.documentElement;
    if (!el || html.classList.contains("seen") || prefersReducedMotion()) {
      releaseReveal();
      return;
    }

    const digits = el.querySelectorAll<HTMLElement>("[data-digit]");
    const bar = el.querySelector<HTMLElement>("[data-bar]");
    const outgoing = el.querySelectorAll<HTMLElement>("[data-out]");
    // SmoothScroll mounts first, so Lenis exists here; hold the page still.
    const lenis = getLenis();
    lenis?.stop();
    html.style.overflow = "hidden";

    const count = { n: 0 };
    const paint = () => {
      const s = String(Math.round(count.n)).padStart(3, "0");
      digits.forEach((d, i) => (d.textContent = s[i]));
      if (bar) bar.style.transform = `scaleX(${count.n / 100})`;
    };

    const tl = gsap.timeline({ paused: true });
    tl.to(count, { n: 100, duration: 1.7, ease: "power2.inOut", onUpdate: paint })
      .to(outgoing, { yPercent: -120, duration: 0.7, ease: "power3.in", stagger: 0.035 }, "+=0.15")
      .add(() => {
        html.style.overflow = "";
        lenis?.start();
        releaseReveal();
      }, "-=0.15")
      .to(el, { yPercent: -100, duration: 1.15, ease: "expo.inOut" }, "<")
      .add(() => {
        el.style.display = "none";
        html.classList.add("seen");
        try {
          sessionStorage.setItem("cv-seen", "1");
        } catch {}
      });

    // Wait for the fonts (up to 1.5 s) so the hero never flashes a fallback.
    const fonts = document.fonts?.ready ?? Promise.resolve();
    let alive = true;
    Promise.race([fonts, new Promise((r) => setTimeout(r, 1500))]).then(() => {
      if (alive) tl.play();
    });

    return () => {
      alive = false;
      tl.kill();
      html.style.overflow = "";
      lenis?.start();
    };
  }, []);

  return (
    <div
      ref={root}
      className="preloader fixed inset-0 z-[400] flex flex-col justify-between bg-ink px-5 pb-6 pt-6 text-paper md:px-14 md:pb-10 md:pt-8"
      aria-hidden="true"
    >
      <div className="flex justify-between overflow-hidden">
        <span data-out className="label">Chandan Verma</span>
        <span data-out className="label text-mute">Portfolio · 2026</span>
      </div>

      <div>
        <div className="overflow-hidden">
          <div data-out className="flex font-display text-[42vw] font-black leading-[0.8] md:text-[26vw]">
            {[0, 1, 2].map((i) => (
              <span key={i} data-digit className="inline-block w-[0.54em] text-center">
                0
              </span>
            ))}
          </div>
        </div>
        <div className="mt-5 flex justify-between overflow-hidden">
          <span data-out className="label text-mute">Software engineer · Hyderabad</span>
          <span data-out className="label text-accent">Loading</span>
        </div>
        <div className="mt-4 h-px w-full bg-line">
          <div data-bar className="h-full origin-left scale-x-0 bg-accent" />
        </div>
      </div>
    </div>
  );
}
