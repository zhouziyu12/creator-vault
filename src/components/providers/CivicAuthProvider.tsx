'use client';

import { ReactNode, createContext, useContext, useState, useEffect } from 'react';
import { getSepoliaBalance } from '@/lib/web3/balance';

interface MockUser {
  id: string;
  wallet?: {
    address: string;
    balance?: string;
    network?: string;
  };
  email?: string;
}

interface CivicAuthContextType {
  user: MockUser | null;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
  refreshBalance: () => Promise<void>;
}

const CivicAuthContext = createContext<CivicAuthContextType | undefined>(undefined);

interface CivicAuthProviderProps {
  children: ReactNode;
}

export function CivicAuthProvider({ children }: CivicAuthProviderProps) {
  // 使用你验证过的真实钱包地址
  const VERIFIED_WALLET_ADDRESS = '0x84Ff138D180e7CcA7C92C94861bbe5D182eD703E';
  
  const [user, setUser] = useState<MockUser | null>({
    id: '3eded658-396d-45cc-89f7-3edd83e10223',
    wallet: {
      address: VERIFIED_WALLET_ADDRESS,
      balance: '0.2',
      network: 'Sepolia'
    }
  });
  const [isLoading, setIsLoading] = useState(false);

  // 获取真实余额
  const refreshBalance = async () => {
    if (!user?.wallet?.address) return;
    
    try {
      setIsLoading(true);
      const balance = await getSepoliaBalance(user.wallet.address);
      
      setUser(prev => prev ? {
        ...prev,
        wallet: {
          ...prev.wallet!,
          balance
        }
      } : null);
      
      console.log('✅ 余额更新成功:', balance, 'SepoliaETH');
    } catch (error) {
      console.error('❌ 余额更新失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 页面加载时获取真实余额
  useEffect(() => {
    if (user?.wallet?.address) {
      refreshBalance();
    }
  }, []);

  const login = () => {
    setIsLoading(true);
    setTimeout(() => {
      setUser({
        id: '3eded658-396d-45cc-89f7-3edd83e10223',
        wallet: {
          address: VERIFIED_WALLET_ADDRESS,
          balance: '0.2',
          network: 'Sepolia'
        }
      });
      setIsLoading(false);
      // 登录后立即刷新余额
      setTimeout(refreshBalance, 500);
    }, 1000);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <CivicAuthContext.Provider value={{ user, isLoading, login, logout, refreshBalance }}>
      {children}
    </CivicAuthContext.Provider>
  );
}

export function useUser() {
  const context = useContext(CivicAuthContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a CivicAuthProvider');
  }
  return context;
}
