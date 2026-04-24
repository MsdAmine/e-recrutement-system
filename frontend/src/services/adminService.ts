import apiClient from "../lib/apiClient";
import { User, JobOffer, PlatformStats } from "../types";

const adminService = {
  getStats: async (): Promise<PlatformStats> => {
    const response = await apiClient.get("/admin/stats");
    return response.data;
  },

  getAllUsers: async (): Promise<User[]> => {
    const response = await apiClient.get("/admin/users");
    return response.data;
  },

  toggleUserStatus: async (userId: number): Promise<User> => {
    const response = await apiClient.patch(`/admin/users/${userId}/toggle-status`);
    return response.data;
  },

  getAllJobs: async (): Promise<JobOffer[]> => {
    const response = await apiClient.get("/admin/jobs");
    return response.data;
  },

  deleteJob: async (jobId: number): Promise<void> => {
    await apiClient.delete(`/admin/jobs/${jobId}`);
  },
};

export default adminService;
