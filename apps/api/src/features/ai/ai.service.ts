import { prisma } from "../../config/prisma";
import { env } from "../../config/env";

async function callGemini(prompt: string): Promise<string | null> {
  if (!env.GEMINI_API_KEY) return null;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            maxOutputTokens: 512,
            temperature: 0.7,
          },
        }),
      }
    );

    if (!response.ok) return null;

    const data = await response.json();
    return (
      data?.candidates?.[0]?.content?.parts?.[0]?.text ?? null
    );
  } catch {
    return null;
  }
}

export async function createCoachResponse(userId: string, message: string) {
  const profile = await prisma.user.findUnique({
    where: { id: userId },
    include: { skills: true, projects: true, experience: true },
  });

  const provider = env.GEMINI_API_KEY ? "gemini" : "local-rules";
  let response: string;

  if (env.GEMINI_API_KEY) {
    const skillList = profile?.skills.map((s) => s.name).join(", ") || "none listed";
    const projectList = profile?.projects.map((p) => p.name).join(", ") || "none listed";
    const experienceList = profile?.experience.map((e) => `${e.role} at ${e.company}`).join(", ") || "none listed";

    const systemContext = `You are CareerOS AI, a professional career coach. The user's profile:
- Target role: ${profile?.targetRole ?? "not set"}
- Skills: ${skillList}
- Projects: ${projectList}
- Experience: ${experienceList}

Give concise, actionable, personalized career advice. Max 3 paragraphs. Be direct and encouraging.`;

    const fullPrompt = `${systemContext}\n\nUser: ${message}\nCoach:`;
    const geminiResponse = await callGemini(fullPrompt);
    response = geminiResponse ?? buildLocalResponse(profile);
  } else {
    response = buildLocalResponse(profile);
  }

  await prisma.aIHistory.create({
    data: {
      userId,
      prompt: message,
      response,
      provider,
    },
  });

  return { response };
}

function buildLocalResponse(profile: { targetRole?: string | null } | null) {
  return [
    `Based on your profile, focus on ${profile?.targetRole ?? "your target role"} positioning.`,
    "Build one proof-heavy project that demonstrates end-to-end ownership, update your resume with measurable metrics, and apply to roles where your core skills repeat in the job description.",
    "Next action: create a 7-day roadmap with one portfolio improvement, one resume pass, and five targeted applications.",
  ].join(" ");
}
