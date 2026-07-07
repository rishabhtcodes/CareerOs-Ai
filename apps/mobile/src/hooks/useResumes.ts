import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchResumes, generateResume, type ResumeType } from "@/services/api/resume";

export function useResumes() {
  return useQuery({
    queryKey: ["resumes"],
    queryFn: fetchResumes,
  });
}

export function useGenerateResume() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { type: ResumeType; targetJobDescription?: string }) =>
      generateResume(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
    },
  });
}
