import axios from "axios";
import { useAuthStore } from "../store";

export const apiClient = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ?? "https://api-kanban-rust.vercel.app",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 15_000,
});

apiClient.interceptors.request.use((config) => {
  const accessToken = useAuthStore.getState().getAccessToken();

  if (accessToken) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${accessToken}`,
    } as typeof config.headers;
  }

  return config;
});
