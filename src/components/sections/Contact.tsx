"use client";

import Shell from "./Shell";
import { profile } from "@/data/resume";

export default function Contact() {
  return (
    <Shell id="contact" service="contact-service" title="Contact" align="center">
      <p className="mb-6 text-sm leading-relaxed text-fg/85">
        My inbox has 100% uptime. Whether it&apos;s a role, a project, or a
        question about distributed systems — route your request below.
      </p>

      <div className="rounded-sm border border-line bg-panel-solid/60 p-4">
        <p className="font-mono text-xs text-muted">
          <span className="text-violet">POST</span> /v1/contact
        </p>
        <div className="mt-4 space-y-3 font-mono text-sm">
          <a
            href={`mailto:${profile.email}`}
            className="flex items-center justify-between gap-3 rounded-sm border border-line px-3 py-2.5 transition-colors hover:border-neon hover:text-neon"
          >
            <span className="text-muted">email</span>
            <span className="truncate">{profile.email}</span>
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between gap-3 rounded-sm border border-line px-3 py-2.5 transition-colors hover:border-neon hover:text-neon"
          >
            <span className="text-muted">linkedin</span>
            <span className="truncate">chandan-verma016 ↗</span>
          </a>
          <div className="flex items-center justify-between gap-3 rounded-sm border border-line px-3 py-2.5">
            <span className="text-muted">location</span>
            <span>{profile.location}</span>
          </div>
        </div>
      </div>

      <a
        href={profile.resumeUrl}
        download
        className="mt-6 block rounded-sm border border-neon bg-neon/10 px-6 py-3 text-center font-mono text-sm text-neon transition-all hover:bg-neon/20 hover:shadow-[0_0_20px_rgba(34,211,238,0.35)]"
      >
        download résumé ↓
      </a>

      <a
        href="/api/resume"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 block text-center font-mono text-[11px] text-muted transition-colors hover:text-neon"
      >
        …or fetch it as JSON: GET /api/resume ↗
      </a>

      <p className="mt-8 border-t border-line pt-5 text-center font-mono text-[10px] leading-relaxed text-muted">
        designed &amp; built by {profile.name} · rendered by react-three-fiber
        <br />
        © {new Date().getFullYear()} — response time: &lt;24h · uptime: 100%
      </p>
    </Shell>
  );
}
