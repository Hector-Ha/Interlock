import { Client } from "dwolla-v2";
import { config } from "../config";
import {
  CreateCustomerRequest,
  CreateFundingSourceRequest,
  CreateTransferRequest,
} from "../types/dwolla";

export const dwollaClient = new Client({
  key: config.dwolla.key!,
  secret: config.dwolla.secret!,
  environment: config.dwolla.env as "sandbox" | "production",
});

export const createCustomer = async (customerData: CreateCustomerRequest) => {
  const response = await dwollaClient.post("customers", customerData);
  return response.headers.get("location");
};

export const addFundingSource = async (
  customerId: string,
  fundingSourceData: CreateFundingSourceRequest
) => {
  const response = await dwollaClient.post(
    `customers/${customerId}/funding-sources`,
    fundingSourceData
  );
  return response.headers.get("location");
};

export const createTransfer = async (transferData: CreateTransferRequest) => {
  const response = await dwollaClient.post("transfers", {
    _links: {
      source: transferData.source,
      destination: transferData.destination,
    },
    amount: transferData.amount,
  });
  return response.headers.get("location");
};
