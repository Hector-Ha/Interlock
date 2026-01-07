import { prisma } from "../db";
import bcrypt from "bcryptjs";

async function verify() {
  const email = "test@interlock.com";
  const password = "password123";

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    console.log("User not found");
    return;
  }

  console.log("User found:", user.id);
  console.log("Current Hash:", user.passwordHash);

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  console.log("Password match:", isMatch);
}

verify()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
