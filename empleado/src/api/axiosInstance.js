import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/tasks/api/v1/',
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
