import type { MetadataRoute } from "next";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? profile.siteUrl;
  return [
    { url: base, changeFrequency: "monthly", priority: 1 },
    ...projects.map((p) => ({
      url: `${base}/work/${p.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
