export {};

declare global {
  interface Window {
    // Set once the motion system mounts. The inline boot script un-hides
    // content if this never happens (e.g. the JS bundle failed to load).
    __motionReady?: boolean;
  }
}
