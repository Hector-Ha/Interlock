import { config } from "@/config";
import { EmailContent } from "./base.email";

export const getVerificationEmail = (token: string): EmailContent => {
  const verifyLink = `${config.clientUrl}/verify-email?token=${token}`;

  return {
    title: "Verify Your Email Address",
    body: `
      <p>Welcome to Interlock!</p>
      <p>We're excited to have you on board. To get started, please verify your email address by clicking the button below.</p>
      <p>This verification link will expire in 24 hours.</p>
    `,
    ctaText: "Verify Email",
    ctaLink: verifyLink,
  };
};
