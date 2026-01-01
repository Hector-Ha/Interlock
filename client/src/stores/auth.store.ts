import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { authService } from "@/services/auth.service";
import { User, SignInParams, SignUpParams } from "@/types/index";

interface AuthState {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;

  // Actions
  initialize: () => Promise<void>;
  signIn: (params: SignInParams) => Promise<void>;
  signUp: (params: SignUpParams) => Promise<void>;
  signOut: () => Promise<void>;
  setUser: (user: User | null) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: true,
      isInitialized: false,
      error: null,

      // Initialize auth state on app load
      initialize: async () => {
        if (get().isInitialized) return;

        try {
          set({ isLoading: true, error: null });
          // Check for token first to avoid unnecessary requests
          const token =
            typeof window !== "undefined"
              ? localStorage.getItem("token")
              : null;

          if (token) {
            const user = await authService.getLoggedInUser();
            set({
              user,
              isAuthenticated: true,
              isLoading: false,
              isInitialized: true,
            });
          } else {
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              isInitialized: true,
            });
          }
        } catch {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            isInitialized: true,
          });
        }
      },

      // Sign in
      signIn: async (params: SignInParams) => {
        try {
          set({ isLoading: true, error: null });
          const response = await authService.signIn(params);
          // Assuming response.user exists contains user object or we fetch it after
          const user = await authService.getLoggedInUser();

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (err) {
          const message = err instanceof Error ? err.message : "Sign in failed";
          set({ isLoading: false, error: message });
          throw err;
        }
      },

      // Sign up
      signUp: async (params: SignUpParams) => {
        try {
          set({ isLoading: true, error: null });
          await authService.signUp(params);
          const user = await authService.getLoggedInUser();

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (err) {
          const message = err instanceof Error ? err.message : "Sign up failed";
          set({ isLoading: false, error: message });
          throw err;
        }
      },

      // Sign out
      signOut: async () => {
        try {
          await authService.logout();
        } catch {
          // Ignore errors
        } finally {
          set({
            user: null,
            isAuthenticated: false,
            error: null,
          });
        }
      },

      setUser: (user) => {
        set({
          user,
          isAuthenticated: !!user,
        });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
