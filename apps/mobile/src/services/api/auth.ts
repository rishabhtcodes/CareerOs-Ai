import { apiClient, setAuthToken } from "@/services/api/client";

interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export async function login(email: string, password: string) {
  const { data } = await apiClient.post<AuthResponse>("/auth/login", { email, password });
  setAuthToken(data.token);
  return data;
}

export async function signup(name: string, email: string, password: string) {
  const { data } = await apiClient.post<AuthResponse>("/auth/signup", { name, email, password });
  setAuthToken(data.token);
  return data;
}
