import { prisma } from "../db";

async function unlockAll() {
  console.log("🔓 Unlocking all accounts...");

  const result = await prisma.user.updateMany({
    data: {
      failedLoginAttempts: 0,
      lockedUntil: null,
    },
  });

  console.log(`✅ Unlocked ${result.count} accounts.`);
}

unlockAll()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
