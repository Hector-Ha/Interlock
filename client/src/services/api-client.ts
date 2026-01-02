import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosResponse,
} from "axios";
import { API_URL } from "@/lib/constants";

export interface ApiError {
  message: string;
  code: string;
  errors?: Record<string, string[]>;
}

function createApiClient(): AxiosInstance {
  const client = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
    timeout: 30000,
  });

  // Request interceptor
  client.interceptors.request.use(
    (config) => {
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor
  client.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError<ApiError>) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && originalRequest) {
        try {
          await client.post("/auth/refresh");
          return client.request(originalRequest);
        } catch {
          if (typeof window !== "undefined") {
            window.location.href = "/sign-in";
          }
          return Promise.reject(error);
        }
      }

      // Extract error message
      const apiError: ApiError = {
        message:
          error.response?.data?.message || error.message || "An error occurred",
        code: error.response?.data?.code || "UNKNOWN_ERROR",
        errors: error.response?.data?.errors,
      };

      return Promise.reject(apiError);
    }
  );

  return client;
}

export const apiClient = createApiClient();

export const api = {
  get: <T>(url: string, config?: Parameters<typeof apiClient.get>[1]) =>
    apiClient.get<T>(url, config).then((res) => res.data),

  post: <T>(
    url: string,
    data?: unknown,
    config?: Parameters<typeof apiClient.post>[2]
  ) => apiClient.post<T>(url, data, config).then((res) => res.data),

  patch: <T>(
    url: string,
    data?: unknown,
    config?: Parameters<typeof apiClient.patch>[2]
  ) => apiClient.patch<T>(url, data, config).then((res) => res.data),

  put: <T>(
    url: string,
    data?: unknown,
    config?: Parameters<typeof apiClient.put>[2]
  ) => apiClient.put<T>(url, data, config).then((res) => res.data),

  delete: <T>(url: string, config?: Parameters<typeof apiClient.delete>[1]) =>
    apiClient.delete<T>(url, config).then((res) => res.data),
};

export default apiClient;
