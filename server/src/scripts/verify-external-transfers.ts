import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(process.cwd(), ".env") });
import { prisma } from "../db";
import { dwollaClient } from "../services/dwolla.service";

async function verifyExternalTransfers() {
  console.log("🔍 Verifying External Transfer Status (Dwolla API)...");

  // Fetch recent P2P transfers with a Dwolla Transfer ID
  const p2pTransactions = await prisma.transaction.findMany({
    where: {
      type: "P2P_SENT",
      dwollaTransferId: { not: null },
    },
    take: 3,
    orderBy: { createdAt: "desc" },
  });

  if (p2pTransactions.length === 0) {
    console.log("❌ No P2P transfers with Dwolla IDs found in DB.");
    return;
  }

  console.log(
    `Checking ${p2pTransactions.length} recent transfers against Dwolla API...\n`,
  );

  for (const tx of p2pTransactions) {
    console.log(`🆔 Transaction ID: ${tx.id}`);
    console.log(`   Dwolla ID:    ${tx.dwollaTransferId}`);

    try {
      // Use the dwollaClient to fetch the transfer URL
      // The stored dwollaTransferId is likely just the UUID or the full URL.
      // If it's a UUID, we need to construct the URL or try to fetch it.
      // The SDK usually takes the full URL for .get().

      let transferUrl = tx.dwollaTransferId;
      if (!transferUrl?.startsWith("http")) {
        // Assuming it's just the ID, construct the sandbox URL
        transferUrl = `https://api-sandbox.dwolla.com/transfers/${tx.dwollaTransferId}`;
      }

      const res = await dwollaClient.get(transferUrl!);

      const status = res.body.status;
      const amount = res.body.amount.value;

      const statusIcon =
        status === "processed" ? "✅" : status === "pending" ? "⏳" : "❌";

      console.log(`   Dwolla Status: ${statusIcon} [${status.toUpperCase()}]`);
      console.log(`   Dwolla Amount: $${amount}`);

      // Check Plaid implication
      console.log(
        `   Plaid Status:  ⚠️  (Not visible in Sandbox Transaction History per Plaid limits)`,
      );
    } catch (error: any) {
      console.log(
        `   ❌ Dwolla Error: ${error?.message || JSON.stringify(error)}`,
      );
    }
    console.log("------------------------------------------------");
  }
}

verifyExternalTransfers()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
