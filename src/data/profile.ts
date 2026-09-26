// Personal details used across the site. Edit here and every page updates.

export const profile = {
  name: "Chandan Verma",
  firstName: "Chandan",
  lastName: "Verma",
  role: "Software Engineer",
  location: "Hyderabad, India",
  timeZone: "Asia/Kolkata",
  email: "chandan@hooksend.in",
  linkedin: "https://www.linkedin.com/in/chandan-verma016",
  github: "https://github.com/chandanv106",
  resumeUrl: "/ChandanVerma_Resume.pdf",
  siteUrl: "https://chandanverma.vercel.app",
  // Shown in the hero in step with the particle shapes, in this order:
  // phone, dashboard, database, globe.
  crafts: ["mobile apps", "SaaS products", "backend systems", "real-time apps"],
  tagline:
    "I design, build and ship complete products: mobile apps, SaaS platforms and the backends that run them.",
  statement:
    "I build complete products. The app in your hand, the API behind it, the database under it and the servers it runs on.",
  about: [
    "By day I build Java and Spring Boot microservices at Capgemini, with event-driven systems on Kafka and 90%+ test coverage.",
    "Outside of it I design, build and run products end to end: a social app live on the App Store and Google Play, and a multi-tenant SaaS approved through Meta App Review.",
  ],
  stats: [
    { value: 2, suffix: "+", label: "Years building production systems" },
    { value: 4, label: "Products shipped to production" },
    { value: 5, label: "Microsoft, Oracle & Google certifications" },
    { value: 90, suffix: "%+", label: "Test coverage on client releases" },
  ],
} as const;

export const socials = [
  { label: "LinkedIn", href: profile.linkedin },
  { label: "GitHub", href: profile.github },
  { label: "Résumé", href: profile.resumeUrl },
] as const;
