import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { certifications, experience, milestones } from "@/data/journey";
import { skillGroups } from "@/data/skills";

export const dynamic = "force-static";

// GET /api/resume — the whole résumé as JSON, for anyone who prefers curl.
export function GET() {
  return Response.json({
    profile: {
      name: profile.name,
      role: profile.role,
      location: profile.location,
      email: profile.email,
      linkedin: profile.linkedin,
      github: profile.github,
      summary: profile.tagline,
    },
    experience,
    projects: projects.map((p) => ({
      name: p.fullName,
      type: p.kind,
      period: p.period,
      summary: p.tagline,
      stack: p.stack.flatMap((g) => g.items),
      highlights: p.highlights.map((h) => h.title),
      url: `${profile.siteUrl}/work/${p.slug}`,
    })),
    skills: Object.fromEntries(skillGroups.map((g) => [g.name, g.items])),
    certifications,
    timeline: milestones,
  });
}
