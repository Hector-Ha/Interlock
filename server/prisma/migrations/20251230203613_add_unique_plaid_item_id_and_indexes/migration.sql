/*
  Warnings:

  - A unique constraint covering the columns `[plaidItemId]` on the table `Bank` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,institutionId]` on the table `Bank` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "failedLoginAttempts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "lockedUntil" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "Bank_plaidItemId_key" ON "Bank"("plaidItemId");

-- CreateIndex
CREATE INDEX "Bank_userId_status_idx" ON "Bank"("userId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "Bank_userId_institutionId_key" ON "Bank"("userId", "institutionId");

-- CreateIndex
CREATE INDEX "Transaction_bankId_date_idx" ON "Transaction"("bankId", "date");

-- CreateIndex
CREATE INDEX "Transaction_status_idx" ON "Transaction"("status");
