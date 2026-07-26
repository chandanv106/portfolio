"use client";

import Shell from "./Shell";
import { certifications } from "@/data/resume";

export default function Certifications() {
  return (
    <Shell
      id="certifications"
      service="auth-service"
      title="Certifications"
      align="right"
    >
      <p className="mb-5 font-mono text-[10px] tracking-widest text-muted">
        credentials verified · signature valid
      </p>
      <div className="space-y-3">
        {certifications.map((cert) => (
          <div
            key={cert.code}
            className="flex items-center justify-between gap-3 rounded-sm border border-line bg-panel-solid/60 p-4 transition-colors hover:border-line-strong"
          >
            <div>
              <p className="text-sm font-medium leading-snug">{cert.name}</p>
              <p className="mt-1 font-mono text-[11px] text-muted">
                issued by {cert.issuer}
              </p>
            </div>
            <span className="shrink-0 rounded-sm border border-ok/40 bg-ok/10 px-2.5 py-1 font-mono text-[11px] text-ok">
              ✓ {cert.code}
            </span>
          </div>
        ))}
      </div>
    </Shell>
  );
}
