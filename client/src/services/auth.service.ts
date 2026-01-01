import apiClient from "./api-client";
import { SignInParams, SignUpParams } from "@/types/auth";
import { User } from "@/types/index";

export const authService = {
  async signIn(user: SignInParams) {
    const response = await apiClient.post("/auth/sign-in", user);
    if (response.data.token) {
      if (typeof window !== "undefined") {
        localStorage.setItem("token", response.data.token);
      }
    }
    return response.data;
  },

  async signUp(userData: SignUpParams) {
    const response = await apiClient.post("/auth/sign-up", userData);
    if (response.data.token) {
      if (typeof window !== "undefined") {
        localStorage.setItem("token", response.data.token);
      }
    }
    return response.data;
  },

  async logout() {
    await apiClient.post("/auth/logout");
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
  },

  async getLoggedInUser() {
    const response = await apiClient.get<User>("/users/get-logged-in-user");
    return response.data;
  },
};
