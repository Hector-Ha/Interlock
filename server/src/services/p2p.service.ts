import { prisma } from "@/db";
import { createP2PTransfer as dwollaP2PTransfer } from "./dwolla.service";
import { notificationService } from "./notification.service";
import { emailService } from "./email.service";
import type { Transaction } from "@prisma/client";

// Transfer limits in cents for precision
const P2P_LIMITS = {
  PER_TRANSACTION: 200000, // $2,000
  DAILY: 500000, // $5,000
  WEEKLY: 1000000, // $10,000
} as const;

// Types
interface RecipientSearchResult {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  hasLinkedBank: boolean;
}

interface TransferLimitValidation {
  valid: boolean;
  reason?: string;
}

interface P2PTransferResult {
  senderTransaction: Transaction;
  recipientTransaction: Transaction;
  transferUrl: string;
}

interface CreateP2PTransferOptions {
  senderId: string;
  recipientId: string;
  senderBankId: string;
  amount: number;
  note?: string;
}

// P2P Service
export const p2pService = {
  // Searches for users by email or phone number.
  // Excludes the current user and returns whether they can receive transfers.
  async searchRecipients(
    query: string,
    currentUserId: string
  ): Promise<RecipientSearchResult[]> {
    if (query.length < 3) {
      return [];
    }

    const users = await prisma.user.findMany({
      where: {
        AND: [
          { id: { not: currentUserId } },
          {
            OR: [
              { email: { contains: query, mode: "insensitive" } },
              { phoneNumber: { contains: query } },
            ],
          },
        ],
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        banks: {
          where: { dwollaFundingUrl: { not: null } },
          select: { id: true },
          take: 1,
        },
      },
      take: 10,
    });

    return users.map((user) => ({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      hasLinkedBank: user.banks.length > 0,
    }));
  },

  // Validates that a transfer doesn't exceed P2P limits.
  async validateLimits(
    senderId: string,
    amount: number
  ): Promise<TransferLimitValidation> {
    const amountCents = Math.round(amount * 100);

    // Check per-transaction limit
    if (amountCents > P2P_LIMITS.PER_TRANSACTION) {
      return {
        valid: false,
        reason: `Maximum per-transaction limit is $${
          P2P_LIMITS.PER_TRANSACTION / 100
        }`,
      };
    }

    // Check daily limit
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const dailyTotal = await prisma.transaction.aggregate({
      where: {
        senderId,
        type: "P2P_SENT",
        createdAt: { gte: todayStart },
        status: { not: "FAILED" },
      },
      _sum: { amount: true },
    });

    const dailySum = Number(dailyTotal._sum.amount || 0) * 100;
    if (dailySum + amountCents > P2P_LIMITS.DAILY) {
      const remaining = (P2P_LIMITS.DAILY - dailySum) / 100;
      return {
        valid: false,
        reason: `Daily P2P limit of $${
          P2P_LIMITS.DAILY / 100
        } reached. Remaining: $${remaining.toFixed(2)}`,
      };
    }

    // Check weekly limit
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 7);

    const weeklyTotal = await prisma.transaction.aggregate({
      where: {
        senderId,
        type: "P2P_SENT",
        createdAt: { gte: weekStart },
        status: { not: "FAILED" },
      },
      _sum: { amount: true },
    });

    const weeklySum = Number(weeklyTotal._sum.amount || 0) * 100;
    if (weeklySum + amountCents > P2P_LIMITS.WEEKLY) {
      const remaining = (P2P_LIMITS.WEEKLY - weeklySum) / 100;
      return {
        valid: false,
        reason: `Weekly P2P limit of $${
          P2P_LIMITS.WEEKLY / 100
        } reached. Remaining: $${remaining.toFixed(2)}`,
      };
    }

    return { valid: true };
  },

  // Creates a P2P transfer between two users.
  async createTransfer(
    options: CreateP2PTransferOptions
  ): Promise<P2PTransferResult> {
    const { senderId, recipientId, senderBankId, amount, note } = options;

    // Validate sender and recipient are different
    if (senderId === recipientId) {
      throw new Error("Cannot send money to yourself");
    }

    // Validate transfer limits
    const limitCheck = await this.validateLimits(senderId, amount);
    if (!limitCheck.valid) {
      throw new Error(limitCheck.reason);
    }

    // Get sender's bank and funding source
    const senderBank = await prisma.bank.findFirst({
      where: {
        id: senderBankId,
        userId: senderId,
        dwollaFundingUrl: { not: null },
      },
    });

    if (!senderBank?.dwollaFundingUrl) {
      throw new Error("Sender bank not linked to Dwolla");
    }

    // Get recipient's primary bank
    const recipientBank = await prisma.bank.findFirst({
      where: {
        userId: recipientId,
        dwollaFundingUrl: { not: null },
      },
    });

    if (!recipientBank?.dwollaFundingUrl) {
      throw new Error("Recipient has no linked bank account");
    }

    // Get user info for notifications
    const [sender, recipient] = await Promise.all([
      prisma.user.findUnique({
        where: { id: senderId },
        select: { firstName: true, lastName: true, email: true },
      }),
      prisma.user.findUnique({
        where: { id: recipientId },
        select: { firstName: true, lastName: true, email: true },
      }),
    ]);

    if (!sender || !recipient) {
      throw new Error("User not found");
    }

    const senderName = `${sender.firstName} ${sender.lastName}`;
    const recipientName = `${recipient.firstName} ${recipient.lastName}`;

    // Create Dwolla transfer
    const transferUrl = await dwollaP2PTransfer(
      senderBank.dwollaFundingUrl,
      recipientBank.dwollaFundingUrl,
      amount,
      { note }
    );

    // Create transactions for both sender and recipient
    const [senderTransaction, recipientTransaction] = await prisma.$transaction(
      [
        prisma.transaction.create({
          data: {
            bankId: senderBank.id,
            amount: -amount, // Negative for sent
            name: `Sent to ${recipientName}`,
            merchantName: recipientName,
            date: new Date(),
            type: "P2P_SENT",
            senderId,
            recipientId,
            status: "PENDING",
            pending: true,
            channel: "p2p",
            dwollaTransferId: transferUrl,
            note,
          },
        }),
        prisma.transaction.create({
          data: {
            bankId: recipientBank.id,
            amount: amount, // Positive for received
            name: `Received from ${senderName}`,
            merchantName: senderName,
            date: new Date(),
            type: "P2P_RECEIVED",
            senderId,
            recipientId,
            status: "PENDING",
            pending: true,
            channel: "p2p",
            dwollaTransferId: transferUrl,
            note,
          },
        }),
      ]
    );

    // Create in-app notifications
    Promise.all([
      notificationService.create({
        recipientUserId: senderId,
        type: "P2P_SENT",
        title: "Money Sent",
        message: `You sent $${amount.toFixed(2)} to ${recipientName}`,
        relatedTransactionId: senderTransaction.id,
      }),
      notificationService.create({
        recipientUserId: recipientId,
        type: "P2P_RECEIVED",
        title: "Money Received",
        message: `${senderName} sent you $${amount.toFixed(2)}`,
        relatedTransactionId: recipientTransaction.id,
      }),
    ]).catch((error) => {
      console.error("Failed to create notifications:", error);
    });

    // Send email notifications
    Promise.all([
      recipient.email &&
        emailService.sendP2PReceivedNotification(
          recipient.email,
          senderName,
          amount
        ),
      sender.email &&
        emailService.sendP2PSentConfirmation(
          sender.email,
          recipientName,
          amount
        ),
    ]).catch((error) => {
      console.error("Failed to send P2P emails:", error);
    });

    return {
      senderTransaction,
      recipientTransaction,
      transferUrl,
    };
  },
};
