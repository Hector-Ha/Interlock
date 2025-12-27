import path from "path";
import { defineConfig } from "prisma/config";

export default defineConfig({
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
