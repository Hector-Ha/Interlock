import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(process.cwd(), ".env") });
import { prisma } from "../db";

async function main() {
  const user = await prisma.user.findFirst({
    where: { email: "test@interlock.com" }, // Assuming this is the test user
  });
  console.log("User Record:", JSON.stringify(user, null, 2));
}

main();
