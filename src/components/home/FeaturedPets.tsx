'use client';
import { PetCard } from '@/components/ui/pet-card';
import { featuredPets } from '@/data/mock-data';
import { ArrowRight } from 'lucide-react';
import { getAllPets } from '@/services/petServices';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';

import Link from 'next/link';

const FeaturedPets = () => {
   const { data: petList, isLoading, isError } = useQuery({
      queryKey: ['petList'],
      queryFn: getAllPets,
      refetchOnMount:true,
      retry: true,
    });
  
  
  return (
  <section className="py-12 px-4">
    <div className="container">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold fade-in-left">Featured Pets</h2>
        <Link href="/pets" className="text-primary flex items-center fade-in-right">
          View All <ArrowRight className="h-4 w-4 ml-1" />
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">


      {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(4)].map((_, i) => (
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
            )

          : 
          
          petList?.pets.map((pet:any, index:number) => {
            if(index<4){
const isFavourite = petList?.favourites.includes(pet._id)
              console.log(petList,isFavourite)

              return (
                <div key={pet._id} className={`fade-in-up delay-${index * 100}`}>
                  <PetCard pet={pet} isFavourite={isFavourite}  />
                </div>
              )
            }
          })
          }

        {/* {petList.map((pet:any, index:number) => (
          <div key={pet.id} className={`fade-in-up delay-${index * 100}`}>
            <PetCard pet={pet} />
          </div>
        ))} */}
      </div>
    </div>
  </section>
)};

export default FeaturedPets;
