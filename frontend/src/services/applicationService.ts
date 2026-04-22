import apiClient from "@/lib/apiClient";
import { Application, ApplicationStatus, Page } from "@/types";

export interface ApplyPayload {
  coverLetter: string;
}

export interface UpdateStatusPayload {
  status: ApplicationStatus;
}

export const applicationService = {
  apply: async (
    jobOfferId: number,
    payload: ApplyPayload
  ): Promise<Application> => {
    const { data } = await apiClient.post<Application>(
      `/applications/job-offers/${jobOfferId}`,
      payload
    );
    return data;
  },

  getMyApplications: async (
    page = 0,
    size = 10
  ): Promise<Page<Application>> => {
    const { data } = await apiClient.get<Page<Application>>(
      `/applications/me?page=${page}&size=${size}`
    );
    return data;
  },

  getMyApplicationById: async (id: number): Promise<Application> => {
    const { data } = await apiClient.get<Application>(
      `/applications/me/${id}`
    );
    return data;
  },

  getRecruiterApplications: async (
    page = 0,
    size = 10,
    status?: ApplicationStatus
  ): Promise<Page<Application>> => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });
    if (status) params.set("status", status);
    const { data } = await apiClient.get<Page<Application>>(
      `/applications/recruiter?${params.toString()}`
    );
    return data;
  },

  getJobOfferApplications: async (
    jobOfferId: number,
    page = 0,
    size = 10
  ): Promise<Page<Application>> => {
    const { data } = await apiClient.get<Page<Application>>(
      `/applications/recruiter/job-offers/${jobOfferId}?page=${page}&size=${size}`
    );
    return data;
  },

  updateStatus: async (
    applicationId: number,
    payload: UpdateStatusPayload
  ): Promise<Application> => {
    const { data } = await apiClient.patch<Application>(
      `/applications/${applicationId}/status`,
      payload
    );
    return data;
  },
};
