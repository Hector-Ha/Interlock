#!/usr/bin/env bun
/**
 * Bundle Security Scanner
 *
 * Scans the Next.js build output for accidentally bundled secrets.
 * Run after `bun run build` to verify no sensitive data leaked to client.
 *
 * Usage: bun run scripts/check-bundle-secrets.ts
 */

import { readFileSync, readdirSync, existsSync } from "fs";
import { join } from "path";

const BUILD_DIR = ".next/static";

// Patterns that should NEVER appear in client bundles
const SECRET_PATTERNS = [
  { pattern: /PLAID_SECRET/i, name: "PLAID_SECRET" },
  { pattern: /DWOLLA_SECRET/i, name: "DWOLLA_SECRET" },
  { pattern: /JWT_SECRET/i, name: "JWT_SECRET" },
  { pattern: /DATABASE_URL/i, name: "DATABASE_URL" },
  { pattern: /ENCRYPTION_KEY/i, name: "ENCRYPTION_KEY" },
  { pattern: /SENDGRID_API_KEY/i, name: "SENDGRID_API_KEY" },
  { pattern: /sk_[a-zA-Z0-9]{20,}/, name: "Stripe-like secret key" },
  {
    pattern: /postgres(ql)?:\/\/[^"'\s]+:[^"'\s]+@/i,
    name: "Database connection string",
  },
];

interface Issue {
  file: string;
  pattern: string;
}

function checkFile(filePath: string): Issue[] {
  const issues: Issue[] = [];

  try {
    const content = readFileSync(filePath, "utf-8");

    for (const { pattern, name } of SECRET_PATTERNS) {
      if (pattern.test(content)) {
        issues.push({
          file: filePath,
          pattern: name,
        });
      }
    }
  } catch {
    // File couldn't be read, skip it
  }

  return issues;
}

function scanDirectory(dir: string): Issue[] {
  const issues: Issue[] = [];

  if (!existsSync(dir)) {
    return issues;
  }

  try {
    const entries = readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const path = join(dir, entry.name);

      if (entry.isDirectory()) {
        issues.push(...scanDirectory(path));
      } else if (entry.name.endsWith(".js") || entry.name.endsWith(".mjs")) {
        issues.push(...checkFile(path));
      }
    }
  } catch {
    // Directory couldn't be read
  }

  return issues;
}

// Main execution
console.log("🔍 Scanning client bundle for secrets...\n");

if (!existsSync(BUILD_DIR)) {
  console.log("⚠️  No build directory found at", BUILD_DIR);
  console.log("   Run 'bun run build' first, then re-run this script.");
  process.exit(0);
}

const issues = scanDirectory(BUILD_DIR);

if (issues.length > 0) {
  console.error(
    "❌ SECURITY ALERT: Potential secrets found in client bundle!\n",
  );

  for (const issue of issues) {
    console.error(`  📁 ${issue.file}`);
    console.error(`     Pattern: ${issue.pattern}\n`);
  }

  console.error("\n⚠️  These secrets should NOT be in the client bundle.");
  console.error(
    "   Check that you're using NEXT_PUBLIC_ prefix only for public values.",
  );
  console.error(
    "   Server-only secrets must never be imported in client code.\n",
  );

  process.exit(1);
} else {
  console.log("✅ No secrets found in client bundle");
  console.log(`   Scanned: ${BUILD_DIR}`);
  process.exit(0);
}
