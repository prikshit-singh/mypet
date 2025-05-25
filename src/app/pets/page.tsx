'use client'
import React, { useState, useEffect } from 'react';
import { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import PetsPage from '@/components/pets/PetsPage';

import Layout from '@/components/layout/Layout';
import { PetCard } from '@/components/ui/pet-card';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ScrollAnimation } from '@/components/ui/scroll-animation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '@/components/ui/drawer';
import { Search, Filter, X } from 'lucide-react';
import { featuredPets } from '@/data/mock-data';
import { useIsMobile } from '@/hooks/use-mobile';
import { Pet } from '@/types/pet';
import { useSearchParams } from 'next/navigation';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { getAllPets, toggolFavouritePet } from '@/services/petServices';
import Cookies from 'js-cookie';
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
    <Layout>
    <Suspense fallback={<div>Loading pets...</div>}>
        <PetsPage />
      </Suspense>
    </Layout>
  );
};

export default page;
