import { prisma } from "@/db";
import { decrypt } from "@/utils/encryption";
import {
  createProcessorToken,
  plaidClient,
  getAccountsWithBalances,
} from "@/services/plaid.service";
import { config } from "@/config";
import {
  dwollaClient,
  ensureCustomer,
  addFundingSource,
  createTransfer,
} from "@/services/dwolla.service";
import { logger } from "@/middleware/logger";
import type { BankDetails, BankListItem } from "@/types/bank.types";

export const bankService = {
  async linkBankWithDwolla(userId: string, bankId: string, accountId: string) {
    const [user, bank] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId } }),
      prisma.bank.findFirst({ where: { id: bankId, userId } }),
    ]);

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
      bank.institutionName,
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

  async getBanks(userId: string): Promise<BankListItem[]> {
    const banks = await prisma.bank.findMany({
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

    return banks.map((bank) => ({
      ...bank,
      isDwollaLinked: !!bank.dwollaFundingUrl,
    }));
  },

  async getBankById(
    bankId: string,
    userId: string,
  ): Promise<BankDetails | null> {
    const bank = await prisma.bank.findFirst({
      where: { id: bankId, userId },
      select: {
        id: true,
        institutionId: true,
        institutionName: true,
        status: true,
        dwollaFundingUrl: true,
        createdAt: true,
        updatedAt: true,
        plaidAccessToken: true,
        transactions: {
          take: 5,
          orderBy: { date: "desc" },
          select: {
            id: true,
            amount: true,
            name: true,
            date: true,
            status: true,
          },
        },
      },
    });

    if (!bank) {
      return null;
    }

    const accessToken = decrypt(bank.plaidAccessToken);
    const accounts = await getEffectiveAccounts(bank.id, accessToken);

    return {
      ...bank,
      isDwollaLinked: !!bank.dwollaFundingUrl,
      transactions: bank.transactions.map((tx) => ({
        ...tx,
        amount: Number(tx.amount),
      })),
      accounts,
    };
  },

  async disconnectBank(bankId: string, userId: string): Promise<void> {
    const bank = await prisma.bank.findFirst({
      where: { id: bankId, userId },
    });

    if (!bank) {
      throw new Error("Bank not found");
    }

    // Remove from Plaid
    try {
      const accessToken = decrypt(bank.plaidAccessToken);
      await plaidClient.itemRemove({ access_token: accessToken });
      logger.info({ bankId }, "Successfully removed item from Plaid");
    } catch (error) {
      logger.warn({ err: error, bankId }, "Failed to remove item from Plaid");
    }

    // Remove from Dwolla
    if (bank.dwollaFundingUrl) {
      try {
        await dwollaClient.post(`${bank.dwollaFundingUrl}`, {
          removed: true,
        });
        logger.info(
          { bankId },
          "Successfully removed funding source from Dwolla",
        );
      } catch (error) {
        logger.warn(
          { err: error, bankId },
          "Failed to remove funding source from Dwolla",
        );
      }
    }

    // Remove from Database
    await prisma.bank.delete({
      where: { id: bankId },
    });

    logger.info({ bankId, userId }, "Bank disconnected successfully");
  },

  async initiateTransfer(
    userId: string,
    sourceBankId: string,
    destinationBankId: string,
    amount: number,
  ) {
    const [sourceBank, destBank] = await Promise.all([
      prisma.bank.findFirst({ where: { id: sourceBankId, userId } }),
      prisma.bank.findFirst({ where: { id: destinationBankId, userId } }),
    ]);

    if (!sourceBank || !destBank) {
      throw new Error("Source or destination bank not found");
    }

    if (!sourceBank.dwollaFundingUrl || !destBank.dwollaFundingUrl) {
      throw new Error(
        "Both banks must be linked with Dwolla before initiating transfer",
      );
    }

    if (sourceBank.dwollaFundingUrl === destBank.dwollaFundingUrl) {
      throw new Error("Cannot transfer between the same linked account");
    }

    // 1. Verify Balance with Plaid
    const accessToken = decrypt(sourceBank.plaidAccessToken);
    try {
      const accounts = await getEffectiveAccounts(sourceBank.id, accessToken);

      // Find the checking account (or use the first depository if no specific checking)
      const sourceAccount =
        accounts.find((acc) => acc.subtype === "checking") ||
        accounts.find((acc) => acc.type === "depository");

      if (sourceAccount && sourceAccount.balance.available !== null) {
        if (sourceAccount.balance.available < amount) {
          throw new Error(
            `Insufficient funds. Available balance: $${sourceAccount.balance.available}`,
          );
        }
      }
    } catch (error: any) {
      // If it's the insufficient funds error we just threw, rethrow it
      if (error.message.startsWith("Insufficient funds")) {
        throw error;
      }
      // Otherwise log warning but allow seeing if Dwolla handles it (optimistic)
      // or simplistic handling: just warn
      logger.warn(
        { err: error },
        "Failed to verify balance with Plaid before transfer",
      );
    }

    const { transferUrl, transferId } = await createTransfer(
      sourceBank.dwollaFundingUrl,
      destBank.dwollaFundingUrl,
      amount,
    );

    const [debitTx, creditTx] = await prisma.$transaction([
      prisma.transaction.create({
        data: {
          bankId: sourceBankId,
          amount,
          name: `Transfer to ${destBank.institutionName}`,
          date: new Date(),
          channel: "ACH",
          status: "PENDING",
          dwollaTransferId: transferId,
          type: "DEBIT",
        },
      }),
      prisma.transaction.create({
        data: {
          bankId: destinationBankId,
          amount,
          name: `Transfer from ${sourceBank.institutionName}`,
          date: new Date(),
          channel: "ACH",
          status: "PENDING",
          dwollaTransferId: `${transferId}_CREDIT`,
          type: "CREDIT",
        },
      }),
    ]);

    return {
      message: "Transfer initiated",
      transferId,
      transactionId: debitTx.id,
    };
  },
};

export async function getEffectiveAccounts(
  bankId: string,
  accessToken: string,
) {
  const isSandbox = config.plaid.env === "sandbox";

  const [accounts, pendingTransactions] = await Promise.all([
    getAccountsWithBalances(accessToken),
    isSandbox
      ? prisma.transaction.findMany({
          where: {
            bankId,
            dwollaTransferId: { not: null },
            status: { in: ["PENDING", "SUCCESS"] },
          },
        })
      : Promise.resolve([]),
  ]);

  let debits = 0;
  let credits = 0;
  for (const tx of pendingTransactions) {
    const amount = Number(tx.amount);
    if (tx.type === "DEBIT") {
      debits += amount;
    } else if (tx.type === "CREDIT") {
      credits += amount;
    }
  }

  // Find checking account or first account
  const checkingAccount =
    accounts.find((a: any) => a.subtype === "checking") ||
    accounts.find((a: any) => a.type === "depository") ||
    accounts[0];

  if (checkingAccount && checkingAccount.balance.available !== null) {
    checkingAccount.balance.available =
      checkingAccount.balance.available - debits + credits;
    if (checkingAccount.balance.current !== null) {
      checkingAccount.balance.current =
        checkingAccount.balance.current - debits + credits;
    }
  }

  return accounts;
}
