import axios from "axios";
import { ACCESS_TOKEN } from "./constants";

// Hardcode the live Render backend URL directly
const api = axios.create({
  baseURL: "https://wickmagic.onrender.com",
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