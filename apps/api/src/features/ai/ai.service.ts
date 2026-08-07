import { prisma } from "../../config/prisma";
import { env } from "../../config/env";

async function callGemini(prompt: string, maxTokens = 600): Promise<string | null> {
  if (!env.GEMINI_API_KEY) return null;
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: maxTokens, temperature: 0.7 }
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

async function callGroq(prompt: string): Promise<string | null> {
  if (!env.GROQ_API_KEY) return null;
  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 600,
        temperature: 0.7
      })
    });
    if (!response.ok) return null;
    const data = await response.json();
    return data?.choices?.[0]?.message?.content ?? null;
  } catch {
    return null;
  }
}

export async function getCoachHistory(userId: string, limit = 20) {
  return prisma.aIHistory.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit,
    select: { id: true, prompt: true, response: true, provider: true, createdAt: true }
  });
}

export async function createCoachResponse(userId: string, message: string) {
  const profile = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      skills: true,
      projects: true,
      experience: true,
      education: true,
      achievements: true,
      applications: { orderBy: { updatedAt: "desc" }, take: 5 }
    }
  });

  const skillList = profile?.skills.map((s) => s.name).join(", ") || "none listed";
  const projectList = profile?.projects.map((p) => p.name).join(", ") || "none listed";
  const experienceList = profile?.experience
    .map((e) => `${e.role} at ${e.company}${e.current ? " (current)" : ""}`)
    .join("; ") || "none listed";
  const educationList = profile?.education
    .map((e) => `${e.degree} from ${e.school}`)
    .join("; ") || "none listed";
  const applicationStats = {
    total: profile?.applications.length ?? 0,
    offer: profile?.applications.filter((a) => a.status === "OFFER").length ?? 0,
    interview: profile?.applications.filter((a) => a.status === "INTERVIEW").length ?? 0
  };

  const systemContext = `You are CareerOS AI, an expert career coach and mentor. You provide deeply personalised, actionable career guidance.

User's Career Profile:
- Name: ${profile?.name ?? "the user"}
- Target Role: ${profile?.targetRole ?? "not set"}
- Headline: ${profile?.headline ?? "not set"}
- Location: ${profile?.location ?? "not specified"}
- Skills: ${skillList}
- Projects: ${projectList}
- Experience: ${experienceList}
- Education: ${educationList}
- Applications: ${applicationStats.total} total, ${applicationStats.interview} in interview stage, ${applicationStats.offer} offers

Guidelines:
- Be concise but insightful (3-5 short paragraphs max)
- Give specific, actionable advice tailored to their profile
- Mention their actual skills, projects, or experience when relevant
- Be encouraging but honest
- If they ask for a roadmap, provide a structured, numbered plan
- Use formatting (bullet points, numbered lists) where helpful`;

  const fullPrompt = `${systemContext}\n\nUser message: ${message}\n\nYour response:`;

  let response: string;
  let provider: string;

  // Try Gemini first, then Groq, then local fallback
  const geminiResponse = await callGemini(fullPrompt, 600);
  if (geminiResponse) {
    response = geminiResponse;
    provider = "gemini";
  } else {
    const groqResponse = await callGroq(fullPrompt);
    if (groqResponse) {
      response = groqResponse;
      provider = "groq";
    } else {
      response = buildLocalResponse(profile);
      provider = "local-rules";
    }
  }

  await prisma.aIHistory.create({
    data: { userId, prompt: message, response, provider }
  });

  return { response, provider };
}

function buildLocalResponse(profile: { targetRole?: string | null; name?: string | null } | null) {
  return [
    `Based on your profile, here's my advice for targeting ${profile?.targetRole ?? "your target role"}:`,
    "1. Build one proof-heavy project that demonstrates end-to-end ownership with measurable metrics.",
    "2. Update your resume with quantified achievements (e.g., 'improved performance by 40%').",
    "3. Apply to roles where your core skills appear in the first paragraph of the job description.",
    "Next step: Set a 7-day sprint — one portfolio improvement, one resume pass, five targeted applications."
  ].join(" ");
}
