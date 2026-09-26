import type Lenis from "lenis";

// The one Lenis instance, shared so links and the transition curtain can
// drive smooth scrolling without a React context.
let instance: Lenis | null = null;

export function setLenis(lenis: Lenis | null) {
  instance = lenis;
}

export function getLenis() {
  return instance;
}

export function scrollToTarget(
  target: string | number | HTMLElement,
  options: { immediate?: boolean; offset?: number } = {}
) {
  if (instance) {
    // A menu may have paused scrolling in the same click; resume first.
    if (instance.isStopped) instance.start();
    instance.scrollTo(target, {
      offset: options.offset ?? 0,
      immediate: options.immediate,
      duration: 1.4,
    });
    return;
  }
  if (typeof target === "number") {
    window.scrollTo({ top: target, behavior: options.immediate ? "instant" : "smooth" });
    return;
  }
  const el = typeof target === "string" ? document.querySelector(target) : target;
  el?.scrollIntoView({ behavior: options.immediate ? "instant" : "smooth" });
}
