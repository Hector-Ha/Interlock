import "dotenv/config";
import { prisma } from "../db";
import { bankService } from "../services/bank.service";

async function main() {
  const user = await prisma.user.findUnique({
    where: { email: "test@interlock.com" },
    include: { banks: true },
  });

  if (!user || user.banks.length < 2) {
    console.log("User or banks not sufficient for test");
    return;
  }

  const sourceBank = user.banks[0];
  const destBank = user.banks[1];

  console.log(
    `Attempting transfer from ${sourceBank.institutionName} to ${destBank.institutionName}`
  );
  console.log(`Source Funding: ${sourceBank.dwollaFundingUrl}`);
  console.log(`Dest Funding: ${destBank.dwollaFundingUrl}`);

  try {
    const result = await bankService.initiateTransfer(
      user.id,
      sourceBank.id,
      destBank.id,
      10.0
    );
    console.log("Transfer Success:", result);
  } catch (error: any) {
    console.error("Transfer Failed!");
    console.error("Error Message:", error.message);
    if (error.body) {
      console.error("Dwolla Error Body:", JSON.stringify(error.body, null, 2));
    }
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
