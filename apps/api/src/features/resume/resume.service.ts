import { prisma } from "../../config/prisma";
import { env } from "../../config/env";

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
          generationConfig: {
            maxOutputTokens: 2048,
            temperature: 0.4,
          },
        }),
      }
    );
    if (!response.ok) return null;
    const data = await response.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? null;
  } catch {
    return null;
  }
}

function calculateAtsScore(
  content: string,
  targetDescription: string | null,
  skills: string[]
): number {
  let score = 40;

  // Skills present in content
  const skillHits = skills.filter((s) =>
    content.toLowerCase().includes(s.toLowerCase())
  ).length;
  score += Math.min(25, skillHits * 3);

  // Keywords from job description matched
  if (targetDescription) {
    const jdWords = targetDescription
      .toLowerCase()
      .split(/\W+/)
      .filter((w) => w.length > 4);
    const uniqueJdWords = [...new Set(jdWords)];
    const matched = uniqueJdWords.filter((w) =>
      content.toLowerCase().includes(w)
    ).length;
    const jdScore = Math.round((matched / Math.max(uniqueJdWords.length, 1)) * 25);
    score += Math.min(25, jdScore);
  } else {
    score += 10;
  }

  // Content richness
  if (content.length > 1000) score += 5;
  if (content.includes("•") || content.includes("-")) score += 3;
  if (/\d+%|\d+\s*(users|projects|clients|revenue)/i.test(content)) score += 7;

  return Math.min(98, Math.max(45, score));
}

export async function readResumes(userId: string) {
  return prisma.generatedResume.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" }
  });
}

export async function readResumeById(userId: string, id: string) {
  return prisma.generatedResume.findFirst({
    where: { id, userId }
  });
}

export async function createResumeDraft(
  userId: string,
  input: {
    type: "frontend" | "fullstack" | "python" | "ai" | "custom";
    targetJobDescription?: string;
  }
) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      skills: true,
      projects: true,
      experience: true,
      education: true,
      achievements: true,
      certificates: true
    }
  });

  const skillList = user?.skills.map((s) => s.name).join(", ") || "Not specified";
  const targetRole = user?.targetRole ?? "Software Developer";
  const name = user?.name ?? "Candidate";
  const headline = user?.headline ?? targetRole;
  const bio = user?.bio ?? "";
  const location = user?.location ?? "";

  const experienceText = (user?.experience ?? [])
    .map((e) => {
      const highlights = JSON.parse(e.highlights || "[]") as string[];
      const dates = `${e.startDate ? new Date(e.startDate).getFullYear() : "?"} – ${e.current ? "Present" : (e.endDate ? new Date(e.endDate).getFullYear() : "?")}`;
      return `**${e.role}** at ${e.company} (${dates})\n${e.description ?? ""}\n${highlights.map((h) => `• ${h}`).join("\n")}`;
    })
    .join("\n\n");

  const educationText = (user?.education ?? [])
    .map((e) => `${e.degree}${e.field ? ` in ${e.field}` : ""} — ${e.school}`)
    .join("\n");

  const projectsText = (user?.projects ?? [])
    .map((p) => {
      const stack = JSON.parse(p.techStack || "[]") as string[];
      return `**${p.name}** [${stack.join(", ")}]\n${p.summary}\n${p.impact ? `Impact: ${p.impact}` : ""}`;
    })
    .join("\n\n");

  const achievementsText = (user?.achievements ?? [])
    .map((a) => `• ${a.title}${a.description ? `: ${a.description}` : ""}`)
    .join("\n");

  const typeDescriptions: Record<string, string> = {
    frontend: "React, TypeScript, CSS, animations, responsive design, performance optimization",
    fullstack: "React, Node.js, Express, PostgreSQL, REST APIs, deployment",
    python: "Python, Django, FastAPI, data science, pandas, machine learning",
    ai: "Machine learning, LLMs, Gemini, PyTorch, TensorFlow, fine-tuning, RAG",
    custom: "general software development"
  };

  const typeContext = typeDescriptions[input.type] ?? "software development";
  const jdSection = input.targetJobDescription
    ? `\n\nTarget Job Description:\n---\n${input.targetJobDescription.slice(0, 1500)}\n---`
    : "";

  const prompt = `You are an expert technical resume writer and career coach. Generate a complete, professional, ATS-optimised resume for the following candidate.

Candidate Profile:
- Name: ${name}
- Headline: ${headline}
- Location: ${location}
- Bio: ${bio}
- Target Role: ${targetRole}
- Resume Type: ${input.type.toUpperCase()} (focus: ${typeContext})
- Skills: ${skillList}

Work Experience:
${experienceText || "No experience listed yet."}

Education:
${educationText || "No education listed yet."}

Projects:
${projectsText || "No projects listed yet."}

Achievements:
${achievementsText || "No achievements listed."}
${jdSection}

Instructions:
1. Write a complete resume in markdown format with clear sections: Summary, Skills, Experience, Projects, Education, Achievements.
2. Tailor the content specifically for a ${input.type.toUpperCase()} developer role.
3. Use strong action verbs, quantify achievements where possible.
4. Make the summary compelling and personalised (3-4 sentences).
5. For each experience, add 3-5 bullet points with impact metrics if missing.
6. Group skills by category (Languages, Frameworks, Tools, etc.).
7. Keep it to one page worth of content (600-900 words).
8. Return ONLY the resume markdown, no extra commentary.`;

  let aiContent: string | null = null;
  if (env.GEMINI_API_KEY) {
    aiContent = await callGemini(prompt);
  }

  const fallbackContent = `# ${name}\n${headline}\n\n## Summary\n${bio || `${name} is a passionate ${targetRole} with expertise in ${skillList}.`}\n\n## Skills\n${skillList}\n\n## Experience\n${experienceText || "_Add your experience to generate detailed content._"}\n\n## Projects\n${projectsText || "_Add your projects to showcase your work._"}\n\n## Education\n${educationText || "_Add your education details._"}\n\n## Achievements\n${achievementsText || "_Add your achievements._"}`;

  const content = aiContent ?? fallbackContent;
  const atsScore = calculateAtsScore(content, input.targetJobDescription ?? null, user?.skills.map((s) => s.name) ?? []);

  return prisma.generatedResume.create({
    data: {
      userId,
      title: `${capitalize(input.type)} Resume`,
      type: input.type,
      atsScore,
      content
    }
  });
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
