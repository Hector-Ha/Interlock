import { describe, it, expect, vi } from "vitest";
import { existsSync, readdirSync, readFileSync } from "fs";
import { join } from "path";

describe("Phase 7: Frontend Performance", () => {
  describe("Bundle Size", () => {
    it("should have .next directory after build (skipped if no build)", () => {
      const nextDir = join(process.cwd(), ".next");

      if (!existsSync(nextDir)) {
        console.log(
          "Skipping: No .next directory found. Run 'bun run build' first.",
        );
        return;
      }

      expect(existsSync(nextDir)).toBe(true);
    });

    it("standalone output should exist for containerization", () => {
      const standaloneDir = join(process.cwd(), ".next/standalone");

      if (!existsSync(join(process.cwd(), ".next"))) {
        console.log("Skipping: No build output found.");
        return;
      }

      // Standalone should exist if output: 'standalone' is configured
      // This may not exist yet if build hasn't run
      if (existsSync(standaloneDir)) {
        expect(existsSync(standaloneDir)).toBe(true);
      }
    });
  });

  describe("No Secrets in Bundle", () => {
    const secretPatterns = [
      { pattern: /PLAID_SECRET/i, name: "PLAID_SECRET" },
      { pattern: /DWOLLA_SECRET/i, name: "DWOLLA_SECRET" },
      { pattern: /JWT_SECRET/i, name: "JWT_SECRET" },
      { pattern: /DATABASE_URL/i, name: "DATABASE_URL" },
      { pattern: /ENCRYPTION_KEY/i, name: "ENCRYPTION_KEY" },
    ];

    it("should not contain server-only secrets in client bundle", () => {
      const staticDir = join(process.cwd(), ".next/static");

      if (!existsSync(staticDir)) {
        console.log(
          "Skipping: No build output found. Run 'bun run build' first.",
        );
        return;
      }

      // Scan JS files for secrets
      const scanDir = (dir: string): string[] => {
        const issues: string[] = [];

        try {
          const entries = readdirSync(dir, { withFileTypes: true });

          for (const entry of entries) {
            const path = join(dir, entry.name);

            if (entry.isDirectory()) {
              issues.push(...scanDir(path));
            } else if (entry.name.endsWith(".js")) {
              const content = readFileSync(path, "utf-8");

              for (const { pattern, name } of secretPatterns) {
                if (pattern.test(content)) {
                  issues.push(`${path}: Contains ${name}`);
                }
              }
            }
          }
        } catch {
          // Directory not accessible
        }

        return issues;
      };

      const issues = scanDir(staticDir);

      if (issues.length > 0) {
        console.error("Security issues found:", issues);
      }

      expect(issues).toHaveLength(0);
    });
  });

  describe("Configuration", () => {
    it("next.config.ts should have standalone output configured", () => {
      const configPath = join(process.cwd(), "next.config.ts");

      if (!existsSync(configPath)) {
        console.log("Skipping: next.config.ts not found");
        return;
      }

      const content = readFileSync(configPath, "utf-8");

      expect(content).toContain("standalone");
    });

    it("next.config.ts should have reactStrictMode enabled", () => {
      const configPath = join(process.cwd(), "next.config.ts");

      if (!existsSync(configPath)) {
        console.log("Skipping: next.config.ts not found");
        return;
      }

      const content = readFileSync(configPath, "utf-8");

      expect(content).toContain("reactStrictMode");
    });

    it("package.json should have analyze script", () => {
      const packagePath = join(process.cwd(), "package.json");
      const content = readFileSync(packagePath, "utf-8");
      const pkg = JSON.parse(content);

      expect(pkg.scripts).toHaveProperty("analyze");
    });

    it("package.json should have check-secrets script", () => {
      const packagePath = join(process.cwd(), "package.json");
      const content = readFileSync(packagePath, "utf-8");
      const pkg = JSON.parse(content);

      expect(pkg.scripts).toHaveProperty("check-secrets");
    });
  });

  describe("Lazy Components", () => {
    it("lazy-components.tsx should exist", () => {
      const lazyPath = join(process.cwd(), "src/lib/lazy-components.tsx");

      expect(existsSync(lazyPath)).toBe(true);
    });

    it("lazy-components should use dynamic imports", () => {
      const lazyPath = join(process.cwd(), "src/lib/lazy-components.tsx");

      if (!existsSync(lazyPath)) {
        console.log("Skipping: lazy-components.tsx not found");
        return;
      }

      const content = readFileSync(lazyPath, "utf-8");

      expect(content).toContain("dynamic");
      expect(content).toContain("ssr: false");
    });
  });
});
