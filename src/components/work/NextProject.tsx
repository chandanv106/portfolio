"use client";

import { useRef } from "react";
import type { Project } from "@/data/projects";
import { TransitionLink } from "@/components/motion/PageTransition";
import { Arrow } from "@/components/ui/Arrow";

// A full-width link to the next project. On hover its colour floods in from
// wherever the pointer entered.
export function NextProject({ project }: { project: Project }) {
  const ref = useRef<HTMLAnchorElement>(null);

  const setOrigin = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--x", `${e.clientX - r.left}px`);
    el.style.setProperty("--y", `${e.clientY - r.top}px`);
  };

  return (
    <TransitionLink
      ref={ref}
      href={`/work/${project.slug}`}
      transitionLabel={project.name}
      transitionColor={project.color}
      onPointerEnter={setOrigin}
      onPointerLeave={setOrigin}
      data-cursor="view"
      data-cursor-label="Next"
      className="group relative block overflow-hidden border-y border-line"
    >
      <span
        className="absolute inset-0 transition-[clip-path] duration-[900ms] ease-[var(--ease-expo)] [clip-path:circle(0%_at_var(--x,50%)_var(--y,50%))] group-hover:[clip-path:circle(150%_at_var(--x,50%)_var(--y,50%))]"
        style={{ background: project.color }}
      />
      <span
        className="gutter relative flex flex-col gap-4 py-16 transition-colors duration-500 md:py-24"
        style={{ "--ink": project.ink } as React.CSSProperties}
      >
        <span className="label text-mute transition-colors duration-500 group-hover:text-[var(--ink)]">Next project</span>
        <span className="flex items-center justify-between gap-6 group-hover:text-[var(--ink)]">
          <span className="font-display text-[15vw] font-black uppercase leading-[0.85] md:text-[10vw]">
            {project.name}
          </span>
          <Arrow className="size-[9vw] shrink-0 transition-transform duration-700 ease-[var(--ease-expo)] group-hover:translate-x-3 md:size-[6vw]" />
        </span>
        <span className="max-w-xl text-paper/65 transition-colors duration-500 group-hover:text-[var(--ink)]">{project.tagline}</span>
      </span>
    </TransitionLink>
  );
}
