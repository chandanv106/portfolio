import { useId } from "react";
import { FitBox } from "./FitBox";

const ROUTES = [
  { d: "M 30 390 C 110 330, 150 250, 250 240 S 330 120, 360 70", dur: "9s" },
  { d: "M 20 150 C 90 170, 150 230, 210 300 S 310 400, 360 420", dur: "11s" },
  { d: "M 40 60 C 120 90, 180 60, 230 130 S 280 300, 350 260", dur: "7.5s" },
];

const EVENTS = [
  ["location.updated", "unit-2041", "38 ms"],
  ["telemetry.batch", "500 rows", "61 ms"],
  ["maintenance.due", "unit-0932", "44 ms"],
  ["route.assigned", "unit-1177", "29 ms"],
  ["engine.alert", "unit-0415", "41 ms"],
  ["location.updated", "unit-3380", "35 ms"],
  ["fuel.low", "unit-0078", "52 ms"],
  ["trip.completed", "unit-1523", "47 ms"],
];

// Illustration: live routes on a map and the Kafka event stream behind them.
export function FleetMock() {
  const uid = useId().replace(/:/g, "");
  return (
    <FitBox width={600} height={480}>
      <div className="relative h-full w-full overflow-hidden rounded-[22px] border border-white/10 bg-[#060a14] text-white">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(79,139,255,0.09)_1px,transparent_1px),linear-gradient(90deg,rgba(79,139,255,0.09)_1px,transparent_1px)] bg-[size:30px_30px]" />
        <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_35%_50%,rgba(79,139,255,0.18),transparent_70%)]" />

        <svg className="absolute left-0 top-0" width="380" height="480" viewBox="0 0 380 480" aria-hidden="true">
          {ROUTES.map((r, i) => (
            <g key={i}>
              <path id={`${uid}-r${i}`} d={r.d} fill="none" stroke="rgba(79,139,255,0.55)" strokeWidth="2" strokeDasharray="2 7" strokeLinecap="round" />
              <circle r="11" fill="rgba(79,139,255,0.18)">
                <animateMotion dur={r.dur} repeatCount="indefinite" rotate="auto">
                  <mpath href={`#${uid}-r${i}`} />
                </animateMotion>
              </circle>
              <circle r="4.5" fill="#9fc0ff">
                <animateMotion dur={r.dur} repeatCount="indefinite">
                  <mpath href={`#${uid}-r${i}`} />
                </animateMotion>
              </circle>
            </g>
          ))}
          {[
            [250, 240],
            [210, 300],
            [230, 130],
          ].map(([x, y], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r="14" fill="none" stroke="rgba(159,192,255,0.35)">
                <animate attributeName="r" values="6;18;6" dur="3s" begin={`${i * 0.8}s`} repeatCount="indefinite" />
                <animate attributeName="opacity" values="1;0;1" dur="3s" begin={`${i * 0.8}s`} repeatCount="indefinite" />
              </circle>
              <circle cx={x} cy={y} r="4" fill="#4f8bff" />
            </g>
          ))}
        </svg>

        <div className="absolute left-5 top-5 rounded-2xl border border-white/10 bg-[#0b1224]/90 px-4 py-3">
          <div className="flex items-center gap-2 text-[10.5px] uppercase tracking-[0.14em] text-white/55">
            <span className="size-2 rounded-full bg-[#3ddc84]" /> Fleet · live
          </div>
          <div className="mt-1 font-display text-[26px] font-extrabold leading-none">
            5,000+ <span className="text-[13px] font-semibold text-white/55">units</span>
          </div>
        </div>

        <div className="absolute bottom-5 left-5 flex gap-2">
          {[
            ["< 200 ms", "events"],
            ["99.9%", "consistent"],
            ["3.5x", "writes"],
          ].map(([v, l]) => (
            <div key={l} className="rounded-xl border border-white/10 bg-[#0b1224]/90 px-3 py-2">
              <div className="text-[14px] font-extrabold leading-none text-[#9fc0ff]">{v}</div>
              <div className="mt-1 text-[9.5px] uppercase tracking-[0.12em] text-white/45">{l}</div>
            </div>
          ))}
        </div>

        <div className="absolute bottom-4 right-4 top-4 w-[218px] overflow-hidden rounded-2xl border border-white/10 bg-[#0b1224]/95 p-3">
          <div className="flex items-center justify-between text-[10.5px] text-white/55">
            <span className="font-mono">kafka · fleet.events</span>
            <span className="size-2 animate-pulse rounded-full bg-[#4f8bff]" />
          </div>
          <div className="relative mt-3 h-[392px] overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_12%,black_85%,transparent)]">
            <div className="animate-[fleet-log_14s_linear_infinite] space-y-2">
              {[...EVENTS, ...EVENTS].map(([name, unit, ms], i) => (
                <div key={i} className="rounded-xl border border-white/[0.07] bg-white/[0.03] px-3 py-2">
                  <div className="font-mono text-[10.5px] text-[#9fc0ff]">{name}</div>
                  <div className="mt-0.5 flex justify-between text-[10px] text-white/50">
                    <span>{unit}</span>
                    <span>{ms}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </FitBox>
  );
}
