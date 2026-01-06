import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import BankDetailsPage from "@/app/(root)/banks/[bankId]/page";

// Minimal mocks
vi.mock("next/navigation", () => ({
  useParams: () => ({ bankId: "123" }),
  useRouter: () => ({ back: vi.fn(), push: vi.fn() }),
}));

vi.mock("@/stores/bank.store", () => ({
  useBankStore: vi.fn(() => ({
    selectedBank: { id: "123", institutionName: "Test Bank", status: "ACTIVE" },
    selectBank: vi.fn(),
    removeBank: vi.fn(),
  })),
}));

vi.mock("@/stores/ui.store", () => ({
  useToast: vi.fn(() => ({ success: vi.fn(), error: vi.fn() })),
}));

vi.mock("@/services/bank.service", () => ({
  bankService: {
    getAccounts: vi.fn().mockResolvedValue({ accounts: [] }),
    getTransactions: vi.fn().mockResolvedValue({ transactions: [] }),
    syncTransactions: vi.fn(),
    disconnectBank: vi.fn(),
  },
}));

vi.mock("@/components/shared/ConfirmModal", () => ({
  ConfirmModal: () => null,
}));

describe("BankDetailsPage Sanity", () => {
  it("renders and loads data", async () => {
    render(<BankDetailsPage />);
    expect(screen.getByText("Loading bank details...")).toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.queryByText("Loading bank details...")
      ).not.toBeInTheDocument();
    });
  });
});
