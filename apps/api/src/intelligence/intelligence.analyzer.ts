/**
 * Intelligence Analyzer
 * Takes raw data from all sources and uses the LLM provider system
 * to synthesize it into structured, actionable market intelligence.
 */

import type { RawIntelligenceData, TrendingTech } from "./types";
import { callWithFallback } from "../features/ai/providers/registry";

export interface AnalyzedReport {
  /** ISO date when this report was generated */
  generatedAt: string;
  /** Which AI provider produced this report */
  provider: string;
  /** Top trending technologies ranked by demand score */
  topTechThisWeek: { rank: number; name: string; category: string; score: number }[];
  /** Skills seeing the biggest surge in demand */
  risingSkills: string[];
  /** AI-written market pulse paragraph (3-4 sentences) */
  marketPulse: string;
  /** Concrete career advice based on current market conditions */
  careerAdvice: string[];
  /** Skills that are cooling down / becoming less relevant */
  decliningSkills: string[];
  /** Jobs most actively hiring right now */
  hotRoles: string[];
  /** Raw data summary for debugging */
  dataSummary: {
    jobsAnalyzed: number;
    techTrendsDetected: number;
    insightsCollected: number;
    sources: string[];
  };
}

function deduplicateTech(trends: TrendingTech[]): TrendingTech[] {
  const seen = new Map<string, TrendingTech>();
  for (const t of trends) {
    const key = t.name.toLowerCase().replace(/[.\s]/g, "");
    const existing = seen.get(key);
    if (existing) {
      existing.score += t.score;
    } else {
      seen.set(key, { ...t });
    }
  }
  return Array.from(seen.values()).sort((a, b) => b.score - a.score);
}

function countRoleFrequency(titles: string[]): string[] {
  const roleMap: Map<string, number> = new Map();
  const ROLES = [
    "Frontend Engineer", "Backend Engineer", "Full Stack Engineer",
    "DevOps Engineer", "SRE", "Data Engineer", "ML Engineer",
    "AI Engineer", "Mobile Engineer", "Platform Engineer",
    "Product Engineer", "Software Engineer",
  ];

  for (const title of titles) {
    for (const role of ROLES) {
      if (title.toLowerCase().includes(role.toLowerCase().split(" ")[0])) {
        roleMap.set(role, (roleMap.get(role) ?? 0) + 1);
      }
    }
  }

  return Array.from(roleMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([role]) => role);
}

export async function analyzeIntelligence(
  raw: RawIntelligenceData
): Promise<AnalyzedReport> {
  const now = new Date().toISOString();
  const deduped = deduplicateTech(raw.trendingTech);
  const top20 = deduped.slice(0, 20);
  const hotRoles = countRoleFrequency(raw.jobSignals.map((j) => j.title));

  // Count skill frequency across job signals
  const skillFreq: Map<string, number> = new Map();
  for (const job of raw.jobSignals) {
    for (const skill of job.skills) {
      skillFreq.set(skill, (skillFreq.get(skill) ?? 0) + 1);
    }
  }
  const risingSkills = Array.from(skillFreq.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([s]) => s);

  const sources = [...new Set([...raw.trendingTech.map((t) => t.source), ...raw.insights.map((i) => i.source)])];

  // Prepare AI prompt for market synthesis
  const techSummary = top20
    .slice(0, 12)
    .map((t, i) => `${i + 1}. ${t.name} (${t.category}, score: ${t.score})`)
    .join("\n");

  const jobSkillSummary = risingSkills.join(", ");
  const newsHeadlines = raw.insights
    .slice(0, 5)
    .map((i) => `- ${i.title}`)
    .join("\n");

  const prompt = `You are a senior tech market analyst. Based on the following live data collected today, write a brief tech market intelligence report.

TRENDING TECHNOLOGIES (from GitHub, Dev.to, HackerNews):
${techSummary}

MOST DEMANDED JOB SKILLS (from real job postings):
${jobSkillSummary}

TOP NEWS & DISCUSSIONS:
${newsHeadlines}

Provide a JSON response with exactly this structure:
{
  "marketPulse": "3-4 sentence paragraph describing the current tech job market state, what's hot and why",
  "careerAdvice": ["actionable advice 1", "actionable advice 2", "actionable advice 3"],
  "decliningSkills": ["skill1", "skill2", "skill3"],
  "risingOpportunities": "one sentence about the biggest opportunity for developers right now"
}

Be specific, data-driven, and practical. No filler. Only valid JSON.`;

  let marketPulse = "";
  let careerAdvice: string[] = [];
  let decliningSkills: string[] = [];
  let provider = "local";

  const result = await callWithFallback(prompt, {
    preferred: null,
    maxTokens: 500,
    temperature: 0.4,
  });

  if (result) {
    provider = result.providerName;
    try {
      const jsonMatch = result.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        marketPulse = parsed.marketPulse ?? "";
        careerAdvice = Array.isArray(parsed.careerAdvice) ? parsed.careerAdvice : [];
        decliningSkills = Array.isArray(parsed.decliningSkills) ? parsed.decliningSkills : [];
      }
    } catch {
      // fallback below
    }
  }

  // Local fallback if AI isn't available
  if (!marketPulse) {
    const topTech = top20.slice(0, 5).map((t) => t.name).join(", ");
    marketPulse = `The tech market remains highly active with strong demand for ${topTech}. Remote opportunities continue to dominate, with full-stack and AI roles seeing the highest volume of postings. Developers with cloud and containerisation experience command premium salaries.`;
    careerAdvice = [
      `Focus on ${risingSkills[0] ?? "TypeScript"} — it appears in the most active job postings right now.`,
      "Add Docker and cloud deployment experience to significantly broaden your opportunity set.",
      "Build one project that demonstrates AI/LLM integration — it's the fastest-growing skill signal.",
    ];
    decliningSkills = ["jQuery", "AngularJS", "CoffeeScript", "Grunt"];
  }

  return {
    generatedAt: now,
    provider,
    topTechThisWeek: top20.slice(0, 15).map((t, i) => ({
      rank: i + 1,
      name: t.name,
      category: t.category,
      score: t.score,
    })),
    risingSkills,
    marketPulse,
    careerAdvice,
    decliningSkills,
    hotRoles,
    dataSummary: {
      jobsAnalyzed: raw.jobSignals.length,
      techTrendsDetected: raw.trendingTech.length,
      insightsCollected: raw.insights.length,
      sources,
    },
  };
}
