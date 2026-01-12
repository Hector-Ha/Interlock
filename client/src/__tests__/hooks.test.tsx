import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useTransferPolling } from "../hooks/useTransferPolling";
import { useNotificationPolling } from "../hooks/useNotificationPolling";
import { useRefresh } from "../hooks/useRefresh";
import { useFocusTrap } from "../hooks/useFocusTrap";
import { useKeyboardShortcuts } from "../hooks/useKeyboardShortcuts";
import { transferService } from "../services/transfer.service";
import { notificationService } from "../services/notification.service";
import { useNotificationStore } from "../stores/notification.store";
import { useToastStore } from "../stores/toast.store";

// Mock dependencies
vi.mock("../services/transfer.service", () => ({
  transferService: {
    getTransfer: vi.fn(),
  },
}));

vi.mock("../services/notification.service", () => ({
  notificationService: {
    getUnreadCount: vi.fn(),
    getNotifications: vi.fn(),
  },
}));

vi.mock("../stores/notification.store", () => ({
  useNotificationStore: Object.assign(vi.fn(), {
    setState: vi.fn(),
    getState: vi.fn(() => ({ unreadCount: 0 })),
  }),
}));

vi.mock("../stores/toast.store", () => ({
  useToastStore: vi.fn(() => ({ toasts: [] })),
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
  },
}));

describe("Phase 5 Hooks - Unit Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // useTransferPolling
  describe("useTransferPolling", () => {
    const mockGetTransfer = transferService.getTransfer as ReturnType<
      typeof vi.fn
    >;

    it("should not poll when there are no pending transfers", () => {
      const transfers = [
        { id: "1", status: "SUCCESS", amount: 100 },
        { id: "2", status: "FAILED", amount: 200 },
      ];

      renderHook(() => useTransferPolling(transfers, { enabled: true }));

      // Advance timers
      act(() => {
        vi.advanceTimersByTime(15000);
      });

      expect(mockGetTransfer).not.toHaveBeenCalled();
    });

    it("should poll for pending transfers", async () => {
      const transfers = [
        { id: "1", status: "PENDING", amount: 100 },
        { id: "2", status: "SUCCESS", amount: 200 },
      ];

      mockGetTransfer.mockResolvedValue({
        transfer: { id: "1", status: "PENDING" },
      });

      renderHook(() =>
        useTransferPolling(transfers, { enabled: true, interval: 5000 }),
      );

      // Advance timers to trigger polling
      await act(async () => {
        vi.advanceTimersByTime(5000);
      });

      expect(mockGetTransfer).toHaveBeenCalledWith("1");
      expect(mockGetTransfer).toHaveBeenCalledTimes(1);
    });

    it("should not poll when disabled", () => {
      const transfers = [{ id: "1", status: "PENDING", amount: 100 }];

      renderHook(() =>
        useTransferPolling(transfers, { enabled: false, interval: 5000 }),
      );

      act(() => {
        vi.advanceTimersByTime(10000);
      });

      expect(mockGetTransfer).not.toHaveBeenCalled();
    });

    it("should call onStatusChange when status changes", async () => {
      const onStatusChange = vi.fn();
      const transfers = [{ id: "1", status: "PENDING", amount: 100 }];

      mockGetTransfer
        .mockResolvedValueOnce({ transfer: { id: "1", status: "PENDING" } })
        .mockResolvedValueOnce({ transfer: { id: "1", status: "SUCCESS" } });

      renderHook(() =>
        useTransferPolling(transfers, {
          enabled: true,
          interval: 5000,
          onStatusChange,
        }),
      );

      // First poll, status stays PENDING
      await act(async () => {
        vi.advanceTimersByTime(5000);
      });

      // Second poll, status changes to SUCCESS
      await act(async () => {
        vi.advanceTimersByTime(5000);
      });

      expect(onStatusChange).toHaveBeenCalledWith("1", "SUCCESS");
    });

    it("should expose refresh function for manual refresh", async () => {
      const transfers = [{ id: "1", status: "PENDING", amount: 100 }];

      mockGetTransfer.mockResolvedValue({
        transfer: { id: "1", status: "PENDING" },
      });

      const { result } = renderHook(() =>
        useTransferPolling(transfers, { enabled: true, interval: 10000 }),
      );

      // Manually trigger refresh
      await act(async () => {
        result.current.refresh();
      });

      expect(mockGetTransfer).toHaveBeenCalledWith("1");
    });
  });

  // useNotificationPolling
  describe("useNotificationPolling", () => {
    const mockGetUnreadCount = notificationService.getUnreadCount as ReturnType<
      typeof vi.fn
    >;
    const mockGetNotifications =
      notificationService.getNotifications as ReturnType<typeof vi.fn>;
    const mockFetchUnreadCount = vi.fn();
    const mockFetchNotifications = vi.fn();

    beforeEach(() => {
      // Setup notification store mock
      (
        useNotificationStore as unknown as ReturnType<typeof vi.fn>
      ).mockReturnValue({
        unreadCount: 0,
        fetchUnreadCount: mockFetchUnreadCount,
        fetchNotifications: mockFetchNotifications,
      });

      mockGetUnreadCount.mockResolvedValue({ count: 0 });
      mockGetNotifications.mockResolvedValue({
        notifications: [],
        total: 0,
        hasMore: false,
      });
    });

    it("should fetch unread count on mount when enabled", async () => {
      renderHook(() => useNotificationPolling({ enabled: true }));

      expect(mockFetchUnreadCount).toHaveBeenCalled();
    });

    it("should not fetch when disabled", () => {
      renderHook(() => useNotificationPolling({ enabled: false }));

      expect(mockFetchUnreadCount).not.toHaveBeenCalled();
    });

    it("should return unreadCount from store", () => {
      (
        useNotificationStore as unknown as ReturnType<typeof vi.fn>
      ).mockReturnValue({
        unreadCount: 5,
        fetchUnreadCount: mockFetchUnreadCount,
        fetchNotifications: mockFetchNotifications,
      });

      const { result } = renderHook(() =>
        useNotificationPolling({ enabled: true }),
      );

      expect(result.current.unreadCount).toBe(5);
    });

    it("should expose refresh function", async () => {
      const { result } = renderHook(() =>
        useNotificationPolling({ enabled: true }),
      );

      await act(async () => {
        await result.current.refresh();
      });

      expect(mockFetchUnreadCount).toHaveBeenCalled();
      expect(mockFetchNotifications).toHaveBeenCalled();
    });
  });

  // useRefresh
  describe("useRefresh", () => {
    it("should track isRefreshing state", async () => {
      const refreshFn = vi.fn(
        () => new Promise((resolve) => setTimeout(resolve, 100)),
      );

      const { result } = renderHook(() => useRefresh(refreshFn));

      expect(result.current.isRefreshing).toBe(false);

      act(() => {
        result.current.refresh();
      });

      expect(result.current.isRefreshing).toBe(true);

      // Wait for refresh to complete
      await act(async () => {
        vi.advanceTimersByTime(600); // 100ms + 500ms minDuration
      });

      expect(result.current.isRefreshing).toBe(false);
    });

    it("should debounce rapid calls", async () => {
      const refreshFn = vi.fn().mockResolvedValue("done");

      const { result } = renderHook(() =>
        useRefresh(refreshFn, { debounceMs: 1000 }),
      );

      // First call should go through
      await act(async () => {
        result.current.refresh();
        vi.advanceTimersByTime(600);
      });

      // Rapid second call should be debounced
      await act(async () => {
        result.current.refresh();
      });

      expect(refreshFn).toHaveBeenCalledTimes(1);
    });

    it("should allow calls after debounce period", async () => {
      const refreshFn = vi.fn().mockResolvedValue("done");

      const { result } = renderHook(() =>
        useRefresh(refreshFn, { debounceMs: 500, minDuration: 0 }),
      );

      // First call
      await act(async () => {
        result.current.refresh();
        vi.advanceTimersByTime(100);
      });

      // Wait for debounce period
      await act(async () => {
        vi.advanceTimersByTime(600);
      });

      // Second call should go through
      await act(async () => {
        result.current.refresh();
        vi.advanceTimersByTime(100);
      });

      expect(refreshFn).toHaveBeenCalledTimes(2);
    });

    it("should update lastRefresh timestamp", async () => {
      const refreshFn = vi.fn().mockResolvedValue("done");

      const { result } = renderHook(() =>
        useRefresh(refreshFn, { minDuration: 0, debounceMs: 0 }),
      );

      expect(result.current.lastRefresh).toBeNull();

      await act(async () => {
        await result.current.refresh();
      });

      expect(result.current.lastRefresh).toBeInstanceOf(Date);
    });
  });

  // useFocusTrap
  describe("useFocusTrap", () => {
    it("should return containerRef", () => {
      const { result } = renderHook(() => useFocusTrap(false));

      expect(result.current.containerRef).toBeDefined();
      expect(result.current.containerRef.current).toBeNull();
    });

    it("should focus first element when activated", () => {
      // Create a container with focusable elements
      const container = document.createElement("div");
      const button1 = document.createElement("button");
      button1.textContent = "First";
      const button2 = document.createElement("button");
      button2.textContent = "Second";
      container.appendChild(button1);
      container.appendChild(button2);
      document.body.appendChild(container);

      const { result, rerender } = renderHook(
        ({ isActive }) => useFocusTrap(isActive),
        { initialProps: { isActive: false } },
      );

      // Attach ref to container
      Object.defineProperty(result.current.containerRef, "current", {
        value: container,
        writable: true,
      });

      // Activate focus trap
      rerender({ isActive: true });

      // First button should be focused
      expect(document.activeElement).toBe(button1);

      // Cleanup
      document.body.removeChild(container);
    });

    it("should handle Tab key to cycle focus", () => {
      const container = document.createElement("div");
      const button1 = document.createElement("button");
      const button2 = document.createElement("button");
      container.appendChild(button1);
      container.appendChild(button2);
      document.body.appendChild(container);

      const { result } = renderHook(() => useFocusTrap(true));

      Object.defineProperty(result.current.containerRef, "current", {
        value: container,
        writable: true,
      });

      button2.focus();

      // Simulate Tab key on last element
      const tabEvent = new KeyboardEvent("keydown", {
        key: "Tab",
        bubbles: true,
      });
      document.dispatchEvent(tabEvent);

      // Cleanup
      document.body.removeChild(container);
    });
  });

  // useKeyboardShortcuts
  describe("useKeyboardShortcuts", () => {
    it("should trigger handler on matching key", () => {
      const handler = vi.fn();
      const shortcuts = [{ key: "h", handler, description: "Go home" }];

      renderHook(() => useKeyboardShortcuts(shortcuts));

      // Simulate keydown
      const event = new KeyboardEvent("keydown", {
        key: "h",
        bubbles: true,
      });
      document.dispatchEvent(event);

      expect(handler).toHaveBeenCalled();
    });

    it("should not trigger when typing in input", () => {
      const handler = vi.fn();
      const shortcuts = [{ key: "h", handler, description: "Go home" }];

      renderHook(() => useKeyboardShortcuts(shortcuts));

      // Create an input and focus it
      const input = document.createElement("input");
      document.body.appendChild(input);
      input.focus();

      // Simulate keydown while input is focused
      const event = new KeyboardEvent("keydown", {
        key: "h",
        bubbles: true,
      });
      Object.defineProperty(event, "target", { value: input });
      document.dispatchEvent(event);

      expect(handler).not.toHaveBeenCalled();

      document.body.removeChild(input);
    });

    it("should handle modifier keys (ctrl)", () => {
      const handler = vi.fn();
      const shortcuts = [
        { key: "s", ctrl: true, handler, description: "Save" },
      ];

      renderHook(() => useKeyboardShortcuts(shortcuts));

      // Without ctrl, should not trigger
      const eventWithoutCtrl = new KeyboardEvent("keydown", {
        key: "s",
        ctrlKey: false,
        bubbles: true,
      });
      document.dispatchEvent(eventWithoutCtrl);
      expect(handler).not.toHaveBeenCalled();

      // With ctrl, should trigger
      const eventWithCtrl = new KeyboardEvent("keydown", {
        key: "s",
        ctrlKey: true,
        bubbles: true,
      });
      document.dispatchEvent(eventWithCtrl);
      expect(handler).toHaveBeenCalled();
    });

    it("should handle shift modifier", () => {
      const handler = vi.fn();
      const shortcuts = [
        { key: "?", shift: true, handler, description: "Help" },
      ];

      renderHook(() => useKeyboardShortcuts(shortcuts));

      const event = new KeyboardEvent("keydown", {
        key: "?",
        shiftKey: true,
        bubbles: true,
      });
      document.dispatchEvent(event);

      expect(handler).toHaveBeenCalled();
    });

    it("should be case insensitive for key matching", () => {
      const handler = vi.fn();
      const shortcuts = [{ key: "H", handler, description: "Go home" }];

      renderHook(() => useKeyboardShortcuts(shortcuts));

      const event = new KeyboardEvent("keydown", {
        key: "h", // lowercase
        bubbles: true,
      });
      document.dispatchEvent(event);

      expect(handler).toHaveBeenCalled();
    });
  });
});
