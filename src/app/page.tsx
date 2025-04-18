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
