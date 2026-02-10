import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/global.css";
import { ToastContainer } from "@/components/ui";
import { ErrorBoundary } from "@/components/error";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Interlock | The Secure Standard for Open Banking",
  description:
    "Interlock bridges your financial world with uncompromising security and reliability. Connect accounts, track balances, and move money with confidence.",
  icons: {
    icon: "/icons/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <ErrorBoundary>
          {children}
          <ToastContainer />
        </ErrorBoundary>
        <Analytics />
      </body>
    </html>
  );
}
