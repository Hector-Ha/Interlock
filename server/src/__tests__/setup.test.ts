import { describe, it, expect } from "vitest";
import { config } from "@/config";
import { prisma } from "@/db";

describe("Environment Setup (Phase 0 Gate)", () => {
  it("should have all required environment variables", () => {
    // Check for critical variables
    expect(config.jwtSecret).toBeDefined();
    // This expects the secret NOT to be the default unsafe one
    expect(config.jwtSecret).not.toBe("supersecret");

    expect(config.encryptionKey).toBeDefined();
    expect(config.plaid.clientId).toBeDefined();
    expect(config.plaid.secret).toBeDefined();

    // Dwolla keys
    expect(config.dwolla.key).toBeDefined();
    expect(config.dwolla.secret).toBeDefined();
  });

  it("should connect to database", async () => {
    // Simple query to verify connection
    const result = await prisma.$queryRaw`SELECT 1 as connected`;
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    expect((result as any)[0].connected).toBe(1);
  });
});
