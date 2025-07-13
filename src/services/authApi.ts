// File: src/services/authApi.ts
import {   User } from '@/types/user';
import { signupPayload ,loginPayload} from '@/types/apiPayloadTypes';
import { RegisterData } from '@/types/user';
import Cookies from 'js-cookie';
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'https://thepetwala.com/api';
// const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';
/**
 * Register a new user
 */
export async function signupService(payload: signupPayload){
  const res = await fetch(`${API_BASE}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Signup failed');
  }

  return res.json();
}
/**
 * Login an existing user
 */
export async function loginService(payload: loginPayload) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Login failed');
  }

  return res.json();
}

export async function loginWithGoogleService(payload: {token:string}) {
  const res = await fetch(`${API_BASE}/auth/google`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Login failed');
  }
  return res.json();
}




/**
 * Logout the current user (client‑side)
 */
export function logout(): void {
  localStorage.removeItem('currentUser');
}

export const getCurrentUserService = async () => {
  const token = Cookies.get('token');

  if (!token) {
    throw new Error('No token found');
  }

  const res = await fetch(`${API_BASE}/auth/me`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch user');
  }

  return res.json(); // Assuming your backend returns { user: {...} }
};

export const createAddress = async(payload:any)=>{
  const token = Cookies.get('token');

  if (!token) {
    throw new Error('No token found');
  }

  const res = await fetch(`${API_BASE}/address/create-address`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Signup failed');
  }

  return res.json();
}

export const sendForgetPasswordLink = async(payload:any)=>{

  console.log(payload,typeof payload)
  
  const res = await fetch(`${API_BASE}/auth/send-forget-password-request`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },

    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Forget Password request failed.');
  }

  return res.json();
}


export const sendResetPassword = async(payload:any)=>{

  console.log(payload,typeof payload)
  
  const res = await fetch(`${API_BASE}/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json',Authorization: `Bearer ${payload.token}` },

    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Forget Password request failed.');
  }

  return res.json();
}

export const verifyAccount = async(payload:any)=>{

  console.log(payload,typeof payload)
  
  const res = await fetch(`${API_BASE}/auth/verify-account`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json',Authorization: `Bearer ${payload.token}` },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Forget Password request failed.');
  }

  return res.json();
}

export const getAddresses = async(payload:any)=>{
  const token = Cookies.get('token');

  if (!token) {
    throw new Error('No token found');
  }

  const res = await fetch(`${API_BASE}/address/get-address`, {
    method: 'Get',
    headers: {  Authorization: `Bearer ${token}`, },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Signup failed');
  }
console.log('response', res)
  return res.json();
}

export const updateAddressById = async(payload:any)=>{
  const token = Cookies.get('token');

  if (!token) {
    throw new Error('No token found');
  }

  console.log('payload',payload)

  const res = await fetch(`${API_BASE}/address/${payload._id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Address not updated');
  }

  return res.json();
}

export const updateCurrentUser = async(payload:any)=>{
  const token = Cookies.get('token');

  if (!token) {
    throw new Error('No token found');
  }

  console.log('payload',payload)

  const res = await fetch(`${API_BASE}/auth/update-me`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Address not updated');
  }
  return res.json();
}

export const updateCurrentUserPassword = async(payload:any)=>{
  const token = Cookies.get('token');

  if (!token) {
    throw new Error('No token found');
  }

  const res = await fetch(`${API_BASE}/auth/update-password`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Address not updated');
  }
  return res.json();
}


export const updateCurrentUserProfileAvatar = async(payload:any)=>{
  const token = Cookies.get('token');

  if (!token) {
    throw new Error('No token found');
  }

  const res = await fetch(`${API_BASE}/auth/update-avatar`, {
    method: 'PUT',
    headers: {  Authorization: `Bearer ${token}`, },
    body:payload,
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Address not updated');
  }
  return res.json();
}