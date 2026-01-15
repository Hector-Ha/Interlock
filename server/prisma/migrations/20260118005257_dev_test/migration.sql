-- CreateIndex
CREATE INDEX "Transaction_senderId_createdAt_idx" ON "Transaction"("senderId", "createdAt");

-- CreateIndex
CREATE INDEX "Transaction_recipientId_createdAt_idx" ON "Transaction"("recipientId", "createdAt");
