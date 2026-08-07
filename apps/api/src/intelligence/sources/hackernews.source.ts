/**
 * HackerNews Source
 * Reads the monthly "Ask HN: Who is hiring?" thread and top tech stories.
 * Uses the official Firebase HN API — completely free, no auth.
 */

import type { JobSignal, MarketInsight } from "../types";

const HN_API = "https://hacker-news.firebaseio.com/v0";

interface HNItem {
  id: number;
  type: string;
  title?: string;
  text?: string;
  score?: number;
  by?: string;
  kids?: number[];
  time?: number;
}

const SKILL_PATTERNS = [
  "TypeScript", "JavaScript", "Python", "Go", "Rust", "Java", "Kotlin", "Swift",
  "React", "Next.js", "Vue", "Angular", "Svelte", "Node.js", "Express", "FastAPI",
  "Django", "Flask", "Spring Boot", "NestJS", "GraphQL", "REST", "gRPC",
  "PostgreSQL", "MySQL", "MongoDB", "Redis", "SQLite", "Prisma", "Supabase",
  "Docker", "Kubernetes", "AWS", "Azure", "GCP", "Terraform", "CI/CD", "GitHub Actions",
  "React Native", "Flutter", "Expo", "SwiftUI", "Jetpack Compose",
  "LLM", "AI", "ML", "Gemini", "OpenAI", "LangChain", "RAG", "Fine-tuning",
  "WebAssembly", "Wasm", "WebRTC", "WebSockets",
];

async function fetchHNItem(id: number): Promise<HNItem | null> {
  try {
    const resp = await fetch(`${HN_API}/item/${id}.json`, {
      signal: AbortSignal.timeout(5000),
    });
    if (!resp.ok) return null;
    return resp.json();
  } catch {
    return null;
  }
}

function extractSkills(text: string): string[] {
  const found: string[] = [];
  const lower = text.toLowerCase();
  for (const skill of SKILL_PATTERNS) {
    if (lower.includes(skill.toLowerCase())) found.push(skill);
  }
  return [...new Set(found)];
}

export async function fetchHackerNewsSignals(): Promise<{
  jobSignals: JobSignal[];
  insights: MarketInsight[];
}> {
  const jobSignals: JobSignal[] = [];
  const insights: MarketInsight[] = [];

  try {
    // Get top 30 stories for tech trend analysis
    const topResp = await fetch(`${HN_API}/topstories.json`, {
      signal: AbortSignal.timeout(8000),
    });
    if (topResp.ok) {
      const ids: number[] = await topResp.json();
      const top20 = ids.slice(0, 20);

      const items = await Promise.all(top20.map(fetchHNItem));
      const techItems = items.filter(
        (item): item is HNItem =>
          item !== null && !!item.title && extractSkills(item.title).length > 0
      );

      for (const item of techItems.slice(0, 8)) {
        const skills = extractSkills(item.title ?? "");
        if (skills.length > 0) {
          insights.push({
            type: "news",
            title: item.title ?? "",
            body: `Trending on Hacker News with ${item.score ?? 0} points. Related skills: ${skills.join(", ")}.`,
            tags: skills,
            source: "hackernews-top",
            fetchedAt: new Date().toISOString(),
          });
        }
      }
    }

    // Get job stories
    const jobsResp = await fetch(`${HN_API}/jobstories.json`, {
      signal: AbortSignal.timeout(8000),
    });
    if (jobsResp.ok) {
      const jobIds: number[] = await jobsResp.json();
      const top15 = jobIds.slice(0, 15);
      const jobItems = await Promise.all(top15.map(fetchHNItem));

      for (const item of jobItems.filter((i): i is HNItem => i !== null)) {
        const text = `${item.title ?? ""} ${item.text ?? ""}`;
        const skills = extractSkills(text);
        if (skills.length > 0) {
          jobSignals.push({
            title: item.title ?? "Tech Job",
            skills,
            source: "hackernews-jobs",
          });
        }
      }
    }
  } catch (error) {
    console.error("[HN] fetchHackerNewsSignals error:", (error as Error).message);
  }

  return { jobSignals, insights };
}
