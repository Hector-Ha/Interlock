import { prisma } from "../db";

async function checkRecipient() {
  const email = "recipient@interlock.com";
  console.log(`Checking user: ${email}`);

  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      banks: true,
    },
  });

  if (!user) {
    console.log("User not found.");
    return;
  }

  console.log("User found:", user.id);
  console.log("Dwolla Customer ID:", user.dwollaCustomerId);
  console.log("Banks count:", user.banks.length);

  user.banks.forEach((bank, i) => {
    console.log(`Bank ${i + 1}:`);
    console.log("  ID:", bank.id);
    console.log("  Name:", bank.institutionName);
    console.log(
      "  Detail:",
      bank.dwollaFundingUrl ? "Linked to Dwolla" : "NOT Linked",
    );
  });
}

checkRecipient()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
