import { useQuery } from "@tanstack/react-query";
import { fetchDashboardSummary } from "@/services/api/dashboard";

export function useDashboardSummary() {
  return useQuery({
    queryKey: ["dashboard-summary"],
    queryFn: fetchDashboardSummary
  });
}
