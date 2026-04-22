import apiClient from "@/lib/apiClient";
import { JobOffer, Page } from "@/types";

export interface CreateJobOfferPayload {
  title: string;
  description: string;
  contractType: string;
  location: string;
  salary?: number | null;
  active: boolean;
}

export type UpdateJobOfferPayload = CreateJobOfferPayload;

export const jobOfferService = {
  getPublicOffers: async (
    page = 0,
    size = 9
  ): Promise<Page<JobOffer>> => {
    const { data } = await apiClient.get<Page<JobOffer>>(
      `/job-offers?page=${page}&size=${size}`
    );
    return data;
  },

  getOfferById: async (id: number): Promise<JobOffer> => {
    const { data } = await apiClient.get<JobOffer>(`/job-offers/${id}`);
    return data;
  },

  getMyOffers: async (page = 0, size = 10): Promise<Page<JobOffer>> => {
    const { data } = await apiClient.get<Page<JobOffer>>(
      `/job-offers/me?page=${page}&size=${size}`
    );
    return data;
  },

  createOffer: async (payload: CreateJobOfferPayload): Promise<JobOffer> => {
    const { data } = await apiClient.post<JobOffer>("/job-offers", payload);
    return data;
  },

  updateOffer: async (
    id: number,
    payload: UpdateJobOfferPayload
  ): Promise<JobOffer> => {
    const { data } = await apiClient.put<JobOffer>(`/job-offers/${id}`, payload);
    return data;
  },

  deleteOffer: async (id: number): Promise<void> => {
    await apiClient.delete(`/job-offers/${id}`);
  },
};
