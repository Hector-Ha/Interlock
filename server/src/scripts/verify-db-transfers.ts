import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(process.cwd(), ".env") });
import { prisma } from "../db";

async function main() {
  console.log("🔍 Fetching DB Transactions...");

  const transactions = await prisma.transaction.findMany({
    orderBy: { date: "desc" },
    include: {
      sender: { select: { email: true, firstName: true, lastName: true } },
      recipient: { select: { email: true, firstName: true, lastName: true } },
      bank: {
        select: {
          institutionName: true,
          user: { select: { email: true } },
        },
      },
    },
    take: 20, // Limit to recent 20 to avoid spamming
  });

  if (transactions.length === 0) {
    console.log("❌ No transactions found.");
    return;
  }

  console.log(`✅ Found ${transactions.length} recent transactions:\n`);

  transactions.forEach((tx) => {
    let description = `Type: ${tx.type}`;
    if (tx.sender) description += ` | From: ${tx.sender.email}`;
    if (tx.recipient) description += ` | To: ${tx.recipient.email}`;
    // If it's a bank transaction, show the bank owner
    if (!tx.sender && !tx.recipient && tx.bank?.user) {
      description += ` | User: ${tx.bank.user.email} (${tx.bank.institutionName})`;
    }

    console.log(`[${tx.status}] $${tx.amount} USD | ${description}`);
    console.log(`   ID: ${tx.id}`);
    console.log(`   Dwolla ID: ${tx.dwollaTransferId || "N/A"}`);
    console.log(`   Date: ${tx.date.toISOString()}`);
    console.log(
      "----------------------------------------------------------------",
    );
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
