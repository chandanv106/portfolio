"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/hooks";
import { onReveal } from "@/lib/reveal";

type Props = {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
};

const format = (n: number, decimals: number) =>
  n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

// Counts from zero when it scrolls into view. The server renders the final
// number, so it's correct for search engines and without JavaScript.
export function CountUp({ value, decimals = 0, prefix = "", suffix = "", duration = 2.2, className }: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    const write = (n: number) => {
      el.textContent = `${prefix}${format(n, decimals)}${suffix}`;
    };
    write(0);

    let io: IntersectionObserver | null = null;
    let tween: gsap.core.Tween | null = null;
    const stop = onReveal(() => {
      io = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          io?.disconnect();
          const counter = { n: 0 };
          tween = gsap.to(counter, { n: value, duration, ease: "power3.out", onUpdate: () => write(counter.n) });
        },
        { threshold: 0.5 }
      );
      io.observe(el);
    });

    return () => {
      stop();
      io?.disconnect();
      tween?.kill();
      write(value);
    };
  }, [value, decimals, prefix, suffix, duration]);

  return (
    <span ref={ref} className={`tabular-nums ${className ?? ""}`}>
      {prefix}
      {format(value, decimals)}
      {suffix}
    </span>
  );
}
