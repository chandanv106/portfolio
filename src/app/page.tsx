import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { tapes } from "@/data/skills";
import { Hero } from "@/components/home/Hero";
import { About } from "@/components/home/About";
import { Work } from "@/components/home/Work";
import { Journey } from "@/components/home/Journey";
import { Stack } from "@/components/home/Stack";
import { Contact } from "@/components/home/Contact";
import { Tapes } from "@/components/motion/Tapes";

// Evaluated at build time; every deploy refreshes it.
const YEAR = new Date().getFullYear();

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.role,
  url: profile.siteUrl,
  email: `mailto:${profile.email}`,
  address: { "@type": "PostalAddress", addressLocality: "Hyderabad", addressCountry: "IN" },
  sameAs: [profile.linkedin, profile.github],
  knowsAbout: ["Java", "Spring Boot", "Apache Kafka", "Next.js", "Flutter", "PostgreSQL", "WebRTC"],
  worksFor: { "@type": "Organization", name: "Capgemini" },
  hasPart: projects.map((p) => ({ "@type": "CreativeWork", name: p.fullName, url: `${profile.siteUrl}/work/${p.slug}` })),
};

export default function Home() {
  return (
    <main id="main">
      <Hero />
      <Tapes rows={tapes} />
      <About />
      <Work />
      <Journey />
      <Stack />
      <Contact year={YEAR} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
    </main>
  );
}
