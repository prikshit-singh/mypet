'use client'
import React, { useState, useEffect } from 'react';
import { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import PetsPage from '@/components/pets/PetsPage';

import Layout from '@/components/layout/Layout';

type SortOption = 'newest' | 'price-low' | 'price-high' | 'name';

interface PetFilter {
  search: string;
  species: string[];
  breeds: string[];
  ageRange: [number, number];
  priceRange: [number, number];
  purpose: string[];
  gender: string[];
  vaccinated?: boolean;
  neutered?: boolean;
  sortBy: SortOption;
}

const page: React.FC = () => {

 
  return (
    <Suspense fallback={<div>Loading pets...</div>}>
        <PetsPage />
      </Suspense>
  );
};

export default page;
