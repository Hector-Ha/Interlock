import nodemailer from "nodemailer";
import { config } from "@/config";

import { logger } from "@/middleware/logger";
import { generateEmailHtml } from "@/utils/email-template";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

// Create reusable transporter object
const createTransporter = () => {
  console.log("DEBUG: createTransporter called");
  console.log(
    "DEBUG: config.email.sendgridApiKey exists?",
    !!config.email.sendgridApiKey
  );

  // Check for SendGrid configuration
  if (config.email.sendgridApiKey) {
    console.log("DEBUG: Using SendGrid transporter");
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
      console.error("DEBUG: Failed to send email:", error);
      throw error; // Rethrow to let caller know
    }
  },

  sendPasswordResetEmail: async (to: string, token: string): Promise<void> => {
    const resetLink = `${config.clientUrl}/reset-password?token=${token}`;

    const html = generateEmailHtml({
      title: "Reset Your Password",
      body: `
        <p>Hello,</p>
        <p>We received a request to reset your password for your Interlock account.</p>
        <p>To proceed with the password reset, please click the button below. This link will expire in 1 hour.</p>
        <p>If you didn't request a password reset, you can safely ignore this email.</p>
      `,
      ctaText: "Reset Password",
      ctaLink: resetLink,
    });

    await emailService.sendEmail({
      to,
      subject: "Reset Your Password - Interlock",
      html,
    });
  },

  sendVerificationEmail: async (to: string, token: string): Promise<void> => {
    const verifyLink = `${config.clientUrl}/verify-email?token=${token}`;

    const html = generateEmailHtml({
      title: "Verify Your Email Address",
      body: `
        <p>Welcome to Interlock!</p>
        <p>We're excited to have you on board. To get started, please verify your email address by clicking the button below.</p>
        <p>This verification link will expire in 24 hours.</p>
      `,
      ctaText: "Verify Email",
      ctaLink: verifyLink,
    });

    await emailService.sendEmail({
      to,
      subject: "Verify Your Email - Interlock",
      html,
    });
  },
};
