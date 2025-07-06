'use client';

import { useState } from 'react';
import { Shield, Wallet, User, AlertCircle, CheckCircle } from 'lucide-react';

interface AlternativeAuthProps {
  onAuthSuccess: (mockUser: any) => void;
}

export function AlternativeAuth({ onAuthSuccess }: AlternativeAuthProps) {
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleMockAuth = async () => {
    setIsAuthenticating(true);
    
    // 模拟认证过程
    setTimeout(() => {
      const mockUser = {
        id: 'demo_user_' + Date.now(),
        wallet: {
          address: '0x' + Math.random().toString(16).substr(2, 40)
        },
        email: 'demo@creatorvault.com',
        verified: true
      };
      
      // 保存到 localStorage
      localStorage.setItem('auth_user', JSON.stringify(mockUser));
      
      setIsAuthenticating(false);
      onAuthSuccess(mockUser);
      
      alert('✅ Mock authentication successful! You can now test all features.');
    }, 2000);
  };

  const handleCivicRetry = () => {
    console.log('🔄 Retrying Civic Auth initialization...');
    localStorage.clear();
    sessionStorage.clear();
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">CreatorVault Authentication</h2>
          <p className="text-gray-600">Choose your authentication method</p>
        </div>

        {/* Civic Auth 问题说明 */}
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-yellow-800">Civic Auth Issue Detected</h3>
              <p className="text-sm text-yellow-700 mt-1">
                Civic Auth is experiencing initialization issues. You can retry or use demo mode to test the platform.
              </p>
            </div>
          </div>
        </div>

        {/* 认证选项 */}
        <div className="space-y-4">
          <button
            onClick={handleCivicRetry}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-medium flex items-center justify-center space-x-2"
          >
            <Shield className="w-5 h-5" />
            <span>🔄 Retry Civic Auth</span>
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with demo</span>
            </div>
          </div>

          <button
            onClick={handleMockAuth}
            disabled={isAuthenticating}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {isAuthenticating ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <User className="w-5 h-5" />
                <span>🚀 Use Demo Mode</span>
              </>
            )}
          </button>
        </div>

        {/* Demo Mode 说明 */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-800">Demo Mode Features</h3>
              <div className="text-sm text-blue-700 mt-1 space-y-1">
                <p>✅ Full payment system testing</p>
                <p>✅ Content creation & management</p>
                <p>✅ Analytics & earnings tracking</p>
                <p>✅ All CreatorVault features</p>
              </div>
            </div>
          </div>
        </div>

        {/* 技术信息 */}
        <div className="mt-4 text-xs text-gray-500 text-center">
          <p>Having issues? Check the browser console for technical details.</p>
        </div>
      </div>
    </div>
  );
}
