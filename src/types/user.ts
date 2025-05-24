
export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'individual' | 'pet_shop' | 'shelter';
  isVerified: boolean;
  joinedAt: string;
  bio: string;
  phone?: string;
  address?: string;
  city?: string;
  rating: number;
  // Additional fields for shelter/pet shop
  licenseNumber?: string;
  establishmentYear?: string;
  website?: string;
  postalCode?: string;
  state?: string;
  operatingHours?: string;
  emergencyContact?: string;
}

export interface UserCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'individual' | 'pet_shop' | 'shelter';
}

export interface OnboardingData {
  address: string;
  city: string;
  state: string;
  postalCode: string;
  phone: string;
  licenseNumber?: string;
  establishmentYear?: string;
  website?: string;
  operatingHours?: string;
  emergencyContact?: string;
}

// Add new interface for address
export interface Address {
  _id?: string;
  street: string;
  city: string;
  state: string;
  zip?: string;
  postalCode?:string
  isDefault: boolean;
  createdAt?: string;
}

