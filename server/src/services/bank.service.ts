import { prisma } from "@/db";
import { decrypt } from "@/utils/encryption";
import { createProcessorToken } from "@/services/plaid.service";
import {
  ensureCustomer,
  addFundingSource,
  createTransfer,
} from "@/services/dwolla.service";

export const bankService = {
  async linkBankWithDwolla(userId: string, bankId: string, accountId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const bank = await prisma.bank.findFirst({
      where: { id: bankId, userId },
    });

    if (!user || !bank) {
      throw new Error("User or bank not found");
    }

    if (bank.dwollaFundingUrl) {
      return {
        message: "Bank already linked with Dwolla",
        fundingSourceUrl: bank.dwollaFundingUrl,
      };
    }

    const { customerUrl } = await ensureCustomer(user);

    const accessToken = decrypt(bank.plaidAccessToken);
    const processorToken = await createProcessorToken(accessToken, accountId);

    const fundingSourceUrl = await addFundingSource(
      customerUrl,
      processorToken,
      bank.institutionName
    );

    await prisma.bank.update({
      where: { id: bankId },
      data: { dwollaFundingUrl: fundingSourceUrl },
    });

    return {
      message: "Bank linked with Dwolla successfully",
      fundingSourceUrl,
    };
  },

  async getBanks(userId: string) {
    return prisma.bank.findMany({
      where: { userId },
      select: {
        id: true,
        institutionId: true,
        institutionName: true,
        status: true,
        dwollaFundingUrl: true,
        createdAt: true,
      },
    });
  },

  async initiateTransfer(
    userId: string,
    sourceBankId: string,
    destinationBankId: string,
    amount: number
  ) {
    const sourceBank = await prisma.bank.findFirst({
      where: { id: sourceBankId, userId },
    });
    const destBank = await prisma.bank.findFirst({
      where: { id: destinationBankId, userId },
    });

    if (!sourceBank || !destBank) {
      throw new Error("Source or destination bank not found");
    }

    if (!sourceBank.dwollaFundingUrl || !destBank.dwollaFundingUrl) {
      throw new Error(
        "Both banks must be linked with Dwolla before initiating transfer"
      );
    }

    const { transferUrl, transferId } = await createTransfer(
      sourceBank.dwollaFundingUrl,
      destBank.dwollaFundingUrl,
      amount
    );

    const transaction = await prisma.transaction.create({
      data: {
        bankId: sourceBankId,
        amount,
        name: `Transfer to ${destBank.institutionName}`,
        date: new Date(),
        channel: "ACH",
        status: "PENDING",
        dwollaTransferId: transferId,
      },
    });

    return {
      message: "Transfer initiated",
      transferId,
      transactionId: transaction.id,
    };
  },
};
