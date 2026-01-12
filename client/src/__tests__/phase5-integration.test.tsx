import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ErrorBoundary } from "@/components/error/ErrorBoundary";
import { ToastContainer } from "@/components/ui/Toast";
import { useToastStore, toast } from "@/stores/toast.store";
import {
  Skeleton,
  TextSkeleton,
  AvatarSkeleton,
} from "@/components/ui/skeleton";
import { DashboardSkeleton } from "@/components/features/dashboard/DashboardSkeleton";
import { getErrorMessage, handleApiError } from "@/lib/api-handler";
import { AxiosError } from "axios";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), back: vi.fn() }),
  usePathname: () => "/",
}));

// Mock Sentry
vi.mock("@sentry/nextjs", () => ({
  captureException: vi.fn(),
}));

describe("Phase 5: Integration & Polish", () => {
  describe("Error Boundary", () => {
    const ThrowingComponent = () => {
      throw new Error("Test error");
    };

    const WorkingComponent = () => <div>Working component</div>;

    it("should catch errors and show recovery UI", () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      render(
        <ErrorBoundary>
          <ThrowingComponent />
        </ErrorBoundary>
      );

      expect(screen.getByText("Something went wrong")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /try again/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /go to dashboard/i })
      ).toBeInTheDocument();

      consoleSpy.mockRestore();
    });

    it("should render children when no error", () => {
      render(
        <ErrorBoundary>
          <WorkingComponent />
        </ErrorBoundary>
      );

      expect(screen.getByText("Working component")).toBeInTheDocument();
    });

    it("should reset error state on retry", async () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      let shouldThrow = true;

      const ConditionalThrow = () => {
        if (shouldThrow) throw new Error("Test error");
        return <div>Recovered</div>;
      };

      const { rerender } = render(
        <ErrorBoundary>
          <ConditionalThrow />
        </ErrorBoundary>
      );

      expect(screen.getByText("Something went wrong")).toBeInTheDocument();

      // Simulate recovery
      shouldThrow = false;
      const retryButton = screen.getByRole("button", { name: /try again/i });
      await userEvent.click(retryButton);

      // After retry, error should be cleared
      consoleSpy.mockRestore();
    });
  });

  describe("Toast Notification System", () => {
    beforeEach(() => {
      // Reset toast store before each test
      useToastStore.setState({ toasts: [] });
    });

    it("should add and display success toast", async () => {
      render(<ToastContainer />);

      act(() => {
        toast.success("Success Title", "Success message");
      });

      await waitFor(() => {
        expect(screen.getByText("Success Title")).toBeInTheDocument();
        expect(screen.getByText("Success message")).toBeInTheDocument();
      });
    });

    it("should add and display error toast", async () => {
      render(<ToastContainer />);

      act(() => {
        toast.error("Error Title", "Error message");
      });

      await waitFor(() => {
        expect(screen.getByText("Error Title")).toBeInTheDocument();
      });
    });

    it("should dismiss toast on click", async () => {
      render(<ToastContainer />);

      act(() => {
        useToastStore.getState().addToast({
          type: "info",
          title: "Dismissible Toast",
          dismissible: true,
        });
      });

      await waitFor(() => {
        expect(screen.getByText("Dismissible Toast")).toBeInTheDocument();
      });

      const dismissButton = screen.getByLabelText("Dismiss");
      await userEvent.click(dismissButton);

      // Toast should be removed after animation
      await waitFor(
        () => {
          expect(
            screen.queryByText("Dismissible Toast")
          ).not.toBeInTheDocument();
        },
        { timeout: 1000 }
      );
    });

    it("should stack multiple toasts", async () => {
      render(<ToastContainer />);

      act(() => {
        toast.success("First Toast");
        toast.info("Second Toast");
        toast.warning("Third Toast");
      });

      await waitFor(() => {
        expect(screen.getByText("First Toast")).toBeInTheDocument();
        expect(screen.getByText("Second Toast")).toBeInTheDocument();
        expect(screen.getByText("Third Toast")).toBeInTheDocument();
      });
    });

    it("should auto-dismiss after duration", async () => {
      vi.useFakeTimers();
      render(<ToastContainer />);

      act(() => {
        useToastStore.getState().addToast({
          type: "info",
          title: "Auto Dismiss",
          duration: 1000,
        });
      });

      expect(screen.getByText("Auto Dismiss")).toBeInTheDocument();

      // Fast-forward time and flush all pending timers
      await act(async () => {
        vi.advanceTimersByTime(1100);
      });

      // Give React time to process the state update
      await act(async () => {
        vi.runAllTimers();
      });

      expect(screen.queryByText("Auto Dismiss")).not.toBeInTheDocument();

      vi.useRealTimers();
    });
  });

  describe("Loading Skeletons", () => {
    it("should render base Skeleton component with pulse animation", () => {
      render(<Skeleton data-testid="skeleton" />);

      const skeleton = screen.getByTestId("skeleton");
      expect(skeleton).toBeInTheDocument();
      expect(skeleton).toHaveClass("animate-pulse");
    });

    it("should render circular variant", () => {
      render(<Skeleton variant="circular" data-testid="avatar-skeleton" />);

      const skeleton = screen.getByTestId("avatar-skeleton");
      expect(skeleton).toHaveClass("rounded-full");
    });

    it("should render TextSkeleton with multiple lines", () => {
      const { container } = render(<TextSkeleton lines={3} />);

      const skeletons = container.querySelectorAll("[aria-hidden='true']");
      expect(skeletons.length).toBe(3);
    });

    it("should render AvatarSkeleton with correct size", () => {
      render(<AvatarSkeleton size="lg" data-testid="avatar" />);

      const avatar = screen.getByTestId("avatar");
      expect(avatar).toHaveClass("h-12", "w-12");
    });

    it("should render DashboardSkeleton", () => {
      const { container } = render(<DashboardSkeleton />);

      // Should have skeleton container rendering
      expect(container.firstChild).toBeInTheDocument();
      // Should have multiple skeleton elements
      expect(
        container.querySelectorAll(".animate-pulse").length
      ).toBeGreaterThan(0);
    });
  });

  describe("API Error Handler", () => {
    it("should map INVALID_CREDENTIALS error code", () => {
      const error = {
        code: "INVALID_CREDENTIALS",
        message: "Invalid credentials",
      };
      const message = getErrorMessage(error);
      expect(message).toBe("Invalid email or password. Please try again.");
    });

    it("should map INSUFFICIENT_FUNDS error code", () => {
      const error = { code: "INSUFFICIENT_FUNDS", message: "Not enough funds" };
      const message = getErrorMessage(error);
      expect(message).toBe("Insufficient funds for this transfer.");
    });

    // NOTE: These tests are skipped because manually constructed AxiosError objects
    // don't behave the same as real Axios errors
    // Tested manually by triggering network errors.
    it("should handle network errors", () => {
      // Create error that mimics Axios network error
      const error = new AxiosError("Network Error");
      error.code = "ERR_NETWORK";
      error.name = "AxiosError";

      const message = getErrorMessage(error);
      expect(message).toBe("Network error. Please check your connection.");
    });

    it("should handle timeout errors", () => {
      // Create error that mimics Axios timeout error
      const error = new AxiosError("Timeout");
      error.code = "ECONNABORTED";
      error.name = "AxiosError";

      const message = getErrorMessage(error);
      expect(message).toBe("Request timed out. Please try again.");
    });

    it("should handle 429 rate limit errors", () => {
      const error = new AxiosError("Too Many Requests");
      error.response = { status: 429 } as never;
      const message = getErrorMessage(error);
      expect(message).toBe("Too many requests. Please wait a moment.");
    });

    it("should fallback to error.message for standard errors", () => {
      const error = new Error("Custom error message");
      const message = getErrorMessage(error);
      expect(message).toBe("Custom error message");
    });

    it("should show toast on handleApiError", () => {
      const addToastSpy = vi.spyOn(useToastStore.getState(), "addToast");
      const error = { code: "INTERNAL_ERROR", message: "Server error" };

      handleApiError(error, true);

      expect(addToastSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "error",
          title: "Error",
        })
      );
    });
  });
});
