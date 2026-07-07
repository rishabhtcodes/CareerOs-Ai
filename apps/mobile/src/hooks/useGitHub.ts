import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { connectGitHub, disconnectGitHub, fetchGitHubProfile } from "@/services/api/github";

export function useGitHub() {
  return useQuery({
    queryKey: ["github"],
    queryFn: fetchGitHubProfile,
  });
}

export function useConnectGitHub() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: connectGitHub,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["github"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
    },
  });
}

export function useDisconnectGitHub() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: disconnectGitHub,
    onSuccess: () => {
      queryClient.setQueryData(["github"], null);
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
    },
  });
}
