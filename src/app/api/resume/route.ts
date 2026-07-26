import {
  profile,
  experience,
  projects,
  skillGroups,
  certifications,
  education,
} from "@/data/resume";

export const dynamic = "force-static";

// A real endpoint on a backend engineer's portfolio: GET /api/resume
export function GET() {
  return Response.json({
    profile,
    experience,
    projects,
    skills: skillGroups,
    certifications,
    education,
  });
}
