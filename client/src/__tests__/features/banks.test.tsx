import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import BanksPage from "@/app/(root)/banks/page";
import { useBankStore } from "@/stores/bank.store";

// Mock child components to isolate page logic
vi.mock("@/components/features/banks/AddBankModal", () => ({
  AddBankModal: ({ open }: { open: boolean }) =>
    open ? <div data-testid="add-bank-modal">Add Bank Modal</div> : null,
}));

// Mock store
vi.mock("@/stores/bank.store", () => ({
  useBankStore: vi.fn(),
}));

// Mock hooks
vi.mock("@/hooks/usePlaidLink", () => ({
  usePlaidLink: vi.fn(() => ({
    open: vi.fn(),
    ready: true,
  })),
}));

describe("BanksPage", () => {
  const mockFetchBanks = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useBankStore as unknown as Mock).mockReturnValue({
      banks: [],
      fetchBanks: mockFetchBanks,
    });
  });

  it("should render empty state when no banks", () => {
    render(<BanksPage />);
    expect(screen.getByText(/No banks connected yet/i)).toBeInTheDocument();
  });

  it("should render bank cards when banks exist", () => {
    (useBankStore as unknown as Mock).mockReturnValue({
      banks: [
        {
          id: "1",
          institutionName: "Test Bank",
          status: "ACTIVE",
          createdAt: new Date().toISOString(),
        },
      ],
      fetchBanks: mockFetchBanks,
    });

    render(<BanksPage />);
    expect(screen.getByText("Test Bank")).toBeInTheDocument();
    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it("should open add bank modal when clicking add button", async () => {
    render(<BanksPage />);

    // There are two "Connect Bank" buttons (one in header, one in empty state)
    // We'll target the one in the header
    const addButtons = screen.getAllByRole("button", { name: /add bank/i });
    fireEvent.click(addButtons[0]);

    await waitFor(() => {
      expect(screen.getByTestId("add-bank-modal")).toBeInTheDocument();
    });
  });
});
