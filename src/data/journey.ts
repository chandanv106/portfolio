// Experience, education and certifications, from the September 2026 CV.

export const experience = {
  company: "Capgemini",
  role: "Analyst / Software Engineer",
  period: "Oct 2024 – Present",
  location: "Hyderabad, India",
  points: [
    "Design and integrate RESTful web services in Java 8, 17 and 21 with Spring Boot 3.x for client-facing applications.",
    "Architect distributed microservices with Spring Cloud and Eureka service discovery.",
    "Build responsive Angular front ends wired to the backend REST APIs.",
    "Keep releases honest with JUnit and Mockito, sustaining 90%+ coverage.",
    "Ship in Agile/Scrum with Git and Maven, using CI-friendly branching.",
  ],
  metrics: [
    { value: 30, suffix: "%", label: "Better interoperability" },
    { value: 25, suffix: "%", label: "Less service-resolution overhead" },
    { value: 90, suffix: "%+", label: "Test coverage" },
    { value: 15, suffix: "%", label: "Faster sprint releases" },
  ],
};

export type Milestone = { year: string; title: string; detail: string; kind: "work" | "product" | "study" | "cert" };

export const milestones: Milestone[] = [
  { year: "2026", title: "Launched HookSend", detail: "My own Instagram automation SaaS, approved through Meta App Review.", kind: "product" },
  { year: "2026", title: "Shipped SocialZoom", detail: "A social app for a client, live on the App Store and Google Play.", kind: "product" },
  { year: "2026", title: "Delivered two Sleek platforms", detail: "A B2B CRM and a UK broadband partner portal, both in production.", kind: "product" },
  { year: "2026", title: "Azure Developer Associate", detail: "Microsoft Certified, AZ-204.", kind: "cert" },
  { year: "2025", title: "Fleet Operations Command Platform", detail: "Kafka microservices for a 5,000+ vehicle fleet.", kind: "product" },
  { year: "2025", title: "Azure Fundamentals & AI Fundamentals", detail: "Microsoft Certified, AZ-900 and AI-900.", kind: "cert" },
  { year: "2024", title: "Joined Capgemini", detail: "Analyst / Software Engineer, Java and Spring Boot.", kind: "work" },
  { year: "2023", title: "Master of Computer Applications", detail: "GL Bajaj Institute of Technology and Management, Noida.", kind: "study" },
  { year: "2023", title: "Oracle Certified Associate", detail: "Java SE 8 Programmer.", kind: "cert" },
  { year: "2021", title: "Bachelor of Computer Applications", detail: "George College, Kolkata, with 8.3 DGPA.", kind: "study" },
];

export const certifications = [
  { code: "AZ-204", name: "Azure Developer Associate", issuer: "Microsoft", date: "Apr 2026" },
  { code: "AZ-900", name: "Azure Fundamentals", issuer: "Microsoft", date: "Sep 2025" },
  { code: "AI-900", name: "Azure AI Fundamentals", issuer: "Microsoft", date: "Jun 2025" },
  { code: "OCA", name: "Java SE 8 Programmer", issuer: "Oracle", date: "Apr 2023" },
  { code: "Antigravity", name: "Accelerate Development with Antigravity", issuer: "Google", date: "Aug 2026" },
];
