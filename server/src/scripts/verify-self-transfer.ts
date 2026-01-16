import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(process.cwd(), ".env") });
import { prisma } from "../db";

async function verifySelfTransfers() {
  console.log("🔍 Verifying Self-Transfers (Between Own Accounts)...");

  // In the current schema, internal transfers might be marked as 'INTERNAL'
  // or simply derived from having 'destinationBankId' without a recipientId change.
  // We'll check for type 'INTERNAL' first as defined in the enum.

  // Fetch INTERNAL, DEBIT, and CREDIT to find linked transfers
  const rawTransfers = await prisma.transaction.findMany({
    where: {
      type: { in: ["INTERNAL", "DEBIT", "CREDIT"] },
    },
    include: {
      bank: {
        include: { user: { select: { id: true, email: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 50, // Grab enough to find pairs
  });

  // Group by base Dwolla ID (remove _CREDIT suffix)
  const transferGroups = new Map<string, typeof rawTransfers>();

  for (const tx of rawTransfers) {
    if (!tx.dwollaTransferId) continue;
    const baseId = tx.dwollaTransferId.replace("_CREDIT", "");

    if (!transferGroups.has(baseId)) {
      transferGroups.set(baseId, []);
    }
    transferGroups.get(baseId)?.push(tx);
  }

  // Filter for valid self-transfers:
  // 1. Explicit INTERNAL type
  // 2. Groups with > 1 transaction where ALL belong to the same user
  const selfTransfers: Array<{
    id: string;
    txs: typeof rawTransfers;
    userEmail: string;
    totalAmount: string;
  }> = [];

  for (const [id, txs] of transferGroups.entries()) {
    // Check if explicitly internal
    const isExplicitInternal = txs.some((t) => t.type === "INTERNAL");

    // Check if implicit self-transfer (all banks belong to same user)
    const distinctUsers = new Set(txs.map((t) => t.bank.user.email));
    const isSameUser = distinctUsers.size === 1;

    if (isExplicitInternal || (txs.length > 1 && isSameUser)) {
      selfTransfers.push({
        id,
        txs: txs.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime()),
        userEmail: txs[0].bank.user.email,
        totalAmount: txs[0].amount.toString(), // Roughly taking the first one
      });
    }
  }

  if (selfTransfers.length === 0) {
    console.log("❌ No Self-transfers found.");
    return;
  }

  console.log(
    `✅ Found ${selfTransfers.length} recent Self-transfers (Grouped):\n`,
  );

  selfTransfers.forEach((group) => {
    console.log(`🔄 Transfer Group: ${group.id}`);
    console.log(`   User: ${group.userEmail}`);
    console.log(`   Amount: $${group.totalAmount} USD`);

    group.txs.forEach((tx) => {
      const statusIcon =
        tx.status === "SUCCESS" ? "✅" : tx.status === "PENDING" ? "⏳" : "❌";
      console.log(
        `   -> ${statusIcon} [${tx.type}] ${tx.amount} USD (${tx.bankId})`,
      );
    });
    console.log("------------------------------------------------");
  });
}

verifySelfTransfers()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
