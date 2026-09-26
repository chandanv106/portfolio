"use client";

import { useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { hasFinePointer, prefersReducedMotion } from "@/lib/hooks";
import { scrollToTarget } from "@/lib/scroll";
import { profile, socials } from "@/data/profile";
import { Magnetic } from "@/components/motion/Magnetic";
import { LocalTime } from "@/components/layout/LocalTime";
import { Arrow, Roll } from "@/components/ui/Arrow";
import { SectionLabel } from "./SectionLabel";

// Letters hop when the pointer passes over them, dragging their neighbours.
function HoverLetters({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  const hop = (index: number) => {
    const el = ref.current;
    if (!el || !hasFinePointer() || prefersReducedMotion()) return;
    const letters = el.querySelectorAll<HTMLElement>("[data-l]");
    letters.forEach((letter, i) => {
      const distance = Math.abs(i - index);
      if (distance > 2) return;
      gsap.to(letter, {
        yPercent: -22 / (distance + 1),
        duration: 0.25,
        ease: "power2.out",
        overwrite: true,
        onComplete: () => {
          gsap.to(letter, { yPercent: 0, duration: 0.9, ease: "elastic.out(1, 0.35)" });
        },
      });
    });
  };

  return (
    <span ref={ref} className={`block whitespace-nowrap ${className}`}>
      <span className="sr-only">{text}</span>
      {Array.from(text).map((ch, i) => (
        <span key={i} data-l aria-hidden="true" onPointerEnter={() => hop(i)} className="inline-block">
          {ch === " " ? " " : ch}
        </span>
      ))}
    </span>
  );
}

function CopyEmail() {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(profile.email);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch {
          window.location.href = `mailto:${profile.email}`;
        }
      }}
      className="roll-host inline-flex h-11 items-center rounded-full border border-line px-5 text-sm font-bold transition-colors hover:border-paper"
    >
      <Roll>{copied ? "Copied ✓" : "Copy email"}</Roll>
    </button>
  );
}

export function Contact({ year }: { year: number }) {
  return (
    <section id="contact" className="relative overflow-hidden pt-24 md:pt-40">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[70%] bg-[radial-gradient(60%_60%_at_50%_100%,rgba(255,107,44,0.22),transparent_70%)]" />

      <div className="gutter relative">
        <SectionLabel index="05">Contact</SectionLabel>
        <h2 className="mt-8 font-display text-[20vw] font-black uppercase leading-[0.84] tracking-[-0.01em] md:text-[15vw]">
          <HoverLetters text="Let's build" />
          <HoverLetters text="something" className="text-accent" />
        </h2>

        <div className="mt-14 flex flex-col gap-12 md:mt-20 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <p data-reveal className="text-lg text-paper/70">
              Have a product in mind, a role to fill, or just want to talk shop? My inbox is open.
            </p>
            <div data-reveal className="mt-6">
              <Magnetic strength={0.2}>
                <a
                  href={`mailto:${profile.email}`}
                  className="group inline-flex items-center gap-3 text-[6.4vw] font-extrabold tracking-[-0.03em] md:text-[3vw]"
                >
                  <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_2px] bg-left-bottom bg-no-repeat pb-1 transition-[background-size] duration-700 ease-[var(--ease-expo)] group-hover:bg-[length:100%_2px]">
                    {profile.email}
                  </span>
                  <Arrow direction="up-right" className="size-[0.7em] transition-transform duration-500 group-hover:rotate-45" />
                </a>
              </Magnetic>
            </div>
            <div data-reveal className="mt-6 flex flex-wrap gap-3">
              <CopyEmail />
              <a
                href={profile.resumeUrl}
                download
                className="roll-host inline-flex h-11 items-center rounded-full bg-paper px-5 text-sm font-bold text-ink transition-colors hover:bg-accent"
              >
                <Roll>Download CV</Roll>
              </a>
            </div>
          </div>

          <ul data-reveal className="flex flex-col gap-2 md:items-end">
            {socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target={s.href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  className="roll-host inline-flex items-center gap-2 text-2xl font-bold md:text-3xl"
                >
                  <Roll>{s.label}</Roll>
                  <Arrow direction="up-right" className="size-5" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <footer className="gutter relative mt-24 flex flex-col gap-4 border-t border-line py-7 text-sm text-mute md:mt-32 md:flex-row md:items-center md:justify-between">
        <span>
          © {year} {profile.name}
        </span>
        <span>
          {profile.location} · <LocalTime className="text-paper" />
        </span>
        <button type="button" onClick={() => scrollToTarget(0)} className="roll-host inline-flex items-center gap-2 font-semibold text-paper">
          <Roll>Back to top</Roll>
          <Arrow direction="up" className="size-4" />
        </button>
      </footer>

      <div aria-hidden="true" className="pointer-events-none select-none overflow-hidden">
        <p className="translate-y-[16%] whitespace-nowrap text-center font-display text-[13.5vw] font-black uppercase leading-[0.8] text-paper/[0.05]">
          {profile.name}
        </p>
      </div>
    </section>
  );
}
