import { api } from "./api-client";
import type { User, SignInParams, SignUpParams } from "@/types";

export interface AuthResponse {
  user: User;
  refreshToken?: string;
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface ResetPasswordData {
  token: string;
  newPassword: string;
}

export const authService = {
  signUp: async (data: SignUpParams): Promise<AuthResponse> => {
    return api.post<AuthResponse>("/auth/sign-up", data);
  },

  signIn: async (data: SignInParams): Promise<AuthResponse> => {
    return api.post<AuthResponse>("/auth/sign-in", data);
  },

  signOut: async (): Promise<void> => {
    await api.post("/auth/sign-out");
  },

  getMe: async (): Promise<AuthResponse> => {
    return api.get<AuthResponse>("/auth/me");
  },

  updateProfile: async (data: UpdateProfileData): Promise<{ user: User }> => {
    return api.patch<{ user: User }>("/auth/profile", data);
  },

  changePassword: async (
    data: ChangePasswordData
  ): Promise<{ message: string }> => {
    return api.post<{ message: string }>("/auth/change-password", data);
  },

  logoutAll: async (): Promise<{
    message: string;
    sessionsInvalidated: number;
  }> => {
    return api.post("/auth/logout-all");
  },

  forgotPassword: async (email: string): Promise<{ message: string }> => {
    return api.post<{ message: string }>("/auth/forgot-password", { email });
  },

  resetPassword: async (
    data: ResetPasswordData
  ): Promise<{ message: string }> => {
    return api.post<{ message: string }>("/auth/reset-password", data);
  },

  sendVerification: async (): Promise<{ message: string }> => {
    return api.post<{ message: string }>("/auth/send-verification");
  },
};
