export interface CreateCustomerRequest {
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
}

export interface CreateFundingSourceRequest {
  plaidToken: string;
  name: string;
  type: "checking" | "savings";
}

export interface CreateTransferRequest {
  source: { href: string };
  destination: { href: string };
  amount: {
    currency: "USD";
    value: string;
  };
}
