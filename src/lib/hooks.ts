"use client";

import { useEffect, useLayoutEffect, useSyncExternalStore } from "react";

export const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

// Server render and hydration both see `false`, then the real value.
export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false
  );
}

export const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
export const FINE_POINTER = "(hover: hover) and (pointer: fine)";

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia(REDUCED_MOTION).matches;

// Desktop-style pointer: a mouse or trackpad, not a finger.
export const hasFinePointer = () =>
  typeof window !== "undefined" && window.matchMedia(FINE_POINTER).matches;

let webgl: boolean | undefined;
export function supportsWebGL() {
  if (webgl === undefined) {
    try {
      const c = document.createElement("canvas");
      webgl = !!(c.getContext("webgl2") || c.getContext("webgl"));
    } catch {
      webgl = false;
    }
  }
  return webgl;
}

const noSubscribe = () => () => {};
// `null` until hydrated, so callers can render nothing instead of guessing.
export function useWebGL(): boolean | null {
  return useSyncExternalStore<boolean | null>(noSubscribe, supportsWebGL, () => null);
}
