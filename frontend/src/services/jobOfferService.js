import api from './api';

const jobOfferService = {
  getAll: async () => {
    const response = await api.get('/job-offers');
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/job-offers/${id}`);
    return response.data;
  },
  
  getMyOffers: async () => {
    const response = await api.get('/job-offers/me');
    return response.data;
  },
  
  create: async (data) => {
    const response = await api.post('/job-offers', data);
    return response.data;
  },
  
  update: async (id, data) => {
    const response = await api.put(`/job-offers/${id}`, data);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/job-offers/${id}`);
    return response.data;
  }
};

export default jobOfferService;
