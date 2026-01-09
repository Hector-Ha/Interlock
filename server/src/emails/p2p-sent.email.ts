import { config } from "@/config";
import { EmailContent } from "./base.email";

export const getP2PSentEmail = (
  recipientName: string,
  amount: number
): EmailContent => {
  return {
    title: "Money Sent Successfully",
    body: `
      <p>Your transfer has been initiated:</p>
      <div class="amount-display">
        <div class="amount-text" style="color: #2563eb;">
          $${amount.toFixed(2)}
        </div>
        <div class="amount-label">to ${recipientName}</div>
      </div>
      <p>The recipient will receive the funds within 1-3 business days.</p>
    `,
    ctaText: "View Transaction",
    ctaLink: `${config.clientUrl}/transfers`,
  };
};
