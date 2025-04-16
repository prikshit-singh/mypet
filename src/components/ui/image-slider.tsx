
import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ImageSliderProps {
  images: string[];
  className?: string;
  autoPlay?: boolean;
  interval?: number;
}

export function ImageSlider({ 
  images, 
  className,
  autoPlay = true,
  interval = 5000 
}: ImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  }, [images.length]);

  const prev = useCallback(() => {
    setCurrentIndex((prevIndex) => prevIndex === 0 ? images.length - 1 : prevIndex - 1);
  }, [images.length]);

  useEffect(() => {
    if (!autoPlay) return;
    
    const intervalId = setInterval(() => {
      next();
    }, interval);
    
    return () => clearInterval(intervalId);
  }, [next, autoPlay, interval]);

  if (!images.length) return null;
  
  return (
    <div className={cn("relative overflow-hidden rounded-lg", className)}>
      <div 
        className="flex transition-transform duration-500 ease-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((image, index) => (
          <div key={index} className="min-w-full h-full">
            <img
              src={image}
              alt={`Slide ${index}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
      
      {/* Navigation Buttons - Fixed z-index and positioning */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white/90 text-foreground rounded-full p-1 z-20 backdrop-blur"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          prev();
        }}
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white/90 text-foreground rounded-full p-1 z-20 backdrop-blur"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          next();
        }}
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5" />
      </Button>
      
      {/* Indicators */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-20">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setCurrentIndex(index);
            }}
            className={cn(
              "w-2 h-2 rounded-full transition-all",
              index === currentIndex
                ? "bg-white w-4"
                : "bg-white/50 hover:bg-white/80"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
