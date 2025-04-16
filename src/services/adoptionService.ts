
import { AdoptionRequest, Pet } from '@/types/pet';
import { User } from '@/types/user';

// In-memory storage for adoption requests (would be a database in a real app)
let adoptionRequests: AdoptionRequest[] = [];

export const adoptionService = {
  // Submit an adoption request
  submitRequest: async (petId: string, message: string): Promise<AdoptionRequest> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Get current user
    const userString = localStorage.getItem('currentUser');
    if (!userString) {
      throw new Error('You must be logged in to submit an adoption request');
    }
    
    const user: User = JSON.parse(userString);
    
    // Create new adoption request
    const newRequest: AdoptionRequest = {
      id: `req_${Date.now()}`,
      petId,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      status: 'pending',
      message,
      createdAt: new Date().toISOString()
    };
    
    // Add to our collection
    adoptionRequests.push(newRequest);
    
    return newRequest;
  },
  
  // Respond to an adoption request (approve or reject)
  respondToRequest: async (requestId: string, approved: boolean): Promise<AdoptionRequest> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Find the request
    const requestIndex = adoptionRequests.findIndex(req => req.id === requestId);
    
    if (requestIndex === -1) {
      throw new Error('Adoption request not found');
    }
    
    // Update the request
    adoptionRequests[requestIndex] = {
      ...adoptionRequests[requestIndex],
      status: approved ? 'approved' : 'rejected'
    };
    
    return adoptionRequests[requestIndex];
  },
  
  // Get all adoption requests for a specific pet
  getRequestsForPet: async (petId: string): Promise<AdoptionRequest[]> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return adoptionRequests.filter(req => req.petId === petId);
  },
  
  // Get all adoption requests made by the current user
  getUserRequests: async (): Promise<AdoptionRequest[]> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Get current user
    const userString = localStorage.getItem('currentUser');
    if (!userString) {
      throw new Error('You must be logged in to view your adoption requests');
    }
    
    const user: User = JSON.parse(userString);
    
    return adoptionRequests.filter(req => req.userId === user.id);
  }
};
