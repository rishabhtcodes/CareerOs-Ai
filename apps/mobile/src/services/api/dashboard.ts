import { apiClient } from "./client";

export interface DashboardSummary {
  profileStrength: number;
  skills: number;
  projects: number;
  applications: number;
  recentResumes: { id: string; title: string; atsScore: number; updatedAt: string }[];
  aiSuggestions: string[];
}

export async function fetchDashboardSummary(): Promise<DashboardSummary> {
  const { data } = await apiClient.get<DashboardSummary>("/dashboard");
  return data;
}
