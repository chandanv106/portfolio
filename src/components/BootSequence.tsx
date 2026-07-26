"use client";

import { useEffect, useState } from "react";

const LINES = [
  "[INFO] booting api-gateway on :8080",
  "[INFO] connecting to kafka broker ... connected",
  "[INFO] eureka: registering 6 services",
  "[INFO] circuit breakers armed (resilience4j)",
  "[ OK ] system ready — routing request",
];

// Brief "service startup" overlay. Content renders underneath immediately,
// so this is purely cosmetic and never blocks reading or crawling.
export default function BootSequence() {
  const [visible, setVisible] = useState(true);
  const [shown, setShown] = useState(0);

  useEffect(() => {
    const skip =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      sessionStorage.getItem("booted") === "1";
    if (skip) {
      setVisible(false);
      return;
    }
    sessionStorage.setItem("booted", "1");

    const timers = LINES.map((_, i) =>
      window.setTimeout(() => setShown(i + 1), 220 + i * 240)
    );
    const done = window.setTimeout(() => setVisible(false), 220 + LINES.length * 240 + 500);
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(done);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      onClick={() => setVisible(false)}
      className="fixed inset-0 z-[100] flex cursor-pointer items-center justify-center bg-bg transition-opacity duration-500"
    >
      <div className="w-full max-w-md px-6 font-mono text-xs leading-relaxed sm:text-sm">
        {LINES.slice(0, shown).map((line) => (
          <p
            key={line}
            className={line.includes("[ OK ]") ? "text-ok" : "text-muted"}
          >
            {line}
          </p>
        ))}
        <p className="text-neon">
          <span className="blink-caret">_</span>
        </p>
      </div>
      <p className="absolute bottom-10 font-mono text-[10px] tracking-widest text-muted">
        click to skip
      </p>
    </div>
  );
}
