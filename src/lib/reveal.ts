// A tiny "the page is ready to animate in" signal.
//
// The preloader (first visit) and the page transition curtain both cover the
// screen while a page mounts. They hold the signal, then release it as the
// cover starts to lift, so entrance animations play where people can see them.

type Listener = () => void;

let ready = false;
let listeners = new Set<Listener>();

export function holdReveal() {
  ready = false;
}

export function releaseReveal() {
  ready = true;
  const pending = listeners;
  listeners = new Set();
  pending.forEach((fn) => fn());
}

// Runs `fn` now if the page is visible, otherwise once the cover lifts.
export function onReveal(fn: Listener): () => void {
  if (ready) {
    fn();
    return () => {};
  }
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}
