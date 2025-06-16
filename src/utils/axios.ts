import axios from 'axios';

export const IMAGE_BASE_URL = 'https://easytrack.co.tz';

const axiosInstance = axios.create({
  baseURL: `${IMAGE_BASE_URL}/api`,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Unauthorized — possibly invalid or expired token');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
