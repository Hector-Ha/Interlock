import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(process.cwd(), ".env") });
import { prisma } from "../db";

async function verifyP2PTransfers() {
  console.log("🔍 Verifying P2P Transfers...");

  const p2pTransactions = await prisma.transaction.findMany({
    where: {
      type: "P2P_SENT",
    },
    include: {
      sender: { select: { email: true } },
      recipient: { select: { email: true } },
      bank: { select: { institutionName: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  if (p2pTransactions.length === 0) {
    console.log("❌ No P2P transfers found.");
    return;
  }

  console.log(`✅ Found ${p2pTransactions.length} recent P2P transfers:\n`);

  p2pTransactions.forEach((tx) => {
    const statusIcon =
      tx.status === "SUCCESS" ? "✅" : tx.status === "PENDING" ? "⏳" : "❌";
    console.log(`${statusIcon} [${tx.status}] ${tx.amount} USD`);
    console.log(`   From: ${tx.sender?.email}`);
    console.log(`   To:   ${tx.recipient?.email}`);
    console.log(`   Bank: ${tx.bank.institutionName}`);
    console.log(`   Date: ${tx.createdAt.toISOString()}`);
    console.log("------------------------------------------------");
  });
}

verifyP2PTransfers()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
