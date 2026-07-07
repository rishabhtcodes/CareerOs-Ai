import { apiClient } from "@/services/api/client";

export interface DashboardSummary {
  profileStrength: number;
  skills: number;
  projects: number;
  applications: number;
  aiSuggestions: string[];
}

export async function fetchDashboardSummary() {
  const { data } = await apiClient.get<DashboardSummary>("/dashboard");
  return data;
}
