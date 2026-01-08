import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["src/**/*.test.ts"],
    exclude: [
      "node_modules",
      "dist",
      "src/__tests__/setup.ts",
      "src/__tests__/helpers.ts",
    ],
    fileParallelism: false, // Run test files sequentially to avoid rate limit conflicts
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: ["node_modules", "dist", "**/*.test.ts", "**/__tests__/**"],
    },
    setupFiles: ["./src/__tests__/setup.ts"],
    testTimeout: 10000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
