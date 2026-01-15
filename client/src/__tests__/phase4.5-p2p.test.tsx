import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useNotificationStore } from "@/stores/notification.store";
import { useBankStore } from "@/stores/bank.store";

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

// Mock P2P service - use inline mock values to avoid hoisting issues
vi.mock("@/services/p2p.service", () => ({
  p2pService: {
    searchRecipients: vi.fn().mockResolvedValue({
      recipients: [
        {
          id: "1",
          firstName: "John",
          lastName: "Doe",
          email: "john@test.com",
          hasLinkedBank: true,
        },
        {
          id: "2",
          firstName: "Jane",
          lastName: "Smith",
          email: "jane@test.com",
          hasLinkedBank: false,
        },
      ],
    }),
    createTransfer: vi.fn().mockResolvedValue({ transactionId: "tx-123" }),
  },
}));

// Mock notification service
vi.mock("@/services/notification.service", () => ({
  notificationService: {
    getNotifications: vi.fn().mockResolvedValue({
      notifications: [
        {
          id: "n1",
          type: "P2P_RECEIVED",
          title: "Money Received",
          message: "You received $50 from John",
          isRead: false,
          readAt: null,
          createdAt: new Date().toISOString(),
        },
        {
          id: "n2",
          type: "P2P_SENT",
          title: "Money Sent",
          message: "You sent $25 to Jane",
          isRead: true,
          readAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        },
      ],
      total: 2,
      hasMore: false,
    }),
    getUnreadCount: vi.fn().mockResolvedValue({ count: 3 }),
    markAsRead: vi.fn().mockResolvedValue(undefined),
    markAllAsRead: vi.fn().mockResolvedValue(undefined),
  },
}));

// Mock bank store
const { useBankStoreMock } = vi.hoisted(() => {
  const mockBankStore = {
    banks: [
      {
        id: "bank-1",
        institutionName: "Test Bank",
        dwollaFundingUrl: "https://dwolla.com/fs/123",
      },
    ],
    isLoading: false,
    fetchBanks: vi.fn(),
  };

  const useBankStoreMock = vi.fn(() => mockBankStore);
  (useBankStoreMock as any).setState = vi.fn((newState) => {
    Object.assign(mockBankStore, newState);
  });
  (useBankStoreMock as any).getState = vi.fn(() => mockBankStore);

  return { useBankStoreMock };
});

vi.mock("@/stores/bank.store", () => ({
  useBankStore: useBankStoreMock,
}));

describe("Phase 4.5: P2P Frontend Components", () => {
  describe("RecipientSearch", () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it("should render search input", async () => {
      const { RecipientSearch } =
        await import("@/components/features/p2p/RecipientSearch");
      render(<RecipientSearch onSelect={vi.fn()} />);

      expect(
        screen.getByPlaceholderText(/search by email or phone/i),
      ).toBeInTheDocument();
    });

    it("should search after 3+ characters typed", async () => {
      const { RecipientSearch } =
        await import("@/components/features/p2p/RecipientSearch");
      const { p2pService } = await import("@/services/p2p.service");
      const user = userEvent.setup();

      render(<RecipientSearch onSelect={vi.fn()} />);

      const input = screen.getByPlaceholderText(/search by email or phone/i);
      await user.type(input, "john");

      await waitFor(
        () => {
          expect(p2pService.searchRecipients).toHaveBeenCalledWith("john");
        },
        { timeout: 1000 },
      );
    });

    it("should display search results", async () => {
      const { RecipientSearch } =
        await import("@/components/features/p2p/RecipientSearch");
      const user = userEvent.setup();

      render(<RecipientSearch onSelect={vi.fn()} />);

      const input = screen.getByPlaceholderText(/search by email or phone/i);
      await user.type(input, "john");

      await waitFor(
        () => {
          expect(screen.getByText("John Doe")).toBeInTheDocument();
        },
        { timeout: 1000 },
      );
      expect(screen.getByText("john@test.com")).toBeInTheDocument();
    });

    it("should call onSelect when recipient with linked bank is clicked", async () => {
      const { RecipientSearch } =
        await import("@/components/features/p2p/RecipientSearch");
      const user = userEvent.setup();
      const onSelect = vi.fn();

      render(<RecipientSearch onSelect={onSelect} />);

      const input = screen.getByPlaceholderText(/search by email or phone/i);
      await user.type(input, "john");

      await waitFor(() => {
        expect(screen.getByText("John Doe")).toBeInTheDocument();
      });

      // Click on John Doe (has linked bank)
      await user.click(screen.getByText("John Doe"));

      expect(onSelect).toHaveBeenCalledWith(
        expect.objectContaining({
          id: "1",
          firstName: "John",
          lastName: "Doe",
          hasLinkedBank: true,
        }),
      );
    });

    it("should show 'no bank linked' warning for recipients without banks", async () => {
      const { RecipientSearch } =
        await import("@/components/features/p2p/RecipientSearch");
      const user = userEvent.setup();

      render(<RecipientSearch onSelect={vi.fn()} />);

      const input = screen.getByPlaceholderText(/search by email or phone/i);
      await user.type(input, "jane");

      await waitFor(() => {
        expect(screen.getByText("Jane Smith")).toBeInTheDocument();
      });

      expect(screen.getByText("No linked bank")).toBeInTheDocument();
    });

    it("should not call onSelect for recipients without linked bank", async () => {
      const { RecipientSearch } =
        await import("@/components/features/p2p/RecipientSearch");
      const user = userEvent.setup();
      const onSelect = vi.fn();

      render(<RecipientSearch onSelect={onSelect} />);

      const input = screen.getByPlaceholderText(/search by email or phone/i);
      await user.type(input, "jane");

      await waitFor(() => {
        expect(screen.getByText("Jane Smith")).toBeInTheDocument();
      });

      // Click on Jane Smith (no linked bank)
      await user.click(screen.getByText("Jane Smith"));

      expect(onSelect).not.toHaveBeenCalled();
    });
  });

  describe("NotificationBell", () => {
    beforeEach(() => {
      vi.clearAllMocks();
      // Reset store state before each test
      useNotificationStore.setState({
        notifications: [],
        unreadCount: 0,
        total: 0,
        hasMore: false,
        isLoading: false,
        error: null,
      });
    });

    it("should render bell icon button", async () => {
      const { NotificationBell } =
        await import("@/components/layout/NotificationBell");
      render(<NotificationBell />);

      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("should show unread count badge when count > 0", async () => {
      // Set unread count in store
      useNotificationStore.setState({ unreadCount: 3 });

      const { NotificationBell } =
        await import("@/components/layout/NotificationBell");
      render(<NotificationBell />);

      expect(screen.getByText("3")).toBeInTheDocument();
    });

    it("should show 9+ when count exceeds 9", async () => {
      useNotificationStore.setState({ unreadCount: 15 });

      const { NotificationBell } =
        await import("@/components/layout/NotificationBell");
      render(<NotificationBell />);

      expect(screen.getByText("9+")).toBeInTheDocument();
    });

    it("should hide badge when count is 0", async () => {
      useNotificationStore.setState({ unreadCount: 0 });

      const { NotificationBell } =
        await import("@/components/layout/NotificationBell");
      render(<NotificationBell />);

      // Badge should not exist
      expect(screen.queryByText("0")).not.toBeInTheDocument();
    });

    it("should open dropdown on click", async () => {
      const { NotificationBell } =
        await import("@/components/layout/NotificationBell");
      const user = userEvent.setup();

      render(<NotificationBell />);

      const button = screen.getByRole("button");
      await user.click(button);

      await waitFor(() => {
        expect(screen.getByText("Notifications")).toBeInTheDocument();
      });
    });

    it("should display notifications in dropdown", async () => {
      // Note: The NotificationBell uses fetchNotifications when dropdown opens,
      // which uses the mocked notificationService. We test from that mock data,
      // not the one we set via setState.

      const { NotificationBell } =
        await import("@/components/layout/NotificationBell");
      const user = userEvent.setup();

      render(<NotificationBell />);

      await user.click(screen.getByRole("button"));

      await waitFor(() => {
        expect(screen.getByText("Money Received")).toBeInTheDocument();
        expect(
          screen.getByText("You received $50 from John"),
        ).toBeInTheDocument();
      });
    });

    it("should show 'Mark all read' button when there are unread notifications", async () => {
      useNotificationStore.setState({ unreadCount: 2 });

      const { NotificationBell } =
        await import("@/components/layout/NotificationBell");
      const user = userEvent.setup();

      render(<NotificationBell />);

      await user.click(screen.getByRole("button"));

      await waitFor(() => {
        expect(screen.getByText("Mark all read")).toBeInTheDocument();
      });
    });
  });

  describe("Notification Store", () => {
    beforeEach(() => {
      vi.clearAllMocks();
      useNotificationStore.setState({
        notifications: [],
        unreadCount: 0,
        total: 0,
        hasMore: false,
        isLoading: false,
        error: null,
      });
    });

    it("should initialize with empty state", () => {
      const state = useNotificationStore.getState();

      expect(state.notifications).toEqual([]);
      expect(state.unreadCount).toBe(0);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });

    it("should fetch notifications", async () => {
      const { notificationService } =
        await import("@/services/notification.service");

      await useNotificationStore.getState().fetchNotifications();

      const state = useNotificationStore.getState();
      expect(state.notifications.length).toBe(2);
      expect(state.total).toBe(2);
      expect(notificationService.getNotifications).toHaveBeenCalled();
    });

    it("should fetch unread count", async () => {
      const { notificationService } =
        await import("@/services/notification.service");

      await useNotificationStore.getState().fetchUnreadCount();

      const state = useNotificationStore.getState();
      expect(state.unreadCount).toBe(3);
      expect(notificationService.getUnreadCount).toHaveBeenCalled();
    });

    it("should mark notification as read with optimistic update", async () => {
      const { notificationService } =
        await import("@/services/notification.service");

      // Setup initial state with an unread notification
      useNotificationStore.setState({
        notifications: [
          {
            id: "n1",
            type: "P2P_RECEIVED",
            title: "Test",
            message: "Test message",
            isRead: false,
            readAt: null,
            createdAt: new Date().toISOString(),
            relatedTransactionId: null,
          },
        ],
        unreadCount: 1,
      });

      await useNotificationStore.getState().markAsRead("n1");

      const state = useNotificationStore.getState();
      expect(state.notifications[0].isRead).toBe(true);
      expect(state.unreadCount).toBe(0);
      expect(notificationService.markAsRead).toHaveBeenCalledWith("n1");
    });

    it("should mark all notifications as read", async () => {
      const { notificationService } =
        await import("@/services/notification.service");

      // Setup initial state
      useNotificationStore.setState({
        notifications: [
          {
            id: "n1",
            type: "P2P_RECEIVED",
            title: "Test 1",
            message: "Test",
            isRead: false,
            readAt: null,
            createdAt: new Date().toISOString(),
            relatedTransactionId: null,
          },
          {
            id: "n2",
            type: "P2P_SENT",
            title: "Test 2",
            message: "Test",
            isRead: false,
            readAt: null,
            createdAt: new Date().toISOString(),
            relatedTransactionId: null,
          },
        ],
        unreadCount: 2,
      });

      await useNotificationStore.getState().markAllAsRead();

      const state = useNotificationStore.getState();
      expect(state.notifications.every((n) => n.isRead)).toBe(true);
      expect(state.unreadCount).toBe(0);
      expect(notificationService.markAllAsRead).toHaveBeenCalled();
    });

    it("should clear error", () => {
      useNotificationStore.setState({ error: "Some error" });

      useNotificationStore.getState().clearError();

      expect(useNotificationStore.getState().error).toBeNull();
    });

    it("should reset to initial state", () => {
      useNotificationStore.setState({
        notifications: [
          {
            id: "n1",
            type: "P2P_RECEIVED",
            title: "Test",
            message: "Test",
            isRead: true,
            readAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            relatedTransactionId: null,
          },
        ],
        unreadCount: 5,
        error: "Some error",
      });

      useNotificationStore.getState().reset();

      const state = useNotificationStore.getState();
      expect(state.notifications).toEqual([]);
      expect(state.unreadCount).toBe(0);
      expect(state.error).toBeNull();
    });
  });

  describe("P2P Transfer Form", () => {
    beforeEach(() => {
      vi.clearAllMocks();
      useBankStore.setState({
        banks: [
          {
            id: "bank-1",
            institutionName: "Test Bank",
            dwollaFundingUrl: "https://dwolla.com/fs/123",
            isDwollaLinked: true,
            status: "ACTIVE",
            institutionId: "ins_1",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          } as any,
        ],
        isLoading: false,
      });
    });

    it("should render transfer form elements", async () => {
      const { P2PTransferForm } =
        await import("@/components/features/transfers/P2PTransferForm");
      render(<P2PTransferForm />);

      expect(screen.getByText(/Send Money/i)).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText(/search by email/i),
      ).toBeInTheDocument();
      expect(screen.getByText(/From Account/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Amount/i)).toBeInTheDocument();
    });

    it("should show RecipientSearch and allow selection", async () => {
      const { P2PTransferForm } =
        await import("@/components/features/transfers/P2PTransferForm");
      const user = userEvent.setup();
      render(<P2PTransferForm />);

      // Initial state has search input
      const searchInput = screen.getByPlaceholderText(/search by email/i);
      await user.type(searchInput, "john");

      await waitFor(() => {
        expect(screen.getByText("John Doe")).toBeInTheDocument();
      });

      // Select recipient
      await user.click(screen.getByText("John Doe"));

      // Search input should be replaced by selected user display
      expect(
        screen.queryByPlaceholderText(/search by email/i),
      ).not.toBeInTheDocument();
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("john@test.com")).toBeInTheDocument();
    });

    it("should validate amount against limits", async () => {
      const { P2PTransferForm } =
        await import("@/components/features/transfers/P2PTransferForm");
      const user = userEvent.setup();
      render(<P2PTransferForm />);

      // Select recipient first (needed to enable submit)
      const searchInput = screen.getByPlaceholderText(/search by email/i);
      await user.type(searchInput, "john");
      await waitFor(() => screen.getByText("John Doe"));
      await user.click(screen.getByText("John Doe"));

      // Select bank
      const amountInput = screen.getByLabelText(/Amount/i);

      // Test > 2000
      await user.type(amountInput, "2500");
      await user.tab(); // trigger validation

      await waitFor(() => {
        expect(
          screen.getByText(/Maximum transfer is \$2,000.00/i),
        ).toBeInTheDocument();
      });

      // Clear and test valid
      await user.clear(amountInput);
      await user.type(amountInput, "100");

      await waitFor(() => {
        expect(screen.queryByText(/Maximum transfer/i)).not.toBeInTheDocument();
      });
    });

    it("should show confirmation modal and submit", async () => {
      const { P2PTransferForm } =
        await import("@/components/features/transfers/P2PTransferForm");
      const { p2pService } = await import("@/services/p2p.service");
      const user = userEvent.setup();
      render(<P2PTransferForm />);

      // Select Recipient
      const searchInput = screen.getByPlaceholderText(/search by email/i);
      await user.type(searchInput, "john");
      await waitFor(() => screen.getByText("John Doe"));
      await user.click(screen.getByText("John Doe"));

      // Select Bank
      const bankTrigger = screen.getByRole("combobox");
      await user.click(bankTrigger); // Open dropdown
      const bankOption = await screen.findByText("Test Bank");
      await user.click(bankOption); // Select bank

      // Enter Amount
      const amountInput = screen.getByLabelText(/Amount/i);
      await user.type(amountInput, "50");

      // Click Continue
      const continueBtn = screen.getByRole("button", { name: /Continue/i });
      expect(continueBtn).toBeEnabled();
      await user.click(continueBtn);

      // Verify Confirmation Modal
      expect(screen.getByText(/Confirm Transfer/i)).toBeInTheDocument();
      expect(screen.getByText(/\$50.00/i)).toBeInTheDocument();
      expect(screen.getByText(/To/i)).toBeInTheDocument();
      expect(screen.getAllByText("John Doe").length).toBeGreaterThan(0);

      // Confirm
      const confirmBtn = screen.getByRole("button", {
        name: /Confirm & Send/i,
      });
      await user.click(confirmBtn);

      // Verify Service Call
      await waitFor(() => {
        expect(p2pService.createTransfer).toHaveBeenCalledWith(
          expect.objectContaining({
            recipientId: "1",
            senderBankId: "bank-1",
            amount: 50,
          }),
        );
      });
    });
  });
});
