'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name?: string;
  email?: string;
  wallet?: {
    address: string;
  };
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface FallbackAuthProviderProps {
  children: ReactNode;
}

export function FallbackAuthProvider({ children }: FallbackAuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 检查是否有保存的用户
    const savedUser = localStorage.getItem('fallback_auth_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Failed to parse saved user:', e);
      }
    }
    setIsLoading(false);
  }, []);

  const signIn = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // 模拟认证过程
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser: User = {
        id: 'demo_user_' + Date.now(),
        name: 'Demo Creator',
        email: 'demo@creatorvault.com',
        wallet: {
          address: '0x' + Math.random().toString(16).substr(2, 40)
        }
      };
      
      setUser(mockUser);
      localStorage.setItem('fallback_auth_user', JSON.stringify(mockUser));
      
      console.log('✅ Fallback authentication successful:', mockUser);
    } catch (err) {
      setError('Authentication failed');
      console.error('❌ Fallback auth error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    
    try {
      setUser(null);
      localStorage.removeItem('fallback_auth_user');
      console.log('✅ Fallback sign out successful');
    } catch (err) {
      setError('Sign out failed');
      console.error('❌ Fallback sign out error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signOut, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useFallbackAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useFallbackAuth must be used within a FallbackAuthProvider');
  }
  return context;
}
