import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import app from "@/app";

describe("Phase 7: Production Readiness", () => {
  describe("Security Headers", () => {
    it("should include Content-Security-Policy header", async () => {
      const response = await request(app).get("/api/v1/health");
      expect(response.headers["content-security-policy"]).toBeDefined();
    });

    it("should include X-Frame-Options header set to DENY", async () => {
      const response = await request(app).get("/api/v1/health");
      expect(response.headers["x-frame-options"]).toBe("DENY");
    });

    it("should include X-Content-Type-Options header", async () => {
      const response = await request(app).get("/api/v1/health");
      expect(response.headers["x-content-type-options"]).toBe("nosniff");
    });

    it("should include Strict-Transport-Security header", async () => {
      const response = await request(app).get("/api/v1/health");
      expect(response.headers["strict-transport-security"]).toBeDefined();
    });

    it("should include X-XSS-Protection header", async () => {
      const response = await request(app).get("/api/v1/health");
      // x-xss-protection may be 0 (disabled) or 1 in modern helmet
      expect(response.headers["x-xss-protection"]).toBeDefined();
    });

    it("should include Referrer-Policy header", async () => {
      const response = await request(app).get("/api/v1/health");
      expect(response.headers["referrer-policy"]).toBe(
        "strict-origin-when-cross-origin",
      );
    });
  });

  describe("Health Check Endpoint", () => {
    it("should return 200 and healthy status", async () => {
      const response = await request(app).get("/api/v1/health");

      expect(response.status).toBe(200);
      expect(response.body.status).toBe("healthy");
    });

    it("should include timestamp in response", async () => {
      const response = await request(app).get("/api/v1/health");

      expect(response.body).toHaveProperty("timestamp");
      // Verify it's a valid ISO date
      expect(new Date(response.body.timestamp).toISOString()).toBe(
        response.body.timestamp,
      );
    });

    it("should include uptime in response", async () => {
      const response = await request(app).get("/api/v1/health");

      expect(response.body).toHaveProperty("uptime");
      expect(typeof response.body.uptime).toBe("number");
      expect(response.body.uptime).toBeGreaterThanOrEqual(0);
    });

    it("should include database status", async () => {
      const response = await request(app).get("/api/v1/health");

      expect(response.body).toHaveProperty("database");
    });
  });

  describe("Readiness Probe", () => {
    it("should return ready status", async () => {
      const response = await request(app).get("/api/v1/ready");

      expect(response.status).toBe(200);
      expect(response.body.ready).toBe(true);
    });
  });

  describe("Liveness Probe", () => {
    it("should return alive status", async () => {
      const response = await request(app).get("/api/v1/live");

      expect(response.status).toBe(200);
      expect(response.body.alive).toBe(true);
    });
  });

  describe("Metrics Endpoint", () => {
    it("should return metrics data", async () => {
      const response = await request(app).get("/api/v1/metrics");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("requests");
      expect(response.body).toHaveProperty("business");
    });

    it("should include request metrics", async () => {
      const response = await request(app).get("/api/v1/metrics");

      expect(response.body.requests).toHaveProperty("total");
      expect(response.body.requests).toHaveProperty("byStatus");
      expect(response.body.requests).toHaveProperty("avgLatency");
    });

    it("should include business metrics", async () => {
      const response = await request(app).get("/api/v1/metrics");

      expect(response.body.business).toHaveProperty("totalUsers");
      expect(response.body.business).toHaveProperty("totalTransfers");
      expect(response.body.business).toHaveProperty("p2pTransfersToday");
    });
  });

  describe("Root Health Check", () => {
    it("should return simple ok status", async () => {
      const response = await request(app).get("/health");

      expect(response.status).toBe(200);
      expect(response.body.status).toBe("healthy");
    });
  });
});
