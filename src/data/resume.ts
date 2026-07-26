// Single source of truth for all portfolio content.
// Update this file and the whole site updates.

export const profile = {
  name: "Chandan Verma",
  role: "Java Backend Engineer",
  location: "Hyderabad, India",
  email: "Chandanv016@gmail.com",
  linkedin: "https://linkedin.com/in/chandan-verma016",
  resumeUrl: "/ChandanVerma_Resume.pdf",
  tagline:
    "I design event-driven microservices and RESTful APIs that stay fast, consistent, and observable under load.",
  summary:
    "Java Backend Engineer with close to 2 years of hands-on experience designing and delivering scalable RESTful APIs and event-driven microservices using Java (8–25), Spring Boot 3.x, Spring Cloud, and Apache Kafka. Proven record of improving system interoperability, reducing latency, and maintaining 90%+ automated test coverage. Skilled in distributed systems design, database performance tuning, and Agile delivery, with cloud exposure through Microsoft Azure certifications.",
};

// The 3D system: each section is a "microservice" node.
export type SectionDef = {
  id: string;
  service: string;
  title: string;
  nav: string;
};

export const sections: SectionDef[] = [
  { id: "gateway", service: "api-gateway", title: "Chandan Verma", nav: "home" },
  { id: "about", service: "identity-service", title: "About", nav: "about" },
  { id: "experience", service: "experience-service", title: "Experience", nav: "experience" },
  { id: "projects", service: "project-service", title: "Projects", nav: "projects" },
  { id: "skills", service: "skills-service", title: "Skills", nav: "skills" },
  { id: "certifications", service: "auth-service", title: "Certifications", nav: "certs" },
  { id: "contact", service: "contact-service", title: "Contact", nav: "contact" },
];

export const experience = [
  {
    company: "Capgemini",
    location: "Hyderabad, India",
    role: "Analyst / Software Engineer",
    period: "Oct 2024 — Present",
    status: "RUNNING",
    points: [
      "Designed and integrated RESTful web services using Java 8/17/21/25 and Spring Boot 3.x, improving system interoperability by 30% across client-facing applications.",
      "Architected distributed microservices with Spring Cloud (Eureka Server) for service discovery, reducing service resolution overhead by 25%.",
      "Built responsive frontend interfaces using HTML5, CSS3, JavaScript, and Angular, integrated with backend REST APIs.",
      "Enforced code quality standards with JUnit and Mockito unit/integration tests, sustaining 90%+ code coverage across releases.",
      "Collaborated in Agile/Scrum ceremonies using Git and Maven, compressing sprint release cycles by 15% through CI-friendly branching and build practices.",
    ],
    metrics: [
      { value: "30%", label: "interoperability gain" },
      { value: "25%", label: "less resolution overhead" },
      { value: "90%+", label: "test coverage" },
      { value: "15%", label: "faster sprint cycles" },
    ],
  },
];

export type Project = {
  name: string;
  service: string;
  period: string;
  stack: string[];
  points: string[];
  metrics: { value: string; label: string }[];
};

export const projects: Project[] = [
  {
    name: "Fleet Operations Command Platform",
    service: "fleet-command",
    period: "May 2025 — Aug 2025",
    stack: ["Java", "Spring Boot", "Kafka", "MySQL", "Hibernate"],
    points: [
      "Architected a multi-service fleet management platform (Fleet, Device, Maintenance, Analytics services) supporting 5,000+ active units.",
      "Implemented event-driven messaging with Apache Kafka to publish lifecycle events and stream real-time notifications in under 200ms.",
      "Applied the Transactional Outbox Pattern with consumer deduplication, achieving 99.9% message consistency across services.",
      "Eliminated race conditions using Optimistic/Pessimistic locking (FOR UPDATE SKIP LOCKED in MySQL) and request idempotency.",
      "Engineered telemetry data pipelines with Hibernate batch processing, increasing write throughput by 3.5x.",
      "Hardened service-to-service calls with Resilience4j (Circuit Breaker, Retry, Rate Limiter) to contain cascading failures.",
    ],
    metrics: [
      { value: "5,000+", label: "active units" },
      { value: "<200ms", label: "event latency" },
      { value: "99.9%", label: "message consistency" },
      { value: "3.5x", label: "write throughput" },
    ],
  },
  {
    name: "Online Furniture Store",
    service: "furniture-api",
    period: "Jan 2025 — Feb 2025",
    stack: ["Java", "Spring Boot", "JWT", "Feign", "Swagger"],
    points: [
      "Built a secure User module with JWT authentication and role-based access control (RBAC) supporting 10,000+ simulated users.",
      "Integrated Feign Client for inter-service communication, cutting inter-service latency by 30%.",
      "Designed, configured, and documented 30+ REST API endpoints using Swagger and Postman.",
    ],
    metrics: [
      { value: "10,000+", label: "simulated users" },
      { value: "30%", label: "lower latency" },
      { value: "30+", label: "documented endpoints" },
    ],
  },
  {
    name: "Telegram Bot with Payment Integration",
    service: "telegram-pay-bot",
    period: "Mar 2026 — Apr 2026",
    stack: ["Java", "Supabase", "Telegram API"],
    points: [
      "Developed an automated Telegram bot with a Java backend to process purchases across 5,000+ active user sessions.",
      "Integrated Supabase as the data layer for order management and real-time payment transactions with sub-second response times.",
    ],
    metrics: [
      { value: "5,000+", label: "active sessions" },
      { value: "<1s", label: "payment response" },
    ],
  },
];

export const skillGroups = [
  {
    name: "Languages",
    key: "lang",
    items: ["Java 8–25", "SQL", "JavaScript", "HTML5", "CSS3"],
  },
  {
    name: "Frameworks",
    key: "framework",
    items: [
      "Spring Boot 3.x",
      "Spring Core",
      "Spring REST",
      "Spring Data JPA",
      "Spring Cloud (Eureka, Feign)",
      "Resilience4j",
      "Angular",
    ],
  },
  {
    name: "Data & Middleware",
    key: "data",
    items: ["MySQL", "NoSQL", "Supabase", "Apache Kafka", "Hibernate"],
  },
  {
    name: "Tools & Testing",
    key: "tools",
    items: ["Git", "Maven", "Postman", "Swagger", "JUnit", "Mockito"],
  },
  {
    name: "Cloud",
    key: "cloud",
    items: ["Microsoft Azure", "AZ-204", "AZ-900", "AI-900"],
  },
];

export const certifications = [
  {
    name: "Oracle Certified Associate, Java SE 8 Programmer",
    issuer: "Oracle",
    code: "OCA",
  },
  {
    name: "Microsoft Certified: Azure Developer Associate",
    issuer: "Microsoft",
    code: "AZ-204",
  },
  {
    name: "Microsoft Certified: Azure Fundamentals",
    issuer: "Microsoft",
    code: "AZ-900",
  },
  {
    name: "Microsoft Certified: Azure AI Fundamentals",
    issuer: "Microsoft",
    code: "AI-900",
  },
];

export const education = {
  school: "GL Bajaj Institute of Technology and Management",
  location: "Noida, India",
  degree: "Master of Computer Applications (MCA)",
  period: "2021 — 2023",
  coursework:
    "Data Structures, Object-Oriented Programming, Software Engineering, Database Systems, Java Enterprise",
};
