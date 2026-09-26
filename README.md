# Chandan Verma — Portfolio

Live at [chandanverma.vercel.app](https://chandanverma.vercel.app).

A dark, motion-heavy portfolio that works the same on phones and desktops:

- **Liquid-chrome hero** — a WebGL blob (React Three Fiber) that ripples, bulges
  toward your cursor or finger, and tilts with an Android phone. The name above
  it inverts wherever the chrome passes behind.
- **Custom cursor** (mouse/trackpad only) that morphs over links, project cards
  ("View") and draggable things ("Drag"), plus magnetic buttons.
- **Smooth scrolling** (Lenis) driving GSAP ScrollTrigger: stacking project
  cards, a word-by-word scroll reveal, velocity-reactive marquee tapes, a
  self-drawing timeline, parallax covers.
- **Page transitions** — a two-tone curtain carrying the destination's name.
- **A page for every project** at `/work/<slug>`: overview, what I built,
  numbers, screens with a lightbox, an animated architecture diagram, stack.
- A one-time preloader, film grain, a draggable 3D skill globe, count-ups.

Everything respects `prefers-reduced-motion`, and all text is server-rendered
HTML (the animations only reveal it).

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS v4 ·
React Three Fiber + drei · GSAP + ScrollTrigger · Lenis

## Updating content

All content lives in `src/data/`:

| File | What it holds |
| --- | --- |
| `profile.ts` | Name, links, hero tagline, about text, headline stats |
| `projects.ts` | Every project: copy, metrics, highlights, stack, screens, architecture diagram |
| `journey.ts` | Capgemini role, the timeline, certifications |
| `skills.ts` | Skill groups (also fill the 3D globe) and the marquee words |

### Adding a case study (e.g. the Sleek projects)

1. Put screenshots in `public/work/<slug>/`.
2. In `src/data/projects.ts`, add a `screens` list, add the GitHub link to
   `links` / `caseStudy`, and switch `visual` to
   `{ kind: "image", src: "/work/<slug>/cover.png", ... }` if you want a real
   cover instead of the animated illustration.

Replace `public/ChandanVerma_Resume.pdf` to update the downloadable résumé.
`GET /api/resume` serves the same data as JSON.

## Develop

```bash
npm install
npm run dev
```

## Deploy

Pushes to `main` deploy to production on Vercel automatically.
