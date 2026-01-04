import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  earlyAccess: true,
  datamodel: ["prisma/schema.prisma"],
  datasource: {
    provider: "postgresql",
    url: process.env.DATABASE_URL,
  },
  db: {
    kind: "postgres",
    url: process.env.DATABASE_URL,
  },
});
