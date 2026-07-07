import { apiClient } from "./client";

export interface CoachMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export async function sendCoachMessage(message: string): Promise<{ response: string }> {
  const { data } = await apiClient.post<{ response: string }>("/ai/coach", { message });
  return data;
}
