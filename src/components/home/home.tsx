"use client"
import Image from "next/image";
import React, { useState, useEffect } from 'react';
import Link from "next/link";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, ArrowRight, PawPrint, Heart, DollarSign, Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ImageSlider } from '@/components/ui/image-slider';
import { PetCard } from '@/components/ui/pet-card';
import Layout from '@/components/layout/Layout';
import { featuredPets } from '@/data/mock-data';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import { useRouter } from 'next/navigation';


const heroImages = [
  'https://images.unsplash.com/photo-1560743641-3914f2c45636?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
];

const quickFilters = [
  { 
    name: 'Adopt', 
    icon: <PawPrint className="h-5 w-5" />, 
    description: 'Find pets needing a forever home',
    color: 'bg-green-100 dark:bg-green-900',
    textColor: 'text-green-800 dark:text-green-100',
    link: '/pets?purpose=adopt'
  },
  { 
    name: 'Buy', 
    icon: <DollarSign className="h-5 w-5" />, 
    description: 'Purchase from trusted sellers',
    color: 'bg-blue-100 dark:bg-blue-900',
    textColor: 'text-blue-800 dark:text-blue-100',
    link: '/pets?purpose=sell'
  },
  { 
    name: 'Sell', 
    icon: <Heart className="h-5 w-5" />, 
    description: 'List your pet for sale',
    color: 'bg-red-100 dark:bg-red-900',
    textColor: 'text-red-800 dark:text-red-100',
    link: '/add-pet'
  },
  { 
    name: 'Breeding', 
    icon: <Calendar className="h-5 w-5" />, 
    description: 'Connect for breeding services',
    color: 'bg-purple-100 dark:bg-purple-900',
    textColor: 'text-purple-800 dark:text-purple-100',
    link: '/pets?purpose=breed'
  },
];

const testimonials = [
  {
    quote: " ThePetWala helped me find my perfect furry companion. The process was so easy!",
    author: "Sarah Johnson",
    image: "https://i.pravatar.cc/150?img=10"
  },
  {
    quote: "As a breeder, I've connected with wonderful pet owners through this platform.",
    author: "David Miller",
    image: "https://i.pravatar.cc/150?img=11"
  },
  {
    quote: "Our shelter has successfully placed dozens of animals in loving homes thanks to  ThePetWala.",
    author: "Happy Paws Shelter",
    image: "https://i.pravatar.cc/150?img=12"
  }
];

const Home: React.FC =() => {
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();
  
  // Initialize scroll animation
  useScrollAnimation();
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
        router.push(`/pets?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative">
        <div className="h-[500px] md:h-[600px] w-full relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-black/30 z-10" />
          <ImageSlider images={heroImages} className="h-full" />
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white text-center p-4">
            <h1 className="text-3xl md:text-5xl font-bold mb-4 animate-slide-up">
              Find Your Perfect Pet Companion
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              Connect with pets for adoption, sale, or breeding from trusted owners, shelters, and breeders.
            </p>
            <form onSubmit={handleSearch} className="w-full max-w-md bg-white/20 backdrop-blur-md rounded-lg p-2 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="flex gap-2">
                <Input
                  placeholder="Search for pets..."
                  className="bg-white border-0 text-gray-800 placeholder-gray-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button type="submit">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Quick Filters */}
      <section className="py-12 px-4 bg-secondary/50">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 fade-in-up">How Can We Help You Today?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {quickFilters.map((filter, index) => (
              <Link
                key={filter.name}
                href={filter.link}
                className={`${filter.color} ${filter.textColor} p-6 rounded-xl transition-all duration-300 hover:shadow-lg flex flex-col items-center text-center group fade-in-up delay-${index * 100}`}
              >
                <div className="p-3 rounded-full bg-white/20 mb-4 group-hover:scale-110 transition-transform">
                  {filter.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{filter.name}</h3>
                <p className="text-sm opacity-90 mb-3">{filter.description}</p>
                <div className="flex items-center text-sm font-medium">
                  Learn More <ArrowRight className="h-4 w-4 ml-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Pets */}
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
                <PetCard pet={pet} isFavourite={false} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 px-4 bg-secondary/50">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 fade-in-up">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card rounded-xl p-6 text-center flex flex-col items-center fade-in-up">
              <div className="bg-primary/10 text-primary rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <Search className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Browse</h3>
              <p className="text-muted-foreground">
                Search through thousands of pets from shelters, breeders, and individual owners.
              </p>
            </div>
            <div className="bg-card rounded-xl p-6 text-center flex flex-col items-center fade-in-up delay-200">
              <div className="bg-primary/10 text-primary rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <Heart className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Connect</h3>
              <p className="text-muted-foreground">
                Message owners directly to ask questions or schedule a meet-up with your potential pet.
              </p>
            </div>
            <div className="bg-card rounded-xl p-6 text-center flex flex-col items-center fade-in-up delay-400">
              <div className="bg-primary/10 text-primary rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <PawPrint className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Adopt or Buy</h3>
              <p className="text-muted-foreground">
                Complete the process safely and bring your new friend home to start creating memories.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 px-4">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 fade-in-up">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div key={index} className={`bg-card p-6 rounded-xl fade-in-up delay-${index * 200}`}>
                <div className="flex flex-col h-full">
                  <div className="mb-4">
                    <svg className="h-8 w-8 text-primary opacity-50" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                  </div>
                  <p className="flex-grow mb-4 text-muted-foreground">{testimonial.quote}</p>
                  <div className="flex items-center">
                    <img
                      src={testimonial.image}
                      alt={testimonial.author}
                      className="h-10 w-10 rounded-full mr-3"
                    />
                    <span className="font-medium">{testimonial.author}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-primary text-primary-foreground">
        <div className="container text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 fade-in-up">Ready to Find Your Perfect Pet?</h2>
          <p className="max-w-2xl mx-auto mb-8 fade-in-up delay-200">
            Whether you're looking to adopt, buy, sell, or breed,  ThePetWala has everything you need to connect with pets and pet lovers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center fade-in-up delay-400">
            <Button asChild size="lg" variant="secondary">
              <Link href="/pets">Browse Pets</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-primary-foreground">
              <Link href="/login">Sign Up Now</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export default Home
