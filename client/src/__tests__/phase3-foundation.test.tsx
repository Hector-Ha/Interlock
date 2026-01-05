import { describe, it, expect, afterEach, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SignUpForm } from "@/components/forms/SignUpForm";
import { useAuthStore } from "@/stores";
import { authService } from "@/services/auth.service";
import React from "react";

// Simplified test suite focusing on Logic/State to avoid resilient JSDOM/React setup issues in this environment
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

vi.mock("@/services/auth.service", () => ({
  authService: {
    signUp: vi
      .fn()
      .mockResolvedValue({ user: { id: "1", email: "test@example.com" } }),
    getMe: vi.fn(),
    signIn: vi.fn(),
    signOut: vi.fn(),
  },
}));

describe("Phase 3: Frontend Foundation", () => {
  afterEach(() => {
    cleanup();
    useAuthStore.setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      isInitialized: false,
    });
    window.sessionStorage.clear();
    vi.clearAllMocks();
  });

  describe("UI Components", () => {
    it("SignUpForm - should render step 1 initially", () => {
      render(<SignUpForm />);

      expect(screen.getByText("Account")).toBeInTheDocument();
      expect(screen.getByLabelText("Email")).toBeInTheDocument();
      expect(screen.getByLabelText("Password")).toBeInTheDocument();

      // Should not see step 2 fields
      expect(screen.queryByLabelText("First Name")).not.toBeInTheDocument();
    });

    it("SignUpForm - should navigate through all steps and submit", async () => {
      const user = userEvent.setup();
      render(<SignUpForm />);

      // Account
      const emailInput = screen.getByLabelText("Email");
      const passwordInput = screen.getByLabelText("Password");

      await user.type(emailInput, "newuser@example.com");
      await user.type(passwordInput, "Password123!");

      const nextButton = screen.getByRole("button", { name: /Next/i });
      await user.click(nextButton);

      // Personal
      expect(await screen.findByText("Personal")).toBeInTheDocument();
      // Increase timeout for animation
      const firstNameInput = await screen.findByLabelText(
        "First Name",
        {},
        { timeout: 3000 }
      );
      await user.type(firstNameInput, "John");
      await user.type(screen.getByLabelText("Last Name"), "Doe");
      await user.type(screen.getByLabelText("Date of Birth"), "1995-05-20");
      await user.click(screen.getByRole("button", { name: /Next/i }));

      // Address
      expect(await screen.findByText("Address")).toBeInTheDocument();
      // Increase timeout for animation
      const addressInput = await screen.findByLabelText(
        "Address",
        {},
        { timeout: 3000 }
      );
      await user.type(addressInput, "123 Main St");

      // Select inputs might need userEvent.selectOptions or just typing if it's a text input
      await user.type(screen.getByLabelText("City"), "New York");
      await user.type(screen.getByLabelText("State"), "NY");
      await user.type(screen.getByLabelText("Postal Code"), "10001");
      await user.click(screen.getByRole("button", { name: /Next/i }));

      // Identity
      expect(await screen.findByText("Identity")).toBeInTheDocument();
      // Increase timeout for animation
      const ssnInput = await screen.findByLabelText(
        /SSN/i,
        {},
        { timeout: 3000 }
      );
      await user.type(ssnInput, "1234");

      const submitButton = screen.getByRole("button", { name: /Sign Up/i });
      await user.click(submitButton);

      // Verify submission
      await waitFor(() => {
        expect(authService.signUp).toHaveBeenCalled();
      });
    });
  });

  describe("State Management (Zustand)", () => {
    it("Auth Store - should have initial state", () => {
      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });

    it("Auth Store - should update user", async () => {
      const mockUser = {
        id: "1",
        email: "test@example.com",
        firstName: "Test",
        lastName: "User",
        createdAt: new Date(),
        updatedAt: new Date(),
        failedLoginAttempts: 0,
        auditLogs: [],
        passwordHash: "",
        address: "",
        identityDocumentId: "",
        dateOfBirth: "",
        country: "US",
      };

      useAuthStore.getState().setUser(mockUser);

      const state = useAuthStore.getState();
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthenticated).toBe(true);

      await useAuthStore.getState().signOut();
      expect(useAuthStore.getState().isAuthenticated).toBe(false);
    });
  });
});
