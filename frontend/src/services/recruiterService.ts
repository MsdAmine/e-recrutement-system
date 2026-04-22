import apiClient from "@/lib/apiClient";
import { RecruiterProfile, RecruiterDashboard } from "@/types";

export interface UpdateRecruiterProfilePayload {
  companyName?: string;
  companyWebsite?: string;
  companySector?: string;
  companyDescription?: string;
}

export const recruiterService = {
  getProfile: async (): Promise<RecruiterProfile> => {
    const { data } = await apiClient.get<RecruiterProfile>("/recruiter/profile");
    return data;
  },

  updateProfile: async (
    payload: UpdateRecruiterProfilePayload
  ): Promise<RecruiterProfile> => {
    const { data } = await apiClient.put<RecruiterProfile>(
      "/recruiter/profile",
      payload
    );
    return data;
  },

  getDashboard: async (): Promise<RecruiterDashboard> => {
    const { data } = await apiClient.get<RecruiterDashboard>(
      "/recruiter/profile/dashboard"
    );
    return data;
  },
};
