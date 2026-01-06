import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { usePlaidLink } from "../hooks/usePlaidLink";
import { plaidService } from "../services/plaid.service";
import { useBankStore } from "../stores/bank.store";
import { useToast } from "../stores/ui.store";

// Mock dependencies
vi.mock("react-plaid-link", () => ({
  usePlaidLink: vi.fn(() => ({
    open: vi.fn(),
    ready: true,
  })),
}));

vi.mock("../services/plaid.service", () => ({
  plaidService: {
    createLinkToken: vi.fn(),
    exchangeToken: vi.fn(),
  },
}));

vi.mock("../stores/bank.store", () => ({
  useBankStore: vi.fn(),
}));

vi.mock("../stores/ui.store", () => ({
  useToast: vi.fn(),
}));

describe("usePlaidLink Hook", () => {
  const mockCreateLinkToken = plaidService.createLinkToken as Mock;
  const mockExchangeToken = plaidService.exchangeToken as Mock;
  const mockFetchBanks = vi.fn();
  const mockToastSuccess = vi.fn();
  const mockToastError = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup default mocks
    mockCreateLinkToken.mockResolvedValue({ link_token: "test-link-token" });
    (useBankStore as unknown as Mock).mockReturnValue({
      fetchBanks: mockFetchBanks,
    });
    (useToast as unknown as Mock).mockReturnValue({
      success: mockToastSuccess,
      error: mockToastError,
    });
  });

  it("should fetch link token on mount", async () => {
    renderHook(() => usePlaidLink());

    await waitFor(() => {
      expect(mockCreateLinkToken).toHaveBeenCalledTimes(1);
    });
  });

  it("should handle initialization error", async () => {
    mockCreateLinkToken.mockRejectedValue(new Error("Failed to get token"));

    const { result } = renderHook(() => usePlaidLink());

    await waitFor(() => {
      expect(result.current.error).toBe("Failed to get token");
    });
  });

  // Since we can't easily access the internal handleSuccess passed to usePlaidLinkBase
  // effectively without more complex mocking of react-plaid-link to call the callback,
  // we will verify that usePlaidLinkBase is called with the correct config including token.

  it("should initialize usePlaidLinkBase with token", async () => {
    const { usePlaidLink: usePlaidLinkBase } = await import("react-plaid-link");

    renderHook(() => usePlaidLink());

    await waitFor(() => {
      expect(usePlaidLinkBase).toHaveBeenCalledWith(
        expect.objectContaining({
          token: "test-link-token",
        })
      );
    });
  });
});
