"use client";

import Shell from "./Shell";
import { profile } from "@/data/resume";

const traits = [
  "distributed systems design",
  "event-driven architecture",
  "database performance tuning",
  "90%+ test coverage culture",
  "agile delivery",
];

export default function About() {
  return (
    <Shell id="about" service="identity-service" title="About" align="right">
      <p className="text-sm leading-relaxed text-fg/90 sm:text-[15px]">
        {profile.summary}
      </p>
      <div className="mt-6 border-t border-line pt-5">
        <p className="mb-3 font-mono text-[10px] tracking-widest text-muted">
          GET /identity/traits
        </p>
        <div className="flex flex-wrap gap-2">
          {traits.map((t) => (
            <span
              key={t}
              className="rounded-sm border border-line bg-neon/5 px-2.5 py-1 font-mono text-xs text-neon-soft"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </Shell>
  );
}
