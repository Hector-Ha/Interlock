export const MOCK_BANKS = [
  {
    id: "bank_1",
    userId: "user_1",
    itemId: "item_1",
    institutionId: "ins_1",
    institutionName: "Chase Bank",
    status: "ACTIVE" as const,
    dwollaFundingUrl: "https://api-sandbox.dwolla.com/funding-sources/1",
    isDwollaLinked: true,
    lastSyncedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "bank_2",
    userId: "user_1",
    itemId: "item_2",
    institutionId: "ins_2",
    institutionName: "Bank of America",
    status: "ACTIVE" as const,
    dwollaFundingUrl: "https://api-sandbox.dwolla.com/funding-sources/2",
    isDwollaLinked: true,
    lastSyncedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "bank_3",
    userId: "user_1",
    itemId: "item_3",
    institutionId: "ins_3",
    institutionName: "Wells Fargo",
    status: "LOGIN_REQUIRED" as const, // Should be filtered out
    dwollaFundingUrl: null,
    isDwollaLinked: false,
    lastSyncedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const MOCK_TRANSFERS = [
  {
    id: "transfer_1",
    amount: 150.0,
    status: "SUCCESS" as const,
    sourceBankName: "Chase Bank",
    destinationBankName: "Bank of America",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
  },
  {
    id: "transfer_2",
    amount: 5000.0,
    status: "PENDING" as const,
    sourceBankName: "Bank of America",
    destinationBankName: "Chase Bank",
    createdAt: new Date().toISOString(), // Just now
  },
  {
    id: "transfer_3",
    amount: 25.5,
    status: "FAILED" as const,
    sourceBankName: "Chase Bank",
    destinationBankName: "External Account",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
  },
];
