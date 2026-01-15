import "dotenv/config";
import { prisma } from "../db";
import { decrypt } from "../utils/encryption";
import { plaidClient } from "../services/plaid.service";

// This script mirrors check-balances.ts but is separate if we need distinct logic later.
// For now, updating it to support multiple test users and verbose logging.

async function checkUserBalances(email: string) {
  console.log(`\n🔍 Checking balances for user: ${email}`);

  const user = await prisma.user.findUnique({
    where: { email },
    include: { banks: true },
  });

  if (!user) {
    console.log(`❌ User not found: ${email}`);
    return 0;
  }

  console.log(`👤 User: ${user.firstName} ${user.lastName} (ID: ${user.id})`);
  console.log(`🏦 Banks Found: ${user.banks.length}`);

  let totalUserBalance = 0;

  for (const bank of user.banks) {
    console.log(`\n  🏦 Institution: ${bank.institutionName} (ID: ${bank.id})`);

    try {
      const accessToken = decrypt(bank.plaidAccessToken);
      const response = await plaidClient.accountsBalanceGet({
        access_token: accessToken,
      });

      const accounts = response.data.accounts;
      let bankTotal = 0;

      for (const acc of accounts) {
        const balance = acc.balances.available ?? acc.balances.current ?? 0;
        bankTotal += balance;
        console.log(`     - Account: ${acc.name} (${acc.type})`);
        console.log(`       Balance: $${balance}`);
      }
      console.log(`     > Bank Total: $${bankTotal}`);
      totalUserBalance += bankTotal;
    } catch (error: any) {
      console.error(
        `     ❌ Failed to fetch balance for bank ${bank.institutionName}:`,
        error?.response?.data || error.message,
      );
    }
  }

  console.log(`  💰 User Total: $${totalUserBalance}`);
  return totalUserBalance;
}

async function main() {
  const targetEmails = ["test@interlock.com", "recipient@interlock.com"];
  let grandTotal = 0;

  for (const email of targetEmails) {
    grandTotal += await checkUserBalances(email);
  }

  console.log(`\n================================`);
  console.log(`GRAND TOTAL: $${grandTotal}`);
  console.log(`================================`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
