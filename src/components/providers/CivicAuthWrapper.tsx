'use client';

import { useEffect } from 'react';
import { useUser } from '@civic/auth-web3/react';

export function CivicAuthWrapper({ children }: { children: React.ReactNode }) {
  const { user } = useUser();

  useEffect(() => {
    // 处理登录成功事件
    if (user) {
      console.log('✅ Civic Auth sign-in successful:', user.name || user.email);
    }
  }, [user]);

  useEffect(() => {
    // 监听登出事件
    const handleBeforeUnload = () => {
      if (!user) {
        console.log('👋 User signed out from Civic Auth');
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [user]);

  return <>{children}</>;
}
