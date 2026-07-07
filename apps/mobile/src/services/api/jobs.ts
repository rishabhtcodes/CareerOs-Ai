import { apiClient } from "./client";

export interface Application {
  id: string;
  company: string;
  role: string;
  sourceUrl: string | null;
  status: "SAVED" | "APPLIED" | "SCREENING" | "INTERVIEW" | "OFFER" | "REJECTED";
  matchScore: number | null;
  notes: string | null;
  appliedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface JobAnalysisResult {
  id: string;
  matchScore: number;
  extractedSkills: string[];
  missingSkills: string[];
  suggestions: string[];
  description: string;
  sourceUrl: string | null;
  createdAt: string;
}

export async function fetchApplications(): Promise<Application[]> {
  const { data } = await apiClient.get<Application[]>("/jobs");
  return data;
}

export async function analyzeJob(input: {
  description?: string;
  sourceUrl?: string;
}): Promise<JobAnalysisResult> {
  const { data } = await apiClient.post<JobAnalysisResult>("/jobs/analyze", input);
  return data;
}
