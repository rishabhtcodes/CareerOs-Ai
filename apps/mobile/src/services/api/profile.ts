import { apiClient } from "./client";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  headline: string | null;
  location: string | null;
  bio: string | null;
  targetRole: string | null;
  skills: { id: string; name: string; level: number; category: string | null }[];
  education: {
    id: string;
    school: string;
    degree: string;
    field: string | null;
    startDate: string | null;
    endDate: string | null;
  }[];
  experience: {
    id: string;
    company: string;
    role: string;
    location: string | null;
    startDate: string | null;
    endDate: string | null;
    current: boolean;
    description: string | null;
    highlights: string[];
  }[];
  projects: {
    id: string;
    name: string;
    summary: string;
    url: string | null;
    repository: string | null;
    techStack: string[];
    impact: string | null;
  }[];
  socialLinks: { id: string; label: string; url: string }[];
}

export interface ProfileUpdateInput {
  headline?: string;
  location?: string;
  bio?: string;
  targetRole?: string;
  skills?: string[];
}

export async function fetchProfile(): Promise<UserProfile> {
  const { data } = await apiClient.get<UserProfile>("/profile");
  return data;
}

export async function updateProfile(input: ProfileUpdateInput): Promise<UserProfile> {
  const { data } = await apiClient.put<UserProfile>("/profile", {
    ...input,
    skills: input.skills ?? [],
  });
  return data;
}
