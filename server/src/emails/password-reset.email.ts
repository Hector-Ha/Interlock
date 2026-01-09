import { config } from "@/config";
import { EmailContent } from "./base.email";

export const getPasswordResetEmail = (token: string): EmailContent => {
  const resetLink = `${config.clientUrl}/reset-password?token=${token}`;

  return {
    title: "Reset Your Password",
    body: `
      <p>Hello,</p>
      <p>We received a request to reset your password for your Interlock account.</p>
      <p>To proceed with the password reset, please click the button below. This link will expire in 1 hour.</p>
      <p>If you didn't request a password reset, you can safely ignore this email.</p>
    `,
    ctaText: "Reset Password",
    ctaLink: resetLink,
  };
};
