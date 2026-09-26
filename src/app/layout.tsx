import type { Metadata, Viewport } from "next";
import { Big_Shoulders, JetBrains_Mono, Manrope } from "next/font/google";
import "./globals.css";
import { profile } from "@/data/profile";
import { InlineScript } from "@/components/ui/InlineScript";
import { TransitionProvider } from "@/components/motion/PageTransition";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { RevealObserver } from "@/components/motion/RevealObserver";
import { Cursor } from "@/components/motion/Cursor";
import { Preloader } from "@/components/layout/Preloader";
import { Nav } from "@/components/layout/Nav";

// Condensed display face; its optical-size axis switches to the tighter
// "Display" cut automatically at large sizes.
const display = Big_Shoulders({
  subsets: ["latin"],
  axes: ["opsz"],
  variable: "--font-display-face",
  display: "swap",
  fallback: ["Arial Narrow", "sans-serif"],
  adjustFontFallback: false,
});
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", display: "swap" });

// Set NEXT_PUBLIC_SITE_URL in Vercel if the site moves to a custom domain.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? profile.siteUrl;

const title = `${profile.name} · Software Engineer`;
const description =
  "Software engineer building complete products: mobile apps, SaaS platforms and the Java, Spring Boot and Kafka backends behind them. See SocialZoom, HookSend and more.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: title, template: `%s · ${profile.name}` },
  description,
  applicationName: profile.name,
  authors: [{ name: profile.name, url: siteUrl }],
  keywords: [
    "Chandan Verma",
    "Software Engineer",
    "Full-stack developer",
    "Java",
    "Spring Boot",
    "Apache Kafka",
    "Next.js",
    "Flutter",
    "PostgreSQL",
    "Hyderabad",
  ],
  openGraph: { type: "website", siteName: profile.name, title, description, url: "/" },
  twitter: { card: "summary_large_image", title, description },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#0b0b0d",
  colorScheme: "dark",
};

// Runs before first paint: marks JS as available (so reveal animations may
// hide content until they play), skips the preloader on repeat visits, and
// un-hides everything if the app bundle never boots.
const BOOT = `(function(){var d=document.documentElement;d.classList.add('js');try{if(sessionStorage.getItem('cv-seen'))d.classList.add('seen')}catch(e){}setTimeout(function(){if(!window.__motionReady)d.classList.remove('js')},6000)})();`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${manrope.variable} ${mono.variable}`} suppressHydrationWarning>
      <body>
        <InlineScript html={BOOT} />
        <a
          href="#main"
          className="fixed left-4 top-4 z-[500] -translate-y-24 rounded-full bg-accent px-5 py-3 font-bold text-ink focus:translate-y-0"
        >
          Skip to content
        </a>
        <TransitionProvider>
          <SmoothScroll />
          <RevealObserver />
          <Preloader />
          <Nav />
          {children}
          <Cursor />
        </TransitionProvider>
        <div className="grain" aria-hidden="true" />
      </body>
    </html>
  );
}
