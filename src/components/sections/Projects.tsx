"use client";

import Shell from "./Shell";
import { projects } from "@/data/resume";

export default function Projects() {
  return (
    <Shell
      id="projects"
      service="project-service"
      title="Projects"
      align="right"
      wide
    >
      <div className="space-y-6">
        {projects.map((proj) => (
          <article
            key={proj.service}
            className="rounded-sm border border-line bg-panel-solid/60 p-5 transition-colors hover:border-line-strong"
          >
            {/* service header bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-3">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-neon">
                  svc/{proj.service}
                </span>
                <span className="flex items-center gap-1.5 font-mono text-[10px] tracking-widest text-ok">
                  <span className="status-dot" /> RUNNING
                </span>
              </div>
              <span className="font-mono text-[11px] text-muted">{proj.period}</span>
            </div>

            <h3 className="mt-3 text-lg font-semibold">{proj.name}</h3>

            <div className="mt-2 flex flex-wrap gap-1.5">
              {proj.stack.map((s) => (
                <span
                  key={s}
                  className="rounded-sm bg-violet/10 px-2 py-0.5 font-mono text-[11px] text-violet"
                >
                  {s}
                </span>
              ))}
            </div>

            <ul className="mt-4 space-y-2">
              {proj.points.map((p, i) => (
                <li key={i} className="flex gap-2.5 text-[13px] leading-relaxed text-fg/85">
                  <span className="mt-0.5 shrink-0 font-mono text-xs text-neon">▹</span>
                  {p}
                </li>
              ))}
            </ul>

            {/* live-dashboard style metric row */}
            <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {proj.metrics.map((m) => (
                <div
                  key={m.label}
                  className="rounded-sm border border-line bg-neon/5 px-3 py-2.5 text-center"
                >
                  <p className="font-mono text-base font-bold text-neon">{m.value}</p>
                  <p className="mt-0.5 text-[10px] leading-tight text-muted">{m.label}</p>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </Shell>
  );
}
