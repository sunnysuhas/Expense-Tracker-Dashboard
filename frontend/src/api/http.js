import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:5050/api",
  withCredentials: true,
  timeout: 12000
});

api.interceptors.request.use((config) => {
  const stored = localStorage.getItem("finora_auth");
  if (stored) {
    const { token } = JSON.parse(stored);
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getErrorMessage = (error) =>
  error?.code === "ECONNABORTED"
    ? "The server took too long to respond. Check that the backend is running."
    : error?.code === "ERR_NETWORK"
      ? "Cannot reach the API. Start the backend server and check VITE_API_URL."
      : error?.response?.data?.message ||
        error?.response?.data?.errors?.[0]?.message ||
        error?.message ||
        "Something went wrong";
