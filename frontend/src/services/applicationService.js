import api from './api';

const applicationService = {
  apply: async (jobOfferId, coverLetter) => {
    const response = await api.post(`/applications/job-offers/${jobOfferId}`, { coverLetter });
    return response.data;
  },
  
  getMyApplications: async () => {
    const response = await api.get('/applications/me');
    return response.data;
  },
  
  getApplicationById: async (id) => {
    const response = await api.get(`/applications/me/${id}`);
    return response.data;
  },
  
  getRecruiterApplications: async () => {
    const response = await api.get('/applications/recruiter');
    return response.data;
  },
  
  getApplicationsByOffer: async (jobOfferId) => {
    const response = await api.get(`/applications/recruiter/job-offers/${jobOfferId}`);
    return response.data;
  },
  
  updateStatus: async (applicationId, status) => {
    const response = await api.patch(`/applications/${applicationId}/status`, { status });
    return response.data;
  }
};

export default applicationService;
