-- CreateEnum
CREATE TYPE "TxType" AS ENUM ('DEBIT', 'CREDIT');

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "type" "TxType" NOT NULL DEFAULT 'DEBIT';
