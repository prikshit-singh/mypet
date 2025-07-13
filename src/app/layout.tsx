import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import AppContext from "@/contexts/AppContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Pet Wala – Buy, Sell, Adopt & Breed Pets",
  description:
    "The Pet Wala is your all-in-one pet marketplace. Register pets for sale, adoption, or breeding, and shop pet accessories all in one trusted platform.",
  keywords: [
    "buy pets online",
    "adopt pets",
    "sell pets",
    "pet breeding",
    "pet accessories",
    "pet marketplace",
    "dog adoption",
    "cat for sale",
    "pet shop",
  ],
  openGraph: {
    title: "The Pet Wala – Buy, Sell, Adopt & Breed Pets",
    description:
      "Discover, buy, sell, adopt, and breed pets in a safe, verified, and community-driven space. Shop curated pet accessories too.",
    url: "https://thepetwala.com",
    siteName: "The Pet Wala",
    type: "website",
    images: [
      {
        url: "https://thepetwala.com/og-logo.png", // Replace with your actual OG image
        width: 1200,
        height: 630,
        alt: "The Pet Wala – Pet Marketplace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Pet Wala – Buy, Sell, Adopt & Breed Pets",
    description:
      "Join The Pet Wala to buy, sell, adopt, or breed pets and explore premium pet accessories. The only platform you need for your pets.",
    images: ["https://thepetwala.com/og-logo.png"], // Replace with your actual Twitter image
  },
  metadataBase: new URL("https://thepetwala.com"), // Optional but recommended
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AppContext >
          {children}
        </AppContext>
      </body>
    </html>
  );
}
