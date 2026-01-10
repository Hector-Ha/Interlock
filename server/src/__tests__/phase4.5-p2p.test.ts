import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import request from "supertest";
import app from "@/app";
import { prisma } from "@/db";
import { p2pService } from "@/services/p2p.service";
import { notificationService } from "@/services/notification.service";
import { createTestUser, createTestBank, cleanupTestData } from "./helpers";

// Mock Dwolla Service for P2P tests
vi.mock("@/services/dwolla.service", () => ({
  dwollaClient: {
    post: vi.fn(),
    get: vi.fn(),
  },
  ensureCustomer: vi.fn().mockResolvedValue({
    customerId: "test-customer-id",
    customerUrl: "https://api-sandbox.dwolla.com/customers/test-customer-id",
  }),
  addFundingSource: vi
    .fn()
    .mockResolvedValue(
      "https://api-sandbox.dwolla.com/funding-sources/test-source-id"
    ),
  createTransfer: vi.fn().mockResolvedValue({
    transferUrl: "https://api-sandbox.dwolla.com/transfers/test-transfer-id",
    transferId: "test-transfer-id",
  }),
  createP2PTransfer: vi
    .fn()
    .mockResolvedValue(
      "https://api-sandbox.dwolla.com/transfers/test-p2p-transfer-id"
    ),
}));

// Mock email service to avoid sending emails during tests
vi.mock("@/services/email.service", () => ({
  emailService: {
    sendP2PReceivedNotification: vi.fn().mockResolvedValue(undefined),
    sendP2PSentConfirmation: vi.fn().mockResolvedValue(undefined),
  },
}));

describe("Phase 4.5: P2P Transfers", () => {
  let sender: Awaited<ReturnType<typeof createTestUser>>;
  let recipient: Awaited<ReturnType<typeof createTestUser>>;
  let senderBank: Awaited<ReturnType<typeof createTestBank>>;
  let recipientBank: Awaited<ReturnType<typeof createTestBank>>;

  beforeAll(async () => {
    // Create test sender
    sender = await createTestUser({ email: "p2p-sender@test.com" });

    // Create test recipient
    recipient = await createTestUser({ email: "p2p-recipient@test.com" });

    // Create banks with Dwolla funding URLs
    senderBank = await createTestBank(sender.user.id, {
      dwollaFundingUrl: "https://api.dwolla.com/funding-sources/sender-test",
    });
    recipientBank = await createTestBank(recipient.user.id, {
      dwollaFundingUrl: "https://api.dwolla.com/funding-sources/recipient-test",
    });
  });

  afterAll(async () => {
    // Cleanup test data
    try {
      await cleanupTestData(sender.user.id);
      await cleanupTestData(recipient.user.id);
    } catch {
      // Ignore cleanup errors
    }
  });

  describe("Database Schema", () => {
    it("should have Notification model", async () => {
      const notification = await prisma.notification.create({
        data: {
          recipientUserId: sender.user.id,
          type: "P2P_RECEIVED",
          title: "Test",
          message: "Schema test",
        },
      });
      expect(notification).toHaveProperty("id");
      expect(notification).toHaveProperty("type");
      expect(notification).toHaveProperty("isRead");
      expect(notification.isRead).toBe(false);
      await prisma.notification.delete({ where: { id: notification.id } });
    });

    it("should support P2P transaction types", async () => {
      const transaction = await prisma.transaction.create({
        data: {
          bankId: senderBank.id,
          amount: 50,
          name: "P2P Test",
          date: new Date(),
          type: "P2P_SENT",
          senderId: sender.user.id,
          recipientId: recipient.user.id,
          status: "PENDING",
          channel: "p2p",
        },
      });
      expect(transaction.type).toBe("P2P_SENT");
      expect(transaction.senderId).toBe(sender.user.id);
      expect(transaction.recipientId).toBe(recipient.user.id);
      await prisma.transaction.delete({ where: { id: transaction.id } });
    });
  });

  describe("Recipient Search Service", () => {
    it("should find users by email", async () => {
      const results = await p2pService.searchRecipients(
        "p2p-recipient",
        sender.user.id
      );

      expect(results).toHaveLength(1);
      expect(results[0].email).toBe("p2p-recipient@test.com");
    });

    it("should exclude current user from search results", async () => {
      const results = await p2pService.searchRecipients(
        "p2p-sender",
        sender.user.id
      );

      expect(results).toHaveLength(0);
    });

    it("should indicate bank linkage status", async () => {
      const results = await p2pService.searchRecipients(
        "p2p-recipient",
        sender.user.id
      );

      expect(results[0].hasLinkedBank).toBe(true);
    });

    it("should return empty for short queries", async () => {
      const results = await p2pService.searchRecipients("ab", sender.user.id);
      expect(results).toHaveLength(0);
    });
  });

  describe("Transfer Limits", () => {
    it("should reject amounts over $2,000 per transaction", async () => {
      const result = await p2pService.validateLimits(sender.user.id, 2500);
      expect(result.valid).toBe(false);
      expect(result.reason).toContain("2000");
    });

    it("should allow amounts under $2,000", async () => {
      const result = await p2pService.validateLimits(sender.user.id, 100);
      expect(result.valid).toBe(true);
    });

    it("should allow amounts at $2,000 limit", async () => {
      const result = await p2pService.validateLimits(sender.user.id, 2000);
      expect(result.valid).toBe(true);
    });
  });

  describe("P2P API Endpoints", () => {
    describe("GET /api/v1/transfers/p2p/recipients/search", () => {
      it("should require authentication", async () => {
        const response = await request(app)
          .get("/api/v1/transfers/p2p/recipients/search")
          .query({ q: "test" });

        expect(response.status).toBe(401);
      });

      it("should validate query length (min 3 chars)", async () => {
        const response = await request(app)
          .get("/api/v1/transfers/p2p/recipients/search")
          .set("Cookie", sender.cookie)
          .query({ q: "ab" });

        expect(response.status).toBe(400);
      });

      it("should return matching recipients", async () => {
        const response = await request(app)
          .get("/api/v1/transfers/p2p/recipients/search")
          .set("Cookie", sender.cookie)
          .query({ q: "p2p-recipient" });

        expect(response.status).toBe(200);
        expect(response.body.recipients).toHaveLength(1);
        expect(response.body.recipients[0].email).toBe(
          "p2p-recipient@test.com"
        );
      });
    });

    describe("POST /api/v1/transfers/p2p", () => {
      it("should require authentication", async () => {
        const response = await request(app)
          .post("/api/v1/transfers/p2p")
          .send({ recipientId: recipient.user.id, amount: 50 });

        expect(response.status).toBe(401);
      });

      it("should validate required fields", async () => {
        const response = await request(app)
          .post("/api/v1/transfers/p2p")
          .set("Cookie", sender.cookie)
          .send({});

        expect(response.status).toBe(400);
      });

      it("should reject self-transfer", async () => {
        const response = await request(app)
          .post("/api/v1/transfers/p2p")
          .set("Cookie", sender.cookie)
          .send({
            recipientId: sender.user.id,
            senderBankId: senderBank.id,
            amount: 50,
          });

        expect(response.status).toBe(400);
        expect(response.body.message).toContain("yourself");
      });

      it("should reject amounts over limit", async () => {
        const response = await request(app)
          .post("/api/v1/transfers/p2p")
          .set("Cookie", sender.cookie)
          .send({
            recipientId: recipient.user.id,
            senderBankId: senderBank.id,
            amount: 3000,
          });

        expect(response.status).toBe(400);
      });

      // Uses the Dwolla mock defined (createP2PTransfer)
      it("should create P2P transfer successfully", async () => {
        const response = await request(app)
          .post("/api/v1/transfers/p2p")
          .set("Cookie", sender.cookie)
          .send({
            recipientId: recipient.user.id,
            senderBankId: senderBank.id,
            amount: 50,
          });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("transactionId");
      });
    });
  });

  describe("Notification Service", () => {
    it("should create notification", async () => {
      const notification = await notificationService.create({
        recipientUserId: sender.user.id,
        type: "P2P_SENT",
        title: "Test Notification",
        message: "Test message",
      });
      expect(notification.id).toBeDefined();
      expect(notification.isRead).toBe(false);
      await prisma.notification.delete({ where: { id: notification.id } });
    });

    it("should get user notifications", async () => {
      // Create a notification first
      const notification = await notificationService.create({
        recipientUserId: sender.user.id,
        type: "P2P_RECEIVED",
        title: "Test",
        message: "Test message",
      });

      const result = await notificationService.getByUserId(sender.user.id);

      expect(result.notifications).toBeInstanceOf(Array);
      expect(result.notifications.length).toBeGreaterThanOrEqual(1);
      expect(result).toHaveProperty("total");
      expect(result).toHaveProperty("hasMore");

      await prisma.notification.delete({ where: { id: notification.id } });
    });

    it("should get unread count", async () => {
      const count = await notificationService.getUnreadCount(sender.user.id);
      expect(typeof count).toBe("number");
    });

    it("should mark notification as read", async () => {
      const notification = await notificationService.create({
        recipientUserId: sender.user.id,
        type: "P2P_RECEIVED",
        title: "Mark Read Test",
        message: "Test",
      });

      await notificationService.markAsRead(notification.id, sender.user.id);

      const updated = await prisma.notification.findUnique({
        where: { id: notification.id },
      });

      expect(updated?.isRead).toBe(true);
      expect(updated?.readAt).toBeDefined();

      await prisma.notification.delete({ where: { id: notification.id } });
    });

    it("should mark all notifications as read", async () => {
      // Create multiple notifications
      const n1 = await notificationService.create({
        recipientUserId: sender.user.id,
        type: "P2P_SENT",
        title: "Test 1",
        message: "Test",
      });
      const n2 = await notificationService.create({
        recipientUserId: sender.user.id,
        type: "P2P_RECEIVED",
        title: "Test 2",
        message: "Test",
      });

      await notificationService.markAllAsRead(sender.user.id);

      const updated1 = await prisma.notification.findUnique({
        where: { id: n1.id },
      });
      const updated2 = await prisma.notification.findUnique({
        where: { id: n2.id },
      });

      expect(updated1?.isRead).toBe(true);
      expect(updated2?.isRead).toBe(true);

      await prisma.notification.deleteMany({
        where: { id: { in: [n1.id, n2.id] } },
      });
    });
  });

  describe("Notification API Endpoints", () => {
    it("GET /notifications should require auth", async () => {
      const response = await request(app).get("/api/v1/notifications");
      expect(response.status).toBe(401);
    });

    it("GET /notifications should return notifications", async () => {
      const response = await request(app)
        .get("/api/v1/notifications")
        .set("Cookie", sender.cookie);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("notifications");
      expect(response.body).toHaveProperty("total");
    });

    it("GET /notifications/unread-count should return count", async () => {
      const response = await request(app)
        .get("/api/v1/notifications/unread-count")
        .set("Cookie", sender.cookie);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("count");
    });

    it("PATCH /notifications/:id/read should mark as read", async () => {
      // Create a notification to mark as read
      const notification = await notificationService.create({
        recipientUserId: sender.user.id,
        type: "P2P_SENT",
        title: "API Test",
        message: "Test",
      });

      const response = await request(app)
        .patch(`/api/v1/notifications/${notification.id}/read`)
        .set("Cookie", sender.cookie);

      expect(response.status).toBe(200);

      await prisma.notification.delete({ where: { id: notification.id } });
    });

    it("POST /notifications/read-all should mark all as read", async () => {
      const response = await request(app)
        .post("/api/v1/notifications/read-all")
        .set("Cookie", sender.cookie);

      expect(response.status).toBe(200);
    });
  });
});
