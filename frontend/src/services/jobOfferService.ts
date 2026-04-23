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

const FALLBACK_PAGE_SIZE = 50;
const MAX_FALLBACK_PAGES = 20;

async function findOfferInPagedResult(
  fetchPage: (page: number, size: number) => Promise<Page<JobOffer>>,
  id: number
): Promise<JobOffer | null> {
  let page = 0;
  let totalPages = 1;

  while (page < totalPages && page < MAX_FALLBACK_PAGES) {
    const result = await fetchPage(page, FALLBACK_PAGE_SIZE);
    const match = result.content.find((offer) => offer.id === id);
    if (match) return match;
    totalPages = result.totalPages;
    page += 1;
  }

  return null;
}

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

  getPublicOfferById: async (id: number): Promise<JobOffer> => {
    try {
      return await jobOfferService.getOfferById(id);
    } catch (error) {
      const fallback = await findOfferInPagedResult(
        jobOfferService.getPublicOffers,
        id
      );
      if (fallback) return fallback;
      throw error;
    }
  },

  getMyOffers: async (page = 0, size = 10): Promise<Page<JobOffer>> => {
    const { data } = await apiClient.get<Page<JobOffer>>(
      `/job-offers/me?page=${page}&size=${size}`
    );
    return data;
  },

  getMyOfferById: async (id: number): Promise<JobOffer> => {
    try {
      return await jobOfferService.getOfferById(id);
    } catch (error) {
      const fallback = await findOfferInPagedResult(jobOfferService.getMyOffers, id);
      if (fallback) return fallback;
      throw error;
    }
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
