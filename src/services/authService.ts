
import { User, UserCredentials, RegisterData, OnboardingData } from '@/types/user';
import { toast } from '@/hooks/use-toast';

// Test users for demo purposes
const DEMO_USERS: User[] = [
  {
    id: "u1",
    name: "John Smith",
    email: "user@example.com",
    avatar: "/placeholder.svg",
    role: "individual",
    isVerified: true,
    joinedAt: "2023-01-15",
    bio: "Pet lover living in San Francisco",
    city: "San Francisco",
    rating: 4.8
  },
  {
    id: "u2",
    name: "Happy Paws Shelter",
    email: "shelter@example.com",
    avatar: "/placeholder.svg",
    role: "shelter",
    isVerified: true,
    joinedAt: "2022-03-10",
    bio: "No-kill animal shelter dedicated to finding forever homes",
    city: "Los Angeles",
    phone: "555-123-4567",
    address: "123 Shelter Ave",
    postalCode: "90001",
    state: "California",
    licenseNumber: "SH-12345",
    establishmentYear: "2010",
    website: "happypaws.example.com",
    operatingHours: "Mon-Sat: 9am-6pm",
    emergencyContact: "555-987-6543",
    rating: 4.9
  },
  {
    id: "u3",
    name: "Elite Pet Shop",
    email: "petshop@example.com",
    avatar: "/placeholder.svg",
    role: "pet_shop",
    isVerified: true,
    joinedAt: "2022-08-22",
    bio: "Professional pet shop specializing in various animals",
    city: "Miami",
    phone: "555-987-6543",
    address: "456 Pet Store Blvd",
    postalCode: "33101",
    state: "Florida",
    licenseNumber: "PS-67890",
    establishmentYear: "2015",
    website: "elitepets.example.com",
    operatingHours: "Mon-Sun: 10am-7pm",
    rating: 4.7
  }
];

// Passwords for demo accounts (in a real app, these would be hashed)
const DEMO_PASSWORDS: Record<string, string> = {
  "user@example.com": "password123",
  "shelter@example.com": "password123",
  "petshop@example.com": "password123"
};

// Store onboarding status in localStorage
const ONBOARDING_KEY = 'needsOnboarding';

export const authService = {
  // Check if user is logged in
  isLoggedIn: (): boolean => {
    return localStorage.getItem('currentUser') !== null;
  },

  // Get the current logged in user
  getCurrentUser: (): User | null => {
    const userString = localStorage.getItem('currentUser');
    return userString ? JSON.parse(userString) : null;
  },
  
  // Check if user needs onboarding
  needsOnboarding: (): boolean => {
    return localStorage.getItem(ONBOARDING_KEY) === 'true';
  },
  
  // Clear onboarding flag
  clearOnboardingFlag: (): void => {
    localStorage.removeItem(ONBOARDING_KEY);
  },

  // Login function
  login: async (credentials: UserCredentials): Promise<User> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Check if email exists
    const user = DEMO_USERS.find(u => u.email === credentials.email);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Check if password matches
    if (DEMO_PASSWORDS[credentials.email] !== credentials.password) {
      throw new Error('Invalid email or password');
    }

    // Store user in localStorage
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    return user;
  },

  // Register function
  register: async (registerData: RegisterData): Promise<User> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Check if email is already taken
    if (DEMO_USERS.some(u => u.email === registerData.email)) {
      throw new Error('Email is already taken');
    }

    // Create new user
    const newUser: User = {
      id: `u${DEMO_USERS.length + 1}`,
      name: registerData.name,
      email: registerData.email,
      avatar: "/placeholder.svg",
      role: registerData.role,
      isVerified: false,
      joinedAt: new Date().toISOString(),
      bio: "",
      rating: 0
    };

    // In a real app, we would store this in a database
    // For now, we'll just add it to our demo users array
    DEMO_USERS.push(newUser);
    
    // Add password to demo passwords
    DEMO_PASSWORDS[registerData.email] = registerData.password;

    // Store user in localStorage
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    
    // Set onboarding flag if role is shelter or pet_shop
    if (registerData.role === 'shelter' || registerData.role === 'pet_shop') {
      localStorage.setItem(ONBOARDING_KEY, 'true');
    }
    
    return newUser;
  },
  
  // Complete onboarding
  completeOnboarding: async (onboardingData: OnboardingData): Promise<User> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Get current user
    const currentUser = authService.getCurrentUser();
    
    if (!currentUser) {
      throw new Error('No user is currently logged in');
    }
    
    // Update user with onboarding data
    const updatedUser: User = {
      ...currentUser,
      address: onboardingData.address,
      city: onboardingData.city,
      state: onboardingData.state,
      postalCode: onboardingData.postalCode,
      phone: onboardingData.phone,
      licenseNumber: onboardingData.licenseNumber,
      establishmentYear: onboardingData.establishmentYear,
      website: onboardingData.website,
      operatingHours: onboardingData.operatingHours,
      emergencyContact: onboardingData.emergencyContact
    };
    
    // Update user in demo users array
    const userIndex = DEMO_USERS.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
      DEMO_USERS[userIndex] = updatedUser;
    }
    
    // Update user in localStorage
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    
    // Clear onboarding flag
    localStorage.removeItem(ONBOARDING_KEY);
    
    return updatedUser;
  },

  // Logout function
  logout: (): void => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem(ONBOARDING_KEY);
  }
};
