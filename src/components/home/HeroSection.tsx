'use client'
import React,{useState} from 'react'
import { Input } from '@/components/ui/input';
import { ImageSlider } from '@/components/ui/image-slider';
import { useRouter } from "next/navigation";
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
const heroImages = [
    'https://images.unsplash.com/photo-1560743641-3914f2c45636?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
  ];
  

function HeroSection() {
    const [searchTerm, setSearchTerm] = useState('');
    const router = useRouter();
      const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTerm.trim()) {
          router.push(`/pets?search=${encodeURIComponent(searchTerm.trim())}`);
        }
      };
    

  return (
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
  )
}

export default HeroSection