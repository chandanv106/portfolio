"use client";

import { useState } from "react";
import { sections } from "@/data/resume";

export default function Nav({ activeIndex }: { activeIndex: number }) {
  const [open, setOpen] = useState(false);

  const jump = (id: string) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-line bg-bg/60 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <button
          onClick={() => jump("gateway")}
          className="font-mono text-sm text-fg transition-colors hover:text-neon"
        >
          <span className="text-neon">~/</span>chandan.verma
          <span className="blink-caret text-neon">_</span>
        </button>

        <nav className="hidden items-center gap-1 md:flex">
          {sections.slice(1).map((s, i) => (
            <button
              key={s.id}
              onClick={() => jump(s.id)}
              className={`px-3 py-1 font-mono text-xs tracking-wider transition-colors ${
                activeIndex === i + 1 ? "text-neon" : "text-muted hover:text-fg"
              }`}
            >
              {activeIndex === i + 1 ? "▸ " : ""}
              {s.nav}
            </button>
          ))}
        </nav>

        <div className="hidden items-center gap-2 rounded-sm border border-line px-2.5 py-1 lg:flex">
          <span className="status-dot" />
          <span className="font-mono text-[10px] tracking-widest text-muted">
            ALL SYSTEMS OPERATIONAL
          </span>
        </div>

        {/* mobile menu toggle */}
        <button
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
          aria-expanded={open}
          className="flex h-8 w-8 items-center justify-center rounded-sm border border-line font-mono text-sm text-neon md:hidden"
        >
          {open ? "✕" : "≡"}
        </button>
      </div>

      {/* mobile dropdown */}
      {open && (
        <nav className="border-t border-line bg-bg/95 backdrop-blur-md md:hidden">
          {sections.slice(1).map((s, i) => (
            <button
              key={s.id}
              onClick={() => jump(s.id)}
              className={`block w-full px-6 py-3 text-left font-mono text-sm tracking-wider transition-colors ${
                activeIndex === i + 1 ? "text-neon" : "text-muted"
              }`}
            >
              <span className="mr-2 text-neon">▸</span>
              {s.nav}
            </button>
          ))}
        </nav>
      )}
    </header>
  );
}
