export function Arrow({ className = "size-4", direction = "right" }: { className?: string; direction?: "right" | "up-right" | "down" | "up" | "left" }) {
  const rotate = { right: 0, "up-right": -45, down: 90, up: -90, left: 180 }[direction];
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: `rotate(${rotate}deg)` }} aria-hidden="true">
      <path d="M4 12h16M13 5l7 7-7 7" />
    </svg>
  );
}

// Label that rolls up to a copy of itself when its `.roll-host` is hovered.
export function Roll({ children }: { children: string }) {
  return (
    <span className="roll">
      <span>{children}</span>
      <span aria-hidden="true">{children}</span>
    </span>
  );
}
