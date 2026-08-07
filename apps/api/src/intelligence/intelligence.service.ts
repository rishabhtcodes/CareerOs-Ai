/**
 * Intelligence Service
 * Orchestrates all data sources → analyzer → DB persistence.
 * Called by the scheduler and the manual refresh endpoint.
 */

import { prisma } from "../config/prisma";
import { fetchGitHubTrends } from "./sources/github.source";
import { fetchHackerNewsSignals } from "./sources/hackernews.source";
import { fetchDevToTrends } from "./sources/devto.source";
import { fetchJobMarketSignals } from "./sources/jobmarket.source";
import { analyzeIntelligence, type AnalyzedReport } from "./intelligence.analyzer";
import type { RawIntelligenceData } from "./types";

// ── Cache: prevent double-runs ─────────────────────────────────────────────────
let isRunning = false;
let lastRunAt: Date | null = null;

const MIN_INTERVAL_MS = 6 * 60 * 60 * 1000; // 6 hours

export function isIntelligenceStale(): boolean {
  if (!lastRunAt) return true;
  return Date.now() - lastRunAt.getTime() > MIN_INTERVAL_MS;
}

// ── Main orchestration ─────────────────────────────────────────────────────────

export async function runIntelligenceCycle(force = false): Promise<AnalyzedReport | null> {
  if (isRunning) {
    console.log("[Intelligence] Cycle already running — skipping");
    return null;
  }
  if (!force && !isIntelligenceStale()) {
    console.log("[Intelligence] Data is fresh — skipping");
    return null;
  }

  isRunning = true;
  const startedAt = Date.now();
  console.log("[Intelligence] Starting intelligence cycle…");

  try {
    // 1. Fetch all sources in parallel
    const [ghTrends, hnData, devtoData, jobData] = await Promise.allSettled([
      fetchGitHubTrends(),
      fetchHackerNewsSignals(),
      fetchDevToTrends(),
      fetchJobMarketSignals(),
    ]);

    const raw: RawIntelligenceData = {
      trendingTech: [
        ...(ghTrends.status === "fulfilled" ? ghTrends.value : []),
        ...(devtoData.status === "fulfilled" ? devtoData.value.trendingTech : []),
      ],
      jobSignals: [
        ...(hnData.status === "fulfilled" ? hnData.value.jobSignals : []),
        ...(jobData.status === "fulfilled" ? jobData.value.jobSignals : []),
      ],
      insights: [
        ...(hnData.status === "fulfilled" ? hnData.value.insights : []),
        ...(devtoData.status === "fulfilled" ? devtoData.value.insights : []),
        ...(jobData.status === "fulfilled" ? jobData.value.insights : []),
      ],
      fetchedAt: new Date().toISOString(),
    };

    console.log(
      `[Intelligence] Fetched: ${raw.trendingTech.length} tech trends, ` +
      `${raw.jobSignals.length} job signals, ${raw.insights.length} insights`
    );

    // 2. AI analysis
    const report = await analyzeIntelligence(raw);

    // 3. Persist to DB
    await persistReport(report, raw);

    lastRunAt = new Date();
    const elapsed = ((Date.now() - startedAt) / 1000).toFixed(1);
    console.log(`[Intelligence] Cycle complete in ${elapsed}s via ${report.provider}`);

    return report;
  } catch (error) {
    console.error("[Intelligence] Cycle failed:", (error as Error).message);
    return null;
  } finally {
    isRunning = false;
  }
}

async function persistReport(report: AnalyzedReport, raw: RawIntelligenceData): Promise<void> {
  try {
    await prisma.marketIntelligence.create({
      data: {
        generatedAt: new Date(report.generatedAt),
        provider: report.provider,
        marketPulse: report.marketPulse,
        topTech: JSON.stringify(report.topTechThisWeek),
        risingSkills: JSON.stringify(report.risingSkills),
        decliningSkills: JSON.stringify(report.decliningSkills),
        hotRoles: JSON.stringify(report.hotRoles),
        careerAdvice: JSON.stringify(report.careerAdvice),
        rawSummary: JSON.stringify(report.dataSummary),
      },
    });

    // Keep only the last 30 reports (prune old ones)
    const old = await prisma.marketIntelligence.findMany({
      orderBy: { generatedAt: "desc" },
      skip: 30,
      select: { id: true },
    });
    if (old.length > 0) {
      await prisma.marketIntelligence.deleteMany({
        where: { id: { in: old.map((r) => r.id) } },
      });
    }
  } catch (error) {
    console.error("[Intelligence] Failed to persist report:", (error as Error).message);
  }
}

// ── Reader ─────────────────────────────────────────────────────────────────────

export async function getLatestReport(): Promise<AnalyzedReport | null> {
  const record = await prisma.marketIntelligence.findFirst({
    orderBy: { generatedAt: "desc" },
  });
  if (!record) return null;

  return {
    generatedAt: record.generatedAt.toISOString(),
    provider: record.provider,
    marketPulse: record.marketPulse,
    topTechThisWeek: JSON.parse(record.topTech),
    risingSkills: JSON.parse(record.risingSkills),
    decliningSkills: JSON.parse(record.decliningSkills),
    hotRoles: JSON.parse(record.hotRoles),
    careerAdvice: JSON.parse(record.careerAdvice),
    dataSummary: JSON.parse(record.rawSummary),
  };
}

export async function getPersonalizedInsights(userId: string): Promise<{
  gapSkills: string[];
  marketMatchedSkills: string[];
  suggestion: string;
  report: AnalyzedReport | null;
}> {
  const [report, userSkills] = await Promise.all([
    getLatestReport(),
    prisma.skill.findMany({ where: { userId }, select: { name: true } }),
  ]);

  if (!report) {
    return { gapSkills: [], marketMatchedSkills: [], suggestion: "Run intelligence refresh to get personalized insights.", report: null };
  }

  const userSkillNames = userSkills.map((s) => s.name.toLowerCase());
  const risingLower = report.risingSkills.map((s) => s.toLowerCase());

  const marketMatchedSkills = report.risingSkills.filter((s) =>
    userSkillNames.some((u) => u.includes(s.toLowerCase()) || s.toLowerCase().includes(u))
  );

  const gapSkills = report.risingSkills
    .filter((s) => !userSkillNames.some((u) => u.includes(s.toLowerCase()) || s.toLowerCase().includes(u)))
    .slice(0, 5);

  const matchPct = Math.round((marketMatchedSkills.length / Math.max(report.risingSkills.length, 1)) * 100);

  const suggestion =
    gapSkills.length > 0
      ? `You match ${matchPct}% of this week's hot skills. Adding ${gapSkills.slice(0, 2).join(" and ")} could significantly boost your job match scores.`
      : `Excellent — your skills align well with current market demand. Focus on deepening expertise in ${report.risingSkills[0] ?? "your top skill"}.`;

  return { gapSkills, marketMatchedSkills, suggestion, report };
}
