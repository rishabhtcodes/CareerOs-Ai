/**
 * GitHub Trending Source
 * Fetches trending repositories using GitHub Search API (no auth needed, 60 req/hr).
 * Extracts language + topic trends from popular repos.
 */

import type { TrendingTech } from "../types";

const GITHUB_API = "https://api.github.com";

interface GitHubRepo {
  full_name: string;
  language: string | null;
  stargazers_count: number;
  topics: string[];
  description: string | null;
}

function since(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().split("T")[0];
}

export async function fetchGitHubTrends(): Promise<TrendingTech[]> {
  const trends: Map<string, TrendingTech> = new Map();

  try {
    // Fetch repos created in the last 7 days sorted by stars
    const url = `${GITHUB_API}/search/repositories?q=created:>${since(7)}&sort=stars&order=desc&per_page=50`;
    const resp = await fetch(url, {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "CareerOS-AI-Intelligence/1.0",
      },
      signal: AbortSignal.timeout(10_000),
    });

    if (!resp.ok) {
      console.warn(`[GH] Search returned ${resp.status}`);
      return [];
    }

    const data = await resp.json() as { items: GitHubRepo[] };
    const repos = data.items ?? [];

    // Count language mentions (weighted by stars)
    for (const repo of repos) {
      if (repo.language) {
        const key = repo.language.toLowerCase();
        const existing = trends.get(key);
        const score = repo.stargazers_count;
        if (existing) {
          existing.score += score;
        } else {
          trends.set(key, {
            name: repo.language,
            score,
            category: "language",
            source: "github-trending",
          });
        }
      }

      // Count topic tags
      for (const topic of repo.topics ?? []) {
        const key = `topic:${topic}`;
        const existing = trends.get(key);
        const score = Math.floor(repo.stargazers_count / 5);
        if (existing) {
          existing.score += score;
        } else {
          // Categorize common topics
          const category = classifyTopic(topic);
          if (category) {
            trends.set(key, {
              name: topic,
              score,
              category,
              source: "github-trending",
            });
          }
        }
      }
    }
  } catch (error) {
    console.error("[GH] fetchGitHubTrends error:", (error as Error).message);
  }

  return Array.from(trends.values())
    .sort((a, b) => b.score - a.score)
    .slice(0, 30);
}

function classifyTopic(
  topic: string
): "language" | "framework" | "tool" | "platform" | "topic" | null {
  const frameworks = [
    "react", "nextjs", "vue", "angular", "svelte", "nuxt",
    "fastapi", "django", "flask", "express", "nestjs", "rails",
    "spring", "laravel", "pytorch", "tensorflow", "langchain",
    "electron", "tauri", "expo",
  ];
  const tools = [
    "docker", "kubernetes", "terraform", "ansible", "grafana",
    "prometheus", "vite", "webpack", "eslint", "prisma", "drizzle",
    "supabase", "firebase", "redis", "nginx",
  ];
  const platforms = [
    "aws", "azure", "gcp", "vercel", "netlify", "cloudflare",
    "github", "gitlab", "bitbucket", "heroku", "railway",
  ];
  const skip = ["awesome", "tutorial", "guide", "course", "learning", "resources"];

  const t = topic.toLowerCase();
  if (skip.some((s) => t.includes(s))) return null;
  if (frameworks.some((f) => t.includes(f))) return "framework";
  if (tools.some((f) => t.includes(f))) return "tool";
  if (platforms.some((f) => t.includes(f))) return "platform";
  return "topic";
}
