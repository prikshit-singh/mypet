
import Cookies from 'js-cookie';
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

export const createPet = async(payload:any)=>{
    const token = Cookies.get('token');
    console.log(payload)
  
    if (!token) {
      throw new Error('No token found');
    }
  
    const res = await fetch(`${API_BASE}/pet/create-pet`, {
      method: 'POST',
      headers: { 
        // 'Content-Type': 'multipart/form-data',
         Authorization: `Bearer ${token}`, },
      body:payload,
    });
  
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Signup failed');
    }
  
    return res.json();
  }