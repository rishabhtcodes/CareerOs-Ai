import { apiClient } from "./client";

export interface GeneratedResume {
  id: string;
  title: string;
  type: string;
  atsScore: number;
  pdfUrl: string | null;
  docxUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export type ResumeType = "frontend" | "fullstack" | "python" | "ai" | "custom";

export async function fetchResumes(): Promise<GeneratedResume[]> {
  const { data } = await apiClient.get<GeneratedResume[]>("/resume");
  return data;
}

export async function generateResume(input: {
  type: ResumeType;
  targetJobDescription?: string;
}): Promise<GeneratedResume> {
  const { data } = await apiClient.post<GeneratedResume>("/resume/generate", input);
  return data;
}
