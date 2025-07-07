'use client';

import { useState, useEffect, ReactNode } from 'react';
import { CivicAuthProvider } from '@civic/auth-web3/react';
import { FallbackAuthProvider } from './FallbackAuthProvider';

interface SmartAuthProviderProps {
  children: ReactNode;
  clientId: string;
}

export function SmartAuthProvider({ children, clientId }: SmartAuthProviderProps) {
  const [authMode, setAuthMode] = useState<'checking' | 'civic' | 'fallback'>('checking');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 检测 Civic Auth 是否可用
    const checkCivicAuth = async () => {
      try {
        console.log('🔍 Testing Civic Auth connectivity...');
        
        // 测试 Civic Auth 服务器连接
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5秒超时
        
        const response = await fetch('https://auth.civic.com/oauth/.well-known/openid-configuration', {
          signal: controller.signal,
          mode: 'cors'
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
          console.log('✅ Civic Auth is available, using Civic Auth');
          setAuthMode('civic');
        } else {
          throw new Error('Civic Auth server not responding properly');
        }
      } catch (err) {
        console.warn('⚠️ Civic Auth not available, using fallback auth:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setAuthMode('fallback');
      }
    };

    checkCivicAuth();
  }, []);

  if (authMode === 'checking') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Initializing Authentication</h2>
          <p className="text-gray-600">Checking Civic Auth availability...</p>
        </div>
      </div>
    );
  }

  if (authMode === 'fallback') {
    return (
      <div>
        {/* 显示回退模式通知 */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>Demo Mode Active:</strong> Civic Auth is not available. Using local authentication for testing.
                <button 
                  onClick={() => window.location.reload()} 
                  className="ml-2 text-yellow-800 underline hover:text-yellow-900"
                >
                  Retry
                </button>
              </p>
            </div>
          </div>
        </div>
        
        <FallbackAuthProvider>
          {children}
        </FallbackAuthProvider>
      </div>
    );
  }

  // 使用 Civic Auth
  return (
    <CivicAuthProvider clientId={clientId}>
      {children}
    </CivicAuthProvider>
  );
}
