/**
 * Dev.to Source
 * Fetches trending articles from Dev.to's public API — no API key required.
 * Extracts tech tags from popular posts to identify trending topics.
 */

import type { MarketInsight, TrendingTech } from "../types";

const DEVTO_API = "https://dev.to/api";

interface DevToArticle {
  id: number;
  title: string;
  tag_list: string[];
  positive_reactions_count: number;
  comments_count: number;
  reading_time_minutes: number;
  published_at: string;
}

// Tags we care about for career intelligence
const RELEVANT_TAGS = new Set([
  "javascript", "typescript", "python", "rust", "go", "java", "kotlin", "swift",
  "react", "nextjs", "vue", "svelte", "angular", "node", "express", "nestjs",
  "fastapi", "django", "flask", "spring",
  "docker", "kubernetes", "devops", "terraform", "cicd",
  "aws", "azure", "gcp", "cloudflare",
  "ai", "machinelearning", "llm", "openai", "gemini", "langchain",
  "reactnative", "flutter", "expo", "ios", "android",
  "postgresql", "mongodb", "redis", "supabase", "prisma",
  "webdev", "backend", "frontend", "fullstack",
  "graphql", "api", "microservices",
]);

export async function fetchDevToTrends(): Promise<{
  trendingTech: TrendingTech[];
  insights: MarketInsight[];
}> {
  const tagScores: Map<string, number> = new Map();
  const insights: MarketInsight[] = [];

  try {
    // Top articles from the past week
    const resp = await fetch(`${DEVTO_API}/articles?per_page=50&top=7`, {
      headers: { "User-Agent": "CareerOS-AI-Intelligence/1.0" },
      signal: AbortSignal.timeout(10_000),
    });

    if (!resp.ok) {
      console.warn(`[DevTo] API returned ${resp.status}`);
      return { trendingTech: [], insights: [] };
    }

    const articles: DevToArticle[] = await resp.json();

    for (const article of articles) {
      const engagementScore = article.positive_reactions_count + article.comments_count * 2;

      // Score each relevant tag
      for (const tag of article.tag_list) {
        const lowerTag = tag.toLowerCase();
        if (RELEVANT_TAGS.has(lowerTag)) {
          tagScores.set(lowerTag, (tagScores.get(lowerTag) ?? 0) + engagementScore);
        }
      }

      // Add top articles as insights
      const relevantTags = article.tag_list.filter((t) => RELEVANT_TAGS.has(t.toLowerCase()));
      if (relevantTags.length >= 2 && article.positive_reactions_count > 50) {
        insights.push({
          type: "news",
          title: article.title,
          body: `Trending on Dev.to — ${article.positive_reactions_count} reactions, ${article.comments_count} comments. Tags: ${relevantTags.join(", ")}.`,
          tags: relevantTags,
          source: "devto-trending",
          fetchedAt: new Date().toISOString(),
        });
      }
    }
  } catch (error) {
    console.error("[DevTo] fetchDevToTrends error:", (error as Error).message);
    return { trendingTech: [], insights: [] };
  }

  const trendingTech: TrendingTech[] = Array.from(tagScores.entries())
    .map(([name, score]) => ({
      name: formatTagName(name),
      score,
      category: classifyTag(name),
      source: "devto-trending",
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 20);

  return { trendingTech, insights: insights.slice(0, 6) };
}

function formatTagName(tag: string): string {
  const names: Record<string, string> = {
    javascript: "JavaScript", typescript: "TypeScript", python: "Python",
    rust: "Rust", go: "Go", java: "Java", kotlin: "Kotlin", swift: "Swift",
    react: "React", nextjs: "Next.js", vue: "Vue.js", svelte: "Svelte",
    angular: "Angular", node: "Node.js", nestjs: "NestJS",
    fastapi: "FastAPI", django: "Django", flask: "Flask",
    docker: "Docker", kubernetes: "Kubernetes", devops: "DevOps",
    terraform: "Terraform", aws: "AWS", azure: "Azure", gcp: "GCP",
    ai: "AI / LLMs", machinelearning: "Machine Learning", llm: "LLM",
    openai: "OpenAI", gemini: "Gemini", langchain: "LangChain",
    reactnative: "React Native", flutter: "Flutter", expo: "Expo",
    postgresql: "PostgreSQL", mongodb: "MongoDB", redis: "Redis",
    supabase: "Supabase", prisma: "Prisma",
    graphql: "GraphQL", microservices: "Microservices",
    webdev: "Web Development", backend: "Backend", frontend: "Frontend",
    fullstack: "Full Stack",
  };
  return names[tag.toLowerCase()] ?? tag.charAt(0).toUpperCase() + tag.slice(1);
}

function classifyTag(tag: string): "language" | "framework" | "tool" | "platform" | "topic" {
  const languages = ["javascript", "typescript", "python", "rust", "go", "java", "kotlin", "swift", "c++", "c#"];
  const frameworks = ["react", "nextjs", "vue", "svelte", "angular", "node", "nestjs", "fastapi", "django", "flask", "spring", "flutter", "reactnative", "expo", "langchain"];
  const tools = ["docker", "kubernetes", "terraform", "devops", "cicd", "prisma", "supabase", "redis", "postgresql", "mongodb", "graphql"];
  const platforms = ["aws", "azure", "gcp", "cloudflare", "openai", "gemini"];

  const t = tag.toLowerCase();
  if (languages.includes(t)) return "language";
  if (frameworks.includes(t)) return "framework";
  if (tools.includes(t)) return "tool";
  if (platforms.includes(t)) return "platform";
  return "topic";
}
