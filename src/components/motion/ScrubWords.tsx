"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/hooks";

// A paragraph whose words light up one by one as you scroll through it.
// Words listed in `highlight` light up in the accent colour.
export function ScrubWords({
  text,
  highlight = [],
  className,
}: {
  text: string;
  highlight?: string[];
  className?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const words = el.querySelectorAll("[data-w]");
    const ctx = gsap.context(() => {
      gsap.fromTo(
        words,
        { opacity: 0.14 },
        {
          opacity: 1,
          ease: "none",
          stagger: 0.08,
          scrollTrigger: { trigger: el, start: "top 82%", end: "bottom 48%", scrub: 0.6 },
        }
      );
    }, el);
    return () => ctx.revert();
  }, []);

  const clean = (w: string) => w.replace(/[.,:;!?]/g, "").toLowerCase();
  const marked = new Set(highlight.map((w) => w.toLowerCase()));

  return (
    <p ref={ref} className={className}>
      {text.split(" ").map((word, i) => (
        <span key={i}>
          <span data-w className={marked.has(clean(word)) ? "text-accent" : undefined}>
            {word}
          </span>{" "}
        </span>
      ))}
    </p>
  );
}
