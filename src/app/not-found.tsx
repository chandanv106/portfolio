import { TransitionLink } from "@/components/motion/PageTransition";
import { Arrow, Roll } from "@/components/ui/Arrow";

export default function NotFound() {
  return (
    <main id="main" className="gutter relative flex min-h-[100svh] flex-col items-start justify-center overflow-hidden py-32">
      <div className="pointer-events-none absolute right-[-10vw] top-1/2 size-[60vmin] -translate-y-1/2 rounded-full bg-accent/25 blur-3xl" />
      <p className="label text-accent">Error 404</p>
      <h1 className="mt-6 font-display text-[34vw] font-black uppercase leading-[0.8] md:text-[24vw]">Lost?</h1>
      <p className="mt-8 max-w-md text-lg text-paper/70">This page doesn&apos;t exist, or it moved. The work is all on the home page.</p>
      <TransitionLink
        href="/"
        transitionLabel="Home"
        className="roll-host mt-10 inline-flex h-13 items-center gap-3 rounded-full bg-paper pl-6 pr-2 font-bold text-ink transition-colors hover:bg-accent"
      >
        <Roll>Take me home</Roll>
        <span className="grid size-9 place-items-center rounded-full bg-ink text-paper">
          <Arrow />
        </span>
      </TransitionLink>
    </main>
  );
}
