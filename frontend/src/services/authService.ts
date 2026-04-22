import apiClient from "@/lib/apiClient";
import { AuthResponse, CurrentUser } from "@/types";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterCandidatePayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface RegisterRecruiterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  companyName: string;
}

export const authService = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>(
      "/auth/login",
      payload
    );
    return data;
  },

  registerCandidate: async (
    payload: RegisterCandidatePayload
  ): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>(
      "/auth/register/candidate",
      payload
    );
    return data;
  },

  registerRecruiter: async (
    payload: RegisterRecruiterPayload
  ): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>(
      "/auth/register/recruiter",
      payload
    );
    return data;
  },

  getCurrentUser: async (): Promise<CurrentUser> => {
    const { data } = await apiClient.get<CurrentUser>("/users/me");
    return data;
  },
};
