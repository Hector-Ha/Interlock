import "dotenv/config";
import { prisma } from "../db";
import { decrypt } from "../utils/encryption";
import { plaidClient } from "../services/plaid.service";

async function main() {
  const userEmail = "test@interlock.com";

  const user = await prisma.user.findUnique({
    where: { email: userEmail },
    include: { banks: true },
  });

  if (!user) {
    console.log("User not found");
    return;
  }

  console.log(`Checking balances for user: ${user.firstName} ${user.lastName}`);
  console.log(`Found ${user.banks.length} banks.`);

  let totalBalance = 0;

  for (const bank of user.banks) {
    try {
      const accessToken = decrypt(bank.plaidAccessToken);
      const response = await plaidClient.accountsBalanceGet({
        access_token: accessToken,
      });

      const accounts = response.data.accounts;
      console.log(`\nBank: ${bank.institutionName} (ID: ${bank.id})`);

      let bankTotal = 0;
      for (const acc of accounts) {
        const balance = acc.balances.available ?? acc.balances.current ?? 0;
        bankTotal += balance;
        console.log(`  - Account: ${acc.name} (${acc.type}): $${balance}`);
      }
      console.log(`  > Bank Total: $${bankTotal}`);
      totalBalance += bankTotal;
    } catch (error: any) {
      console.error(
        `Failed to fetch balance for bank ${bank.institutionName}:`,
        error?.response?.data || error.message
      );
    }
  }

  console.log(`\n================================`);
  console.log(`GRAND TOTAL: $${totalBalance}`);
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
