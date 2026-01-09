import { config } from "@/config";
import { EmailContent } from "./base.email";

export const getP2PReceivedEmail = (
  senderName: string,
  amount: number
): EmailContent => {
  return {
    title: "You Received Money! 💰",
    body: `
      <p>Great news! <strong>${senderName}</strong> just sent you:</p>
      <div class="amount-display">
        <div class="amount-text" style="color: #22c55e;">
          $${amount.toFixed(2)}
        </div>
      </div>
      <p>The funds will be deposited into your linked bank account within 1-3 business days.</p>
    `,
    ctaText: "View Transaction",
    ctaLink: `${config.clientUrl}/transfers`,
  };
};
