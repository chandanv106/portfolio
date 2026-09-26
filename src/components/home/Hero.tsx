"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion, REDUCED_MOTION, useMediaQuery, useWebGL } from "@/lib/hooks";
import { profile } from "@/data/profile";
import { SplitText } from "@/components/motion/SplitText";
import { Magnetic } from "@/components/motion/Magnetic";
import { TransitionLink } from "@/components/motion/PageTransition";
import { LocalTime } from "@/components/layout/LocalTime";
import { Arrow, Roll } from "@/components/ui/Arrow";

const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

export function Hero() {
  const section = useRef<HTMLElement>(null);
  const visual = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(true);

  const webgl = useWebGL();
  const reduced = useMediaQuery(REDUCED_MOTION);
  const mobile = useMediaQuery("(max-width: 767px)");

  // Stop rendering the 3D scene once the hero is off screen.
  useEffect(() => {
    const el = section.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Scrolling away pulls the two name lines apart and sinks the chrome.
  useEffect(() => {
    const el = section.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const trigger = { trigger: el, start: "top top", end: "bottom top", scrub: true };
      gsap.to("[data-line='1']", { xPercent: -14, ease: "none", scrollTrigger: trigger });
      gsap.to("[data-line='2']", { xPercent: 14, ease: "none", scrollTrigger: trigger });
      gsap.to("[data-fade]", { opacity: 0, y: -40, ease: "none", scrollTrigger: { ...trigger, end: "45% top" } });
      gsap.to(visual.current, { yPercent: 18, scale: 0.86, opacity: 0.25, ease: "none", scrollTrigger: trigger });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={section} id="top" className="relative isolate flex h-[100svh] min-h-[620px] flex-col overflow-hidden">
      {/* soft coloured light behind the chrome */}
      <div className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(60%_50%_at_68%_45%,rgba(255,107,44,0.16),transparent_70%),radial-gradient(40%_40%_at_20%_80%,rgba(79,123,255,0.10),transparent_70%)]" />

      <div ref={visual} className="absolute inset-0 -z-10">
        {webgl === true && !reduced ? (
          <div className="absolute inset-0 animate-[fade-in_1.6s_ease_both]">
            <HeroScene active={active} mobile={mobile} />
          </div>
        ) : webgl === false || reduced ? (
          <div className="absolute left-1/2 top-[42%] size-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_35%_30%,#fff_0%,#ffd9c7_12%,#ff6b2c_38%,#6b2cff_70%,transparent_72%)] opacity-80 blur-[2px] md:left-[62%]" />
        ) : null}
      </div>

      <div className="gutter relative flex flex-1 flex-col pb-7 pt-24 md:pb-10 md:pt-28">
        <div data-fade className="flex items-start justify-between gap-6">
          <p data-reveal className="label max-w-[14rem] leading-relaxed text-paper/70" style={{ "--d": "0.35s" } as React.CSSProperties}>
            {profile.role}
            <br />
            <span className="text-mute">Backend · Web · Mobile</span>
          </p>
          <p data-reveal className="label text-right leading-relaxed text-paper/70" style={{ "--d": "0.45s" } as React.CSSProperties}>
            {profile.location}
            <br />
            <LocalTime />
          </p>
        </div>

        <h1 className="my-auto select-none font-display font-black uppercase leading-[0.8] tracking-[-0.01em] text-white mix-blend-difference">
          <span className="sr-only">{profile.name}</span>
          <span aria-hidden="true" data-line="1" className="block whitespace-nowrap text-[24vw] md:text-[19vw]">
            <SplitText text={profile.firstName} />
          </span>
          <span aria-hidden="true" data-line="2" className="block whitespace-nowrap text-right text-[24vw] md:text-[19vw]">
            <SplitText text={profile.lastName} delay={0.15} />
          </span>
        </h1>

        <div data-fade className="flex flex-col gap-7 md:flex-row md:items-end md:justify-between">
          <p data-reveal className="max-w-md text-[17px] leading-relaxed text-paper/80 md:text-lg" style={{ "--d": "0.55s" } as React.CSSProperties}>
            {profile.tagline}
          </p>
          <div data-reveal className="flex flex-wrap items-center gap-3" style={{ "--d": "0.65s" } as React.CSSProperties}>
            <Magnetic>
              <TransitionLink
                href="/#work"
                className="roll-host group inline-flex h-13 items-center gap-3 rounded-full bg-paper pl-6 pr-2 text-[15px] font-bold text-ink transition-colors hover:bg-accent"
              >
                <Roll>View my work</Roll>
                <span className="grid size-9 place-items-center rounded-full bg-ink text-paper transition-transform duration-500 group-hover:rotate-90">
                  <Arrow direction="down" />
                </span>
              </TransitionLink>
            </Magnetic>
            <Magnetic>
              <a
                href={profile.resumeUrl}
                download
                className="roll-host inline-flex h-13 items-center rounded-full border border-paper/30 px-6 text-[15px] font-bold transition-colors hover:border-paper"
              >
                <Roll>Download CV</Roll>
              </a>
            </Magnetic>
          </div>
        </div>
      </div>

      <div data-fade className="pointer-events-none absolute bottom-7 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 md:flex">
        <span className="label text-mute">Scroll</span>
        <span className="relative h-12 w-px overflow-hidden bg-line">
          <span className="absolute inset-x-0 top-0 h-1/2 animate-[scroll-cue_1.8s_var(--ease-quart)_infinite] bg-paper" />
        </span>
      </div>
    </section>
  );
}
