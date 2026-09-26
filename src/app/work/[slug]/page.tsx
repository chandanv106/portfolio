import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getNextProject, getProject, projects } from "@/data/projects";
import { profile } from "@/data/profile";
import { SplitText } from "@/components/motion/SplitText";
import { CountUp } from "@/components/motion/CountUp";
import { Magnetic } from "@/components/motion/Magnetic";
import { TransitionLink } from "@/components/motion/PageTransition";
import { ProjectVisual, visualBackdrop } from "@/components/visuals/ProjectVisual";
import { Parallax } from "@/components/work/Parallax";
import { Gallery } from "@/components/work/Gallery";
import { FlowDiagram } from "@/components/work/FlowDiagram";
import { NextProject } from "@/components/work/NextProject";
import { Arrow, Roll } from "@/components/ui/Arrow";

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: project.name,
    description: project.tagline,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: { title: `${project.name} · ${profile.name}`, description: project.tagline, url: `/work/${project.slug}` },
  };
}

function Heading({ index, children }: { index: string; children: string }) {
  return (
    <div className="flex flex-col gap-4 md:col-span-4">
      <p data-reveal className="label flex items-center gap-3 text-mute">
        <span className="text-[var(--c)]">({index})</span>
        <span className="h-px w-8 bg-line" />
        {children}
      </p>
    </div>
  );
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  const next = getNextProject(project.slug);
  let section = 0;
  const idx = () => String(++section).padStart(2, "0");

  const facts = [
    { k: "Role", v: project.role },
    { k: "Timeline", v: project.period },
    { k: "Platform", v: project.platform },
    { k: "Type", v: project.kind },
  ];

  return (
    <main id="main" style={{ "--c": project.color } as React.CSSProperties}>
      {/* Hero */}
      <section className="gutter relative overflow-hidden pb-12 pt-32 md:pb-16 md:pt-44">
        <div className="pointer-events-none absolute -right-40 -top-40 size-[34rem] rounded-full opacity-40 blur-3xl" style={{ background: project.color }} />
        <div className="relative">
          <div data-reveal className="flex flex-wrap items-center justify-between gap-4">
            <TransitionLink href="/#work" transitionLabel="Work" className="roll-host inline-flex items-center gap-2 text-sm font-bold">
              <Arrow direction="left" className="size-4" />
              <Roll>All work</Roll>
            </TransitionLink>
            <span className="label text-mute">
              {project.kind} · {project.year}
            </span>
          </div>

          <SplitText
            as="h1"
            text={project.name}
            className="mt-10 block font-display text-[17.5vw] font-black uppercase leading-[0.84] md:mt-14 md:text-[12vw]"
          />
          <SplitText
            as="p"
            by="words"
            text={project.tagline}
            delay={0.25}
            className="mt-6 block max-w-3xl text-xl leading-snug text-paper/80 md:mt-8 md:text-3xl"
          />

          <dl className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-line bg-line md:mt-16 md:grid-cols-4">
            {facts.map((f, i) => (
              <div key={f.k} data-reveal style={{ "--d": `${0.3 + i * 0.06}s` } as React.CSSProperties} className="bg-ink p-5 md:p-6">
                <dt className="label text-mute">{f.k}</dt>
                <dd className="mt-2 font-semibold leading-snug">{f.v}</dd>
              </div>
            ))}
          </dl>

          {project.links.length > 0 && (
            <div data-reveal className="mt-8 flex flex-wrap gap-3">
              {project.links.map((link, i) => (
                <Magnetic key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className={`roll-host inline-flex h-12 items-center gap-2 rounded-full px-6 text-[15px] font-bold transition-colors ${
                      i === 0 ? "text-ink hover:bg-paper" : "border border-line hover:border-paper"
                    }`}
                    style={i === 0 ? { background: project.color, color: project.ink } : undefined}
                  >
                    <Roll>{link.label}</Roll>
                    <Arrow direction="up-right" className="size-4" />
                  </a>
                </Magnetic>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Cover */}
      <section className="gutter">
        <div data-reveal="clip" className="overflow-hidden rounded-[28px]" style={visualBackdrop(project.color)}>
          <Parallax className="aspect-[4/5] sm:aspect-[16/11] md:aspect-[16/9]">
            <ProjectVisual project={project} sizes="100vw" preload />
          </Parallax>
        </div>
      </section>

      {/* Overview */}
      <section className="gutter grid gap-8 py-24 md:grid-cols-12 md:py-36">
        <Heading index={idx()}>Overview</Heading>
        <div className="flex flex-col gap-6 md:col-span-8">
          {project.summary.map((para, i) => (
            <p key={i} data-reveal className={i === 0 ? "text-2xl leading-snug md:text-[2.1rem]" : "text-lg leading-relaxed text-paper/70"}>
              {para}
            </p>
          ))}
          {project.note && (
            <p data-reveal className="mt-4 flex gap-3 rounded-2xl border border-line bg-ink-2 p-5 text-[15px] leading-relaxed text-paper/65">
              <span className="mt-1 size-2 shrink-0 rounded-full bg-[var(--c)]" />
              {project.note}
            </p>
          )}
        </div>
      </section>

      {/* Highlights */}
      <section className="gutter grid gap-8 pb-24 md:grid-cols-12 md:pb-36">
        <Heading index={idx()}>What I built</Heading>
        <ol className="md:col-span-8">
          {project.highlights.map((h, i) => (
            <li key={h.title} data-reveal className="group grid gap-3 border-t border-line py-8 md:grid-cols-[4rem_1fr] md:py-10">
              <span className="font-mono text-sm text-[var(--c)]">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3 className="text-xl font-extrabold tracking-[-0.02em] transition-transform duration-500 ease-[var(--ease-expo)] group-hover:translate-x-2 md:text-2xl">
                  {h.title}
                </h3>
                <p className="mt-3 max-w-2xl text-lg leading-relaxed text-paper/65">{h.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Numbers */}
      {project.metrics && (
        <section className="gutter pb-24 md:pb-36">
          <dl className={`grid grid-cols-2 gap-px overflow-hidden rounded-[28px] border border-line bg-line ${project.metrics.length === 4 ? "md:grid-cols-4" : "md:grid-cols-3"}`}>
            {project.metrics.map((m, i) => (
              <div key={m.label} data-reveal style={{ "--d": `${i * 0.07}s` } as React.CSSProperties} className="flex flex-col gap-3 bg-ink-2 p-6 md:p-10">
                <dt className="order-2 text-sm leading-snug text-mute">{m.label}</dt>
                <dd className="font-display text-6xl font-black text-[var(--c)] md:text-8xl">
                  <CountUp value={m.value} decimals={m.decimals} prefix={m.prefix} suffix={m.suffix} />
                </dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {/* Screens */}
      {project.screens && (
        <section className="gutter pb-24 md:pb-36">
          <div className="mb-10 grid gap-8 md:grid-cols-12">
            <Heading index={idx()}>Screens</Heading>
            <p data-reveal className="text-lg text-paper/65 md:col-span-8">
              Every screen in both themes, light on the left and dark on the right. Drag through them, or tap one to open it.
            </p>
          </div>
          <Gallery screens={project.screens} color={project.color} />
        </section>
      )}

      {/* Architecture */}
      {project.flow && (
        <section className="gutter pb-24 md:pb-36">
          <div className="mb-10 grid gap-8 md:grid-cols-12">
            <Heading index={idx()}>How it works</Heading>
          </div>
          <div data-reveal className="rounded-[28px] border border-line bg-ink-2 p-5 md:p-10">
            <FlowDiagram project={project} />
          </div>
        </section>
      )}

      {/* Stack */}
      <section className="gutter grid gap-8 pb-24 md:grid-cols-12 md:pb-36">
        <Heading index={idx()}>Stack</Heading>
        <dl className="flex flex-col md:col-span-8">
          {project.stack.map((group) => (
            <div key={group.group} data-reveal className="grid gap-3 border-t border-line py-6 md:grid-cols-[12rem_1fr]">
              <dt className="font-bold">{group.group}</dt>
              <dd className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span key={item} className="rounded-full border border-line px-3.5 py-1.5 text-sm font-semibold text-paper/85">
                    {item}
                  </span>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <NextProject project={next} />

      <footer className="gutter flex flex-col gap-6 py-14 md:flex-row md:items-center md:justify-between">
        <p className="max-w-md text-lg text-paper/70">
          Want something like this built?{" "}
          <a href={`mailto:${profile.email}`} className="font-bold text-paper underline decoration-[var(--c)] decoration-2 underline-offset-4">
            {profile.email}
          </a>
        </p>
        <TransitionLink href="/#contact" transitionLabel="Contact" className="roll-host inline-flex items-center gap-2 font-bold">
          <Roll>Get in touch</Roll>
          <Arrow direction="up-right" className="size-4" />
        </TransitionLink>
      </footer>
    </main>
  );
}
