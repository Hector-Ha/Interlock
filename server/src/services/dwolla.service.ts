import { Client } from "dwolla-v2";
import { config } from "../config";

export const dwollaClient = new Client({
  key: config.dwolla.key!,
  secret: config.dwolla.secret!,
  environment: config.dwolla.env as "sandbox" | "production",
});

export const createCustomer = async (customerData: {
  firstName: string;
  lastName: string;
  email: string;
  type: string;
  address1: string;
  city: string;
  state: string;
  postalCode: string;
  dateOfBirth: string;
  ssn: string;
}) => {
  const response = await dwollaClient.post("customers", customerData);
  return response.headers.get("location");
};

export const addFundingSource = async (
  customerId: string,
  fundingSourceData: {
    plaidToken: string;
    name: string;
    type: "checking" | "savings";
  }
) => {
  const response = await dwollaClient.post(
    `customers/${customerId}/funding-sources`,
    fundingSourceData
  );
  return response.headers.get("location");
};

export const createTransfer = async (transferData: {
  source: { href: string };
  destination: { href: string };
  amount: { currency: "USD"; value: string };
}) => {
  const response = await dwollaClient.post("transfers", {
    _links: {
      source: transferData.source,
      destination: transferData.destination,
    },
    amount: transferData.amount,
  });
  return response.headers.get("location");
};
