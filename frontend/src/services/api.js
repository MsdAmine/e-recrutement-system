import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle 403 Forbidden (Unauthorized in our context)
      if (error.response.status === 403) {
        // Only clear if we are not on login page
        if (!window.location.pathname.includes('/login')) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          // Redirect or trigger state change if needed
          // window.location.href = '/login'; 
        }
      }
      
      const message = error.response.data?.detail || error.response.data?.message || 'An unexpected error occurred';
      return Promise.reject({ ...error, message });
    }
    return Promise.reject(error);
  }
);

export default api;
