import { prisma } from "../db";

async function checkUserLock(email: string) {
  console.log(`\n🔍 Checking lock status for: ${email}`);

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    console.log(`❌ User not found`);
    return;
  }

  console.log(`   ID: ${user.id}`);
  console.log(`   Failed Attempts: ${user.failedLoginAttempts}`);

  if (user.lockedUntil) {
    console.log(`   🔒 STATUS: LOCKED until ${user.lockedUntil.toISOString()}`);

    // Check if lock is still active
    if (new Date() < user.lockedUntil) {
      console.log(`      (Account is currently locked)`);
    } else {
      console.log(`      (Lock has expired, account should be accessible)`);
    }
  } else {
    console.log(`   ✅ STATUS: ACTIVE (Not Locked)`);
  }
}

async function main() {
  const targetEmails = ["test@interlock.com", "recipient@interlock.com"];

  console.log("========================================");
  for (const email of targetEmails) {
    await checkUserLock(email);
  }
  console.log("\n========================================");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
