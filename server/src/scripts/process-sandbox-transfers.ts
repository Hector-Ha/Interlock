import dotenv from "dotenv";
import path from "path";

// Load environment variables from .env
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

import { prisma } from "../db";
import {
  simulateSandboxProcessing,
  getTransfer,
} from "../services/dwolla.service";

async function main() {
  console.log("⏳ Simulating Dwolla Sandbox Processing...");

  try {
    // 1. Trigger Simulation
    const result = await simulateSandboxProcessing();
    console.log("✅ Simulation triggered successfully!");

    // 2. Wait a moment for Dwolla to process internally
    console.log("⏳ Waiting 2 seconds for processing to propagate...");
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // 3. Sync Pending Transactions
    console.log("🔄 Syncing pending transaction statuses...");
    const pendingTransactions = await prisma.transaction.findMany({
      where: {
        status: "PENDING",
        dwollaTransferId: { not: null },
      },
      include: {
        bank: { include: { user: true } },
        sender: true,
        recipient: true,
      },
    });

    console.log(
      `Found ${pendingTransactions.length} pending transactions to check.`,
    );

    let updatedCount = 0;

    for (const tx of pendingTransactions) {
      if (!tx.dwollaTransferId) continue;

      // Identify who this transaction belongs to
      let ownerName = "Unknown";
      if (tx.bank?.user) {
        ownerName = `${tx.bank.user.firstName} ${tx.bank.user.lastName}`;
      }

      console.log(`\n🔎 Checking Tx ${tx.id} for ${ownerName}`);
      console.log(`   Amount: ${tx.amount} | Type: ${tx.type}`);
      console.log(`   Transfer ID: ${tx.dwollaTransferId}`);

      try {
        // Strip _CREDIT suffix if present to get base transfer ID
        const isCredit = tx.dwollaTransferId.endsWith("_CREDIT");
        const baseTransferId = isCredit
          ? tx.dwollaTransferId.replace("_CREDIT", "")
          : tx.dwollaTransferId;

        const dwollaTransfer = await getTransfer(baseTransferId);
        const dwollaStatus = dwollaTransfer.status; // processed, pending, failed, cancelled

        let newStatus:
          | "SUCCESS"
          | "FAILED"
          | "PENDING"
          | "RETURNED"
          | "CANCELLED"
          | null = null;

        switch (dwollaStatus) {
          case "processed":
            newStatus = "SUCCESS";
            break;
          case "failed":
            newStatus = "FAILED";
            break;
          case "cancelled":
            newStatus = "CANCELLED";
            break;
        }

        if (newStatus && newStatus !== tx.status) {
          await prisma.transaction.update({
            where: { id: tx.id },
            data: { status: newStatus as any },
          });
          console.log(
            `   ✅ Updated Status: ${tx.status} -> ${newStatus} (Dwolla: ${dwollaStatus})`,
          );
          updatedCount++;
        } else {
          console.log(
            `   (No status change. Current: ${tx.status}, Dwolla: ${dwollaStatus})`,
          );
        }
      } catch (err: any) {
        console.error(`   ⚠️ Failed to check transfer:`, err.message);
      }
    }

    console.log(`\n🎉 Sync Complete. Updated ${updatedCount} transactions.`);
    console.log(
      "All pending sandbox transfers should now be 'processed' and reflected in your database.",
    );
    console.log(
      "You may need to run this twice if moving funds between two banks (once for debit, once for credit).",
    );
  } catch (error: any) {
    console.error(
      "❌ Error simulating processing:",
      error.body || error.message,
    );
    process.exit(1);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
