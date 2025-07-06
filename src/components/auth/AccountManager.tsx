'use client';

import { useState } from 'react';
import { useUser } from '@civic/auth-web3/react';
import { Trash2, RefreshCw, Users, AlertTriangle, CheckCircle } from 'lucide-react';

export function AccountManager() {
  const { user, isLoading, signIn, signOut } = useUser();
  const [isClearing, setIsClearing] = useState(false);

  const clearAllAuthData = async () => {
    setIsClearing(true);
    try {
      console.log('🧹 Clearing all authentication data...');
      
      // 先尝试正常登出
      if (signOut) {
        try {
          await signOut();
        } catch (e) {
          console.log('Normal signOut failed, proceeding with manual cleanup:', e);
        }
      }
      
      // 清理所有存储
      localStorage.clear();
      sessionStorage.clear();
      
      // 清理 IndexedDB 中的 Civic 数据
      if ('indexedDB' in window) {
        try {
          const databases = await indexedDB.databases();
          databases.forEach(db => {
            if (db.name?.includes('civic') || db.name?.includes('auth')) {
              indexedDB.deleteDatabase(db.name);
            }
          });
        } catch (e) {
          console.log('IndexedDB cleanup failed:', e);
        }
      }
      
      // 清理 Cookies
      document.cookie.split(";").forEach((c) => {
        const eqPos = c.indexOf("=");
        const name = eqPos > -1 ? c.substr(0, eqPos) : c;
        if (name.includes('civic') || name.includes('auth')) {
          document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
        }
      });
      
      alert('✅ All authentication data cleared! Page will reload.');
      window.location.href = '/';
    } catch (error) {
      console.error('❌ Clear auth data failed:', error);
      alert('❌ Failed to clear data: ' + error);
    } finally {
      setIsClearing(false);
    }
  };

  const switchAccount = async () => {
    try {
      console.log('🔄 Switching account...');
      
      if (signOut) {
        await signOut();
        console.log('✅ Signed out successfully');
        
        // 稍等后重新登录
        setTimeout(() => {
          if (signIn) {
            signIn();
          }
        }, 1000);
      } else {
        alert('Sign out function not available. Try "Clear All Data" instead.');
      }
    } catch (error) {
      console.error('❌ Account switch failed:', error);
      alert('❌ Account switch failed: ' + (error?.message || 'Unknown error'));
    }
  };

  const testSignIn = async () => {
    try {
      console.log('🧪 Testing sign in...');
      if (signIn) {
        await signIn();
        console.log('✅ Sign in test successful');
      } else {
        alert('Sign in function not available.');
      }
    } catch (error) {
      console.error('❌ Sign in test failed:', error);
      alert('❌ Sign in failed: ' + (error?.message || 'Unknown error'));
    }
  };

  return (
    <div className="fixed bottom-20 right-4 z-50">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-xs">
        <h3 className="font-medium text-gray-900 mb-3 flex items-center space-x-2">
          <Users className="w-4 h-4" />
          <span>Civic Auth Manager</span>
        </h3>
        
        {/* 用户状态显示 */}
        {user ? (
          <div className="mb-3 p-2 bg-green-50 border border-green-200 rounded text-xs">
            <div className="flex items-center space-x-1 mb-1">
              <CheckCircle className="w-3 h-3 text-green-600" />
              <p className="text-green-800 font-medium">Logged in</p>
            </div>
            <p className="text-green-700"><strong>ID:</strong> {user.id?.slice(0, 12)}...</p>
            {user.name && <p className="text-green-700"><strong>Name:</strong> {user.name}</p>}
            {user.email && <p className="text-green-700"><strong>Email:</strong> {user.email}</p>}
          </div>
        ) : (
          <div className="mb-3 p-2 bg-gray-50 border border-gray-200 rounded text-xs">
            <p className="text-gray-600">❌ Not logged in</p>
          </div>
        )}
        
        {/* 函数可用性状态 */}
        <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded text-xs">
          <p className="text-blue-800 font-medium">🔧 Civic Auth Status:</p>
          <p className="text-blue-700">Loading: {isLoading ? '⏳' : '✅'}</p>
          <p className="text-blue-700">signIn: {signIn ? '✅' : '❌'}</p>
          <p className="text-blue-700">signOut: {signOut ? '✅' : '❌'}</p>
        </div>
        
        <div className="space-y-2">
          {!user && (
            <button
              onClick={testSignIn}
              className="w-full bg-green-600 text-white py-2 px-3 rounded text-sm hover:bg-green-700 transition-colors flex items-center justify-center space-x-1"
            >
              <span>🚀 Test Sign In</span>
            </button>
          )}
          
          {user && (
            <button
              onClick={switchAccount}
              className="w-full bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Switch Account</span>
            </button>
          )}
          
          <button
            onClick={() => {
              console.log('🔍 Civic Auth Debug Info:');
              console.log('User:', user);
              console.log('Loading:', isLoading);
              console.log('signIn function:', signIn);
              console.log('signOut function:', signOut);
              alert('Check console for debug info');
            }}
            className="w-full bg-purple-600 text-white py-2 px-3 rounded text-sm hover:bg-purple-700 transition-colors flex items-center justify-center space-x-1"
          >
            <AlertTriangle className="w-3 h-3" />
            <span>Debug Info</span>
          </button>
          
          <button
            onClick={clearAllAuthData}
            disabled={isClearing}
            className="w-full bg-red-600 text-white py-2 px-3 rounded text-sm hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-1"
          >
            <Trash2 className="w-3 h-3" />
            <span>{isClearing ? 'Clearing...' : 'Clear All Data'}</span>
          </button>
        </div>
        
        <div className="mt-3 text-xs text-gray-500">
          <p>💡 Using official Civic Auth hooks</p>
          <p>📖 Based on docs: useUser() hook</p>
        </div>
      </div>
    </div>
  );
}
