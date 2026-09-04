import axios from 'axios';
import { ACCESS_TOKEN } from './constants';

// Clean up any double slashes or undefined values
const API_URL = import.meta.env.VITE_API_URL || 'https://wickmagic.onrender.com';

const api = axios.create({
  baseURL: API_URL.replace(/\/$/, ''), // Removes trailing slash if present
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
