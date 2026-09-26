"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "@/lib/gsap";
import { getLenis } from "@/lib/scroll";
import { prefersReducedMotion } from "@/lib/hooks";
import { profile, socials } from "@/data/profile";
import { TransitionLink } from "@/components/motion/PageTransition";
import { Magnetic } from "@/components/motion/Magnetic";
import { LocalTime } from "./LocalTime";
import { Roll } from "@/components/ui/Arrow";

const LINKS = [
  { label: "Work", href: "/#work" },
  { label: "About", href: "/#about" },
  { label: "Experience", href: "/#journey" },
  { label: "Stack", href: "/#stack" },
  { label: "Contact", href: "/#contact" },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  const bar = useRef<HTMLElement>(null);
  const pathname = usePathname();

  // Slide away while scrolling down, come back on the way up.
  useEffect(() => {
    let last = window.scrollY;
    let hidden = false;
    const onScroll = () => {
      const y = window.scrollY;
      const hide = y > last && y > 140;
      if (hide !== hidden && Math.abs(y - last) > 2) {
        hidden = hide;
        gsap.to(bar.current, { yPercent: hide ? -130 : 0, duration: 0.7, ease: "expo.out" });
      }
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // A route change always brings the bar back.
  useEffect(() => {
    gsap.set(bar.current, { yPercent: 0 });
  }, [pathname]);

  return (
    <>
      <header ref={bar} className="fixed inset-x-0 top-0 z-[120] text-white mix-blend-difference">
        <div className="gutter flex items-center justify-between py-5 md:py-6">
          <TransitionLink href="/" transitionLabel="Home" className="roll-host font-display text-2xl font-black uppercase tracking-wide md:text-[1.7rem]">
            <Roll>{profile.name}</Roll>
          </TransitionLink>

          <nav aria-label="Main" className="hidden items-center gap-9 md:flex">
            {LINKS.map((link) => (
              <TransitionLink key={link.href} href={link.href} transitionLabel={link.label} className="roll-host text-[15px] font-semibold">
                <Roll>{link.label}</Roll>
              </TransitionLink>
            ))}
            <Magnetic>
              <TransitionLink
                href="/#contact"
                transitionLabel="Contact"
                className="roll-host inline-flex items-center gap-2 rounded-full border border-white px-5 py-2.5 text-[15px] font-semibold"
              >
                <span className="pulse-dot" />
                <Roll>Let&apos;s talk</Roll>
              </TransitionLink>
            </Magnetic>
          </nav>

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex items-center gap-3 text-[15px] font-semibold md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            Menu
            <span className="flex w-7 flex-col gap-[5px]" aria-hidden="true">
              <span className="h-[2px] w-full bg-white" />
              <span className="h-[2px] w-2/3 self-end bg-white" />
            </span>
          </button>
        </div>
      </header>
      <MobileMenu open={open} onClose={() => setOpen(false)} />
    </>
  );
}

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const lenis = getLenis();
    const items = el.querySelectorAll("[data-menu-item]");
    const quick = prefersReducedMotion();

    if (open) {
      lenis?.stop();
      gsap.set(el, { visibility: "visible" });
      gsap.fromTo(
        el,
        { clipPath: "circle(0% at 92% 4%)" },
        { clipPath: "circle(150% at 92% 4%)", duration: quick ? 0 : 0.9, ease: "expo.inOut" }
      );
      gsap.fromTo(items, { yPercent: 110 }, { yPercent: 0, duration: quick ? 0 : 1, ease: "expo.out", stagger: 0.06, delay: quick ? 0 : 0.3 });
      closeBtn.current?.focus();
      const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }

    lenis?.start();
    gsap.to(el, {
      clipPath: "circle(0% at 92% 4%)",
      duration: quick ? 0 : 0.7,
      ease: "expo.inOut",
      onComplete: () => {
        gsap.set(el, { visibility: "hidden" });
      },
    });
  }, [open, onClose]);

  return (
    <div
      ref={root}
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      className="invisible fixed inset-0 z-[130] flex flex-col bg-accent text-ink md:hidden"
    >
      <div className="gutter flex items-center justify-between py-5">
        <span className="font-display text-2xl font-black uppercase tracking-wide">{profile.name}</span>
        <button ref={closeBtn} type="button" onClick={onClose} className="flex items-center gap-3 text-[15px] font-semibold">
          Close
          <span className="relative block size-6" aria-hidden="true">
            <span className="absolute left-0 top-1/2 h-[2px] w-full rotate-45 bg-ink" />
            <span className="absolute left-0 top-1/2 h-[2px] w-full -rotate-45 bg-ink" />
          </span>
        </button>
      </div>

      <nav aria-label="Mobile" className="gutter mt-6 flex flex-1 flex-col justify-center gap-1">
        {LINKS.map((link, i) => (
          <div key={link.href} className="overflow-hidden">
            <div data-menu-item>
              <TransitionLink
                href={link.href}
                transitionLabel={link.label}
                onClick={onClose}
                className="flex items-baseline gap-4 font-display text-[16vw] font-black uppercase leading-[1]"
              >
                <span className="font-mono text-sm font-medium">0{i + 1}</span>
                {link.label}
              </TransitionLink>
            </div>
          </div>
        ))}
      </nav>

      <div className="gutter pb-8">
        <div className="overflow-hidden">
          <div data-menu-item className="flex flex-col gap-4 border-t border-ink/20 pt-6">
            <a href={`mailto:${profile.email}`} className="text-lg font-bold underline decoration-2 underline-offset-4">
              {profile.email}
            </a>
            <div className="flex items-center justify-between text-sm font-semibold">
              <div className="flex gap-5">
                {socials.map((s) => (
                  <a key={s.label} href={s.href} target={s.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
                    {s.label}
                  </a>
                ))}
              </div>
              <LocalTime />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
