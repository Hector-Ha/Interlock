import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "@/app";

describe("Phase 1: Security Tests", () => {
  describe("Authentication", () => {
    it("should require city field in signup", async () => {
      const response = await request(app).post("/api/v1/auth/sign-up").send({
        email: "test-city-missing@example.com",
        password: "Password123",
        firstName: "Test",
        lastName: "User",
        address: "123 Main St",
        // city is missing
        state: "CA",
        postalCode: "94102",
        dateOfBirth: "1990-01-01",
        ssn: "1234",
      });

      // Expecting 400 because city is required
      expect(response.status).toBe(400);
      // The error message might vary based on Zod or controller implementation
      // But we expect it to fail.
    });

    it("should enforce password complexity", async () => {
      const response = await request(app).post("/api/v1/auth/sign-up").send({
        email: "test-weak-pass@example.com",
        password: "weak", // Too simple
        firstName: "Test",
        lastName: "User",
        address: "123 Main St",
        city: "San Francisco",
        state: "CA",
        postalCode: "94102",
        dateOfBirth: "1990-01-01",
        ssn: "1234",
      });

      expect(response.status).toBe(400);
    });
  });

  describe("JWT Validation", () => {
    it("should reject requests without token", async () => {
      const response = await request(app).get("/api/v1/auth/me");
      expect(response.status).toBe(401);
    });

    it("should reject invalid tokens", async () => {
      const response = await request(app)
        .get("/api/v1/auth/me")
        .set("Cookie", "token=invalid-token");

      expect(response.status).toBe(401);
    });
  });

  describe("Rate Limiting", () => {
    it("should rate limit auth routes", async () => {
      // Make 6 requests (limit is 5)
      // Note: Rate limiting is active and isolated per test suite run.

      const email = "test-rate-limit@test.com";
      for (let i = 0; i < 6; i++) {
        await request(app)
          .post("/api/v1/auth/sign-in")
          .send({ email, password: "wrong" });
      }

      const response = await request(app)
        .post("/api/v1/auth/sign-in")
        .send({ email, password: "wrong" });

      expect(response.status).toBe(429);
    });
  });
});
