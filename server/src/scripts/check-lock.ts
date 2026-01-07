import { prisma } from "../db";

async function verify() {
  const email = "test@interlock.com";

  // Check user
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    console.log("User not found");
    return;
  }

  console.log("User found:", user.id);

  // Check account lock
  if (user.lockedUntil) {
    console.log("Account is LOCKED until:", user.lockedUntil);
  } else {
    console.log("Account is NOT locked");
  }

  console.log("Failed attempts:", user.failedLoginAttempts);
}

verify()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
