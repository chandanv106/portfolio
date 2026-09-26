"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/hooks";
import { certifications, experience, milestones } from "@/data/journey";
import { SplitText } from "@/components/motion/SplitText";
import { CountUp } from "@/components/motion/CountUp";
import { SectionLabel } from "./SectionLabel";

const KIND_COLOR = { work: "#ff6b2c", product: "#ffc21a", study: "#9b8cff", cert: "#4f8bff" } as const;
const KIND_LABEL = { work: "Work", product: "Shipped", study: "Education", cert: "Certified" } as const;

export function Journey() {
  const timeline = useRef<HTMLDivElement>(null);

  // The timeline's spine fills in as you scroll past it.
  useEffect(() => {
    const el = timeline.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-spine]",
        { scaleY: 0 },
        { scaleY: 1, ease: "none", scrollTrigger: { trigger: el, start: "top 70%", end: "bottom 60%", scrub: true } }
      );
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section id="journey" className="gutter relative py-24 md:py-40">
      <SectionLabel index="03">Experience</SectionLabel>
      <SplitText
        as="h2"
        text="Where I've been"
        className="mt-6 block font-display text-[17vw] font-black uppercase leading-[0.85] tracking-[-0.01em] md:text-[10.5vw]"
      />

      {/* Current role */}
      <article data-reveal className="relative mt-14 overflow-hidden rounded-[28px] border border-line bg-ink-2 p-6 md:mt-20 md:p-12">
        <div className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-accent/20 blur-3xl" />
        <div className="relative flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="label flex items-center gap-2 text-accent">
              <span className="pulse-dot" /> Current role
            </p>
            <h3 className="mt-4 font-display text-5xl font-black uppercase md:text-7xl">{experience.company}</h3>
            <p className="mt-2 text-lg text-paper/75">{experience.role}</p>
          </div>
          <p className="label text-mute md:text-right">
            {experience.period}
            <br />
            {experience.location}
          </p>
        </div>

        <ul className="relative mt-8 grid gap-3 text-paper/75 md:mt-10 md:grid-cols-2 md:gap-x-12">
          {experience.points.map((point) => (
            <li key={point} className="flex gap-3 leading-relaxed">
              <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-accent" />
              {point}
            </li>
          ))}
        </ul>

        <dl className="relative mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-4">
          {experience.metrics.map((m) => (
            <div key={m.label} className="flex flex-col gap-1 bg-ink-2 p-5">
              <dt className="order-2 text-sm text-mute">{m.label}</dt>
              <dd className="font-display text-5xl font-black">
                <CountUp value={m.value} suffix={m.suffix} />
              </dd>
            </div>
          ))}
        </dl>
      </article>

      {/* Timeline */}
      <div ref={timeline} className="relative mt-20 md:mt-28">
        <p data-reveal className="label mb-10 text-mute">The road so far</p>
        <div className="absolute bottom-0 left-[7px] top-14 w-px bg-line md:left-[calc(8rem+7px)]">
          <div data-spine className="h-full w-full origin-top bg-gradient-to-b from-accent via-[#ffc21a] to-[#4f8bff]" />
        </div>
        <ol className="flex flex-col gap-9 md:gap-11">
          {milestones.map((m, i) => (
            <li key={`${m.year}-${m.title}`} data-reveal style={{ "--d": `${(i % 3) * 0.06}s` } as React.CSSProperties} className="relative grid gap-1 pl-10 md:grid-cols-[8rem_1fr] md:gap-0 md:pl-0">
              <span className="label pt-1 text-mute md:pr-8 md:text-right">{m.year}</span>
              <span
                className="absolute left-0 top-1.5 size-[15px] rounded-full border-[3px] border-ink md:left-[8rem]"
                style={{ background: KIND_COLOR[m.kind] }}
              />
              <div className="md:pl-12">
                <p className="text-xl font-bold tracking-tight md:text-2xl">{m.title}</p>
                <p className="mt-1 text-paper/60">{m.detail}</p>
                <span className="label mt-2 inline-block" style={{ color: KIND_COLOR[m.kind] }}>
                  {KIND_LABEL[m.kind]}
                </span>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* Certifications */}
      <div className="mt-24 md:mt-32">
        <p data-reveal className="label mb-8 text-mute">Certifications</p>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {certifications.map((c, i) => (
            <li
              key={c.code}
              data-reveal
              style={{ "--d": `${i * 0.06}s` } as React.CSSProperties}
              className="group relative overflow-hidden rounded-3xl border border-line bg-ink-2 p-5 transition-colors duration-500 hover:border-accent/60"
            >
              <div className="absolute inset-0 translate-y-full bg-accent transition-transform duration-500 ease-[var(--ease-expo)] group-hover:translate-y-0" />
              <div className="relative transition-colors duration-500 group-hover:text-ink">
                <p className="font-display text-3xl font-black uppercase">{c.code}</p>
                <p className="mt-6 text-[15px] font-semibold leading-snug">{c.name}</p>
                <p className="mt-1 text-sm opacity-60">
                  {c.issuer} · {c.date}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
