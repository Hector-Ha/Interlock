import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SkipLink } from "@/components/a11y/SkipLink";
import { LiveRegion } from "@/components/a11y/LiveRegion";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useRefresh } from "@/hooks/useRefresh";
import { renderHook, waitFor } from "@testing-library/react";

describe("Phase 5: Accessibility", () => {
  describe("Skip Link", () => {
    it("should render skip link with correct href", () => {
      render(<SkipLink />);

      const link = screen.getByRole("link", { name: /skip to main content/i });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", "#main-content");
    });

    it("should be visually hidden by default", () => {
      render(<SkipLink />);

      const link = screen.getByRole("link", { name: /skip to main content/i });
      expect(link).toHaveClass("sr-only");
    });

    it("should have focus-visible styles", () => {
      render(<SkipLink />);

      const link = screen.getByRole("link", { name: /skip to main content/i });
      // Check for focus:not-sr-only class which makes it visible when focused
      expect(link.className).toContain("focus:not-sr-only");
    });
  });

  describe("Live Region", () => {
    it("should announce messages to screen readers", () => {
      render(<LiveRegion message="New notification received" />);

      const region = screen.getByRole("status");
      expect(region).toBeInTheDocument();
      expect(region).toHaveTextContent("New notification received");
    });

    it("should have polite aria-live by default", () => {
      render(<LiveRegion message="Test message" />);

      const region = screen.getByRole("status");
      expect(region).toHaveAttribute("aria-live", "polite");
    });

    it("should support assertive politeness", () => {
      render(<LiveRegion message="Urgent message" politeness="assertive" />);

      const region = screen.getByRole("status");
      expect(region).toHaveAttribute("aria-live", "assertive");
    });

    it("should have aria-atomic for complete announcements", () => {
      render(<LiveRegion message="Complete message" />);

      const region = screen.getByRole("status");
      expect(region).toHaveAttribute("aria-atomic", "true");
    });

    it("should update message when prop changes", async () => {
      const { rerender } = render(<LiveRegion message="First message" />);

      expect(screen.getByRole("status")).toHaveTextContent("First message");

      rerender(<LiveRegion message="Second message" />);

      expect(screen.getByRole("status")).toHaveTextContent("Second message");
    });
  });

  describe("Focus Trap", () => {
    function FocusTrapTestComponent({ isActive }: { isActive: boolean }) {
      const { containerRef } = useFocusTrap(isActive);

      return (
        <div ref={containerRef} data-testid="trap-container">
          <button data-testid="first-btn">First Button</button>
          <input type="text" placeholder="Input field" data-testid="input" />
          <button data-testid="last-btn">Last Button</button>
        </div>
      );
    }

    it("should return a container ref", () => {
      render(<FocusTrapTestComponent isActive={false} />);

      // Container should be rendered
      const container = screen.getByTestId("trap-container");
      expect(container).toBeInTheDocument();
    });

    it("should render focusable elements", () => {
      render(<FocusTrapTestComponent isActive={true} />);

      // All focusable elements should be there
      expect(screen.getByTestId("first-btn")).toBeInTheDocument();
      expect(screen.getByTestId("input")).toBeInTheDocument();
      expect(screen.getByTestId("last-btn")).toBeInTheDocument();
    });

    it("should have accessible focus trap container", () => {
      render(<FocusTrapTestComponent isActive={true} />);

      // Container should contain all interactive elements
      const container = screen.getByTestId("trap-container");
      expect(container.querySelectorAll("button")).toHaveLength(2);
      expect(container.querySelectorAll("input")).toHaveLength(1);
    });
  });

  describe("Refresh Hook", () => {
    it("should show loading state during refresh", async () => {
      const mockRefreshFn = vi.fn().mockResolvedValue("refreshed");

      const { result } = renderHook(() =>
        useRefresh(mockRefreshFn, { minDuration: 0 })
      );

      expect(result.current.isRefreshing).toBe(false);

      let refreshPromise: Promise<unknown>;
      act(() => {
        refreshPromise = result.current.refresh();
      });

      // Should be refreshing
      expect(result.current.isRefreshing).toBe(true);

      await act(async () => {
        await refreshPromise;
      });

      // Should be done
      expect(result.current.isRefreshing).toBe(false);
    });

    it("should debounce rapid clicks", async () => {
      const mockRefreshFn = vi.fn().mockResolvedValue("refreshed");

      const { result } = renderHook(() =>
        useRefresh(mockRefreshFn, { minDuration: 0, debounceMs: 1000 })
      );

      // First call should work
      await act(async () => {
        await result.current.refresh();
      });

      // Immediate second call should be debounced
      await act(async () => {
        await result.current.refresh();
      });

      expect(mockRefreshFn).toHaveBeenCalledTimes(1);
    });

    it("should track last refresh time", async () => {
      const mockRefreshFn = vi.fn().mockResolvedValue("refreshed");

      const { result } = renderHook(() =>
        useRefresh(mockRefreshFn, { minDuration: 0 })
      );

      expect(result.current.lastRefresh).toBeNull();

      await act(async () => {
        await result.current.refresh();
      });

      expect(result.current.lastRefresh).toBeInstanceOf(Date);
    });
  });
});
