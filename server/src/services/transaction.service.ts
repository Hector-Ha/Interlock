import { prisma } from "@/db";
import { plaidClient } from "./plaid.service";
import { decrypt } from "@/utils/encryption";
import { logger } from "@/middleware/logger";
import pLimit from "p-limit";
import type {
  SyncResult,
  TransactionFilters,
  PaginationParams,
} from "@/types/transaction.types";

/**
 * Syncs transactions from Plaid using the Sync API.
 * Handles pagination automatically and stores results in database.
 */
export const syncTransactions = async (bankId: string): Promise<SyncResult> => {
  const bank = await prisma.bank.findUnique({ where: { id: bankId } });

  if (!bank) {
    throw new Error("Bank not found");
  }

  const accessToken = decrypt(bank.plaidAccessToken);

  let cursor = bank.transactionsCursor || undefined;
  let hasMore = true;
  let added = 0;
  let modified = 0;
  let removed = 0;

  /* concurrency limit for parallel processing */
  const limit = pLimit(10);

  while (hasMore) {
    const response = await plaidClient.transactionsSync({
      access_token: accessToken,
      cursor,
      count: 100,
    });

    const { added: newTx, modified: modTx, removed: remTx } = response.data;

    await Promise.all([
      // Process added transactions in parallel
      ...newTx.map((tx) =>
        limit(async () => {
          await prisma.transaction.upsert({
            where: { plaidTransactionId: tx.transaction_id },
            create: {
              bankId,
              plaidTransactionId: tx.transaction_id,
              amount: Math.abs(tx.amount),
              name: tx.name || "Unknown",
              merchantName: tx.merchant_name,
              date: new Date(tx.date),
              channel: tx.payment_channel,
              category: tx.personal_finance_category?.primary || null,
              status: tx.pending ? "PENDING" : "SUCCESS",
              pending: tx.pending,
            },
            update: {
              amount: Math.abs(tx.amount),
              name: tx.name || "Unknown",
              merchantName: tx.merchant_name,
              status: tx.pending ? "PENDING" : "SUCCESS",
              pending: tx.pending,
              category: tx.personal_finance_category?.primary || null,
            },
          });
          added++;
        }),
      ),

      // Process modified transactions in parallel
      ...modTx.map((tx) =>
        limit(async () => {
          const existing = await prisma.transaction.findFirst({
            where: { plaidTransactionId: tx.transaction_id },
          });

          if (existing) {
            await prisma.transaction.update({
              where: { id: existing.id },
              data: {
                amount: Math.abs(tx.amount),
                name: tx.name || "Unknown",
                merchantName: tx.merchant_name,
                status: tx.pending ? "PENDING" : "SUCCESS",
                pending: tx.pending,
              },
            });
            modified++;
          }
        }),
      ),

      // Process removed transactions in parallel
      ...remTx.map((tx) =>
        limit(async () => {
          if (tx.transaction_id) {
            await prisma.transaction.deleteMany({
              where: { plaidTransactionId: tx.transaction_id },
            });
            removed++;
          }
        }),
      ),
    ]);

    hasMore = response.data.has_more;
    cursor = response.data.next_cursor;
  }

  // Save cursor for next sync
  await prisma.bank.update({
    where: { id: bankId },
    data: { transactionsCursor: cursor },
  });

  logger.info(
    { bankId, added, modified, removed },
    "Transaction sync completed",
  );

  return { added, modified, removed, hasMore: false };
};

/**
 * Retrieves transactions with filtering and pagination.
 */
export const getTransactions = async (
  bankId: string,
  filters: TransactionFilters,
  pagination: PaginationParams,
) => {
  const where: Record<string, unknown> = { bankId };

  // Apply filters
  if (filters.startDate || filters.endDate) {
    where.date = {};
    if (filters.startDate) {
      (where.date as Record<string, Date>).gte = filters.startDate;
    }
    if (filters.endDate) {
      (where.date as Record<string, Date>).lte = filters.endDate;
    }
  }

  if (filters.category) {
    where.category = filters.category;
  }

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.minAmount !== undefined || filters.maxAmount !== undefined) {
    where.amount = {};
    if (filters.minAmount !== undefined) {
      (where.amount as Record<string, number>).gte = filters.minAmount;
    }
    if (filters.maxAmount !== undefined) {
      (where.amount as Record<string, number>).lte = filters.maxAmount;
    }
  }

  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      orderBy: { date: "desc" },
      take: pagination.limit,
      skip: pagination.offset,
      select: {
        id: true,
        amount: true,
        name: true,
        merchantName: true,
        date: true,
        status: true,
        category: true,
        channel: true,
        pending: true,
      },
    }),
    prisma.transaction.count({ where }),
  ]);

  return {
    data: transactions.map((tx) => ({
      ...tx,
      amount: Number(tx.amount),
    })),
    pagination: {
      total,
      limit: pagination.limit,
      offset: pagination.offset,
      hasMore: pagination.offset + transactions.length < total,
    },
  };
};

/**
 * Gets a single transaction by ID.
 */
export const getTransactionById = async (
  transactionId: string,
  userId: string,
) => {
  const transaction = await prisma.transaction.findFirst({
    where: { id: transactionId },
    include: {
      bank: {
        select: {
          userId: true,
          institutionName: true,
        },
      },
    },
  });

  if (!transaction || transaction.bank.userId !== userId) {
    return null;
  }

  return {
    id: transaction.id,
    amount: Number(transaction.amount),
    name: transaction.name,
    merchantName: transaction.merchantName,
    date: transaction.date,
    status: transaction.status,
    category: transaction.category,
    channel: transaction.channel,
    pending: transaction.pending,
    institutionName: transaction.bank.institutionName,
    createdAt: transaction.createdAt,
  };
};
