import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SignUpForm } from "@/components/forms/SignUpForm";
import { SignInForm } from "@/components/forms/SignInForm";
import { ProfileSettings } from "@/components/features/settings/ProfileSettings";
import { authService } from "@/services/auth.service";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    back: vi.fn(),
    replace: vi.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => ({ get: vi.fn() }),
  useParams: () => ({}),
}));

// Mock framer-motion to avoid animation issues in tests
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, className }: any) => (
      <div className={className}>{children}</div>
    ),
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock stores
vi.mock("@/stores/auth.store", () => ({
  useAuthStore: vi.fn(() => ({
    user: {
      id: "1",
      email: "test@test.com",
      firstName: "Test",
      lastName: "User",
    },
    setUser: vi.fn(),
  })),
}));

// Mock ui store
vi.mock("@/stores/ui.store", () => ({
  useToast: () => ({
    success: vi.fn(),
    error: vi.fn(),
  }),
}));

// Mock services
vi.mock("@/services/auth.service", () => ({
  authService: {
    signIn: vi.fn(),
    signUp: vi.fn(),
    updateProfile: vi.fn(),
  },
}));

describe("Phase 4: Frontend Features", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("SignUpForm", () => {
    it("should render first step correctly", () => {
      render(<SignUpForm />);
      // Step 1: Account (Email/Password)
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^password/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /next/i })).toBeInTheDocument();
    });

    it("should validate password match on step 1", async () => {
      const user = userEvent.setup();
      render(<SignUpForm />);

      await user.type(screen.getByLabelText(/email/i), "test@example.com");
      await user.type(screen.getByLabelText(/^password/i), "Password123!");
      await user.type(
        screen.getByLabelText(/confirm password/i),
        "PasswordMismatch"
      );

      await user.click(screen.getByRole("button", { name: /next/i }));

      await waitFor(() => {
        expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
      });
    });

    it("should advance to step 2 with valid data", async () => {
      const user = userEvent.setup();
      render(<SignUpForm />);

      // Fill Step 1
      await user.type(screen.getByLabelText(/email/i), "test@example.com");
      await user.type(screen.getByLabelText(/^password/i), "Password123!");
      await user.type(
        screen.getByLabelText(/confirm password/i),
        "Password123!"
      );

      await user.click(screen.getByRole("button", { name: /next/i }));

      await waitFor(() => {
        // Step 2: Personal (First/Last Name)
        expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
      });
    });
  });

  describe("SignInForm", () => {
    it("should render correctly", () => {
      render(<SignInForm />);
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    });

    it("should show validation errors on empty submit", async () => {
      const user = userEvent.setup();
      render(<SignInForm />);

      await user.click(screen.getByRole("button", { name: /sign in/i }));

      await waitFor(() => {
        expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
        expect(screen.getByText(/password is required/i)).toBeInTheDocument();
      });
    });
  });

  describe("ProfileSettings", () => {
    it("should render current user data", () => {
      render(<ProfileSettings />);
      expect(screen.getByDisplayValue("Test")).toBeInTheDocument(); // firstName
      expect(screen.getByDisplayValue("User")).toBeInTheDocument(); // lastName
      expect(screen.getByDisplayValue("test@test.com")).toBeInTheDocument(); // email
    });

    it("should call updateProfile on form submission", async () => {
      // Mock successful update
      (authService.updateProfile as any).mockResolvedValue({
        user: {
          id: "1",
          email: "test@test.com",
          firstName: "Updated",
          lastName: "User",
        },
      });

      const user = userEvent.setup();
      render(<ProfileSettings />);

      const firstNameInput = screen.getByLabelText(/first name/i);
      await user.clear(firstNameInput);
      await user.type(firstNameInput, "Updated");

      await user.click(screen.getByRole("button", { name: /save changes/i }));

      await waitFor(() => {
        expect(authService.updateProfile).toHaveBeenCalledWith(
          expect.objectContaining({
            firstName: "Updated",
            lastName: "User",
          })
        );
      });
    });
  });
});
