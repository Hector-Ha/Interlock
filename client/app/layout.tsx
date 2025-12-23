import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "../styles/global.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const openSauceSans = localFont({
  src: [
    {
      path: "../assets/fonts/Open_Sauce_Sans/OpenSauceSans-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../assets/fonts/Open_Sauce_Sans/OpenSauceSans-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../assets/fonts/Open_Sauce_Sans/OpenSauceSans-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../assets/fonts/Open_Sauce_Sans/OpenSauceSans-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../assets/fonts/Open_Sauce_Sans/OpenSauceSans-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../assets/fonts/Open_Sauce_Sans/OpenSauceSans-ExtraBold.ttf",
      weight: "800",
      style: "normal",
    },
    {
      path: "../assets/fonts/Open_Sauce_Sans/OpenSauceSans-Black.ttf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-open-sauce-sans",
});

export const metadata: Metadata = {
  title: "Interlock - The Future of Security Open Banking",
  description: "A transparent, secure, and user-friendly open banking platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${openSauceSans.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
