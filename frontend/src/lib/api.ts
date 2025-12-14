import axios from 'axios';

// Single source of truth for backend URL
const API_BASE_URL = 'http://localhost:5000/api';
// const API_BASE_URL = 'https://api.ezmasalaa.com/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor to add token from localStorage
axiosInstance.interceptors.request.use(
  (config) => {
    // Try to get token from localStorage (persisted Redux state)
    const persistedState = localStorage.getItem('persist:root');
    if (persistedState) {
      try {
        const parsed = JSON.parse(persistedState);
        const authState = parsed.auth ? JSON.parse(parsed.auth) : null;
        const token = authState?.userToken || authState?.adminToken;

        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        // Ignore parsing errors
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.error || error.response?.data?.message || error.message || 'Request failed';
    return Promise.reject(new Error(message));
  }
);

export const api = {
  get: <T = any>(endpoint: string) => axiosInstance.get<any, T>(endpoint),
  post: <T = any>(endpoint: string, data?: any) => axiosInstance.post<any, T>(endpoint, data),
  put: <T = any>(endpoint: string, data?: any) => axiosInstance.put<any, T>(endpoint, data),
  patch: <T = any>(endpoint: string, data?: any) => axiosInstance.patch<any, T>(endpoint, data),
  delete: <T = any>(endpoint: string) => axiosInstance.delete<any, T>(endpoint),
  upload: <T = any>(endpoint: string, formData: FormData) =>
    axiosInstance.post<any, T>(endpoint, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

export default api;
