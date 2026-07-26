"use client";

import Shell from "./Shell";
import { experience, education } from "@/data/resume";

export default function Experience() {
  return (
    <Shell
      id="experience"
      service="experience-service"
      title="Experience"
      align="left"
      wide
    >
      {experience.map((job) => (
        <div key={job.company} className="relative border-l border-line-strong pl-6">
          <span className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-neon shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="text-xl font-semibold">
              {job.company}
              <span className="ml-3 font-mono text-xs text-ok">● {job.status}</span>
            </h3>
            <span className="font-mono text-xs text-muted">{job.period}</span>
          </div>
          <p className="mt-1 text-sm text-neon-soft">
            {job.role} — {job.location}
          </p>
          <ul className="mt-4 space-y-2.5">
            {job.points.map((p, i) => (
              <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-fg/85">
                <span className="mt-0.5 shrink-0 font-mono text-xs text-neon">▹</span>
                {p}
              </li>
            ))}
          </ul>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {job.metrics.map((m) => (
              <div
                key={m.label}
                className="rounded-sm border border-line bg-neon/5 p-3 text-center"
              >
                <p className="font-mono text-lg font-bold text-neon">{m.value}</p>
                <p className="mt-1 text-[11px] leading-tight text-muted">{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="relative mt-10 border-l border-line pl-6">
        <span className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-violet shadow-[0_0_10px_rgba(167,139,250,0.7)]" />
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="text-lg font-semibold">{education.school}</h3>
          <span className="font-mono text-xs text-muted">{education.period}</span>
        </div>
        <p className="mt-1 text-sm text-violet">
          {education.degree} — {education.location}
        </p>
        <p className="mt-2 text-xs leading-relaxed text-muted">
          Key coursework: {education.coursework}
        </p>
      </div>
    </Shell>
  );
}
