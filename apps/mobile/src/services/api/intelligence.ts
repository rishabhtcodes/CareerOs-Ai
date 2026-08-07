import { apiClient } from "./client";

export interface IntelligenceReport {
  generatedAt: string;
  provider: string;
  topTechThisWeek: { rank: number; name: string; category: string; score: number }[];
  risingSkills: string[];
  marketPulse: string;
  careerAdvice: string[];
  decliningSkills: string[];
  hotRoles: string[];
  dataSummary: {
    jobsAnalyzed: number;
    techTrendsDetected: number;
    insightsCollected: number;
    sources: string[];
  };
}

export interface PersonalizedIntelligence {
  gapSkills: string[];
  marketMatchedSkills: string[];
  suggestion: string;
}

export interface IntelligenceResponse {
  report: IntelligenceReport | null;
  personalized: PersonalizedIntelligence;
  meta: {
    isStale: boolean;
    hasData: boolean;
  };
}

export async function fetchIntelligence(): Promise<IntelligenceResponse> {
  const { data } = await apiClient.get<IntelligenceResponse>("/intelligence");
  return data;
}

export async function refreshIntelligence(): Promise<{ message: string; startedAt: string }> {
  const { data } = await apiClient.post<{ message: string; startedAt: string }>("/intelligence/refresh");
  return data;
}
