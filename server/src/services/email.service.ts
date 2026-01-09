import nodemailer from "nodemailer";
import { config } from "@/config";

import { logger } from "@/middleware/logger";
import { renderEmailLayout } from "@/emails/base.email";
import { getPasswordResetEmail } from "@/emails/password-reset.email";
import { getVerificationEmail } from "@/emails/verification.email";
import { getP2PReceivedEmail } from "@/emails/p2p-received.email";
import { getP2PSentEmail } from "@/emails/p2p-sent.email";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

// Create reusable transporter object
const createTransporter = () => {
  // Check for SendGrid configuration
  if (config.email.sendgridApiKey) {
    return nodemailer.createTransport({
      host: "smtp.sendgrid.net",
      port: 587,
      auth: {
        user: "apikey",
        pass: config.email.sendgridApiKey,
      },
    });
  }

  if (config.env === "production") {
    const errorMsg =
      "Email service not configured for production (missing SendGrid API Key).";
    logger.error(errorMsg);
    throw new Error(errorMsg);
  }

  // Development / Fallback
  return nodemailer.createTransport({
    jsonTransport: true,
  });
};

const transporter = createTransporter();

export const emailService = {
  sendEmail: async ({ to, subject, html }: EmailOptions): Promise<void> => {
    const from =
      config.email.senderEmail || '"Interlock" <noreply@interlock.app>';

    if (!transporter) {
      logger.info(
        { to, subject },
        "Email Service (No Transporter): Email sent (logged only)"
      );
      return;
    }

    try {
      const info = await transporter.sendMail({
        from,
        to,
        subject,
        html,
      });

      logger.info({ messageId: info.messageId, to }, "Email sent successfully");

      if (!config.email.sendgridApiKey && config.env === "development") {
        console.log("---------------- EMAIL PREVIEW ----------------");
        console.log(`To: ${to}`);
        console.log(`Subject: ${subject}`);
        console.log("Body:", html);
        console.log("-----------------------------------------------");
      }
    } catch (error) {
      logger.error({ err: error, to }, "Failed to send email");
      throw error; // Rethrow to let caller know
    }
  },

  sendPasswordResetEmail: async (to: string, token: string): Promise<void> => {
    const content = getPasswordResetEmail(token);
    const html = renderEmailLayout(content);

    await emailService.sendEmail({
      to,
      subject: "Reset Your Password - Interlock",
      html,
    });
  },

  sendVerificationEmail: async (to: string, token: string): Promise<void> => {
    const content = getVerificationEmail(token);
    const html = renderEmailLayout(content);

    await emailService.sendEmail({
      to,
      subject: "Verify Your Email - Interlock",
      html,
    });
  },

  // Sends notification email when user receives P2P transfer.
  sendP2PReceivedNotification: async (
    to: string,
    senderName: string,
    amount: number
  ): Promise<void> => {
    const content = getP2PReceivedEmail(senderName, amount);
    const html = renderEmailLayout(content);

    await emailService.sendEmail({
      to,
      subject: `${senderName} sent you $${amount.toFixed(2)}`,
      html,
    });
  },

  // Sends confirmation email when user sends P2P transfer.
  sendP2PSentConfirmation: async (
    to: string,
    recipientName: string,
    amount: number
  ): Promise<void> => {
    const content = getP2PSentEmail(recipientName, amount);
    const html = renderEmailLayout(content);

    await emailService.sendEmail({
      to,
      subject: `You sent $${amount.toFixed(2)} to ${recipientName}`,
      html,
    });
  },
};
