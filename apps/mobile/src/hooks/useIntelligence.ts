import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchIntelligence, refreshIntelligence } from "@/services/api/intelligence";

export function useIntelligence() {
  return useQuery({
    queryKey: ["intelligence"],
    queryFn: fetchIntelligence,
    refetchInterval: 5 * 60 * 1000, // auto refetch in mobile UI every 5 mins
  });
}

export function useRefreshIntelligence() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: refreshIntelligence,
    onSuccess: () => {
      // Invalidate to pick up changes when server finishes background cycle
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["intelligence"] });
      }, 5000);
    },
  });
}
