"use client";

import { useSyncExternalStore } from "react";
import { profile } from "@/data/profile";

const format = new Intl.DateTimeFormat("en-GB", {
  timeZone: profile.timeZone,
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

const subscribe = (tick: () => void) => {
  const id = setInterval(tick, 10_000);
  return () => clearInterval(id);
};

// Live clock in Hyderabad. Renders "--:--" on the server, then the real time.
export function LocalTime({ className }: { className?: string }) {
  const time = useSyncExternalStore(subscribe, () => format.format(new Date()), () => "--:--");
  return (
    <span className={`tabular-nums ${className ?? ""}`}>
      {time} <span className="text-mute">IST</span>
    </span>
  );
}
