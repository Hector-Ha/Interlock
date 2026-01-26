import { prisma } from "@/db";
import { dwollaClient } from "@/services/dwolla.service";
import { logger } from "@/middleware/logger";
import type { TransferDetails, TransferListItem } from "@/types/transfer.types";

// Gets a transfer by ID with full details.
export const getTransferById = async (
  transferId: string,
  userId: string,
): Promise<TransferDetails | null> => {
  const transfer = await prisma.transaction.findFirst({
    where: {
      id: transferId,
      dwollaTransferId: { not: null },
    },
    include: {
      bank: {
        select: {
          id: true,
          userId: true,
          institutionName: true,
        },
      },
    },
  });

  if (!transfer || transfer.bank.userId !== userId) {
    return null;
  }

  return {
    id: transfer.id,
    amount: Number(transfer.amount),
    status: transfer.status,
    sourceBank: {
      id: transfer.bank.id,
      institutionName: transfer.bank.institutionName,
    },
    destinationBank: {
      // TODO: Add destinationBankId to Transaction schema for proper bank tracking
      id: "",
      institutionName: transfer.name.replace("Transfer to ", ""),
    },
    dwollaTransferId: transfer.dwollaTransferId,
    createdAt: transfer.createdAt,
    updatedAt: transfer.updatedAt,
  };
};

// Gets user's transfer history with pagination.
export const getTransfers = async (
  userId: string,
  filters: {
    status?: string;
    startDate?: Date;
    endDate?: Date;
    search?: string;
    sortBy?: "date_desc" | "date_asc" | "amount_desc" | "amount_asc";
  },
  pagination: { limit: number; offset: number },
): Promise<{
  data: TransferListItem[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}> => {
  const userBanks = await prisma.bank.findMany({
    where: { userId },
    select: { id: true },
  });

  const bankIds = userBanks.map((b) => b.id);

  if (bankIds.length === 0) {
    return {
      data: [],
      pagination: {
        total: 0,
        limit: pagination.limit,
        offset: pagination.offset,
        hasMore: false,
      },
    };
  }

  const where: any = {
    bankId: { in: bankIds },
    dwollaTransferId: { not: null },
  };

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.startDate || filters.endDate) {
    where.createdAt = {};
    if (filters.startDate) {
      where.createdAt.gte = filters.startDate;
    }
    if (filters.endDate) {
      where.createdAt.lte = filters.endDate;
    }
  }

  if (filters.search) {
    where.OR = [
      {
        name: {
          contains: filters.search,
          mode: "insensitive",
        },
      },
      {
        bank: {
          institutionName: {
            contains: filters.search,
            mode: "insensitive",
          },
        },
      },
    ];
  }

  let orderBy: any = { createdAt: "desc" };
  if (filters.sortBy) {
    switch (filters.sortBy) {
      case "date_asc":
        orderBy = { createdAt: "asc" };
        break;
      case "amount_desc":
        orderBy = { amount: "desc" };
        break;
      case "amount_asc":
        orderBy = { amount: "asc" };
        break;
      case "date_desc":
      default:
        orderBy = { createdAt: "desc" };
        break;
    }
  }

  const [transfers, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      orderBy,
      take: pagination.limit,
      skip: pagination.offset,
      include: {
        bank: {
          select: {
            institutionName: true,
          },
        },
      },
    }),
    prisma.transaction.count({ where }),
  ]);

  const formattedTransfers: TransferListItem[] = transfers.map((t) => ({
    id: t.id,
    amount: Number(t.amount),
    status: t.status,
    sourceBankName: t.bank.institutionName,
    destinationBankName: t.name.replace("Transfer to ", ""),
    createdAt: t.createdAt,
  }));

  return {
    data: formattedTransfers,
    pagination: {
      total,
      limit: pagination.limit,
      offset: pagination.offset,
      hasMore: pagination.offset + formattedTransfers.length < total,
    },
  };
};

//Cancels a pending transfer.
export const cancelTransfer = async (
  transferId: string,
  userId: string,
): Promise<boolean> => {
  const transfer = await prisma.transaction.findFirst({
    where: { id: transferId },
    include: {
      bank: { select: { userId: true } },
    },
  });

  if (!transfer || transfer.bank.userId !== userId) {
    throw new Error("Transfer not found");
  }

  if (transfer.status !== "PENDING") {
    throw new Error("Only pending transfers can be cancelled");
  }

  if (!transfer.dwollaTransferId) {
    throw new Error("Transfer has no Dwolla ID");
  }

  // Cancel in Dwolla
  try {
    await dwollaClient.post(`transfers/${transfer.dwollaTransferId}`, {
      status: "cancelled",
    });
  } catch (error) {
    logger.error(
      { err: error, transferId },
      "Failed to cancel transfer in Dwolla",
    );
    throw new Error("Failed to cancel transfer with payment provider");
  }

  // Update local status
  await prisma.transaction.update({
    where: { id: transferId },
    data: { status: "FAILED" },
  });

  logger.info({ transferId, userId }, "Transfer cancelled successfully");

  return true;
};

export const transferService = {
  getTransferById,
  getTransfers,
  cancelTransfer,
};
