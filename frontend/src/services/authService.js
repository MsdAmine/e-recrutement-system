import api from './api';

export const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  
  registerCandidate: async (data) => {
    const response = await api.post('/auth/register/candidate', data);
    return response.data;
  },
  
  registerRecruiter: async (data) => {
    const response = await api.post('/auth/register/recruiter', data);
    return response.data;
  },
  
  getCurrentUser: async () => {
    const response = await api.get('/users/me');
    return response.data;
  }
};

export default authService;
