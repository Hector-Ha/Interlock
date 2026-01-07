import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(process.cwd(), ".env") });
import { prisma } from "../db";

async function main() {
  const transactions = await prisma.transaction.findMany({
    orderBy: { date: "desc" },
  });
  console.log("DB Transactions:", JSON.stringify(transactions, null, 2));
}

main();
