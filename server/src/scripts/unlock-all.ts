import { prisma } from "../db";

async function unlockAll() {
  console.log("🔓 Checking for locked accounts...");

  // Find currently locked users
  const lockedUsers = await prisma.user.findMany({
    where: {
      OR: [{ lockedUntil: { not: null } }, { failedLoginAttempts: { gt: 0 } }],
    },
  });

  if (lockedUsers.length === 0) {
    console.log("✅ No locked users found.");
    return;
  }

  console.log(
    `Found ${lockedUsers.length} users with locks or failed attempts:`,
  );
  lockedUsers.forEach((u) => {
    console.log(
      ` - ${u.email} (Attempts: ${u.failedLoginAttempts}, Locked Until: ${u.lockedUntil})`,
    );
  });

  const result = await prisma.user.updateMany({
    where: {
      id: { in: lockedUsers.map((u) => u.id) },
    },
    data: {
      failedLoginAttempts: 0,
      lockedUntil: null,
    },
  });

  console.log(`✅ Unlocked/Reset ${result.count} accounts.`);
}

unlockAll()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
