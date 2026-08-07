import { prisma } from "../../config/prisma";
import { env } from "../../config/env";

const APPLICATION_STATUSES = ["SAVED", "APPLIED", "SCREENING", "INTERVIEW", "OFFER", "REJECTED"] as const;
type ApplicationStatus = typeof APPLICATION_STATUSES[number];

async function callGemini(prompt: string): Promise<string | null> {
  if (!env.GEMINI_API_KEY) return null;
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 512, temperature: 0.3 }
        })
      }
    );
    if (!response.ok) return null;
    const data = await response.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? null;
  } catch {
    return null;
  }
}

// ─── Applications ─────────────────────────────────────────────────────────────

export async function readApplications(userId: string) {
  return prisma.application.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" }
  });
}

export async function createApplication(
  userId: string,
  input: {
    company: string;
    role: string;
    sourceUrl?: string | null;
    status?: ApplicationStatus;
    matchScore?: number | null;
    notes?: string | null;
    appliedAt?: string | null;
  }
) {
  return prisma.application.create({
    data: {
      userId,
      company: input.company,
      role: input.role,
      sourceUrl: input.sourceUrl ?? null,
      status: input.status ?? "SAVED",
      matchScore: input.matchScore ?? null,
      notes: input.notes ?? null,
      appliedAt: input.appliedAt ? new Date(input.appliedAt) : null
    }
  });
}

export async function updateApplication(
  userId: string,
  id: string,
  input: {
    status?: ApplicationStatus;
    notes?: string | null;
    matchScore?: number | null;
    appliedAt?: string | null;
  }
) {
  const app = await prisma.application.findFirst({ where: { id, userId } });
  if (!app) throw new Error("Not found");

  return prisma.application.update({
    where: { id },
    data: {
      status: input.status,
      notes: input.notes,
      matchScore: input.matchScore,
      appliedAt: input.appliedAt ? new Date(input.appliedAt) : undefined
    }
  });
}

export async function deleteApplication(userId: string, id: string) {
  const app = await prisma.application.findFirst({ where: { id, userId } });
  if (!app) throw new Error("Not found");
  return prisma.application.delete({ where: { id } });
}

// ─── Job Analysis ─────────────────────────────────────────────────────────────

export async function analyzeJobDescription(
  userId: string,
  input: { sourceUrl?: string; description?: string }
) {
  const [skills, profile] = await Promise.all([
    prisma.skill.findMany({ where: { userId } }),
    prisma.user.findUnique({ where: { id: userId }, select: { targetRole: true, name: true } })
  ]);

  const description = input.description ?? "";
  const skillNames = skills.map((s) => s.name);

  const matchedSkills = skillNames.filter((skill) =>
    description.toLowerCase().includes(skill.toLowerCase())
  );

  let extractedSkills = matchedSkills;
  let missingSkills: string[] = [];
  let suggestions: string[] = [];

  // Try Gemini for richer analysis
  if (env.GEMINI_API_KEY && description.length > 50) {
    const prompt = `Analyze this job description and provide a JSON response.

Job Description:
${description.slice(0, 2000)}

Candidate Skills: ${skillNames.join(", ")}
Target Role: ${profile?.targetRole ?? "not specified"}

Return ONLY valid JSON with this structure:
{
  "matched_skills": ["skill1", "skill2"],
  "missing_skills": ["skill3", "skill4"],
  "suggestions": ["actionable suggestion 1", "actionable suggestion 2", "suggestion 3"]
}

Rules:
- matched_skills: candidate skills that appear in the job description (max 10)
- missing_skills: important skills in the job description that the candidate lacks (max 6)  
- suggestions: specific, actionable resume improvements (max 4, be concrete)`;

    const aiResponse = await callGemini(prompt);
    if (aiResponse) {
      try {
        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          extractedSkills = Array.isArray(parsed.matched_skills) ? parsed.matched_skills : matchedSkills;
          missingSkills = Array.isArray(parsed.missing_skills) ? parsed.missing_skills : [];
          suggestions = Array.isArray(parsed.suggestions) ? parsed.suggestions : [];
        }
      } catch {
        // Fall through to local logic
      }
    }
  }

  // Local fallback
  if (missingSkills.length === 0) {
    const commonSkills = ["System design", "Testing", "CI/CD", "Docker", "AWS"];
    missingSkills = commonSkills.filter(
      (skill) => !matchedSkills.some((m) => m.toLowerCase().includes(skill.toLowerCase()))
    );
  }

  if (suggestions.length === 0) {
    suggestions = [
      "Mirror the job title and top keywords in your resume headline.",
      "Add project bullets that show business impact and technical ownership.",
      "Quantify achievements with metrics (users, performance %, revenue impact)."
    ];
  }

  const baseScore = 45 + matchedSkills.length * 7;
  const matchScore = Math.min(95, baseScore);

  return prisma.jobAnalysis.create({
    data: {
      userId,
      sourceUrl: input.sourceUrl,
      description,
      matchScore,
      extractedSkills: JSON.stringify(extractedSkills),
      missingSkills: JSON.stringify(missingSkills),
      suggestions: JSON.stringify(suggestions)
    }
  });
}
