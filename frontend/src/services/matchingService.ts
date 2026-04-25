import apiClient from "@/lib/apiClient";
import { MatchResult } from "@/types";

export const matchingService = {
  getCandidateMatches: async (): Promise<MatchResult[]> => {
    const { data } = await apiClient.get<MatchResult[]>("/matching/jobs");
    return data;
  },

  getCandidateMatchForJob: async (jobId: number): Promise<MatchResult> => {
    const { data } = await apiClient.get<MatchResult>(`/matching/jobs/${jobId}`);
    return data;
  },
};
