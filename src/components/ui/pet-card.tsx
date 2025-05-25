
import React from 'react';
import Link from 'next/link';
import { Heart, MapPin, Medal, Shield, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Pet } from '@/types/pet';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { getAllPets ,toggolFavouritePet} from '@/services/petServices';
interface PetCardProps {
  pet: Pet;
  className?: string;
  isFavourite:boolean
}

export function PetCard({ pet, className ,isFavourite}: PetCardProps) {
    const queryClient = useQueryClient();
  const purposeColors = {
    adopt: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
    sell: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
    breed: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100',
  };

  const purposeLabel = {
    adopt: 'Adoption',
    sell: 'For Sale',
    breed: 'For Breeding',
  };

  const ToggolFavourite = useMutation<any, Error, any>(
        {
          mutationFn: toggolFavouritePet,
          onSuccess: async (pet: any) => {
            await queryClient.invalidateQueries({ queryKey: ['petList'] });
            // toast({
            //   title: 'Pet saved successfully',
            // });
          },
          onError: (err: any) => {
            toast({
              title: 'Pet Request failed',
              description: err.message,
              variant: 'destructive',
            });
    
          },
        }
      );

      const handleToggol = (id:string)=>{
        ToggolFavourite.mutate(id)
      }

  return (
    <div className={cn('pet-card h-full flex flex-col border rounded-lg overflow-hidden bg-card', className)}>
      <div className="relative overflow-hidden h-48">
        <img 
          src={pet.images[0]} 
          alt={pet.name} 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-2 right-2">
          <Button 
            variant="secondary" 
            size="icon" 
            className="h-8 w-8 rounded-full bg-white/80 text-foreground hover:bg-white backdrop-blur"
            onClick={()=>handleToggol(pet._id)}
          >
            {isFavourite ?<Heart className="h-4 w-4 fill-red-500 text-white  bg-red" /> : <Heart className="h-4 w-4 " /> }
            
            <span className="sr-only">Add to favorites</span>
          </Button>
        </div>
        <div className="absolute bottom-2 left-2 flex gap-1.5">
          <Badge className={purposeColors[pet.purpose as keyof typeof purposeColors]}>
            {purposeLabel[pet.purpose as keyof typeof purposeLabel]}
          </Badge>
          {pet.vaccinated && (
            <Badge variant="secondary" className="bg-white/80 backdrop-blur flex items-center gap-1">
              <Shield className="h-3 w-3" /> Vaccinated
            </Badge>
          )}
        </div>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg line-clamp-1">
            <Link href={`/pets/${pet._id}`} className="hover:text-primary">
              {pet.name}
            </Link>
          </h3>
          {pet.ownerVerified && (
            <Badge variant="outline" className="flex items-center gap-1 border-green-500 text-green-600">
              <Medal className="h-3 w-3" /> Verified
            </Badge>
          )}
        </div>
        <div className="flex items-center text-sm text-muted-foreground mb-2">
          <MapPin className="h-3.5 w-3.5 mr-1" />
          <span>{typeof pet.address === 'object' && pet.address !== null ? pet.address.city : 'No city'}</span>
          <span className="mx-2">•</span>
          <Calendar className="h-3.5 w-3.5 mr-1" />
          <span>{pet.age} {pet.age === 1 ? 'year' : 'years'}</span>
        </div>
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge variant="secondary">{pet.type}</Badge>
          <Badge variant="secondary">{pet.breed}</Badge>
          <Badge variant="secondary">{pet.gender}</Badge>
        </div>
        
        {pet.purpose === 'adopt' ? (
          <div className="font-bold text-lg mb-3 text-green-600">
            Free Adoption
          </div>
        ) : pet.purpose === 'sell' ? (
          <div className="font-bold text-lg mb-3 text-primary">
            ${pet.price?.toFixed(2)}
          </div>
        ) : (
          <div className="font-bold text-lg mb-3 text-purple-600">
            {pet.gender === 'Male' ? (
              <>Stud Fee: ${pet.price?.toFixed(2)}</>
            ) : (
              <>Breeding</>
            )}
          </div>
        )}
        
        <div className="flex gap-2 mt-auto pt-4">
          <Button asChild className="w-full">
            <Link href={`/pets/${pet._id}`}>View Details</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
