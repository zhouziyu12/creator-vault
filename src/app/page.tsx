'use client';

import { useState, useEffect } from 'react';
import { CustomUserButton } from '@/components/auth/UserButton';
import { CreatorDashboard } from '@/components/creator/CreatorDashboard';
import { QuickPaymentTest } from '@/components/demo/QuickPaymentTest';
import { AccountManager } from '@/components/auth/AccountManager';
import { ContentDebugPanel } from '@/components/debug/ContentDebugPanel';
import { useUser } from '@civic/auth-web3/react';
import { 
  Search,
  Menu,
  Bell,
  Video,
  Coins,
  Shield,
  Wallet
} from 'lucide-react';

export default function HomePage() {
  const { user, isLoading } = useUser();
  const [mockUser, setMockUser] = useState<any>(null);

  useEffect(() => {
    // 检查是否有保存的 mock 用户
    const savedUser = localStorage.getItem('auth_user');
    if (savedUser) {
      try {
        setMockUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Failed to parse saved user:', e);
      }
    }
  }, [user]);

  const currentUser = user || mockUser;

  if (isLoading && !mockUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg animate-pulse mb-4 mx-auto flex items-center justify-center">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading CreatorVault...</h2>
          <p className="text-gray-600">Initializing Civic Auth...</p>
        </div>
      </div>
    );
  }

  if (currentUser) {
    return (
      <>
        <CreatorDashboard />
        <QuickPaymentTest />
        <AccountManager />
        <ContentDebugPanel />
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center space-x-4">
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <Menu className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-2">
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-2 rounded-lg">
                  <Coins className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold">CreatorVault</span>
                <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">Web3</span>
              </div>
            </div>

            <div className="flex-1 max-w-2xl mx-8">
              <div className="flex">
                <input
                  type="text"
                  placeholder="Search for Web3 content, creators, NFTs..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-l-full focus:outline-none focus:border-blue-500"
                />
                <button className="px-6 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-full hover:bg-gray-200">
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="p-2 hover:bg-gray-100 rounded-full relative">
                <Video className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">+</span>
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <Bell className="w-5 h-5" />
              </button>
              <CustomUserButton />
            </div>
          </div>
        </header>

        <main className="flex-1 p-6">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white mb-8">
            <div className="max-w-2xl">
              <h1 className="text-4xl font-bold mb-4">
                Welcome to the Web3 Creator Economy
              </h1>
              <p className="text-xl text-purple-100 mb-6">
                Create, share, and monetize your content with Civic Auth identity verification 
                and embedded Web3 wallets. Secure, verified, and decentralized.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 items-start">
                <div className="flex items-center space-x-2 bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold">
                  <Shield className="w-5 h-5" />
                  <span>Get Verified with Civic:</span>
                </div>
                <CustomUserButton />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                <div className="flex items-center space-x-2 text-purple-100">
                  <Shield className="w-5 h-5" />
                  <span>Identity Verified</span>
                </div>
                <div className="flex items-center space-x-2 text-purple-100">
                  <Wallet className="w-5 h-5" />
                  <span>Web3 Wallet Included</span>
                </div>
                <div className="flex items-center space-x-2 text-purple-100">
                  <Coins className="w-5 h-5" />
                  <span>Direct Earnings</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Civic Auth Verified</h3>
              <p className="text-gray-600">
                Secure identity verification with seamless Web3 integration. Build trust with your audience.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Wallet className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Embedded Web3 Wallet</h3>
              <p className="text-gray-600">
                Get your Web3 wallet automatically when you sign up. No complex setup required.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Coins className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Direct Crypto Earnings</h3>
              <p className="text-gray-600">
                Receive payments directly to your wallet. No platform fees, no waiting periods.
              </p>
            </div>
          </div>
        </main>
      </div>
      
      <QuickPaymentTest />
      <AccountManager />
      <ContentDebugPanel />
    </>
  );
}
