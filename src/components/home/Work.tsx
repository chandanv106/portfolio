"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/hooks";
import { projects } from "@/data/projects";
import { TransitionLink } from "@/components/motion/PageTransition";
import { SplitText } from "@/components/motion/SplitText";
import { ProjectVisual, visualBackdrop } from "@/components/visuals/ProjectVisual";
import { Arrow } from "@/components/ui/Arrow";
import { SectionLabel } from "./SectionLabel";

const pad = (n: number) => String(n).padStart(2, "0");

// Each project is a full-height card that sticks to the top of the screen;
// the next one slides over it while the one underneath shrinks and dims.
export function Work() {
  const list = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = list.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>("[data-stack-item]");
      items.forEach((item, i) => {
        const next = items[i + 1];
        if (!next) return;
        const card = item.querySelector("[data-card]");
        const shade = item.querySelector("[data-shade]");
        const trigger = { trigger: next, start: "top bottom", end: "top 15%", scrub: true };
        gsap.to(card, { scale: 0.9, ease: "none", scrollTrigger: trigger });
        gsap.to(shade, { opacity: 0.65, ease: "none", scrollTrigger: trigger });
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section id="work" className="relative pb-24 pt-20 md:pb-40 md:pt-28">
      <div className="gutter mb-14 flex flex-col gap-6 md:mb-20 md:flex-row md:items-end md:justify-between">
        <div>
          <SectionLabel index="02">Selected work</SectionLabel>
          <SplitText
            as="h2"
            text="Things I've built"
            className="mt-6 block font-display text-[17vw] font-black uppercase leading-[0.85] tracking-[-0.01em] md:text-[10.5vw]"
          />
        </div>
        <p data-reveal className="max-w-sm text-paper/65 md:pb-3 md:text-right">
          Apps, SaaS and backends I designed, built and shipped. Pick one to see how it works.
        </p>
      </div>

      <div ref={list} className="gutter flex flex-col gap-[6vh]">
        {projects.map((project, i) => (
          <div
            key={project.slug}
            data-stack-item
            className="sticky"
            style={{ top: `calc(11vh + ${i * 14}px)` }}
          >
            <TransitionLink
              href={`/work/${project.slug}`}
              transitionLabel={project.name}
              transitionColor={project.color}
              data-cursor="view"
              data-cursor-label="View"
              className="group block rounded-[28px] focus-visible:outline-offset-4"
            >
              <article
                data-card
                className="relative h-[80svh] origin-top overflow-hidden rounded-[28px] border border-line bg-ink-2 md:h-[76vh]"
              >
                <div data-shade className="pointer-events-none absolute inset-0 z-20 bg-black opacity-0" />
                <div className="grid h-full grid-rows-[46%_1fr] md:grid-cols-[1fr_1.3fr] md:grid-rows-1">
                  <div className="relative m-2.5 overflow-hidden rounded-[20px] md:order-2 md:m-3.5" style={visualBackdrop(project.color)}>
                    <div className="absolute inset-0 transition-transform duration-[1.2s] ease-[var(--ease-expo)] group-hover:scale-[1.04]">
                      <ProjectVisual project={project} sizes="(min-width: 768px) 58vw, 100vw" />
                    </div>
                  </div>

                  <div className="flex min-h-0 flex-col justify-between p-5 pt-3 md:order-1 md:p-10">
                    <div className="label flex items-center justify-between text-mute">
                      <span>
                        <span className="text-paper">{pad(i + 1)}</span> / {pad(projects.length)}
                      </span>
                      <span>
                        {project.kind} · {project.year}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-display text-[13vw] font-black uppercase leading-[0.88] md:text-[5.4vw]">
                        {project.name}
                      </h3>
                      <p className="mt-3 max-w-md text-[15px] leading-relaxed text-paper/70 md:mt-5 md:text-lg">{project.tagline}</p>
                      <ul className="mt-4 hidden flex-wrap gap-2 md:mt-6 md:flex">
                        {project.tags.map((tag) => (
                          <li key={tag} className="rounded-full border border-line px-3 py-1 text-xs font-semibold text-paper/80">
                            {tag}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <span className="inline-flex items-center gap-3 text-[15px] font-bold">
                      <span
                        className="grid size-11 place-items-center rounded-full transition-transform duration-500 group-hover:-rotate-45"
                        style={{ background: project.color, color: project.ink }}
                      >
                        <Arrow />
                      </span>
                      View project
                      <span className="text-mute">· {project.platform}</span>
                    </span>
                  </div>
                </div>
              </article>
            </TransitionLink>
          </div>
        ))}
      </div>
    </section>
  );
}
