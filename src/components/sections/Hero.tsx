"use client";

import { motion } from "framer-motion";
import { profile } from "@/data/resume";

// This command is real: /api/resume is a live endpoint and these fields
// exist on it, so anyone can paste it into a terminal and get this back.
const curlCommand =
  "curl -s https://chandanverma.vercel.app/api/resume \\\n    | jq '.profile | {name, role, location}'";

const curlResponse = `{
  "name": "${profile.name}",
  "role": "${profile.role}",
  "location": "${profile.location}"
}`;

export default function Hero() {
  const jump = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section
      id="gateway"
      className="relative z-10 flex min-h-[100dvh] flex-col items-center justify-center px-4 pt-20 sm:px-6"
    >
      {/* scrim so the hero text stays readable over the 3D scene */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_55%_at_50%_42%,rgba(5,5,16,0.88),rgba(5,5,16,0.45)_55%,transparent_78%)]" />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        // w-full is load-bearing: without it the column sizes to max-content
        // and the mono/JSON children push it wider than a phone viewport.
        className="relative flex w-full max-w-3xl flex-col items-center text-center"
      >
        <p className="mb-4 font-mono text-[10px] tracking-[0.16em] text-neon sm:text-xs sm:tracking-[0.3em]">
          // WELCOME TO MY DISTRIBUTED SYSTEM
        </p>
        <h1 className="text-5xl font-bold tracking-tight sm:text-7xl">
          {profile.name}
        </h1>
        <p className="mt-4 text-xl text-neon-soft sm:text-2xl">{profile.role}</p>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
          {profile.tagline}
        </p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="panel mt-8 w-full min-w-0 max-w-lg rounded-sm p-4 text-left"
        >
          <p className="whitespace-pre-wrap break-all font-mono text-[10px] text-muted sm:text-xs sm:break-normal">
            <span className="text-ok">$</span> {curlCommand}
          </p>
          <pre className="mt-2 overflow-x-auto font-mono text-[10px] leading-relaxed text-neon-soft sm:text-xs">
            {curlResponse}
          </pre>
        </motion.div>

        <div className="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row sm:gap-4">
          <button
            onClick={() => jump("projects")}
            className="w-full rounded-sm border border-neon bg-neon/10 px-6 py-3 font-mono text-sm text-neon transition-all hover:bg-neon/20 hover:shadow-[0_0_20px_rgba(34,211,238,0.35)] sm:w-auto sm:py-2.5"
          >
            view projects →
          </button>
          <a
            href={profile.resumeUrl}
            download
            className="w-full rounded-sm border border-line px-6 py-3 text-center font-mono text-sm text-fg transition-colors hover:border-line-strong hover:text-neon-soft sm:w-auto sm:py-2.5"
          >
            download résumé ↓
          </a>
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        // kept in normal flow rather than pinned to the bottom edge: on short
        // viewports an absolute hint collides with the CTA buttons
        className="mt-10 font-mono text-[11px] tracking-widest text-muted"
      >
        scroll to route your request ↓
      </motion.p>
    </section>
  );
}
