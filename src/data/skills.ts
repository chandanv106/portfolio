// Skills from the CV, grouped. Every item also floats in the 3D skill globe,
// tinted with its group's colour.

export type SkillGroup = { name: string; color: string; items: string[] };

export const skillGroups: SkillGroup[] = [
  {
    name: "Languages",
    color: "#FF6B2C",
    items: ["Java", "TypeScript", "JavaScript", "Dart", "Python", "SQL", "PL/pgSQL", "Swift", "Kotlin"],
  },
  {
    name: "Backend",
    color: "#FFC21A",
    items: ["Spring Boot", "Spring Cloud", "Hibernate", "Resilience4j", "Node.js", "FastAPI"],
  },
  {
    name: "Frontend & mobile",
    color: "#FF4D8D",
    items: ["Next.js", "React", "Angular", "Flutter", "BLoC", "Tailwind CSS"],
  },
  {
    name: "APIs & messaging",
    color: "#9B8CFF",
    items: ["REST", "GraphQL", "WebSockets", "Webhooks", "OAuth 2.0", "Kafka", "Redis", "BullMQ", "WebRTC"],
  },
  {
    name: "Data",
    color: "#2FD9A6",
    items: ["PostgreSQL", "MySQL", "SQLite", "Supabase", "Prisma", "Row Level Security"],
  },
  {
    name: "DevOps & cloud",
    color: "#4F8BFF",
    items: ["Docker", "Caddy", "Nginx", "Linux VPS", "Cloudflare R2", "Codemagic", "Azure", "Git", "Maven"],
  },
  {
    name: "Testing",
    color: "#E8E6E1",
    items: ["JUnit", "Mockito", "Vitest", "pytest", "Dart test", "Postman"],
  },
];

// The two marquee tapes on the home page.
export const tapes = [
  ["Java", "Spring Boot", "Kafka", "Microservices", "PostgreSQL", "Redis", "Docker"],
  ["Next.js", "React", "Flutter", "TypeScript", "WebRTC", "Supabase", "Azure"],
];
