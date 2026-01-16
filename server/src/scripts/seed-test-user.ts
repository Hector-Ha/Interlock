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
import { Products } from "plaid";
import { TxType, TxStatus } from "@prisma/client";

// --- Configuration Data ---

const USERS_TO_SEED = [
  {
    role: "sender",
    email: "test@interlock.com",
    password: "password123",
    firstName: "Test",
    lastName: "User",
    phone: "+15550001234",
    dob: "1990-01-01",
    ssn: "1234", // Valid sandbox SSN last 4
    address: {
      address1: "123 Test St",
      city: "Test City",
      state: "NY",
      postalCode: "10001",
    },
    institutions: [
      { id: "ins_109508", name: "First Platypus Bank" },
      { id: "ins_109510", name: "Third Platypus Bank" },
    ],
  },
  {
    role: "recipient",
    email: "recipient@interlock.com",
    password: "password123",
    firstName: "Recipient",
    lastName: "User",
    phone: "+15550005678",
    dob: "1992-05-15",
    ssn: "5678",
    address: {
      address1: "456 Recipient Rd",
      city: "Other Town",
      state: "CA",
      postalCode: "90210",
    },
    institutions: [
      { id: "ins_109508", name: "First Platypus Bank" }, // Savings/Checking
    ],
  },
];

async function seedUser(userData: (typeof USERS_TO_SEED)[0]) {
  console.log(`\n👤 Processing User: ${userData.email} (${userData.role})`);

  // 1. Cleanup & Create User
  const existingUser = await prisma.user.findUnique({
    where: { email: userData.email },
  });
  if (existingUser) {
    console.log(`  - Deleting existing user...`);
    await prisma.user.delete({ where: { id: existingUser.id } });
  }

  const passwordHash = await bcrypt.hash(userData.password, 10);
  const user = await prisma.user.create({
    data: {
      email: userData.email,
      passwordHash,
      firstName: userData.firstName,
      lastName: userData.lastName,
      phoneNumber: userData.phone, // P2P Discovery
      phoneVerified: true,
      address: encrypt(JSON.stringify(userData.address)),
      dateOfBirth: encrypt(userData.dob),
      identityDocumentId: encrypt(userData.ssn),
      country: "US",
    },
  });
  console.log(`  - Created User DB ID: ${user.id}`);

  // 2. Create Verified Dwolla Customer
  let dwollaCustomerUrl: string | null = null;
  try {
    const dwollaEmail = `test-${Date.now()}-${Math.floor(
      Math.random() * 1000,
    )}@interlock.com`;
    const customerData = {
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: dwollaEmail,
      type: "personal",
      address1: userData.address.address1,
      city: userData.address.city,
      state: userData.address.state,
      postalCode: userData.address.postalCode,
      dateOfBirth: userData.dob,
      ssn: userData.ssn,
    };

    const customerResponse = await dwollaClient.post("customers", customerData);
    dwollaCustomerUrl = customerResponse.headers.get("location");
    const customerId = dwollaCustomerUrl?.split("/").pop();

    if (dwollaCustomerUrl && customerId) {
      await prisma.user.update({
        where: { id: user.id },
        data: { dwollaCustomerId: customerId, dwollaCustomerUrl },
      });
      console.log(`  - Dwolla Customer Created: ${customerId}`);
    }
  } catch (error: any) {
    console.warn(
      `  ! Failed to create Dwolla Customer:`,
      error?.body?.message || error,
    );
  }

  // 3. Link Banks
  const createdBanks = [];
  if (dwollaCustomerUrl) {
    for (const institution of userData.institutions) {
      try {
        console.log(`  🏦 Linking Bank: ${institution.name}...`);

        // A. Public Token
        const publicTokenRes = await plaidClient.sandboxPublicTokenCreate({
          institution_id: institution.id,
          initial_products: [Products.Auth, Products.Transactions],
          options: {
            override_username: "user_good",
            override_password: "pass_good",
          },
        });
        const publicToken = publicTokenRes.data.public_token;

        // B. Exchange & Create DB Bank
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
          metadata as any,
        );

        // C. Get Plaid Account for Dwolla
        const bank = await prisma.bank.findUnique({
          where: { id: bankInfo.id },
        });
        const accessToken = decrypt(bank!.plaidAccessToken);
        const accounts = await getAccounts(accessToken);

        // Select account based on institution to ensure unique funding sources
        // First Platypus -> Checking (Index 0)
        // Third Platypus -> Savings (Index 1)
        const accountIndex = institution.name.includes("Third") ? 1 : 0;
        const selectedAccount = accounts[accountIndex] || accounts[0];

        if (selectedAccount) {
          // D. Processor Token (Plaid -> Dwolla)
          const processorToken = await createProcessorToken(
            accessToken,
            selectedAccount.account_id,
          );

          // E. Create Dwolla Funding Source
          const fundingSourceUrl = await addFundingSource(
            dwollaCustomerUrl,
            processorToken,
            `${institution.name} ${selectedAccount.name}`,
          );

          // F. Update Bank
          await prisma.bank.update({
            where: { id: bank!.id },
            data: { dwollaFundingUrl: fundingSourceUrl },
          });

          createdBanks.push({ ...bank, dwollaFundingUrl: fundingSourceUrl });
          console.log(`  - Linked & Funded: ${selectedAccount.name}`);

          // G. Sync Transactions from Plaid (to fill initial data)
          try {
            await syncTransactions(bank!.id);
          } catch (e) {
            console.log("    (Plaid sync skipped/failed, using manual seed)");
          }
        }
      } catch (err: any) {
        console.error(
          `  ! Failed to link bank ${institution.name}:`,
          err?.response?.data || err,
        );
      }
    }
  }

  return { user, banks: createdBanks };
}

async function main() {
  console.log("🌱 STARTING SEED PROCESS...");

  const users = {
    sender: null as any,
    recipient: null as any,
  };

  // 1. Create Users & Banks
  for (const config of USERS_TO_SEED) {
    const result = await seedUser(config);
    if (config.role === "sender") users.sender = result;
    if (config.role === "recipient") users.recipient = result;
  }

  // 2. Seed P2P Transactions
  if (users.sender?.banks.length > 0 && users.recipient?.banks.length > 0) {
    console.log("\n💸 Seeding P2P Transactions...");
    const sender = users.sender.user;
    const recipient = users.recipient.user;
    const senderBank = users.sender.banks[0];
    const recipientBank = users.recipient.banks[0];

    // Create a history of P2P transfers
    const p2pTransactions = [
      {
        amount: 50.0,
        dateDelta: -2, // 2 days ago
        note: "Dinner money",
      },
      {
        amount: 25.5,
        dateDelta: -5, // 5 days ago
        note: "Uber share",
      },
    ];

    for (const tx of p2pTransactions) {
      const date = new Date();
      date.setDate(date.getDate() + tx.dateDelta);

      const transferId = `mock-transfer-${Date.now()}-${Math.random()}`;

      // Sender Side
      await prisma.transaction.create({
        data: {
          bankId: senderBank.id,
          amount: -tx.amount, // outflow
          name: `Sent to ${recipient.firstName} ${recipient.lastName}`,
          merchantName: `${recipient.firstName} ${recipient.lastName}`,
          date: date,
          type: TxType.P2P_SENT,
          status: TxStatus.SUCCESS,
          senderId: sender.id,
          recipientId: recipient.id,
          channel: "p2p",
          dwollaTransferId: transferId,
          note: tx.note,
          pending: false,
        },
      });

      // Recipient Side
      await prisma.transaction.create({
        data: {
          bankId: recipientBank.id,
          amount: tx.amount, // inflow
          name: `Received from ${sender.firstName} ${sender.lastName}`,
          merchantName: `${sender.firstName} ${sender.lastName}`,
          date: date,
          type: TxType.P2P_RECEIVED,
          status: TxStatus.SUCCESS,
          senderId: sender.id,
          recipientId: recipient.id,
          channel: "p2p",
          dwollaTransferId: `${transferId}_CREDIT`,
          note: tx.note,
          pending: false,
        },
      });
    }
    console.log(
      `  - Created ${p2pTransactions.length} historical P2P transfers.`,
    );
  } else {
    console.warn(
      "  ! Skipping P2P seed: Missing fully funded banks for one or both users.",
    );
  }

  console.log("\n✅ SEED COMPLETE");
  console.log("------------------------------------------------");
  console.log(`Sender:    test@interlock.com / password123`);
  console.log(`Recipient: recipient@interlock.com / password123`);
  console.log("------------------------------------------------");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
