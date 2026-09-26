// Every project on the site. Order here is the order on the home page.
// To add a case study later (e.g. the Sleek repos), fill in `caseStudy`.

export type Metric = {
  value: number;
  label: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
};

export type Highlight = { title: string; body: string };

export type MockKind = "hooksend" | "fleet" | "crm" | "telecom";

export type Visual =
  | { kind: "image"; src: string; alt: string; width: number; height: number }
  | { kind: "mock"; mock: MockKind };

export type Screen = { src: string; title: string; caption: string };

export type FlowNode = {
  id: string;
  label: string;
  sub?: string;
  x: number;
  y: number;
  accent?: boolean;
};

export type FlowEdge = {
  from: string;
  to: string;
  label?: string;
  dashed?: boolean;
};

export type Project = {
  slug: string;
  name: string;
  fullName: string;
  kind: string;
  period: string;
  year: string;
  platform: string;
  role: string;
  color: string;
  ink: string;
  tagline: string;
  summary: string[];
  tags: string[];
  stack: { group: string; items: string[] }[];
  metrics?: Metric[];
  highlights: Highlight[];
  visual: Visual;
  screens?: Screen[];
  flow?: {
    caption: string;
    width: number;
    height: number;
    nodes: FlowNode[];
    edges: FlowEdge[];
  };
  links: { label: string; href: string }[];
  caseStudy?: string;
  note?: string;
};

export const projects: Project[] = [
  {
    slug: "socialzoom",
    name: "SocialZoom",
    fullName: "SocialZoom",
    kind: "Freelance",
    period: "Jun – Sep 2026",
    year: "2026",
    platform: "iOS & Android",
    role: "Sole engineer: app, backend and infrastructure",
    color: "#FFC21A",
    ink: "#17130A",
    tagline:
      "A full social app with feed, stories, chat and calls, live on the App Store and Google Play.",
    summary: [
      "SocialZoom is an Instagram-style social app built for the client Social Zoom: a photo and video feed, 24-hour stories, one-to-one and group messaging, voice notes and calls, with the moderation and privacy tools a real community needs.",
      "I built all of it: the Flutter app, a self-hosted Supabase backend with its PostgreSQL schema and security rules, the realtime and push pipelines, a call relay, a media transcoder, an admin panel, and the servers they run on.",
    ],
    tags: ["Flutter", "Supabase", "PostgreSQL", "WebRTC", "Python"],
    stack: [
      { group: "App", items: ["Flutter", "Dart", "BLoC", "go_router", "PowerSync", "Swift", "Kotlin"] },
      { group: "Backend", items: ["Supabase", "PostgreSQL", "PL/pgSQL", "PostgREST", "Python", "FastAPI"] },
      { group: "Realtime & media", items: ["WebRTC", "coturn", "CallKit", "PushKit", "FCM", "ffmpeg HLS"] },
      { group: "Infrastructure", items: ["Ubuntu VPS", "Docker", "Caddy", "Cloudflare R2", "Codemagic"] },
    ],
    metrics: [
      { value: 3418, label: "Tests passing" },
      { value: 97, label: "Database migrations" },
      { value: 22, label: "Modular Flutter packages" },
      { value: 1.5, decimals: 1, suffix: "s", label: "Median push delivery" },
    ],
    highlights: [
      {
        title: "Offline first",
        body: "Every screen reads from SQLite on the phone, kept in step with PostgreSQL by PowerSync, so the app opens instantly and keeps working on a bad connection. A watchdog notices a silently dead sync within 30 seconds and recovers on its own.",
      },
      {
        title: "Calls that ring like phone calls",
        body: "WebRTC over my own TURN relay, so calls connect even behind carrier NAT. On iPhone an incoming call arrives as a PushKit VoIP push handed to CallKit; on Android it is a full-screen ringer. Calls keep going when you leave the app.",
      },
      {
        title: "Security lives in the database",
        body: "Row Level Security on every table and security-definer functions for every write that matters. A pre-launch audit found and closed four holes in messaging, and the migrations ship with SQL check scripts that prove it.",
      },
      {
        title: "Debugging calls in production",
        body: "When calls failed to connect, I built an in-app trace pipeline that uploaded call timelines to Postgres, traced the failures to mis-addressed ICE candidates, and shipped the fix with regression tests.",
      },
      {
        title: "Push that arrives fast",
        body: "Kept-alive HTTP pools and parallel per-device dispatch in a Python worker brought delivery to about 1.5 s median on FCM and APNs. Tapping a notification opens the exact post, comment or chat.",
      },
      {
        title: "Shipped and operated",
        body: "Codemagic CI/CD for signed iOS and Android builds, App Store Connect and Play Console releases, and self-hosted Supabase on two VPS with encrypted off-site backups and scheduled restore tests.",
      },
    ],
    visual: {
      kind: "image",
      src: "/work/socialzoom/hero-dark.png",
      alt: "SocialZoom on three iPhones showing chat, the home feed and a profile",
      width: 1600,
      height: 880,
    },
    screens: [
      { src: "/work/socialzoom/feed.png", title: "Home feed", caption: "Stories across the top, then posts from people you follow, with Home and For you tabs." },
      { src: "/work/socialzoom/profile.png", title: "Profile", caption: "A cover, the counts that matter and a grid of posts, with Tagged and Saved beside it." },
      { src: "/work/socialzoom/discover.png", title: "Discover", caption: "Trending and a personal For you, laid out as a staggered grid of photos and videos." },
      { src: "/work/socialzoom/inbox.png", title: "Chats", caption: "Every conversation with unread counts, pinned chats and a tab for message requests." },
      { src: "/work/socialzoom/chat.png", title: "Messaging", caption: "Photo markup, video, voice notes with a live waveform, stickers, reactions and read receipts." },
      { src: "/work/socialzoom/group.png", title: "Group chats", caption: "Named groups with each sender labelled and member management for admins." },
      { src: "/work/socialzoom/call.png", title: "Voice calls", caption: "Calls that ring on the lock screen through CallKit, or a full-screen ringer on Android." },
      { src: "/work/socialzoom/story.png", title: "Stories", caption: "24-hour stories with reactions, replies and an editor for drawing, text and stickers." },
      { src: "/work/socialzoom/vanish.png", title: "Vanish mode", caption: "Messages that disappear once seen, with a warning if someone takes a screenshot." },
      { src: "/work/socialzoom/privacy.png", title: "Privacy", caption: "Private accounts, blocking, hidden words, app lock and a record of every report." },
    ],
    flow: {
      caption: "The app reads from a copy of the data on the phone and writes through the server. Calls and video transcoding run on a second server so neither can starve the other.",
      width: 1000,
      height: 540,
      nodes: [
        { id: "cdn", label: "R2 CDN", sub: "photos · HLS video", x: 120, y: 80 },
        { id: "app", label: "Flutter app", sub: "iOS · Android · SQLite", x: 120, y: 270, accent: true },
        { id: "push", label: "FCM · APNs", sub: "notifications · calls", x: 120, y: 470 },
        { id: "sync", label: "PowerSync", sub: "offline sync", x: 385, y: 100 },
        { id: "api", label: "Supabase", sub: "Auth · REST · Realtime", x: 385, y: 270 },
        { id: "turn", label: "TURN relay", sub: "WebRTC calls", x: 385, y: 470 },
        { id: "pg", label: "PostgreSQL", sub: "RLS on every table", x: 655, y: 185 },
        { id: "jobs", label: "Python workers", sub: "push · email · jobs", x: 655, y: 370 },
        { id: "admin", label: "FastAPI admin", sub: "moderation", x: 885, y: 185 },
      ],
      edges: [
        { from: "cdn", to: "app", label: "media" },
        { from: "push", to: "app", dashed: true },
        { from: "app", to: "sync", label: "sync" },
        { from: "app", to: "api", label: "requests" },
        { from: "app", to: "turn", label: "call audio", dashed: true },
        { from: "sync", to: "pg" },
        { from: "api", to: "pg" },
        { from: "jobs", to: "pg" },
        { from: "admin", to: "pg" },
        { from: "jobs", to: "push" },
      ],
    },
    links: [
      { label: "Case study on GitHub", href: "https://github.com/chandanv106/socialzoom" },
      { label: "socialzoom.co", href: "https://socialzoom.co" },
    ],
    caseStudy: "https://github.com/chandanv106/socialzoom",
    note: "SocialZoom is the client's commercial product and its source code is private. The screens are rendered from the app's real widgets by its own test suite, with invented people.",
  },
  {
    slug: "hooksend",
    name: "HookSend",
    fullName: "HookSend",
    kind: "Own product",
    period: "Jul 2026 – Present",
    year: "2026",
    platform: "Web · SaaS",
    role: "Founder & engineer",
    color: "#FF4D8D",
    ink: "#1C0712",
    tagline:
      "Instagram automation for creators and brands: comment a keyword, get a DM within seconds.",
    summary: [
      "HookSend is my own multi-tenant SaaS for Instagram automation. When someone comments a keyword on a post, HookSend answers with a DM within seconds, exactly once.",
      "I designed and built it end to end, from the database schema and the official Instagram Graph API integration to billing, security hardening and a Dockerised deployment with separate staging and production, and led it through Meta App Review to approval.",
    ],
    tags: ["Next.js 16", "TypeScript", "PostgreSQL", "BullMQ", "Redis"],
    stack: [
      { group: "Web", items: ["Next.js 16", "React 19", "TypeScript", "Tailwind v4"] },
      { group: "Backend", items: ["PostgreSQL", "Prisma", "Redis", "BullMQ", "Webhooks"] },
      { group: "Platform", items: ["Instagram Graph API", "OAuth 2.0", "UPI payments"] },
      { group: "Quality & ops", items: ["Vitest", "Docker", "Ubuntu VPS", "Staging + production"] },
    ],
    metrics: [
      { value: 1, label: "Reply per comment, guaranteed" },
      { value: 169, label: "Automated tests" },
      { value: 4, label: "Plan tiers with a 15-day trial" },
      { value: 256, suffix: "-bit", label: "AES-GCM token encryption" },
    ],
    highlights: [
      {
        title: "Event-driven delivery",
        body: "Instagram webhooks feed a BullMQ pipeline that matches keyword comments and sends DMs within seconds, with signature verification, deduplication, retries and dead-letter handling guaranteeing exactly one reply per comment.",
      },
      {
        title: "Metering that can't be raced",
        body: "Atomic compare-and-set reservations inside database transactions closed a race condition that let workspaces go over their monthly DM allowance.",
      },
      {
        title: "Plans that stop on their own",
        body: "Four plan tiers and a 15-day trial, with limits enforced at send time, so lapsed plans and over-cap campaigns stop automatically instead of silently sending. Payments run through UPI with QR generation.",
      },
      {
        title: "Official Graph API, approved",
        body: "OAuth, webhooks, private replies, message templates, carousels and insights on Meta's official Instagram Graph API, taken through Meta App Review to approval.",
      },
      {
        title: "Hardened by default",
        body: "AES-256-GCM encryption for stored access tokens with a verified key-rotation path, SSRF guards, rate limiting on public endpoints, TOTP two-factor, OTP-protected admin and fail-closed internal job routes.",
      },
      {
        title: "Tested and designed",
        body: "169 Vitest tests across the worker pipeline, billing and usage logic on a strict TypeScript build, plus the marketing site and its design system with runtime OG images, JSON-LD and sitemaps.",
      },
    ],
    visual: { kind: "mock", mock: "hooksend" },
    flow: {
      caption: "Every comment takes the same path. Duplicates, forgeries and failures each have a place to go, so a follower never gets two DMs or none.",
      width: 1000,
      height: 520,
      nodes: [
        { id: "ig", label: "Instagram", sub: "keyword comment", x: 120, y: 95, accent: true },
        { id: "hook", label: "Webhook", sub: "signature check", x: 373, y: 95 },
        { id: "dedup", label: "Dedup", sub: "seen before?", x: 627, y: 95 },
        { id: "queue", label: "BullMQ", sub: "Redis queue", x: 880, y: 95 },
        { id: "worker", label: "Worker", sub: "match keyword", x: 880, y: 290 },
        { id: "meter", label: "Usage meter", sub: "atomic reserve", x: 627, y: 290 },
        { id: "api", label: "Graph API", sub: "send the DM", x: 373, y: 290 },
        { id: "dm", label: "DM delivered", sub: "exactly once", x: 120, y: 290, accent: true },
        { id: "dlq", label: "Dead-letter", sub: "after retries", x: 880, y: 445 },
        { id: "pg", label: "PostgreSQL", sub: "plans · usage", x: 627, y: 445 },
      ],
      edges: [
        { from: "ig", to: "hook" },
        { from: "hook", to: "dedup" },
        { from: "dedup", to: "queue" },
        { from: "queue", to: "worker" },
        { from: "worker", to: "meter" },
        { from: "meter", to: "api" },
        { from: "api", to: "dm" },
        { from: "worker", to: "dlq", dashed: true },
        { from: "meter", to: "pg", dashed: true },
      ],
    },
    links: [{ label: "Visit hooksend.in", href: "https://hooksend.in" }],
  },
  {
    slug: "sleek-crm",
    name: "Sleek CRM",
    fullName: "Sleek Business CRM Platform",
    kind: "Client project",
    period: "Jul – Aug 2026",
    year: "2026",
    platform: "Web",
    role: "Full-stack engineer",
    color: "#9B8CFF",
    ink: "#0F0B26",
    tagline:
      "A B2B sales and workforce CRM with employee and admin portals, live in production.",
    summary: [
      "A merchant-acquisition and workforce-management CRM for a B2B sales team, with separate portals for employees and admins.",
      "It lets the business add new verticals with their own lead fields without a single schema migration, keeps employee banking data encrypted with keys the database never sees, and tracks attendance in real time.",
    ],
    tags: ["Next.js", "TypeScript", "Supabase", "PostgreSQL"],
    stack: [
      { group: "Web", items: ["Next.js", "TypeScript", "Tailwind CSS"] },
      { group: "Data", items: ["Supabase", "PostgreSQL", "JSONB"] },
      { group: "Security", items: ["AES-256-GCM", "IP whitelisting", "Audit trail"] },
    ],
    metrics: [
      { value: 2, label: "Portals: employee & admin" },
      { value: 0, label: "Migrations per new vertical" },
      { value: 256, suffix: "-bit", label: "Per-record encryption" },
    ],
    highlights: [
      {
        title: "No-code lead fields",
        body: "A dynamic lead-fields engine backed by JSONB lets admins define custom fields per business vertical, so a new vertical never needs a schema migration.",
      },
      {
        title: "Zero-knowledge encryption",
        body: "Employee banking data is encrypted with AES-256-GCM using per-record IVs and auth tags, so a leaked database dump reveals nothing.",
      },
      {
        title: "Real-time attendance",
        body: "Shift and break tracking with IP whitelisting and automatic clock-out, visible to admins as it happens.",
      },
      {
        title: "Tamper-proof audit trail",
        body: "Every sensitive change is recorded in an audit trail that can't be quietly edited.",
      },
    ],
    visual: { kind: "mock", mock: "crm" },
    links: [],
    note: "This is client work and its code is private. A full case study with screens is coming soon.",
  },
  {
    slug: "sleek-telecom",
    name: "Sleek Telecom",
    fullName: "Sleek Telecom Provisioning & Partner Portal",
    kind: "Client project",
    period: "Jun – Jul 2026",
    year: "2026",
    platform: "Web",
    role: "Full-stack engineer",
    color: "#2FD9A6",
    ink: "#03170F",
    tagline:
      "A UK broadband ordering platform with partner and admin portals and live fibre availability.",
    summary: [
      "A broadband provisioning platform for the UK market. Customers and partner agents order through an 8-step funnel that checks live broadband and fibre availability through the PXC Partner API.",
      "Every sale is attributed to the partner who made it, HQ and the partner are both notified, and admins follow each order's lifecycle and every partner's sales in real time.",
    ],
    tags: ["Next.js", "TypeScript", "Prisma", "PostgreSQL"],
    stack: [
      { group: "Web", items: ["Next.js", "TypeScript", "Tailwind CSS"] },
      { group: "Data", items: ["Prisma", "PostgreSQL"] },
      { group: "Integrations", items: ["PXC Partner API", "Transactional email"] },
    ],
    metrics: [
      { value: 8, label: "Step order funnel" },
      { value: 2, label: "Portals: partner & admin" },
      { value: 2, label: "Emails per order, sent async" },
    ],
    highlights: [
      {
        title: "Live availability",
        body: "An 8-step order funnel that queries the PXC Partner API for live broadband and fibre availability at the customer's address.",
      },
      {
        title: "Partner attribution",
        body: "A role-based attribution system that auto-tags each order with the agent ID of the partner who made the sale.",
      },
      {
        title: "Dual-email engine",
        body: "Asynchronous notifications to HQ and to the partner for every order, without slowing the checkout down.",
      },
      {
        title: "Admin dashboard",
        body: "Real-time order lifecycle tracking and partner sales metrics in one place.",
      },
    ],
    visual: { kind: "mock", mock: "telecom" },
    links: [],
    note: "This is client work and its code is private. A full case study with screens is coming soon.",
  },
  {
    slug: "fleet-ops",
    name: "Fleet Ops",
    fullName: "Fleet Operations Command Platform",
    kind: "Backend project",
    period: "May – Aug 2025",
    year: "2025",
    platform: "Microservices",
    role: "Backend engineer",
    color: "#4F8BFF",
    ink: "#050E22",
    tagline:
      "Event-driven microservices for a 5,000+ vehicle fleet, streaming notifications in under 200 ms.",
    summary: [
      "A multi-service fleet management platform with Fleet, Device, Maintenance and Analytics services, built on Java, Spring Boot and Apache Kafka to support more than 5,000 active units.",
      "The work was about correctness under load: no lost events, no double processing and no cascading failures when one service goes down.",
    ],
    tags: ["Java", "Spring Boot", "Kafka", "MySQL", "Hibernate"],
    stack: [
      { group: "Services", items: ["Java", "Spring Boot", "Spring Cloud", "Resilience4j"] },
      { group: "Messaging", items: ["Apache Kafka", "Transactional outbox"] },
      { group: "Data", items: ["MySQL", "Hibernate", "Spring Data JPA"] },
    ],
    metrics: [
      { value: 5000, suffix: "+", label: "Active units" },
      { value: 200, prefix: "<", suffix: "ms", label: "Event latency" },
      { value: 99.9, decimals: 1, suffix: "%", label: "Message consistency" },
      { value: 3.5, decimals: 1, suffix: "x", label: "Write throughput" },
    ],
    highlights: [
      {
        title: "Transactional outbox",
        body: "Events are written in the same transaction as the state change and relayed to Kafka, with consumer deduplication on the other side, for 99.9% message consistency.",
      },
      {
        title: "Locking that holds",
        body: "Optimistic and pessimistic locking with FOR UPDATE SKIP LOCKED removed race conditions when many workers pick up jobs at once.",
      },
      {
        title: "Faster telemetry",
        body: "Hibernate batch processing in the telemetry pipelines raised write throughput by 3.5x.",
      },
      {
        title: "Failures that stay contained",
        body: "Resilience4j circuit breakers, retries and rate limiters on service-to-service calls stop one slow service from taking the rest down with it.",
      },
    ],
    visual: { kind: "mock", mock: "fleet" },
    flow: {
      caption: "State and events are committed together, then fanned out through Kafka. Each consumer deduplicates, so a redelivered message is never processed twice.",
      width: 1000,
      height: 500,
      nodes: [
        { id: "units", label: "5,000+ units", sub: "telemetry", x: 120, y: 250, accent: true },
        { id: "device", label: "Device service", sub: "Spring Boot", x: 370, y: 250 },
        { id: "db", label: "MySQL", sub: "state + outbox", x: 370, y: 425 },
        { id: "kafka", label: "Apache Kafka", sub: "event bus", x: 620, y: 250, accent: true },
        { id: "fleet", label: "Fleet service", sub: "dispatch", x: 875, y: 85 },
        { id: "maint", label: "Maintenance", sub: "schedules", x: 875, y: 250 },
        { id: "analytics", label: "Analytics", sub: "insights", x: 875, y: 415 },
      ],
      edges: [
        { from: "units", to: "device" },
        { from: "device", to: "db", label: "one transaction", dashed: true },
        { from: "db", to: "kafka", label: "outbox relay" },
        { from: "kafka", to: "fleet" },
        { from: "kafka", to: "maint" },
        { from: "kafka", to: "analytics" },
      ],
    },
    links: [],
    note: "A backend-only system, so there are no screens to show. The diagram and numbers tell its story.",
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export function getNextProject(slug: string) {
  const i = projects.findIndex((p) => p.slug === slug);
  return projects[(i + 1) % projects.length];
}
