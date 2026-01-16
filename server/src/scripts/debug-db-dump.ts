import { prisma } from "../db";
import fs from "fs";
import path from "path";

async function main() {
  console.log("🔍 Dumping DB Users and Banks...");

  const users = await prisma.user.findMany({
    include: {
      banks: true,
    },
  });

  const output: any[] = [];

  for (const user of users) {
    const userData: any = {
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      dwollaCustomerUrl: user.dwollaCustomerUrl,
      banks: [],
    };

    for (const bank of user.banks) {
      userData.banks.push({
        name: bank.institutionName,
        id: bank.id,
        dwollaFundingUrl: bank.dwollaFundingUrl,
        status: bank.status,
      });
    }
    output.push(userData);
  }

  const outputPath = path.join(process.cwd(), "debug_result.json");
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
  console.log(`Debug dump written to ${outputPath}`);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
