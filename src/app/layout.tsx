import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const grotesk = Space_Grotesk({
  variable: "--font-grotesk",
  subsets: ["latin"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

// Set NEXT_PUBLIC_SITE_URL in Vercel once the domain is live so social
// previews resolve against the real host.
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Chandan Verma — Java Backend Engineer",
  description:
    "Java Backend Engineer building event-driven microservices with Spring Boot, Spring Cloud, and Apache Kafka. Explore my work as a living distributed system.",
  keywords: [
    "Java Backend Engineer",
    "Spring Boot",
    "Apache Kafka",
    "Microservices",
    "Spring Cloud",
    "Chandan Verma",
  ],
  openGraph: {
    title: "Chandan Verma — Java Backend Engineer",
    description:
      "Event-driven microservices, RESTful APIs, and distributed systems. Explore my portfolio rendered as a living 3D system architecture.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${grotesk.variable} ${jetbrains.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
