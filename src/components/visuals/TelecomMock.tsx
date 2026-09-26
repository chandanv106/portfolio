import { FitBox } from "./FitBox";

const PLANS = [
  ["Full Fibre 900", "900 Mbps"],
  ["Full Fibre 500", "500 Mbps"],
  ["Superfast 80", "80 Mbps"],
];

// Illustration of the order funnel: address lookup, live availability,
// partner attribution. Invented address and IDs; the real app is private.
export function TelecomMock() {
  return (
    <FitBox width={600} height={480}>
      <div className="relative h-full w-full text-white">
        <div className="absolute inset-x-[30px] top-[22px] rounded-[24px] border border-white/10 bg-[#07130f] p-5 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]">
          <div className="flex items-center justify-between text-[10.5px] uppercase tracking-[0.14em] text-white/45">
            <span>New order</span>
            <span>Step 3 of 8</span>
          </div>
          <div className="mt-3 flex items-center gap-1.5">
            {Array.from({ length: 8 }, (_, i) => (
              <span key={i} className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
                {i < 3 && (
                  <span
                    className="block h-full origin-left animate-[tel-step_6s_var(--ease-expo)_infinite] rounded-full bg-[#2fd9a6]"
                    style={{ animationDelay: `${i * 0.25}s` }}
                  />
                )}
              </span>
            ))}
          </div>

          <div className="mt-5 font-display text-[22px] font-extrabold">Check availability</div>
          <div className="relative mt-3 flex items-center gap-3 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
            <span className="text-[15px]">📍</span>
            <span className="text-[13px] font-semibold">12 Harbour Road, Bristol BS1</span>
            <span className="absolute inset-y-0 left-0 w-1/3 animate-[tel-scan_3s_ease-in-out_infinite] bg-[linear-gradient(90deg,transparent,rgba(47,217,166,0.25),transparent)]" />
          </div>

          <div className="mt-4 space-y-2">
            {PLANS.map(([name, speed], i) => (
              <div
                key={name}
                className="flex animate-[tel-plan_6s_var(--ease-expo)_infinite] items-center justify-between rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3"
                style={{ animationDelay: `${0.4 + i * 0.2}s` }}
              >
                <div>
                  <div className="text-[13px] font-bold">{name}</div>
                  <div className="text-[10.5px] text-white/50">{speed} · live from PXC</div>
                </div>
                <span className="rounded-full bg-[#2fd9a6]/15 px-2.5 py-1 text-[10.5px] font-bold text-[#5ff0c0]">Available ✓</span>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-[26px] left-[46px] animate-[float-y_6s_ease-in-out_infinite] rounded-2xl border border-white/12 bg-[#0d1d17] px-4 py-3 shadow-2xl">
          <div className="text-[10px] uppercase tracking-[0.14em] text-white/45">Partner</div>
          <div className="mt-1 text-[13px] font-bold">Agent PX-2041 · attributed</div>
        </div>
        <div className="absolute bottom-[26px] right-[46px] flex animate-[float-y_7s_ease-in-out_infinite_reverse] flex-col gap-1.5 rounded-2xl border border-white/12 bg-[#0d1d17] px-4 py-3 shadow-2xl">
          <div className="text-[11px] font-semibold">✉️ HQ notified</div>
          <div className="text-[11px] font-semibold">✉️ Partner notified</div>
        </div>
      </div>
    </FitBox>
  );
}
