import { beforeAll, afterAll, afterEach } from "vitest";
import { prisma } from "@/db";

beforeAll(async () => {
  // Ensure test database is clean or connected
  try {
    await prisma.$connect();
    console.log("Test DB connected");
  } catch (error) {
    console.error("Failed to connect to test DB:", error);
    process.exit(1);
  }
});

afterEach(async () => {
  // TODO:Clean up test data after each test
});

afterAll(async () => {
  await prisma.$disconnect();
});
