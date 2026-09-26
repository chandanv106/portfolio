"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { setLenis } from "@/lib/scroll";

// Inertia scrolling on wheel/trackpad. Touch keeps native scrolling, which
// already feels right on phones. Lenis drives ScrollTrigger from GSAP's ticker
// so scroll-linked animations never lag a frame behind.
export function SmoothScroll() {
  useEffect(() => {
    window.__motionReady = true;

    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true, autoRaf: false });
    setLenis(lenis);
    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return null;
}
