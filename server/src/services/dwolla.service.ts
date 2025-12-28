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

  const customerResponse = await dwolla.post("customers", {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    type: "receive-only",
  });

  const customerUrl = customerResponse.headers.get("location") as string;
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
  const fundingSourceResponse = await dwolla.post(
    `${dwollaCustomerUrl}/funding-sources`,
    {
      plaidToken: processorToken,
      name: accountName,
    }
  );

  const fundingSourceUrl = fundingSourceResponse.headers.get(
    "location"
  ) as string;

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
