"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { onReveal } from "@/lib/reveal";

const SELECTOR = "[data-reveal], [data-split], [data-words]";

// One observer for the whole site: anything marked data-reveal / data-split /
// data-words gets `.is-in` when it scrolls into view, and CSS does the rest.
// It waits for the preloader or transition curtain before it starts.
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    let io: IntersectionObserver | null = null;
    let mo: MutationObserver | null = null;

    const stop = onReveal(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-in");
              observer.unobserve(entry.target);
            }
          }
        },
        { rootMargin: "0px 0px -6% 0px", threshold: 0.01 }
      );
      io = observer;

      const watch = (root: ParentNode) => {
        root.querySelectorAll(SELECTOR).forEach((el) => {
          if (!el.classList.contains("is-in")) observer.observe(el);
        });
      };
      watch(document);

      mo = new MutationObserver((mutations) => {
        for (const m of mutations) {
          m.addedNodes.forEach((node) => {
            if (!(node instanceof Element)) return;
            if (node.matches(SELECTOR)) observer.observe(node);
            watch(node);
          });
        }
      });
      mo.observe(document.body, { childList: true, subtree: true });
    });

    return () => {
      stop();
      io?.disconnect();
      mo?.disconnect();
    };
  }, [pathname]);

  return null;
}
