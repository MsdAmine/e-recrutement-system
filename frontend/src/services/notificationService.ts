import apiClient from "@/lib/apiClient";
import { Notification, Page } from "@/types";

export const notificationService = {
  getAll: async (page = 0, size = 10): Promise<Page<Notification>> => {
    const { data } = await apiClient.get<Page<Notification>>(
      `/notifications?page=${page}&size=${size}`
    );
    return data;
  },

  getUnread: async (page = 0, size = 10): Promise<Page<Notification>> => {
    const { data } = await apiClient.get<Page<Notification>>(
      `/notifications/unread?page=${page}&size=${size}`
    );
    return data;
  },

  markAsRead: async (notificationId: number): Promise<Notification> => {
    const { data } = await apiClient.patch<Notification>(
      `/notifications/${notificationId}/read`
    );
    return data;
  },

  markAllAsRead: async (): Promise<void> => {
    await apiClient.patch("/notifications/read-all");
  },
};
