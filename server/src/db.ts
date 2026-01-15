import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, Prisma } from "./generated/client";

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

// Configure log levels based on environment
const getLogConfig = (): Prisma.LogLevel[] => {
  if (process.env.NODE_ENV === "production") {
    // In production, only log errors and warnings
    return ["error", "warn"];
  }
  // In development, log queries too for debugging
  return ["query", "error", "warn"];
};

// Singleton pattern for development hot-reload safety
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const createPrismaClient = () => {
  return new PrismaClient({
    adapter,
    log: getLogConfig(),
  });
};

export const prisma: PrismaClient =
  globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
