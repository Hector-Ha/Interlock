import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import request from "supertest";
import app from "@/app";
import { prisma } from "@/db";
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
    it.skip("should have Notification model", async () => {
      // TODO: Implement after schema migration
      // const notification = await prisma.notification.create({
      //   data: {
      //     recipientUserId: sender.user.id,
      //     type: "P2P_RECEIVED",
      //     title: "Test",
      //     message: "Schema test",
      //   },
      // });
      // expect(notification).toHaveProperty("id");
      // expect(notification).toHaveProperty("type");
      // expect(notification).toHaveProperty("isRead");
      // await prisma.notification.delete({ where: { id: notification.id } });
    });

    it.skip("should support P2P transaction types", async () => {
      // TODO: Implement after schema migration
      // const transaction = await prisma.transaction.create({
      //   data: {
      //     bankId: senderBank.id,
      //     amount: 50,
      //     name: "P2P Test",
      //     date: new Date(),
      //     type: "P2P_SENT",
      //     senderId: sender.user.id,
      //     recipientId: recipient.user.id,
      //     status: "PENDING",
      //     channel: "p2p",
      //   },
      // });
      // expect(transaction.type).toBe("P2P_SENT");
      // expect(transaction.senderId).toBe(sender.user.id);
      // expect(transaction.recipientId).toBe(recipient.user.id);
      // await prisma.transaction.delete({ where: { id: transaction.id } });
    });
  });

  describe("Recipient Search Service", () => {
    it.skip("should find users by email", async () => {
      // TODO: Implement after p2pService is created
      // const results = await p2pService.searchRecipients(
      //   "p2p-recipient",
      //   sender.user.id
      // );
      // expect(results).toHaveLength(1);
      // expect(results[0].email).toBe("p2p-recipient@test.com");
    });

    it.skip("should exclude current user from search results", async () => {
      // TODO: Implement after p2pService is created
      // Should not return the sender when searching for their own email
    });

    it.skip("should indicate bank linkage status", async () => {
      // TODO: Implement after p2pService is created
      // Each result should have hasLinkedBank property
    });
  });

  describe("Transfer Limits", () => {
    it.skip("should reject amounts over $2,000 per transaction", async () => {
      // TODO: Implement after p2pService is created
      // const result = await p2pService.validateLimits(sender.user.id, 2500);
      // expect(result.valid).toBe(false);
      // expect(result.reason).toContain("2,000");
    });

    it.skip("should enforce $5,000 daily limit", async () => {
      // TODO: Implement after p2pService is created
    });

    it.skip("should enforce $10,000 weekly limit", async () => {
      // TODO: Implement after p2pService is created
    });

    it.skip("should allow valid amounts under limits", async () => {
      // TODO: Implement after p2pService is created
      // const result = await p2pService.validateLimits(sender.user.id, 100);
      // expect(result.valid).toBe(true);
    });
  });

  describe("P2P API Endpoints", () => {
    describe("GET /api/v1/transfers/p2p/recipients/search", () => {
      it.skip("should require authentication", async () => {
        const response = await request(app)
          .get("/api/v1/transfers/p2p/recipients/search")
          .query({ q: "test" });

        expect(response.status).toBe(401);
      });

      it.skip("should validate query length (min 3 chars)", async () => {
        const response = await request(app)
          .get("/api/v1/transfers/p2p/recipients/search")
          .set("Cookie", sender.cookie)
          .query({ q: "ab" });

        expect(response.status).toBe(400);
      });

      it.skip("should return matching recipients", async () => {
        const response = await request(app)
          .get("/api/v1/transfers/p2p/recipients/search")
          .set("Cookie", sender.cookie)
          .query({ q: "p2p-recipient" });

        expect(response.status).toBe(200);
        expect(response.body.recipients).toHaveLength(1);
      });
    });

    describe("POST /api/v1/transfers/p2p", () => {
      it.skip("should require authentication", async () => {
        const response = await request(app)
          .post("/api/v1/transfers/p2p")
          .send({ recipientId: recipient.user.id, amount: 50 });

        expect(response.status).toBe(401);
      });

      it.skip("should validate required fields", async () => {
        const response = await request(app)
          .post("/api/v1/transfers/p2p")
          .set("Cookie", sender.cookie)
          .send({});

        expect(response.status).toBe(400);
      });

      it.skip("should reject self-transfer", async () => {
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

      it.skip("should reject amounts over limit", async () => {
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

      it.skip("should create P2P transfer successfully", async () => {
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
    it.skip("should create notification", async () => {
      // TODO: Implement after notificationService is created
      // const notification = await notificationService.create({
      //   recipientUserId: sender.user.id,
      //   type: "P2P_SENT",
      //   title: "Test Notification",
      //   message: "Test message",
      // });
      // expect(notification.id).toBeDefined();
      // expect(notification.isRead).toBe(false);
      // await prisma.notification.delete({ where: { id: notification.id } });
    });

    it.skip("should get user notifications", async () => {
      // TODO: Implement after notificationService is created
    });

    it.skip("should get unread count", async () => {
      // TODO: Implement after notificationService is created
    });

    it.skip("should mark notification as read", async () => {
      // TODO: Implement after notificationService is created
    });

    it.skip("should mark all notifications as read", async () => {
      // TODO: Implement after notificationService is created
    });
  });

  describe("Notification API Endpoints", () => {
    it.skip("GET /notifications should require auth", async () => {
      const response = await request(app).get("/api/v1/notifications");
      expect(response.status).toBe(401);
    });

    it.skip("GET /notifications should return notifications", async () => {
      const response = await request(app)
        .get("/api/v1/notifications")
        .set("Cookie", sender.cookie);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("notifications");
      expect(response.body).toHaveProperty("total");
    });

    it.skip("GET /notifications/unread-count should return count", async () => {
      const response = await request(app)
        .get("/api/v1/notifications/unread-count")
        .set("Cookie", sender.cookie);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("count");
    });

    it.skip("PATCH /notifications/:id/read should mark as read", async () => {
      // TODO: Implement after notificationService is created
    });

    it.skip("POST /notifications/mark-all-read should mark all as read", async () => {
      // TODO: Implement after notificationService is created
    });
  });
});
