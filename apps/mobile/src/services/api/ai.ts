import { apiClient } from "@/services/api/client";

export async function askCareerCoach(message: string) {
  const { data } = await apiClient.post<{ response: string }>("/ai/coach", { message });
  return data;
}
