"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/hooks";

// The contents drift and settle as the frame scrolls through the viewport.
export function Parallax({ children, className = "" }: { children: ReactNode; className?: string }) {
  const frame = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!frame.current || !inner.current || prefersReducedMotion()) return;
    const tween = gsap.fromTo(
      inner.current,
      { yPercent: -6, scale: 1.12 },
      {
        yPercent: 6,
        scale: 1,
        ease: "none",
        scrollTrigger: { trigger: frame.current, start: "top bottom", end: "bottom top", scrub: true },
      }
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <div ref={frame} className={`relative overflow-hidden ${className}`}>
      <div ref={inner} className="absolute inset-0 will-change-transform">
        {children}
      </div>
    </div>
  );
}
