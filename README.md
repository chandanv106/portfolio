# Chandan Verma — Portfolio

A portfolio rendered as a **living distributed system**: the visitor arrives as a
request at an API Gateway and scrolls through a 3D microservices architecture —
each section is a glowing service pod connected by a Kafka-style event bus with
message packets streaming along it.

## Stack

- **Next.js 16** (App Router) + TypeScript
- **React Three Fiber + drei + postprocessing** — the 3D scene (bloom, starfield, grid)
- **Tailwind CSS v4** — 2D content layers
- **framer-motion** — section reveals

## Develop

```bash
npm install
npm run dev
```

## Updating content

All resume content lives in one file: `src/data/resume.ts`.
Edit it and the whole site updates. Replace `public/ChandanVerma_Resume.pdf`
to update the downloadable résumé.

## Architecture notes

- `src/components/three/layout.ts` — world positions of every service node and
  the camera waypoints; the event-bus curve threads through them.
- `src/components/three/CameraRig.tsx` — maps document scroll progress (0–1) to
  a smoothed flight path with a "dwell" at each node.
- `src/components/PortfolioApp.tsx` — decides 3D vs 2D: mobile, reduced-motion,
  or no-WebGL visitors get a lightweight animated grid fallback with the same
  content.

## Deploy

Push to GitHub and import into [Vercel](https://vercel.com) — zero config needed.
