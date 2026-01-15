import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(process.cwd(), ".env") });
import { prisma } from "../db";

async function verifySelfTransfers() {
  console.log("🔍 Verifying Self-Transfers (Between Own Accounts)...");

  // In the current schema, internal transfers might be marked as 'INTERNAL'
  // or simply derived from having 'destinationBankId' without a recipientId change.
  // We'll check for type 'INTERNAL' first as defined in the enum.

  const selfTransfers = await prisma.transaction.findMany({
    where: {
      type: "INTERNAL",
    },
    include: {
      // Wait, Transaction relates to 'bank'. Bank relates to 'user'.
      // Relation is: Transaction -> Bank -> User.
      bank: {
        include: { user: { select: { email: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  if (selfTransfers.length === 0) {
    console.log("❌ No Self-transfers found.");

    // Fallback: Check for transactions mimicking internal transfer behavior just in case
    // For now, adhere strictly to schema enum `INTERNAL`.
    return;
  }

  console.log(`✅ Found ${selfTransfers.length} recent Self-transfers:\n`);

  selfTransfers.forEach((tx) => {
    const statusIcon =
      tx.status === "SUCCESS" ? "✅" : tx.status === "PENDING" ? "⏳" : "❌";
    console.log(`${statusIcon} [${tx.status}] ${tx.amount} USD`);
    console.log(`   User: ${tx.bank.user.email}`);
    console.log(`   Date: ${tx.createdAt.toISOString()}`);
    console.log("------------------------------------------------");
  });
}

verifySelfTransfers()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
