import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Launchpad — Your AI Marketing Team, On Demand",
    template: "%s | Launchpad",
  },
  description:
    "Launchpad is an AI-powered digital marketing platform for small and medium businesses. Build campaigns, generate copy, and grow your business with Max, your AI marketing strategist.",
  keywords: [
    "AI marketing",
    "digital marketing",
    "marketing automation",
    "campaign management",
    "small business marketing",
  ],
  authors: [{ name: "Launchpad" }],
  creator: "Launchpad",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL,
    title: "Launchpad — Your AI Marketing Team, On Demand",
    description:
      "AI-powered digital marketing platform for small and medium businesses.",
    siteName: "Launchpad",
  },
  twitter: {
    card: "summary_large_image",
    title: "Launchpad — Your AI Marketing Team, On Demand",
    description:
      "AI-powered digital marketing platform for small and medium businesses.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased bg-[#0a0a0a] text-white`}>
        {children}
      </body>
    </html>
  );
}
