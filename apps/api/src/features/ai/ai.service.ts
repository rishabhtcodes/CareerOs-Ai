import { prisma } from "../../config/prisma";
import { callWithFallback } from "./providers/registry";
import type { ProviderName } from "./providers/types";

// ── Utilities ──────────────────────────────────────────────────────────────────

async function getUserPreferredProvider(userId: string): Promise<string | null> {
  const settings = await prisma.settings.findUnique({
    where: { userId },
    select: { aiProvider: true },
  });
  return settings?.aiProvider ?? null;
}

function buildLocalResponse(profile: { targetRole?: string | null; name?: string | null } | null) {
  return [
    `Based on your profile, here's my advice for targeting ${profile?.targetRole ?? "your target role"}:`,
    "1. Build one proof-heavy project that demonstrates end-to-end ownership with measurable metrics.",
    "2. Update your resume with quantified achievements (e.g., 'improved load time by 40%').",
    "3. Apply to roles where your core skills appear in the first paragraph of the job description.",
    "Next step: Set a 7-day sprint — one portfolio improvement, one resume pass, five targeted applications.",
  ].join(" ");
}

// ── Coach history ──────────────────────────────────────────────────────────────

export async function getCoachHistory(userId: string, limit = 20) {
  return prisma.aIHistory.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit,
    select: { id: true, prompt: true, response: true, provider: true, createdAt: true },
  });
}

// ── Coach response ─────────────────────────────────────────────────────────────

export async function createCoachResponse(userId: string, message: string) {
  const [profile, preferredProvider] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      include: {
        skills: true,
        projects: true,
        experience: true,
        education: true,
        achievements: true,
        certificates: true,
        applications: { orderBy: { updatedAt: "desc" }, take: 5 },
      },
    }),
    getUserPreferredProvider(userId),
  ]);

  // Build rich profile context
  const skillList    = profile?.skills.map((s) => s.name).join(", ") || "none listed";
  const projectList  = profile?.projects.map((p) => p.name).join(", ") || "none listed";
  const certList     = profile?.certificates.map((c) => c.name).join(", ") || "none";
  const experienceList = profile?.experience
    .map((e) => `${e.role} at ${e.company}${e.current ? " (current)" : ""}`)
    .join("; ") || "none listed";
  const educationList = profile?.education
    .map((e) => `${e.degree}${e.field ? ` in ${e.field}` : ""} from ${e.school}`)
    .join("; ") || "none listed";

  const applicationStats = {
    total:     profile?.applications.length ?? 0,
    offer:     profile?.applications.filter((a) => a.status === "OFFER").length ?? 0,
    interview: profile?.applications.filter((a) => a.status === "INTERVIEW").length ?? 0,
    applied:   profile?.applications.filter((a) => a.status === "APPLIED").length ?? 0,
  };

  const systemPrompt = `You are CareerOS AI, an expert career coach and mentor. You provide deeply personalised, actionable career guidance.

User's Career Profile:
- Name: ${profile?.name ?? "the user"}
- Target Role: ${profile?.targetRole ?? "not set"}
- Headline: ${profile?.headline ?? "not set"}
- Location: ${profile?.location ?? "not specified"}
- Skills: ${skillList}
- Projects: ${projectList}
- Experience: ${experienceList}
- Education: ${educationList}
- Certifications: ${certList}
- Applications: ${applicationStats.total} total | ${applicationStats.applied} applied | ${applicationStats.interview} interview stage | ${applicationStats.offer} offers

Guidelines:
- Be concise but insightful (3-5 short paragraphs max)
- Give specific, actionable advice tailored to their actual profile data
- Mention their real skills, projects, or experience when relevant
- Be encouraging but honest — don't just give generic advice
- If they ask for a roadmap, provide a structured numbered plan with timelines
- Use formatting (bullet points, numbered lists) where it aids clarity`;

  const result = await callWithFallback(message, {
    preferred: preferredProvider,
    maxTokens: 700,
    temperature: 0.7,
    systemPrompt,
  });

  let responseText: string;
  let providerName: ProviderName;

  if (result) {
    responseText = result.text;
    providerName = result.providerName;
  } else {
    responseText = buildLocalResponse(profile);
    providerName = "local";
  }

  await prisma.aIHistory.create({
    data: { userId, prompt: message, response: responseText, provider: providerName },
  });

  return { response: responseText, provider: providerName };
}
