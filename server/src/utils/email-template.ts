import { config } from "@/config";

interface TemplateOptions {
  head?: string;
  title: string;
  body: string;
  ctaText?: string;
  ctaLink?: string;
  footerText?: string;
}

export const generateEmailHtml = ({
  title,
  body,
  ctaText,
  ctaLink,
  footerText = "© 2026 Interlock. All rights reserved.",
}: TemplateOptions): string => {
  const colors = {
    brand: "#7839ee", // --color-brand-main
    brandHover: "#6d28d9", // --color-brand-hover
    text: "#212529", // --color-gray-text
    grayMain: "#70707b", // --color-gray-main
    background: "#f8f9fa", // --color-gray-surface
    white: "#ffffff", // --color-white
    border: "#dee2e6", // --color-gray-disabled
  };

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
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: ${colors.text};
      margin: 0;
      padding: 0;
      background-color: ${colors.background};
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: ${colors.white};
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      border: 1px solid ${colors.border};
    }
    .header {
      background-color: ${colors.white};
      padding: 32px 40px;
      text-align: center;
      border-bottom: 1px solid ${colors.border};
    }
    .logo {
      color: ${colors.text};
      font-family: 'Google Sans', 'Inter', sans-serif;
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
      color: ${colors.text};
      font-size: 24px;
      margin-top: 0;
      margin-bottom: 24px;
      font-weight: 600;
      letter-spacing: -0.5px;
    }
    p {
      margin-bottom: 24px;
      color: ${colors.text};
      font-size: 16px;
      line-height: 1.625;
    }
    .button-container {
      text-align: center;
      margin: 32px 0;
    }
    .button {
      background-color: ${colors.brand};
      color: ${colors.white} !important;
      padding: 12px 32px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      font-size: 16px;
      display: inline-block;
      transition: background-color 0.2s;
    }
    .button:hover {
      background-color: ${colors.brandHover};
    }
    .footer {
      background-color: ${colors.background};
      padding: 32px;
      text-align: center;
      font-size: 13px;
      color: ${colors.grayMain};
      border-top: 1px solid ${colors.border};
    }
    .link {
      color: ${colors.brand};
      text-decoration: underline;
    }
    .footer a {
      color: ${colors.grayMain};
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
      
      <p style="font-size: 14px; margin-top: 32px; color: ${
        colors.grayMain
      }; border-top: 1px solid ${colors.border}; padding-top: 24px;">
        If the button above doesn't work, copy and paste this link into your browser:<br>
        <a href="${ctaLink}" class="link" style="word-break: break-all;">${ctaLink}</a>
      </p>
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
