'use client';

import { ReactNode } from 'react';
import { CivicAuthProvider } from '@civic/auth-web3/react';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  return (
    <CivicAuthProvider
      config={{
        apiKey: process.env.NEXT_PUBLIC_CIVIC_API_KEY || 'demo-key',
        redirectUrl: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000',
        theme: {
          primaryColor: '#8b5cf6',
          borderRadius: '0.5rem',
        }
      }}
    >
      {children}
    </CivicAuthProvider>
  );
}
