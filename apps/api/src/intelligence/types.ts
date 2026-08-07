/**
 * Intelligence Engine — Data Source Types
 * Each source fetches raw market signal data from a public API.
 * No API key required for any of these sources.
 */

export interface TrendingTech {
  name: string;
  /** Relative mention/star count, higher = more popular */
  score: number;
  category: "language" | "framework" | "tool" | "platform" | "topic";
  source: string;
}

export interface JobSignal {
  title: string;
  skills: string[];
  company?: string;
  location?: string;
  source: string;
}

export interface MarketInsight {
  type: "skill_trend" | "job_demand" | "salary" | "news";
  title: string;
  body: string;
  tags: string[];
  source: string;
  fetchedAt: string;
}

export interface RawIntelligenceData {
  trendingTech: TrendingTech[];
  jobSignals: JobSignal[];
  insights: MarketInsight[];
  fetchedAt: string;
}
