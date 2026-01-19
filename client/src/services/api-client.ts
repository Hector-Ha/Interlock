import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosResponse,
} from "axios";
import { API_URL } from "@/lib/constants";
import { useAuthStore } from "@/stores/auth.store";

export interface ApiError {
  message: string;
  code: string;
  errors?: Record<string, string[]>;
}

// Flag to track if a refresh is currently in progress
let isRefreshing = false;
// Queue to hold requests while refreshing
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}> = [];

// Helper to process the queue
const processQueue = (error: AxiosError | null, token: any = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

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
    (error) => Promise.reject(error),
  );

  // Response interceptor
  client.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError<ApiError>) => {
      const originalRequest = error.config as any;

      // Skip refresh logic for auth endpoints to prevent infinite loops
      const isAuthEndpoint = originalRequest?.url?.startsWith("/auth/");

      if (
        error.response?.status === 401 &&
        originalRequest &&
        !isAuthEndpoint
      ) {
        if (originalRequest._retry) {
          return Promise.reject(error);
        }

        if (isRefreshing) {
          return new Promise(function (resolve, reject) {
            failedQueue.push({ resolve, reject });
          })
            .then(() => {
              return client.request(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          await client.post("/auth/refresh");
          processQueue(null);
          return client.request(originalRequest);
        } catch (refreshError: any) {
          processQueue(refreshError, null);
          // Clear local state only - don't call signOut API to prevent loops
          useAuthStore.setState({
            user: null,
            isAuthenticated: false,
            error: null,
          });

          if (typeof window !== "undefined") {
            window.location.href = "/sign-in";
          }
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
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
    },
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
    config?: Parameters<typeof apiClient.post>[2],
  ) => apiClient.post<T>(url, data, config).then((res) => res.data),

  patch: <T>(
    url: string,
    data?: unknown,
    config?: Parameters<typeof apiClient.patch>[2],
  ) => apiClient.patch<T>(url, data, config).then((res) => res.data),

  put: <T>(
    url: string,
    data?: unknown,
    config?: Parameters<typeof apiClient.put>[2],
  ) => apiClient.put<T>(url, data, config).then((res) => res.data),

  delete: <T>(url: string, config?: Parameters<typeof apiClient.delete>[1]) =>
    apiClient.delete<T>(url, config).then((res) => res.data),
};

export default apiClient;
