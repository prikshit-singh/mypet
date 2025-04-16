
export interface Pet {
  id: string;
  name: string;
  type: 'Dog' | 'Cat' | 'Bird' | 'Fish' | 'Small Mammal' | 'Reptile' | 'Other';
  breed: string;
  age: number;
  gender: 'Male' | 'Female';
  description: string;
  purpose: 'adopt' | 'sell' | 'breed';
  price?: number;
  city: string;
  vaccinated: boolean;
  images: string[];
  createdAt: string;
  owner: {
    id: string;
    name: string;
    avatar: string;
    role: 'individual' | 'pet_shop' | 'shelter';
    rating: number;
    joinedAt: string;
  };
  ownerVerified: boolean;
  adoptionRequests?: AdoptionRequest[];
}

export interface AdoptionRequest {
  id: string;
  petId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  status: 'pending' | 'approved' | 'rejected';
  message: string;
  createdAt: string;
}

export interface PetFilter {
  type?: string[] | undefined;
  breed?: string[] | undefined;
  age?: [number, number] | undefined;
  gender?: string[] | undefined;
  city?: string[] | undefined;
  purpose?: string[] | undefined;
  vaccinated?: boolean | undefined;
  verifiedOwner?: boolean | undefined;
  minPrice?: number | undefined;
  maxPrice?: number | undefined;
}
