import axios, { AxiosInstance } from "axios";
import { API_BASE_URL } from "@/lib/constants";

// Axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // TODO: Retrieve token from secure storage. For now, checks localStorage directly as a fallback
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle specific error codes
    if (error.response) {
      const { status } = error.response;

      switch (status) {
        case 401:
          // TODO: Implement logout logic via store
          if (typeof window !== "undefined") {
          }
          break;
        case 403:
          // Forbidden
          console.error("Access forbidden");
          break;
        case 500:
          // Server Error
          console.error("Server error");
          break;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
