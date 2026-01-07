import { prisma } from "../db";
import { config } from "../config";
import { ensureCustomer, addFundingSource } from "../services/dwolla.service";
import {
  plaidClient,
  exchangePublicToken,
  createProcessorToken,
  getAccounts,
} from "../services/plaid.service";
import { syncTransactions } from "../services/transaction.service";
import { dwollaClient } from "../services/dwolla.service";
import { encrypt, decrypt } from "../utils/encryption";
import bcrypt from "bcryptjs";
import { Products, CountryCode } from "plaid";

// Helper to generate distinct test data for each bank
function getCustomUserConfig(index: number) {
  // Define distinct, round balances for easier tracking
  const configs = [
    {
      // Bank 1: High balance
      checking: 5000,
      savings: 1000,
      nameSuffix: "Alpha",
    },
    {
      // Bank 2: Lower balance
      checking: 2000,
      savings: 500,
      nameSuffix: "Beta",
    },
  ];

  const conf = configs[index] || configs[0];

  // Schema for Custom User
  // We use a simple setup with just 2 accounts per bank
  return JSON.stringify({
    version: "2",
    override_accounts: [
      {
        type: "depository",
        subtype: "checking",
        starting_balance: conf.checking,
        meta: {
          name: `Plaid Checking ${conf.nameSuffix}`,
          limit: 5000,
        },
      },
      {
        type: "depository",
        subtype: "savings",
        starting_balance: conf.savings,
        meta: {
          name: `Plaid Saving ${conf.nameSuffix}`,
        },
      },
    ],
  });
}

async function main() {
  console.log("🌱 Seeding test user...");
  console.log("Checking Dwolla Config:", {
    env: config.dwolla.env,
    keyHash: config.dwolla.key
      ? config.dwolla.key.substring(0, 5) + "..."
      : "undefined",
    secretHash: config.dwolla.secret
      ? config.dwolla.secret.substring(0, 5) + "..."
      : "undefined",
  });

  const email = "test@interlock.com";
  const password = "password123";

  // Cleanup existing user
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    console.log("Deleting existing test user...");
    await prisma.user.delete({ where: { id: existingUser.id } });
  }

  // Create User
  console.log("Creating new user...");
  const passwordHash = await bcrypt.hash(password, 10);

  // Fake PII
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      firstName: "Test",
      lastName: "User",
      address: encrypt(
        JSON.stringify({
          address1: "123 Test St",
          city: "Test City",
          state: "NY",
          postalCode: "10001",
        })
      ),
      dateOfBirth: encrypt("1990-01-01"),
      identityDocumentId: encrypt("1234"), // Last 4 digits or full SSN depending on needs, using 1234 for sandbox
      country: "US",
    },
  });

  console.log(`User created: ${user.id}`);

  // 3. Create Verified Dwolla Customer
  console.log("Creating Verified Dwolla Customer...");
  let dwollaCustomerUrl: string | null = null;
  try {
    // Sandbox Verified Customer Data
    // Use unique email to avoid "Duplicate" error and ensure we get a fresh Verified customer (since old one was receive-only)
    const dwollaEmail = `test-${Date.now()}@interlock.com`;

    const customerData = {
      firstName: "Test",
      lastName: "User",
      email: dwollaEmail,
      type: "personal",
      address1: "123 Test St",
      city: "Test City",
      state: "NY",
      postalCode: "10001",
      dateOfBirth: "1990-01-01",
      ssn: "1234",
    };

    const customerResponse = await dwollaClient.post("customers", customerData);
    dwollaCustomerUrl = customerResponse.headers.get("location");
    const customerId = dwollaCustomerUrl?.split("/").pop();

    console.log(`Dwolla Customer Created: ${dwollaCustomerUrl}`);

    // Update user with Dwolla ID
    if (dwollaCustomerUrl && customerId) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          dwollaCustomerId: customerId,
          dwollaCustomerUrl: dwollaCustomerUrl,
        },
      });
    }
  } catch (error: any) {
    console.warn("Failed to create Dwolla Customer.", error?.body || error);
  }

  // 4. Create Banks and Funding Sources
  const institutions = [
    { id: "ins_109508", name: "First Platypus Bank" },
    { id: "ins_109509", name: "Second Platypus Bank" },
  ];

  console.log(`\n🏦 Creating ${institutions.length} banks...`);

  for (const institution of institutions) {
    try {
      console.log(
        `\n--- Processing ${institution.name} (${institution.id}) ---`
      );

      // Create Plaid Sandbox Public Token
      console.log("Generating Plaid Sandbox Public Token...");
      const institutionIndex = institutions.indexOf(institution);

      const publicTokenRes = await plaidClient.sandboxPublicTokenCreate({
        institution_id: institution.id,
        initial_products: [Products.Auth, Products.Transactions],
        options: {
          override_username: "user_good",
          override_password: "pass_good",
        },
      });
      const publicToken = publicTokenRes.data.public_token;

      // Exchange for Access Token (Creates Bank in DB)
      console.log("Exchanging Public Token...");
      const metadata = {
        institution: {
          institution_id: institution.id,
          name: institution.name,
        },
        accounts: [],
      };

      const bankInfo = await exchangePublicToken(
        user.id,
        publicToken,
        metadata as any
      );
      console.log(`Bank created: ${bankInfo.id}`);

      // Get Access Token from DB
      const bank = await prisma.bank.findUnique({ where: { id: bankInfo.id } });
      const accessToken = decrypt(bank!.plaidAccessToken);

      if (dwollaCustomerUrl) {
        // Get Accounts
        console.log("Fetching accounts from Plaid...");
        const accounts = await getAccounts(accessToken);

        // Select a different account for each institution to avoid Dwolla duplicates
        // First Platypus -> index 0
        // Second Platypus -> index 1
        // Tartaruga -> index 2
        const insIndex = institutions.findIndex((i) => i.id === institution.id);
        const accountIndex = insIndex >= 0 ? insIndex : 0;

        const selectedAccount = accounts[accountIndex] || accounts[0];

        if (!selectedAccount) {
          console.warn(
            "No account found found, skipping Dwolla funding source."
          );
          continue;
        }

        console.log(
          `Selected Account: ${selectedAccount.name} (${selectedAccount.mask})`
        );

        // Create Processor Token
        console.log("Creating Processor Token...");
        const processorToken = await createProcessorToken(
          accessToken,
          selectedAccount.account_id
        );

        // Add Funding Source to Dwolla
        console.log("Adding Funding Source to Dwolla...");
        const fundingSourceUrl = await addFundingSource(
          dwollaCustomerUrl,
          processorToken,
          `${institution.name} ${selectedAccount.name}`
        );
        console.log(`Dwolla Funding Source URL: ${fundingSourceUrl}`);

        // Update Bank with Funding URL
        await prisma.bank.update({
          where: { id: bank!.id },
          data: { dwollaFundingUrl: fundingSourceUrl },
        });

        // Sync Transactions for this bank (Plaid API)
        console.log("Syncing transactions from Plaid...");
        try {
          const syncResult = await syncTransactions(bank!.id);
          console.log(`Synced ${syncResult.added} transactions.`);
        } catch (err) {
          console.error("Sync failed, proceeding to manual seed:", err);
        }

        console.log("Seeding manual mock transactions...");
        const today = new Date();
        const mockTxs = Array.from({ length: 15 }).map((_, i) => {
          const date = new Date(today);
          date.setDate(today.getDate() - i);
          const type = i % 3 === 0 ? "credit" : "debit";
          const amount = type === "credit" ? -50 : Math.random() * 100 + 10;

          return {
            bankId: bank!.id,
            amount: Math.abs(amount),
            name: type === "credit" ? "Direct Deposit" : `Merchant ${i}`,
            date: date,
            status: "SUCCESS",
            channel: "online",
            category: type === "credit" ? "Transfer" : "Travel",
            plaidTransactionId: `mock-tx-${bank!.id}-${i}`,
            pending: false,
          };
        });

        await prisma.transaction.createMany({
          data: mockTxs as any,
        });
        console.log(`Manually seeded ${mockTxs.length} transactions.`);
      } else {
        console.log(
          "Skipping Dwolla Funding Source creation as Dwolla Customer creation failed."
        );
      }
    } catch (error: any) {
      console.error(
        `Failed to create bank ${institution.name}:`,
        error?.response?.data || error
      );
    }
  }

  console.log(
    "\n Test user and banks created (Dwolla status: " +
      (dwollaCustomerUrl ? "Active" : "Failed") +
      ")"
  );
  console.log(`Email: ${email}`);
  console.log(`Password: ${password}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
