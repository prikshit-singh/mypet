'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';


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

  const isMobile = useIsMobile();
  const [pets, setPets] = useState<Pet[]>([]);
  const [filteredPets, setFilteredPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const searchParams = useSearchParams();
  const searchFromUrl = searchParams.get('search') || '';
  const initialPurpose = searchParams.get('purpose') ? [searchParams.get('purpose') as string] : [];
  const [searchInput, setSearchInput] = useState(searchFromUrl);


  const [filters, setFilters] = useState<PetFilter>({
    search: searchFromUrl,
    species: [],
    breeds: [],
    ageRange: [0, 15],
    priceRange: [0, 5000],
    purpose: initialPurpose,
    gender: [],
    vaccinated: undefined,
    neutered: undefined,
    sortBy: 'newest'
  });

  const speciesOptions = ['Dog', 'Cat', 'Bird', 'Rabbit', 'Hamster', 'Fish', 'Reptile', 'Other'];
  const breedOptions = ['Labrador Retriever', 'German Shepherd', 'Persian', 'Siamese', 'Parakeet', 'Cockatiel', 'Netherland Dwarf', 'Syrian Hamster', 'Betta Fish', 'Bearded Dragon'];
  const purposeOptions = ['adopt', 'sell', 'breed'];
  const genderOptions = ['male', 'female'];
  const queryClient = useQueryClient();
  const { data: petList, isLoading, isError } = useQuery({
    queryKey: ['petList'],
    queryFn: getAllPets,
    refetchOnMount: true,
    retry: true,
  });
  console.log(123)
  useEffect(() => {
    const timeout = setTimeout(() => {
      setFilters((prev) => ({
        ...prev,
        search: searchInput,
      }));
    }, 200); // debounce delay, adjust as needed

    return () => clearTimeout(timeout);
  }, [searchInput]);


  useEffect(() => {
    console.log('result', petList)

    if (isLoading) return;
    let result: any = [];

    if (Array.isArray(petList?.pets)) {
      result = [...petList?.pets];
    }

    console.log('result', result)
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter((pet: any) =>
        pet.name.toLowerCase().includes(searchTerm) ||
        pet.breed.toLowerCase().includes(searchTerm) ||
        pet.type.toLowerCase().includes(searchTerm) ||
        pet.description.toLowerCase().includes(searchTerm)
      );
      console.log(123, searchTerm, result)

    }

    if (filters.species.length > 0) {
      result = result.filter((pet: any) => filters.species.includes(pet.type));
    }

    if (filters.breeds.length > 0) {
      result = result.filter((pet: any) => filters.breeds.includes(pet.breed));
    }

    if (filters.purpose.length > 0) {
      result = result.filter((pet: any) => filters.purpose.includes(pet.purpose));
    }

    if (filters.gender.length > 0) {
      result = result.filter((pet: any) =>
        filters.gender.includes(pet.gender.toLowerCase())
      );
    }

    result = result.filter((pet: any) =>
      pet.age >= filters.ageRange[0] && pet.age <= filters.ageRange[1]
    );

    result = result.filter((pet: any) => {
      if (pet.purpose === 'adopt') return true;
      return (!pet.price || (
        pet.price >= filters.priceRange[0] &&
        pet.price <= filters.priceRange[1]
      ));
    });

    if (filters.vaccinated !== undefined) {
      result = result.filter((pet: any) => pet.vaccinated === filters.vaccinated);
    }

    switch (filters.sortBy) {
      case 'newest':
        result.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'price-low':
        result.sort((a: any, b: any) => {
          if (a.purpose === 'adopt' && b.purpose === 'adopt') return 0;
          if (a.purpose === 'adopt') return -1;
          if (b.purpose === 'adopt') return 1;
          return (a.price || 0) - (b.price || 0);
        });
        break;
      case 'price-high':
        result.sort((a: any, b: any) => {
          if (a.purpose === 'adopt' && b.purpose === 'adopt') return 0;
          if (a.purpose === 'adopt') return 1;
          if (b.purpose === 'adopt') return -1;
          return (b.price || 0) - (a.price || 0);
        });
        break;
      case 'name':
        result.sort((a: any, b: any) => a.name.localeCompare(b.name));
        break;
    }

    setFilteredPets(result);
  }, [petList, filters, isLoading]);

  const handleCheckboxFilter = (key: 'species' | 'breeds' | 'purpose' | 'gender', value: string, checked: boolean) => {
    setFilters(prev => {
      if (checked) {
        return {
          ...prev,
          [key]: [...prev[key], value]
        };
      } else {
        return {
          ...prev,
          [key]: prev[key].filter(item => item !== value)
        };
      }
    });
  };

  const handleSwitchFilter = (key: 'vaccinated' | 'neutered', checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      [key]: checked
    }));
  };

  const handleRangeFilter = (key: 'ageRange' | 'priceRange', value: [number, number]) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSort = (value: SortOption) => {
    setFilters(prev => ({
      ...prev,
      sortBy: value
    }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value)
    // setFilters(prev => ({
    //   ...prev,
    //   search: e.target.value
    // }));
  };

  const clearAllFilters = () => {
    setFilters({
      search: '',
      species: [],
      breeds: [],
      ageRange: [0, 15],
      priceRange: [0, 5000],
      purpose: [],
      gender: [],
      vaccinated: undefined,
      neutered: undefined,
      sortBy: 'newest'
    });
  };

  const hasActiveFilters = () => {
    return (
      filters.search !== '' ||
      filters.species.length > 0 ||
      filters.breeds.length > 0 ||
      filters.purpose.length > 0 ||
      filters.gender.length > 0 ||
      filters.vaccinated !== undefined ||
      filters.neutered !== undefined ||
      filters.ageRange[0] !== 0 ||
      filters.ageRange[1] !== 15 ||
      filters.priceRange[0] !== 0 ||
      filters.priceRange[1] !== 5000
    );
  };

  const FiltersContent = () => (
    <>


      <Accordion type="multiple" defaultValue={['purpose', 'species', 'price']}>
        <AccordionItem value="purpose">
          <AccordionTrigger>Purpose</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {purposeOptions.map(purpose => (
                <div key={purpose} className="flex items-center space-x-2">
                  <Checkbox
                    id={`purpose-${purpose}`}
                    checked={filters.purpose.includes(purpose)}
                    onCheckedChange={(checked) =>
                      handleCheckboxFilter('purpose', purpose, checked as boolean)
                    }
                  />
                  <label
                    htmlFor={`purpose-${purpose}`}
                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {purpose.charAt(0).toUpperCase() + purpose.slice(1)}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="species">
          <AccordionTrigger>Species</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {speciesOptions.map(species => (
                <div key={species} className="flex items-center space-x-2">
                  <Checkbox
                    id={`species-${species}`}
                    checked={filters.species.includes(species)}
                    onCheckedChange={(checked) =>
                      handleCheckboxFilter('species', species, checked as boolean)
                    }
                  />
                  <label
                    htmlFor={`species-${species}`}
                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {species}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="breed">
          <AccordionTrigger>Breed</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {breedOptions.map(breed => (
                <div key={breed} className="flex items-center space-x-2">
                  <Checkbox
                    id={`breed-${breed}`}
                    checked={filters.breeds.includes(breed)}
                    onCheckedChange={(checked) =>
                      handleCheckboxFilter('breeds', breed, checked as boolean)
                    }
                  />
                  <label
                    htmlFor={`breed-${breed}`}
                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {breed}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="gender">
          <AccordionTrigger>Gender</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {genderOptions.map(gender => (
                <div key={gender} className="flex items-center space-x-2">
                  <Checkbox
                    id={`gender-${gender}`}
                    checked={filters.gender.includes(gender)}
                    onCheckedChange={(checked) =>
                      handleCheckboxFilter('gender', gender, checked as boolean)
                    }
                  />
                  <label
                    htmlFor={`gender-${gender}`}
                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {gender.charAt(0).toUpperCase() + gender.slice(1)}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="age">
          <AccordionTrigger>Age (years)</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>{filters.ageRange[0]}</span>
                <span>{filters.ageRange[1]}</span>
              </div>
              <Slider
                defaultValue={filters.ageRange}
                min={0}
                max={15}
                step={1}
                onValueChange={(value) => handleRangeFilter('ageRange', value as [number, number])}
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="price">
          <AccordionTrigger>Price ($)</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>${filters.priceRange[0]}</span>
                <span>${filters.priceRange[1]}</span>
              </div>
              <Slider
                defaultValue={filters.priceRange}
                min={0}
                max={5000}
                step={100}
                onValueChange={(value) => handleRangeFilter('priceRange', value as [number, number])}
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="health">
          <AccordionTrigger>Health</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="vaccinated">Vaccinated</Label>
                <Switch
                  id="vaccinated"
                  checked={filters.vaccinated || false}
                  onCheckedChange={(checked) => handleSwitchFilter('vaccinated', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="neutered">Neutered/Spayed</Label>
                <Switch
                  id="neutered"
                  checked={filters.neutered || false}
                  onCheckedChange={(checked) => handleSwitchFilter('neutered', checked)}
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="mt-6">
        <Button onClick={clearAllFilters} variant="outline" className="w-full">
          Clear All Filters
        </Button>
      </div>
    </>
  );



  console.log('filteredPets', loading, filteredPets)
  return (
    <Layout>
      <div className="container py-8">
        <ScrollAnimation type="fade-in">
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Find Your Perfect Pet</h1>
              <p className="text-muted-foreground">Browse our selection of pets available for adoption, sale, or breeding</p>
            </div>

            <div className="flex items-center space-x-4">
              <Label htmlFor="sort-by" className="hidden md:inline">Sort by:</Label>
              <Select onValueChange={(value) => handleSort(value as SortOption)} defaultValue={filters.sortBy}>
                <SelectTrigger className="w-[180px]" id="sort-by">
                  <SelectValue placeholder="Newest" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                </SelectContent>
              </Select>

              {isMobile && (
                <Drawer open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                  <DrawerTrigger asChild>
                    <Button size="icon" variant="outline" className="md:hidden">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </DrawerTrigger>
                  <DrawerContent>
                    <DrawerHeader>
                      <DrawerTitle>Filters</DrawerTitle>
                      <DrawerDescription>Filter pets by category, price, and more.</DrawerDescription>
                    </DrawerHeader>
                    <ScrollArea className="px-4 h-[70vh]">
                      <FiltersContent />
                    </ScrollArea>
                    <DrawerFooter>
                      <Button onClick={() => setIsFilterOpen(false)}>Apply Filters</Button>
                      <DrawerClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DrawerClose>
                    </DrawerFooter>
                  </DrawerContent>
                </Drawer>
              )}
            </div>
          </div>
        </ScrollAnimation>

        {hasActiveFilters() && (
          <ScrollAnimation type="fade-in" delay={200}>
            <div className="mt-4 flex flex-wrap gap-2">
              {filters.search && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Search: {filters.search}
                  <button onClick={() => setFilters(prev => ({ ...prev, search: '' }))}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}

              {filters.species.map(species => (
                <Badge key={species} variant="secondary" className="flex items-center gap-1">
                  {species}
                  <button onClick={() => handleCheckboxFilter('species', species, false)}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}

              {filters.breeds.map(breed => (
                <Badge key={breed} variant="secondary" className="flex items-center gap-1">
                  {breed}
                  <button onClick={() => handleCheckboxFilter('breeds', breed, false)}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}

              {filters.purpose.map(purpose => (
                <Badge key={purpose} variant="secondary" className="flex items-center gap-1">
                  {purpose.charAt(0).toUpperCase() + purpose.slice(1)}
                  <button onClick={() => handleCheckboxFilter('purpose', purpose, false)}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}

              {(filters.ageRange[0] !== 0 || filters.ageRange[1] !== 15) && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Age: {filters.ageRange[0]}-{filters.ageRange[1]} years
                  <button onClick={() => handleRangeFilter('ageRange', [0, 15])}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}

              {(filters.priceRange[0] !== 0 || filters.priceRange[1] !== 5000) && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Price: ${filters.priceRange[0]}-${filters.priceRange[1]}
                  <button onClick={() => handleRangeFilter('priceRange', [0, 5000])}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}

              {filters.vaccinated && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Vaccinated
                  <button onClick={() => handleSwitchFilter('vaccinated', false)}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}

              {filters.neutered && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Neutered/Spayed
                  <button onClick={() => handleSwitchFilter('neutered', false)}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}

              <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                Clear All
              </Button>
            </div>
          </ScrollAnimation>
        )}

        <Separator className="my-6" />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {!isMobile && (
            <ScrollAnimation type="fade-in-left" className="hidden md:block">
              <div className="sticky top-20 border rounded-lg p-4 overflow-hidden">
                <h2 className="font-semibold text-lg mb-4">Filters</h2>
                <ScrollArea className="h-[calc(100vh-220px)] pr-4">
                  <div className="pr-2">
                    <div className="mb-6">
                      <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="search"
                          placeholder="Search pets..."
                          className="pl-8 mt-2 ml-2 w-[95%]"
                          value={searchInput}
                          onChange={handleSearchChange}
                        />
                      </div>
                    </div>
                    <FiltersContent />
                  </div>
                </ScrollArea>
              </div>
            </ScrollAnimation>
          )}

          <div className="md:col-span-3">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="border rounded-lg p-4 space-y-3">
                    <div className="h-40 bg-muted animate-pulse rounded-md" />
                    <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                    <div className="h-4 bg-muted animate-pulse rounded w-1/2" />
                    <div className="flex gap-2">
                      <div className="h-8 bg-muted animate-pulse rounded w-1/3" />
                      <div className="h-8 bg-muted animate-pulse rounded w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredPets.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPets.map((pet, index) => {

                    const isFavourite = petList?.favourites.includes(pet._id)

                    return (
                      <ScrollAnimation
                        key={pet?._id}
                        type="fade-in-up"
                        delay={(index % 3 * 100 + 100) as 100 | 200 | 300 | 400 | 500}
                      >
                        <PetCard pet={pet} isFavourite={isFavourite} className="h-full" />
                      </ScrollAnimation>
                    )
                  })}
                </div>

                {/* <ScrollAnimation type="fade-in" delay={300}>
                  <div className="mt-8">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious href="#" />
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLink href="#" isActive>1</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLink href="#">2</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLink href="#">3</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationNext href="#" />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                </ScrollAnimation> */}
              </>
            ) : (
              <ScrollAnimation type="fade-in">
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium mb-2">No pets found</h3>
                  <p className="text-muted-foreground mb-6">Try adjusting your filters to find what you're looking for.</p>
                  <Button onClick={clearAllFilters} variant="outline">Clear All Filters</Button>
                </div>
              </ScrollAnimation>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default page;
