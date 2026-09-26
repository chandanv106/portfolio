import { useId } from "react";
import { FitBox } from "./FitBox";

// Illustration: someone comments a keyword, HookSend answers with a DM.
// Loops every 6 s (keyframes in globals.css). Invented handles, no real UI.
export function HookSendMock() {
  const route = `hs-route-${useId().replace(/:/g, "")}`;
  return (
    <FitBox width={600} height={480}>
      <div className="relative h-full w-full text-white">
        {/* phone with a post and its comments */}
        <div className="absolute left-[34px] top-[18px] h-[444px] w-[244px] rounded-[36px] border border-white/12 bg-[#0e0e12] p-3 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]">
          <div className="mx-auto mb-3 h-[18px] w-[76px] rounded-full bg-black" />
          <div className="flex items-center gap-2 px-1">
            <span className="size-7 rounded-full bg-[conic-gradient(from_200deg,#ff4d8d,#ff9f43,#ff4d8d)] p-[2px]">
              <span className="block size-full rounded-full border-2 border-[#0e0e12] bg-[#ffd6e5]" />
            </span>
            <div className="leading-tight">
              <div className="text-[11px] font-bold">studio.kiara</div>
              <div className="text-[9px] text-white/45">Spring drop · 2h</div>
            </div>
          </div>
          <div className="relative mt-2 h-[152px] overflow-hidden rounded-2xl bg-[linear-gradient(140deg,#ff4d8d_0%,#9b5cf6_55%,#1d1a2b_100%)]">
            <div className="absolute -right-6 -top-6 size-28 rounded-full bg-[#ffc21a]/80 blur-[2px]" />
            <div className="absolute bottom-3 left-3 font-display text-[22px] font-extrabold leading-none tracking-tight">
              NEW
              <br />
              DROP
            </div>
          </div>
          <div className="mt-2 flex gap-3 px-1 text-[13px] text-white/80">
            <span>♥</span>
            <span>💬</span>
            <span className="ml-auto text-[10px] text-white/45">1,204 likes</span>
          </div>
          <div className="mt-2 space-y-2 px-1 text-[10.5px] leading-snug text-white/75">
            <p>
              <b className="text-white">aarav.k</b> this is so clean
            </p>
            <p>
              <b className="text-white">riya.m</b> need this 🔥
            </p>
            <p className="animate-[hs-comment_6s_var(--ease-expo)_infinite] rounded-xl bg-white/[0.06] px-2 py-1.5">
              <b className="text-white">meera_</b>{" "}
              <span className="rounded-md bg-[#ff4d8d]/20 px-1.5 py-0.5 font-bold text-[#ff7aa9]">PRICE</span>
            </p>
          </div>
        </div>

        {/* the comment travelling to the DM */}
        <svg className="absolute left-0 top-0" width="600" height="480" viewBox="0 0 600 480" aria-hidden="true">
          <path id={route} d="M 250 392 C 330 392, 300 150, 348 150" fill="none" stroke="rgba(255,77,141,0.45)" strokeWidth="2" strokeDasharray="4 6" />
          <circle r="6" fill="#ff4d8d">
            <animateMotion dur="6s" repeatCount="indefinite" keyPoints="0;0;1;1" keyTimes="0;0.16;0.3;1" calcMode="linear">
              <mpath href={`#${route}`} />
            </animateMotion>
            <animate attributeName="opacity" dur="6s" repeatCount="indefinite" values="0;0;1;1;0;0" keyTimes="0;0.15;0.17;0.29;0.31;1" />
          </circle>
        </svg>

        {/* the DM that arrives */}
        <div className="absolute right-[26px] top-[64px] w-[250px] animate-[hs-dm_6s_var(--ease-expo)_infinite] rounded-[26px] border border-white/12 bg-[#15151b] p-4 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]">
          <div className="flex items-center gap-2 text-[10.5px] text-white/55">
            <span className="size-2 rounded-full bg-[#3ddc84]" />
            New message · now
          </div>
          <div className="mt-3 rounded-[18px] rounded-tl-md bg-[#ff4d8d] px-3 py-2.5 text-[12.5px] font-semibold leading-snug text-[#1c0712]">
            Hi Meera! 👋 Here&apos;s the price list you asked for.
          </div>
          <div className="mt-2 flex items-center gap-2.5 rounded-2xl border border-white/10 bg-white/[0.04] p-2">
            <span className="size-10 shrink-0 rounded-xl bg-[linear-gradient(140deg,#ff4d8d,#9b5cf6)]" />
            <span className="min-w-0 leading-tight">
              <span className="block truncate text-[11px] font-bold">Spring collection · prices</span>
              <span className="block truncate text-[10px] text-white/45">studio.kiara/spring</span>
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[10px] text-white/45">
            <span>Sent seconds after the comment</span>
            <span className="text-[#ff7aa9]">✓✓</span>
          </div>
        </div>

        {/* the rule behind it */}
        <div className="absolute bottom-[34px] right-[26px] w-[250px] rounded-[22px] border border-white/12 bg-[#15151b] p-4">
          <div className="flex items-center justify-between text-[10.5px] text-white/55">
            <span>Automation</span>
            <span className="flex h-[18px] w-[32px] items-center justify-end rounded-full bg-[#ff4d8d] px-[3px]">
              <span className="size-3 rounded-full bg-white" />
            </span>
          </div>
          <div className="mt-2 text-[13px] font-bold leading-snug">
            Comment contains <span className="text-[#ff7aa9]">“PRICE”</span>
          </div>
          <div className="mt-1 text-[11.5px] text-white/55">→ Send the DM once per person</div>
        </div>
      </div>
    </FitBox>
  );
}
