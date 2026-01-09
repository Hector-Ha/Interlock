import { Client } from "dwolla-v2";
import { config } from "@/config";
import { prisma } from "@/db";
import { decrypt } from "@/utils/encryption";
import type { User } from "@prisma/client";

const dwolla = new Client({
  environment: config.dwolla.env as "sandbox" | "production",
  key: config.dwolla.key!,
  secret: config.dwolla.secret!,
});

export const dwollaClient = dwolla;

export const ensureCustomer = async (
  user: User
): Promise<{ customerId: string; customerUrl: string }> => {
  if (user.dwollaCustomerId && user.dwollaCustomerUrl) {
    return {
      customerId: user.dwollaCustomerId,
      customerUrl: user.dwollaCustomerUrl,
    };
  }

  let customerUrl: string;

  try {
    const customerResponse = await dwolla.post("customers", {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      type: "receive-only",
    });

    customerUrl = customerResponse.headers.get("location") as string;
  } catch (err: any) {
    if (
      err.body &&
      err.body._embedded &&
      err.body._embedded.errors &&
      err.body._embedded.errors.some(
        (e: any) => e.code === "Duplicate" && e.path === "/email"
      )
    ) {
      const duplicateError = err.body._embedded.errors.find(
        (e: any) => e.code === "Duplicate" && e.path === "/email"
      );
      customerUrl = duplicateError._links.about.href;
    } else {
      throw err;
    }
  }

  const customerId = customerUrl.split("/").pop() as string;

  await prisma.user.update({
    where: { id: user.id },
    data: {
      dwollaCustomerId: customerId,
      dwollaCustomerUrl: customerUrl,
    },
  });

  return { customerId, customerUrl };
};

export const addFundingSource = async (
  dwollaCustomerUrl: string,
  processorToken: string,
  accountName: string
): Promise<string> => {
  let fundingSourceUrl: string;

  try {
    const fundingSourceResponse = await dwolla.post(
      `${dwollaCustomerUrl}/funding-sources`,
      {
        plaidToken: processorToken,
        name: accountName,
      }
    );
    fundingSourceUrl = fundingSourceResponse.headers.get("location") as string;
  } catch (err: any) {
    if (err.body && err.body.code === "DuplicateResource" && err.body._links) {
      fundingSourceUrl = err.body._links.about.href;
    } else {
      throw err;
    }
  }

  return fundingSourceUrl;
};

export const createTransfer = async (
  sourceFundingUrl: string,
  destinationFundingUrl: string,
  amount: number,
  currency: string = "USD"
): Promise<{ transferUrl: string; transferId: string }> => {
  const transferResponse = await dwolla.post("transfers", {
    _links: {
      source: { href: sourceFundingUrl },
      destination: { href: destinationFundingUrl },
    },
    amount: {
      currency,
      value: amount.toFixed(2),
    },
  });

  const transferUrl = transferResponse.headers.get("location") as string;
  const transferId = transferUrl.split("/").pop() as string;

  return { transferUrl, transferId };
};

export const getAccountBalance = async (fundingSourceUrl: string) => {
  const response = await dwolla.get(`${fundingSourceUrl}/balance`);
  return response.body;
};

export const simulateSandboxProcessing = async () => {
  if (config.dwolla.env !== "sandbox") {
    throw new Error("Cannot simulate processing in production environment");
  }

  // This endpoint simulates bank transfer processing in Sandbox
  // It processes pending ACH transfers to "processed"
  const response = await dwolla.post("sandbox-simulations", {});
  return response.body;
};

export const getTransfer = async (transferId: string) => {
  const response = await dwolla.get(`transfers/${transferId}`);
  return response.body;
};

/**
 * Creates a P2P transfer between two Dwolla customers.
 * @param senderFundingSourceUrl - Sender's Dwolla funding source URL
 * @param recipientFundingSourceUrl - Recipient's Dwolla funding source URL
 * @param amount - Amount in dollars (e.g., 50.00)
 * @param metadata - Optional metadata including note
 * @returns Dwolla transfer URL for tracking
 */
export const createP2PTransfer = async (
  senderFundingSourceUrl: string,
  recipientFundingSourceUrl: string,
  amount: number,
  metadata?: { note?: string }
): Promise<string> => {
  const requestBody: Record<string, unknown> = {
    _links: {
      source: { href: senderFundingSourceUrl },
      destination: { href: recipientFundingSourceUrl },
    },
    amount: {
      currency: "USD",
      value: amount.toFixed(2),
    },
  };

  if (metadata?.note) {
    requestBody.metadata = { note: metadata.note };
  }

  const response = await dwolla.post("transfers", requestBody);
  const transferUrl = response.headers.get("location");

  if (!transferUrl) {
    throw new Error("Dwolla did not return transfer URL");
  }

  return transferUrl;
};
