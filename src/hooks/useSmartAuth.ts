'use client';

import { useUser as useCivicUser } from '@civic/auth-web3/react';
import { useFallbackAuth } from '@/components/auth/FallbackAuthProvider';

// 检测是否在 Fallback 模式
function isFallbackMode() {
  // 检查是否有 fallback provider 的上下文
  try {
    return !!localStorage.getItem('fallback_auth_user') || !window.navigator.onLine;
  } catch {
    return false;
  }
}

export function useSmartAuth() {
  const fallbackAuth = useFallbackAuth();
  
  let civicAuth;
  try {
    civicAuth = useCivicUser();
  } catch (error) {
    // 如果 Civic Auth 不可用，civicAuth 将是 undefined
    civicAuth = undefined;
  }

  // 如果在 fallback 模式或 civic auth 不可用，使用 fallback
  if (!civicAuth || fallbackAuth.user) {
    return {
      user: fallbackAuth.user,
      isLoading: fallbackAuth.isLoading,
      signIn: fallbackAuth.signIn,
      signOut: fallbackAuth.signOut,
      error: fallbackAuth.error,
      mode: 'fallback' as const
    };
  }

  // 使用 Civic Auth
  return {
    user: civicAuth.user,
    isLoading: civicAuth.isLoading,
    signIn: civicAuth.signIn,
    signOut: civicAuth.signOut,
    error: null,
    mode: 'civic' as const
  };
}
