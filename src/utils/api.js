import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const registerUser = (data) => api.post("/auth/register", data).then((r) => r.data);
export const loginUser = (data) => api.post("/auth/login", data).then((r) => r.data);
export const getProfile = () => api.get("/auth/profile").then((r) => r.data);

// Emails
export const sendBulkEmail = (data) => api.post("/emails", data).then((r) => r.data);
export const getEmailHistory = () => api.get("/emails").then((r) => r.data);
export const getEmailById = (id) => api.get(`/emails/${id}`).then((r) => r.data);
export const deleteEmail = (id) => api.delete(`/emails/${id}`).then((r) => r.data);

export default api;
