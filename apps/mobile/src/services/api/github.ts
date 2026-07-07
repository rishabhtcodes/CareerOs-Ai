import { apiClient } from "./client";

export interface GitHubProfile {
  id: string;
  username: string;
  avatarUrl: string;
  repoCount: number;
  totalStars: number;
  totalCommits: number;
  topLanguages: { name: string; percentage: number; color: string }[];
  syncedAt: string;
}

export async function fetchGitHubProfile(): Promise<GitHubProfile | null> {
  const { data } = await apiClient.get<GitHubProfile | null>("/github");
  return data;
}

export async function connectGitHub(username: string): Promise<GitHubProfile> {
  const { data } = await apiClient.post<GitHubProfile>("/github/connect", { username });
  return data;
}

export async function disconnectGitHub(): Promise<void> {
  await apiClient.delete("/github/disconnect");
}
