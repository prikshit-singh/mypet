'use client';
import { PetCard } from '@/components/ui/pet-card';
import { featuredPets } from '@/data/mock-data';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

const FeaturedPets = () => (
  <section className="py-12 px-4">
    <div className="container">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold fade-in-left">Featured Pets</h2>
        <Link href="/pets" className="text-primary flex items-center fade-in-right">
          View All <ArrowRight className="h-4 w-4 ml-1" />
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {featuredPets.map((pet, index) => (
          <div key={pet.id} className={`fade-in-up delay-${index * 100}`}>
            <PetCard pet={pet} />
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturedPets;
