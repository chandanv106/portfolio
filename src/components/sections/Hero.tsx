"use client";

import { motion } from "framer-motion";
import { profile } from "@/data/resume";

const curlResponse = `{
  "name": "${profile.name}",
  "role": "${profile.role}",
  "experience": "~2 years",
  "focus": ["microservices", "kafka", "spring-boot"],
  "location": "${profile.location}",
  "status": 200
}`;

export default function Hero() {
  const jump = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section
      id="gateway"
      className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 pt-20 sm:px-6"
    >
      {/* scrim so the hero text stays readable over the 3D scene */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_55%_at_50%_42%,rgba(5,5,16,0.88),rgba(5,5,16,0.45)_55%,transparent_78%)]" />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative flex max-w-3xl flex-col items-center text-center"
      >
        <p className="mb-4 font-mono text-xs tracking-[0.3em] text-neon">
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
          className="panel mt-8 w-full max-w-lg rounded-sm p-4 text-left"
        >
          <p className="font-mono text-xs text-muted">
            <span className="text-ok">$</span> curl -X GET https://chandan.dev/v1/profile
          </p>
          <pre className="mt-2 overflow-x-auto font-mono text-xs leading-relaxed text-neon-soft">
            {curlResponse}
          </pre>
        </motion.div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => jump("projects")}
            className="rounded-sm border border-neon bg-neon/10 px-6 py-2.5 font-mono text-sm text-neon transition-all hover:bg-neon/20 hover:shadow-[0_0_20px_rgba(34,211,238,0.35)]"
          >
            view projects →
          </button>
          <a
            href={profile.resumeUrl}
            download
            className="rounded-sm border border-line px-6 py-2.5 font-mono text-sm text-fg transition-colors hover:border-line-strong hover:text-neon-soft"
          >
            download résumé ↓
          </a>
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="absolute bottom-8 font-mono text-[11px] tracking-widest text-muted"
      >
        scroll to route your request ↓
      </motion.p>
    </section>
  );
}
