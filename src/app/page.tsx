// 'use client';
// import React from 'react';
import Home from "@/components/home/Home";


export const metadata = {
  title: "The Pet Wala – Find Your Perfect Pet Today home",
  description:
    "Explore thousands of pets available for adoption, sale, and breeding on The Pet Wala. Register your pet or browse accessories today!",
  keywords: [
    "buy pets online",
    "adopt pets",
    "sell pets",
    "pet breeding",
    "pet accessories",
    "dog adoption",
    "cat sale",
    "pet wala",
  ],
  openGraph: {
    title: "The Pet Wala – Pet Marketplace",
    description:
      "Buy, sell, adopt, or breed pets on India’s fastest-growing pet platform. Shop pet accessories and connect with verified users.",
    url: "https://thepetwala.com",
    siteName: "The Pet Wala",
    images: [
      {
        url: "https://thepetwala.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "The Pet Wala – Pet Marketplace",
      },
    ],
  },
};

export default function HomePage() {
  return <Home />;
}
