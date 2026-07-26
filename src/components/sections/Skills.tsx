"use client";

import Shell from "./Shell";
import { skillGroups } from "@/data/resume";

export default function Skills() {
  return (
    <Shell id="skills" service="skills-service" title="Skills" align="left" wide>
      <p className="mb-6 font-mono text-[10px] tracking-widest text-muted">
        GET /skills?group=all — dependency graph resolved
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        {skillGroups.map((group) => (
          <div
            key={group.key}
            className="rounded-sm border border-line bg-panel-solid/60 p-4"
          >
            <p className="mb-3 flex items-center gap-2 font-mono text-xs text-neon">
              <span className="text-muted">deps:</span>
              {group.key}
            </p>
            <div className="flex flex-wrap gap-2">
              {group.items.map((item) => (
                <span
                  key={item}
                  className="rounded-sm border border-line px-2.5 py-1 font-mono text-xs text-fg/90 transition-colors hover:border-neon hover:text-neon"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Shell>
  );
}
