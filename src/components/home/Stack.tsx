import { skillGroups } from "@/data/skills";
import { SplitText } from "@/components/motion/SplitText";
import { SectionLabel } from "./SectionLabel";
import { SkillSphere } from "./SkillSphere";

const sphereItems = skillGroups.flatMap((g) => g.items.map((label) => ({ label, color: g.color })));

export function Stack() {
  return (
    <section id="stack" className="gutter relative overflow-hidden py-24 md:py-40">
      <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <div>
          <SectionLabel index="04">Stack</SectionLabel>
          <SplitText
            as="h2"
            text="Tools I build with"
            className="mt-6 block font-display text-[17vw] font-black uppercase leading-[0.85] tracking-[-0.01em] md:text-[9vw] lg:text-[7vw]"
          />
          <p data-reveal className="mt-6 max-w-md text-paper/65">
            Java and Spring for services, Next.js and Flutter for what people touch, PostgreSQL underneath, and the servers to run it all. Spin the globe.
          </p>

          <dl className="mt-10 flex flex-col gap-5">
            {skillGroups.map((group, i) => (
              <div key={group.name} data-reveal style={{ "--d": `${i * 0.05}s` } as React.CSSProperties} className="grid gap-2 border-t border-line pt-4 md:grid-cols-[10rem_1fr]">
                <dt className="flex items-center gap-2 text-sm font-bold">
                  <span className="size-2 rounded-full" style={{ background: group.color }} />
                  {group.name}
                </dt>
                <dd className="text-[15px] leading-relaxed text-paper/65">{group.items.join(" · ")}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div data-reveal="scale" className="order-first lg:order-none">
          <SkillSphere items={sphereItems} />
        </div>
      </div>
    </section>
  );
}
