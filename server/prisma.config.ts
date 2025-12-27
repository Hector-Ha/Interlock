import "dotenv/config";
import path from "path";
import { defineConfig } from "prisma/config";

console.log(
  "Loading config. DB URL:",
  process.env.DATABASE_URL ? "FOUND" : "MISSING"
);
export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL as string,
  },
  earlyAccess: true,
  schema: path.join(__dirname, "prisma/schema.prisma"),
  migrate: {
    async resolveDataSource() {
      return {
        databaseUrl: process.env.DATABASE_URL as string,
      };
    },
  },
  studio: {
    async resolveDataSource() {
      return {
        databaseUrl: process.env.DATABASE_URL as string,
      };
    },
  },
});
