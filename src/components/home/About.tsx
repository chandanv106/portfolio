import { profile } from "@/data/profile";
import { ScrubWords } from "@/components/motion/ScrubWords";
import { CountUp } from "@/components/motion/CountUp";
import { SectionLabel } from "./SectionLabel";

export function About() {
  return (
    <section id="about" className="gutter relative py-28 md:py-44">
      <div className="grid gap-10 md:grid-cols-12">
        <div className="md:col-span-3">
          <SectionLabel index="01">About</SectionLabel>
        </div>

        <div className="md:col-span-9">
          <ScrubWords
            text={profile.statement}
            highlight={["complete", "products."]}
            className="text-[7.4vw] font-bold leading-[1.12] tracking-[-0.035em] md:text-[3.4vw]"
          />

          <div className="mt-14 grid gap-6 text-lg leading-relaxed text-paper/70 md:mt-20 md:grid-cols-2 md:gap-12">
            {profile.about.map((line, i) => (
              <p key={i} data-reveal style={{ "--d": `${i * 0.1}s` } as React.CSSProperties}>
                {line}
              </p>
            ))}
          </div>

          <dl className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-line bg-line md:mt-24 md:grid-cols-4">
            {profile.stats.map((stat, i) => (
              <div
                key={stat.label}
                data-reveal
                style={{ "--d": `${i * 0.08}s` } as React.CSSProperties}
                className="flex flex-col gap-3 bg-ink p-5 md:p-8"
              >
                <dt className="order-2 text-sm leading-snug text-mute">{stat.label}</dt>
                <dd className="font-display text-6xl font-black md:text-7xl">
                  <CountUp value={stat.value} suffix={"suffix" in stat ? stat.suffix : ""} />
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
