import { prisma } from "@/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "@/config";
import { encrypt } from "@/utils/encryption";

export async function createTestUser(overrides = {}) {
  const passwordHash = await bcrypt.hash("TestPassword123", 10);

  const user = await prisma.user.create({
    data: {
      email: `test-${Date.now()}-${Math.random()
        .toString(36)
        .substring(7)}@example.com`,
      passwordHash,
      firstName: "Test",
      lastName: "User",
      address: encrypt(
        JSON.stringify({
          address1: "123 Test St",
          city: "Test City",
          state: "CA",
          postalCode: "94102",
        })
      ),
      dateOfBirth: encrypt("1990-01-01"),
      identityDocumentId: encrypt("1234"),
      country: "US",
      ...overrides,
    },
  });

  const token = jwt.sign({ userId: user.id }, config.jwtSecret, {
    expiresIn: "1h",
  });

  return {
    user,
    cookie: `token=${token}`,
    token,
  };
}

export async function createTestBank(userId: string, overrides = {}) {
  return prisma.bank.create({
    data: {
      userId,
      plaidItemId: `item-${Date.now()}-${Math.random()
        .toString(36)
        .substring(7)}`,
      plaidAccessToken: encrypt("test-access-token"),
      institutionId: "ins_test",
      institutionName: "Test Bank",
      status: "ACTIVE",
      ...overrides,
    },
  });
}

export async function createTestTransaction(bankId: string, overrides = {}) {
  return prisma.transaction.create({
    data: {
      bankId,
      amount: 100,
      name: "Test Transaction",
      date: new Date(),
      status: "SUCCESS",
      channel: "online",
      ...overrides,
    },
  });
}

// Cleanup helper
export async function cleanupTestData(userId: string) {
  try {
    await prisma.transaction.deleteMany({
      where: { bank: { userId } },
    });
    await prisma.bank.deleteMany({
      where: { userId },
    });
    await prisma.user.delete({
      where: { id: userId },
    });
  } catch (error) {
    console.warn("Cleanup failed:", error);
  }
}
