
import Cookies from 'js-cookie';
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

export const createPet = async (payload: any) => {
  const token = Cookies.get('token');
  console.log(payload)

  if (!token) {
    throw new Error('No token found');
  }

  const res = await fetch(`${API_BASE}/pet/create-pet`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: payload,
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Signup failed');
  }

  return res.json();
 if (!token) {
    throw new Error('No token found');
  }
}

export const updatePet = async ({ id, payload }: { id: string; payload: any }) => {
  const token = Cookies.get('token');
  console.log(payload)

  if (!token) {
    throw new Error('No token found');
  }

  const res = await fetch(`${API_BASE}/pet/${id}`, {
    method: 'PUT',
    headers: {
      // 'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
    body: payload,
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Signup failed');
  }

  return res.json();
 if (!token) {
    throw new Error('No token found');
  }
}

export const getAllPets = async () => {
  console.log('get all pets')
  const token = Cookies.get('token');
  const res = await fetch(`${API_BASE}/pet`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Pet fetch failed');
  }
  const petsData = await res.json()
  return { pets: petsData?.pets, favourites: petsData?.favourites };
}

export const getSinglePets = async (id: string) => {
  const token = Cookies.get('token');
  console.log('getSinglePets')
  const res = await fetch(`${API_BASE}/pet/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Pet fetch failed');
  }
  const petsData = await res.json()
  return petsData?.pet;
}

export const getUserPets = async () => {
  const token = Cookies.get('token');

  if (!token) {
    throw new Error('No token found');
  }

  console.log('getUserPets')
  const res = await fetch(`${API_BASE}/pet/get-user-pets`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Pet fetch failed');
  }
  const petsData = await res.json()
  return petsData?.pet;
}

export const getUserFavouritePets = async () => {
  const token = Cookies.get('token');

  if (!token) {
    throw new Error('No token found');
  }

  console.log('getUserPets')
  const res = await fetch(`${API_BASE}/pet/get-user-favourite-pets`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Pet fetch failed');
  }
  const petsData = await res.json()
  return petsData?.pet;
}

export const deleteSinglePets = async (id: string) => {
  const token = Cookies.get('token');
  console.log(id)
  const res = await fetch(`${API_BASE}/pet/delete/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Pet fetch failed');
  }
  const petsData = await res.json()
  return petsData;
}

export const toggolFavouritePet = async (id: string) => {
  console.log('toggolFavouritePet')

  const token = Cookies.get('token');
  console.log(id)

  if (!token) {
    throw new Error('No token found');
  }
  const res = await fetch(`${API_BASE}/pet/toggol-favourite/${id}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Pet fetch failed');
  }
  const petsData = await res.json()
  return petsData?.pet;
}

export const ratePetOwner = async (payload: { ownerId: string, rating: number, comment: string }) => {
  const { ownerId, rating, comment } = payload
  console.log('💬 Rating pet owner:', ownerId, 'with rating:', rating, 'with comment:', comment);

  const token = Cookies.get('token');

  if (!token) {
    throw new Error('No token found');
  }

  const res = await fetch(`${API_BASE}/pet/pet-owner-rating/${ownerId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ rating, comment }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to rate pet owner');
  }

  const data = await res.json();
  return data;
};

export const getUserSinglePet = async (id: string) => {
  const token = Cookies.get('token');

  if (!token) {
    throw new Error('No token found');
  }

  console.log('getUserSinglePet')
  const res = await fetch(`${API_BASE}/pet/get-user-single-pet/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
     Authorization: `Bearer ${token}`
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Pet fetch failed');
  }
  const petsData = await res.json()
  return petsData?.pet;
}



