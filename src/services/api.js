import axios from "axios";

const API = axios.create({
  baseURL: "https://swafy-backend.onrender.com/api",
});

API.interceptors.request.use((config) => {
  // ❌ ما نبعثوش token مع auth
  if (!config.url.includes("/auth/")) {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default API;