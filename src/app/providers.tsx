'use client';

import { GoogleOAuthProvider } from '@react-oauth/google';
import React from 'react';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  console.log('NEXT_PUBLIC_GOOGLE_CLIENT_ID',process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID)
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
      {children}
    </GoogleOAuthProvider>
  );
}
