"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  type ComponentProps,
  type ReactNode,
} from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/hooks";
import { holdReveal, releaseReveal } from "@/lib/reveal";
import { getLenis, scrollToTarget } from "@/lib/scroll";

type NavigateOptions = { label?: string; color?: string };
type Navigate = (href: string, options?: NavigateOptions) => void;

const TransitionContext = createContext<Navigate>(() => {});

// Page changes play a two-tone curtain: a coloured panel, then a dark one
// carrying the destination's name, sweep up over the page, the route
// changes underneath, and both sweep off the top.
export function TransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const root = useRef<HTMLDivElement>(null);
  const colorPanel = useRef<HTMLDivElement>(null);
  const inkPanel = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const busy = useRef(false);
  const arriving = useRef<{ hash: string } | null>(null);

  const navigate = useCallback<Navigate>(
    (href, options = {}) => {
      const url = new URL(href, window.location.href);
      if (url.origin !== window.location.origin) {
        window.location.assign(url.href);
        return;
      }
      if (url.pathname === window.location.pathname) {
        scrollToTarget(url.hash || 0);
        return;
      }
      if (busy.current) return;
      busy.current = true;
      holdReveal();

      const go = () => {
        arriving.current = { hash: url.hash };
        router.push(url.pathname + url.hash, { scroll: false });
      };

      if (prefersReducedMotion() || !root.current) {
        go();
        return;
      }

      getLenis()?.stop();
      if (label.current) label.current.textContent = options.label ?? "";
      if (colorPanel.current) colorPanel.current.style.background = options.color ?? "var(--color-accent)";

      gsap
        .timeline()
        .set(root.current, { visibility: "visible" })
        .fromTo(colorPanel.current, { yPercent: 100 }, { yPercent: 0, duration: 0.75, ease: "expo.inOut" })
        .fromTo(inkPanel.current, { yPercent: 100 }, { yPercent: 0, duration: 0.75, ease: "expo.inOut" }, 0.09)
        .fromTo(label.current, { yPercent: 110 }, { yPercent: 0, duration: 0.7, ease: "expo.out" }, 0.5)
        .add(go, 0.84);
    },
    [router]
  );

  // The new route has committed underneath the curtain: reset scroll, then lift.
  useEffect(() => {
    const arrival = arriving.current;
    if (!arrival) return;
    arriving.current = null;

    const frame = requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        const lenis = getLenis();
        lenis?.start();
        if (arrival.hash) scrollToTarget(arrival.hash, { immediate: true });
        else if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
        else window.scrollTo(0, 0);
        ScrollTrigger.refresh();
        releaseReveal();

        if (!root.current || prefersReducedMotion()) {
          busy.current = false;
          return;
        }
        gsap
          .timeline({
            onComplete: () => {
              gsap.set(root.current, { visibility: "hidden" });
              busy.current = false;
            },
          })
          .to(label.current, { yPercent: -110, duration: 0.45, ease: "power3.in" })
          .to(inkPanel.current, { yPercent: -100, duration: 0.95, ease: "expo.inOut" }, 0.12)
          .to(colorPanel.current, { yPercent: -100, duration: 0.95, ease: "expo.inOut" }, 0.2);
      })
    );
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  return (
    <TransitionContext.Provider value={navigate}>
      {children}
      <div ref={root} className="pointer-events-none fixed inset-0 z-[350] invisible" aria-hidden="true">
        <div ref={colorPanel} className="absolute inset-0 translate-y-full bg-accent" />
        <div ref={inkPanel} className="absolute inset-0 grid translate-y-full place-items-center bg-ink">
          <span className="overflow-hidden px-6">
            <span
              ref={label}
              className="block text-center font-display text-[16vw] font-black uppercase leading-[0.9] md:text-[10vw]"
            />
          </span>
        </div>
      </div>
    </TransitionContext.Provider>
  );
}

export function useNavigate() {
  return useContext(TransitionContext);
}

type TransitionLinkProps = Omit<ComponentProps<typeof Link>, "href" | "onNavigate"> & {
  href: string;
  // Shown on the curtain while the page changes.
  transitionLabel?: string;
  transitionColor?: string;
};

// A next/link that plays the curtain. Cmd/Ctrl-click still opens a new tab.
export function TransitionLink({ href, transitionLabel, transitionColor, children, ...props }: TransitionLinkProps) {
  const navigate = useNavigate();
  return (
    <Link
      href={href}
      {...props}
      onNavigate={(e) => {
        e.preventDefault();
        navigate(href, { label: transitionLabel, color: transitionColor });
      }}
    >
      {children}
    </Link>
  );
}
