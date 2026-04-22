import apiClient from "@/lib/apiClient";
import { CandidateProfile, CandidateDashboard } from "@/types";

export interface UpdateCandidateProfilePayload {
  phone?: string;
  address?: string;
  headline?: string;
  summary?: string;
  cvUrl?: string;
}

export const candidateService = {
  getProfile: async (): Promise<CandidateProfile> => {
    const { data } = await apiClient.get<CandidateProfile>("/candidate/profile");
    return data;
  },

  updateProfile: async (
    payload: UpdateCandidateProfilePayload
  ): Promise<CandidateProfile> => {
    const { data } = await apiClient.put<CandidateProfile>(
      "/candidate/profile",
      payload
    );
    return data;
  },

  getDashboard: async (): Promise<CandidateDashboard> => {
    const { data } = await apiClient.get<CandidateDashboard>(
      "/candidate/profile/dashboard"
    );
    return data;
  },
};
