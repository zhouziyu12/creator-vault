'use client';

import { useUser } from '@civic/auth-web3/react';
import { useState, useRef, useEffect } from 'react';
import { 
  LogOut, 
  Settings, 
  Wallet, 
  DollarSign, 
  ChevronDown,
  Shield,
  Bell,
  User
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export function CustomUserButton() {
  const { user, login, logout, isLoading } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // 点击外部关闭下拉菜单
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMenuItemClick = (path: string) => {
    setIsOpen(false);
    router.push(path);
  };

  const handleLogout = () => {
    setIsOpen(false);
    logout();
  };

  if (isLoading) {
    return (
      <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
    );
  }

  if (!user) {
    return (
      <button
        onClick={login}
        className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-medium flex items-center space-x-2"
      >
        <Shield className="w-4 h-4" />
        <span>Login with Civic</span>
      </button>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-white border border-gray-200 rounded-full px-3 py-2 hover:bg-gray-50 transition-colors"
      >
        <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
          <span className="text-white font-medium text-sm">
            {user.id?.charAt(0)?.toUpperCase() || 'Z'}
          </span>
        </div>
        <div className="text-left">
          <div className="text-sm font-medium text-gray-900">ziyu zhou</div>
          <div className="flex items-center space-x-1">
            <Shield className="w-3 h-3 text-green-500" />
            <span className="text-xs text-green-600">Civic Verified</span>
          </div>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
          {/* 用户信息 */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-medium">
                  {user.id?.charAt(0)?.toUpperCase() || 'Z'}
                </span>
              </div>
              <div>
                <div className="font-medium text-gray-900">ziyu zhou</div>
                <div className="text-sm text-gray-500">tzuyu030401@gmail.com</div>
                <div className="flex items-center space-x-1 mt-1">
                  <Shield className="w-3 h-3 text-green-500" />
                  <span className="text-xs text-green-600">Identity Verified by Civic</span>
                </div>
              </div>
            </div>
          </div>

          {/* 菜单项 */}
          <div className="py-2">
            <button
              onClick={() => handleMenuItemClick('/wallet')}
              className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors"
            >
              <Wallet className="w-5 h-5 text-gray-500" />
              <div className="text-left">
                <div className="font-medium text-gray-900">Web3 Wallet</div>
                <div className="text-sm text-gray-500">Manage your wallet</div>
              </div>
            </button>

            <button
              onClick={() => handleMenuItemClick('/earnings')}
              className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors"
            >
              <DollarSign className="w-5 h-5 text-gray-500" />
              <div className="text-left">
                <div className="font-medium text-gray-900">Earnings</div>
                <div className="text-sm text-gray-500">View your earnings</div>
              </div>
            </button>

            <button
              onClick={() => handleMenuItemClick('/settings')}
              className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors"
            >
              <Settings className="w-5 h-5 text-gray-500" />
              <div className="text-left">
                <div className="font-medium text-gray-900">Settings</div>
                <div className="text-sm text-gray-500">Account preferences</div>
              </div>
            </button>
          </div>

          {/* 退出登录 */}
          <div className="border-t border-gray-100 pt-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-red-50 transition-colors text-red-600"
            >
              <LogOut className="w-5 h-5" />
              <div className="text-left">
                <div className="font-medium">Sign Out</div>
                <div className="text-sm">Disconnect from Civic</div>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
