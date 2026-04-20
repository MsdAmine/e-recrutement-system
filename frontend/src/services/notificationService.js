import api from './api';

const notificationService = {
  getAll: async () => {
    const response = await api.get('/notifications');
    return response.data;
  },
  
  getUnread: async () => {
    const response = await api.get('/notifications/unread');
    return response.data;
  },
  
  markAsRead: async (id) => {
    const response = await api.patch(`/notifications/${id}/read`);
    return response.data;
  },
  
  markAllAsRead: async () => {
    await api.patch('/notifications/read-all');
  }
};

export default notificationService;
