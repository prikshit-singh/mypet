
import Cookies from 'js-cookie';
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'https://thepetwala.com/api';



export const getAllChats = async () => {
    console.log('get all chats')
    const token = Cookies.get('token');
    const res = await fetch(`${API_BASE}/chat/get-all-chats`, {
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
    const chatsData = await res.json()
    return chatsData?.chats || [];
}

export const getSingleChat = async (id: string) => {
    const token = Cookies.get('token');
    console.log('getSingleChat')
    const res = await fetch(`${API_BASE}/chat/${id}`, {
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
    const chatData = await res.json()
    return {chat:chatData?.chat,messages:chatData?.messages};
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


export const sendRequest = async (payload: any) => {
    const token = Cookies.get('token');

    if (!token) {
        throw new Error('No token found');
    }
    console.log(`${API_BASE}/request/send`, payload)
    const res = await fetch(`${API_BASE}/request/send`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Signup failed');
    }
    return res.json();
}

export const updateRequest = async (payload: any) => {
    const token = Cookies.get('token');

    if (!token) {
        throw new Error('No token found');
    }
    console.log(`${API_BASE}/request/update`, payload)
    const res = await fetch(`${API_BASE}/request/update`, {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Signup failed');
    }
    return res.json();
}


export const getSentRequest = async () => {
    const token = Cookies.get('token');
    if (!token) {
        throw new Error('No token found');
    }
    const res = await fetch(`${API_BASE}/request/sent`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Signup failed');
    }
    const data = await res.json()
    return data?.requests || [];
}

export const getReceivedRequest = async () => {
    const token = Cookies.get('token');
    if (!token) {
        throw new Error('No token found');
    }
    const res = await fetch(`${API_BASE}/request/received`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Signup failed');
    }
    const data = await res.json()
    return data?.requests || [];
}



