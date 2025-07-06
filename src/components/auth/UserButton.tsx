'use client';

import { useState } from 'react';
import { useUser } from '@civic/auth-web3/react';
import { 
  User, 
  LogOut, 
  Wallet, 
  Settings,
  ChevronDown,
  Shield,
  ExternalLink
} from 'lucide-react';

export function CustomUserButton() {
  const { user, isLoading, signIn, signOut } = useUser();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSignIn = async () => {
    try {
      console.log('🚀 Starting Civic Auth sign in...');
      await signIn();
      console.log('✅ Sign in successful');
    } catch (error) {
      console.error('❌ Sign in failed:', error);
      alert('Sign in failed. Please try again.');
    }
  };

  const handleSignOut = async () => {
    try {
      console.log('🚪 Starting sign out...');
      await signOut();
      console.log('✅ Sign out successful');
      setIsDropdownOpen(false);
    } catch (error) {
      console.error('❌ Sign out failed:', error);
      alert('Sign out failed: ' + (error?.message || 'Unknown error'));
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-lg">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
        <span className="text-sm text-gray-600">Loading...</span>
      </div>
    );
  }

  if (!user) {
    return (
      <button
        onClick={handleSignIn}
        className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-medium"
      >
        <Shield className="w-4 h-4" />
        <span>Sign In with Civic</span>
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center space-x-2 bg-white border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
          {user.name ? user.name[0].toUpperCase() : (user.id ? user.id[0].toUpperCase() : 'U')}
        </div>
        <div className="text-left hidden sm:block">
          <p className="text-sm font-medium text-gray-900">
            {user.name || (user.id ? `${user.id.slice(0, 8)}...` : 'User')}
          </p>
          <p className="text-xs text-gray-500">Civic Verified</p>
        </div>
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </button>

      {isDropdownOpen && (
        <>
          {/* 背景遮罩 */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsDropdownOpen(false)}
          ></div>
          
          {/* 下拉菜单 */}
          <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
            {/* 用户信息 */}
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                  {user.name ? user.name[0].toUpperCase() : (user.id ? user.id[0].toUpperCase() : 'U')}
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {user.name || (user.id ? `${user.id.slice(0, 12)}...` : 'Anonymous User')}
                  </p>
                  <div className="flex items-center space-x-1">
                    <Shield className="w-3 h-3 text-green-500" />
                    <span className="text-xs text-green-600">Civic Verified</span>
                  </div>
                  {user.email && (
                    <p className="text-xs text-gray-500 mt-1">{user.email}</p>
                  )}
                </div>
              </div>
            </div>

            {/* 用户信息显示 */}
            <div className="px-4 py-2 bg-blue-50 border-b border-gray-100">
              <div className="text-xs text-blue-800 space-y-1">
                <p><strong>User ID:</strong> {user.id}</p>
                {user.email && <p><strong>Email:</strong> {user.email}</p>}
                {user.name && <p><strong>Name:</strong> {user.name}</p>}
                {user.updated_at && (
                  <p><strong>Updated:</strong> {new Date(user.updated_at).toLocaleDateString()}</p>
                )}
              </div>
            </div>

            {/* 菜单项 */}
            <div className="py-2">
              <button
                onClick={() => {
                  setIsDropdownOpen(false);
                  window.location.href = '/dashboard';
                }}
                className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <User className="w-4 h-4" />
                <span>Dashboard</span>
              </button>
              
              <button
                onClick={() => {
                  setIsDropdownOpen(false);
                  window.location.href = '/wallet';
                }}
                className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Wallet className="w-4 h-4" />
                <span>Wallet</span>
              </button>
              
              <button
                onClick={() => {
                  setIsDropdownOpen(false);
                  window.location.href = '/settings';
                }}
                className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </button>

              <button
                onClick={() => window.open('https://civic.com', '_blank')}
                className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span>About Civic Auth</span>
              </button>
            </div>

            {/* 登出区域 */}
            <div className="py-2 border-t border-gray-100">
              <button
                onClick={handleSignOut}
                className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
