/**
 * Job Market Source
 * Fetches real job listings from free public job APIs:
 *  - Jobicy (https://jobicy.com/api/v2/remote-jobs) — remote tech jobs, free
 *  - RemoteOK (https://remoteok.com/api) — remote jobs, free
 *
 * Extracts skills from job titles and tags to understand what employers want.
 */

import type { JobSignal, MarketInsight } from "../types";

// ── Skill extraction ───────────────────────────────────────────────────────────

const SKILL_PATTERNS = [
  "TypeScript", "JavaScript", "Python", "Go", "Rust", "Java", "Kotlin", "Swift",
  "C#", "C++", "PHP", "Ruby", "Scala",
  "React", "Next.js", "Vue", "Angular", "Svelte", "Node.js", "Express", "NestJS",
  "FastAPI", "Django", "Flask", "Spring", "Rails", "Laravel",
  "React Native", "Flutter", "Expo", "iOS", "Android", "SwiftUI",
  "PostgreSQL", "MySQL", "MongoDB", "Redis", "Elasticsearch", "Supabase",
  "Docker", "Kubernetes", "AWS", "Azure", "GCP", "Terraform", "CI/CD",
  "GraphQL", "REST", "gRPC", "WebSockets", "Microservices",
  "Machine Learning", "AI", "LLM", "MLOps", "PyTorch", "TensorFlow",
  "Prisma", "Drizzle", "TypeORM", "Sequelize",
  "Git", "Linux", "Bash", "DevOps", "SRE",
];

function extractSkills(text: string): string[] {
  const lower = text.toLowerCase();
  return [...new Set(SKILL_PATTERNS.filter((s) => lower.includes(s.toLowerCase())))];
}

// ── Jobicy ─────────────────────────────────────────────────────────────────────

interface JobicyJob {
  id: string;
  jobTitle: string;
  companyName: string;
  jobTags: string[];
  jobType: string;
}

async function fetchJobicyJobs(): Promise<JobSignal[]> {
  try {
    const resp = await fetch("https://jobicy.com/api/v2/remote-jobs?count=25&tag=developer", {
      headers: { "User-Agent": "CareerOS-AI-Intelligence/1.0" },
      signal: AbortSignal.timeout(10_000),
    });
    if (!resp.ok) return [];
    const data = await resp.json() as { jobs?: JobicyJob[] };
    const jobs = data.jobs ?? [];

    return jobs.map((j) => ({
      title: j.jobTitle,
      skills: [
        ...extractSkills(j.jobTitle),
        ...j.jobTags.map((t) => {
          // Normalize tag to known skill
          const found = SKILL_PATTERNS.find((s) => s.toLowerCase() === t.toLowerCase());
          return found ?? null;
        }).filter((s): s is string => s !== null),
      ].slice(0, 10),
      company: j.companyName,
      source: "jobicy",
    }));
  } catch (error) {
    console.error("[Jobicy] error:", (error as Error).message);
    return [];
  }
}

// ── RemoteOK ───────────────────────────────────────────────────────────────────

interface RemoteOKJob {
  id: string;
  position: string;
  company: string;
  tags: string[];
  location: string;
}

async function fetchRemoteOKJobs(): Promise<JobSignal[]> {
  try {
    const resp = await fetch("https://remoteok.com/api?tags=dev", {
      headers: {
        "User-Agent": "CareerOS-AI-Intelligence/1.0",
        "Accept": "application/json",
      },
      signal: AbortSignal.timeout(10_000),
    });
    if (!resp.ok) return [];
    const data = await resp.json() as RemoteOKJob[];
    // First element is often a "legal" object, skip it
    const jobs = data.filter((j) => j.position);

    return jobs.slice(0, 20).map((j) => ({
      title: j.position,
      skills: [
        ...extractSkills(j.position),
        ...j.tags.map((t) => {
          const found = SKILL_PATTERNS.find((s) => s.toLowerCase() === t.toLowerCase());
          return found ?? null;
        }).filter((s): s is string => s !== null),
      ].slice(0, 10),
      company: j.company,
      location: j.location,
      source: "remoteok",
    }));
  } catch (error) {
    console.error("[RemoteOK] error:", (error as Error).message);
    return [];
  }
}

// ── Aggregator ─────────────────────────────────────────────────────────────────

export async function fetchJobMarketSignals(): Promise<{
  jobSignals: JobSignal[];
  insights: MarketInsight[];
}> {
  // Run both in parallel
  const [jobicy, remoteok] = await Promise.allSettled([
    fetchJobicyJobs(),
    fetchRemoteOKJobs(),
  ]);

  const allJobs: JobSignal[] = [
    ...(jobicy.status === "fulfilled" ? jobicy.value : []),
    ...(remoteok.status === "fulfilled" ? remoteok.value : []),
  ];

  // Aggregate skill demand from job postings
  const skillDemand: Map<string, number> = new Map();
  for (const job of allJobs) {
    for (const skill of job.skills) {
      skillDemand.set(skill, (skillDemand.get(skill) ?? 0) + 1);
    }
  }

  // Build market demand insight
  const topSkills = Array.from(skillDemand.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map(([skill, count]) => `${skill} (${count} jobs)`);

  const insights: MarketInsight[] = [];

  if (topSkills.length > 0) {
    insights.push({
      type: "job_demand",
      title: "Most In-Demand Skills This Week",
      body: `Based on ${allJobs.length} real remote job listings: ${topSkills.join(", ")}.`,
      tags: topSkills.map((s) => s.split(" ")[0]),
      source: "job-market-aggregate",
      fetchedAt: new Date().toISOString(),
    });
  }

  return { jobSignals: allJobs.slice(0, 40), insights };
}
