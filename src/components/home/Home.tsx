'use client';
import React from 'react';
import Layout from '@/components/layout/Layout';
import HeroSection from '@/components/home/HeroSection';
import QuickFilters from '@/components/home/QuickFilters';
import FeaturedPets from '@/components/home/FeaturedPets';
import HowItWorks from '@/components/home/HowItWorks';
import Testimonials from '@/components/home/Testimonials';
import CTA from '@/components/home/CTA';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';


export const metadata = {
  title: "The Pet Wala – Find Your Perfect Pet Today",
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



const Home: React.FC = () => {
  useScrollAnimation();

  return (
    <Layout>
      <HeroSection />
      <QuickFilters />
      <FeaturedPets />
      <HowItWorks />
      <Testimonials />
      <CTA />
    </Layout>
  );
};

export default Home;
