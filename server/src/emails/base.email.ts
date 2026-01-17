import { config } from "@/config";

export interface EmailContent {
  title: string;
  body: string;
  ctaText?: string;
  ctaLink?: string;
  footerText?: string;
}

const theme = {
  colors: {
    brand: {
      main: "#7839ee", // --color-brand-main
      hover: "#6d28d9", // --color-brand-hover
      text: "#4c1d95", // --color-brand-text
      surface: "#f5f3ff", // --color-brand-surface
    },
    gray: {
      text: "#212529", // --color-gray-text
      main: "#70707b", // --color-gray-main
      surface: "#f8f9fa", // --color-gray-surface
      border: "#dee2e6", // --color-gray-disabled
    },
    success: {
      main: "#10b981", // --color-success-main
      text: "#064e3b", // --color-success-text
    },
    white: "#ffffff",
  },
  fonts: {
    main: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    heading: "'Google Sans', 'Inter', sans-serif",
  },
};

export const renderEmailLayout = ({
  title,
  body,
  ctaText,
  ctaLink,
  footerText = "© 2026 Interlock. All rights reserved.",
}: EmailContent): string => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    
    body {
      font-family: ${theme.fonts.main};
      line-height: 1.6;
      color: ${theme.colors.gray.text};
      margin: 0;
      padding: 0;
      background-color: ${theme.colors.gray.surface};
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: ${theme.colors.white};
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      border: 1px solid ${theme.colors.gray.border};
    }
    .header {
      background-color: ${theme.colors.white};
      padding: 32px 40px;
      text-align: center;
      border-bottom: 1px solid ${theme.colors.gray.border};
    }
    .logo {
      color: ${theme.colors.gray.text};
      font-family: ${theme.fonts.heading};
      font-size: 26px;
      font-weight: 700;
      text-decoration: none;
      letter-spacing: -0.5px;
      display: inline-block;
    }
    .content {
      padding: 40px;
    }
    h1 {
      color: ${theme.colors.gray.text};
      font-family: ${theme.fonts.heading};
      font-size: 24px;
      margin-top: 0;
      margin-bottom: 24px;
      font-weight: 600;
      letter-spacing: -0.5px;
    }
    p {
      margin-bottom: 24px;
      color: ${theme.colors.gray.text};
      font-size: 16px;
      line-height: 1.625;
    }
    strong {
      font-weight: 600;
      color: ${theme.colors.brand.text};
    }
    .amount-display {
      text-align: center; 
      margin: 24px 0;
      padding: 24px;
      background-color: ${theme.colors.gray.surface};
      border-radius: 8px;
    }
    .amount-text {
      font-size: 36px; 
      font-weight: bold; 
      color: ${theme.colors.success.main};
      font-family: ${theme.fonts.heading};
    }
    .amount-label {
      margin-top: 8px; 
      color: ${theme.colors.gray.main};
      font-size: 14px;
    }
    .button-container {
      text-align: center;
      margin: 32px 0;
    }
    .button {
      background-color: ${theme.colors.brand.main};
      color: ${theme.colors.white} !important;
      padding: 12px 32px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      font-size: 16px;
      display: inline-block;
      transition: background-color 0.2s;
    }
    .button:hover {
      background-color: ${theme.colors.brand.hover};
    }
    .footer {
      background-color: ${theme.colors.gray.surface};
      padding: 32px;
      text-align: center;
      font-size: 13px;
      color: ${theme.colors.gray.main};
      border-top: 1px solid ${theme.colors.gray.border};
    }
    .link {
      color: ${theme.colors.brand.main};
      text-decoration: underline;
    }
    .footer a {
      color: ${theme.colors.gray.main};
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <a href="${config.clientUrl}" class="logo">Interlock</a>
    </div>
    <div class="content">
      <h1>${title}</h1>
      <div>
        ${body}
      </div>
      
      ${
        ctaText && ctaLink
          ? `
        <div class="button-container">
          <a href="${ctaLink}" class="button" target="_blank">${ctaText}</a>
        </div>
      `
          : ""
      }
      
      ${
        ctaLink
          ? `
      <p style="font-size: 14px; margin-top: 32px; color: ${
        theme.colors.gray.main
      }; border-top: 1px solid ${theme.colors.gray.border}; padding-top: 24px;">
        If the button above doesn't work, copy and paste this link into your browser:<br>
        <a href="${ctaLink}" class="link" style="word-break: break-all;">${ctaLink}</a>
      </p>
      `
          : ""
      }
    </div>
    <div class="footer">
      <p style="margin: 0;">${footerText}</p>
      <p style="margin: 8px 0 0;">
        <a href="#">Unsubscribe</a> • 
        <a href="#">Privacy Policy</a>
      </p>
    </div>
  </div>
</body>
</html>
  `;
};
