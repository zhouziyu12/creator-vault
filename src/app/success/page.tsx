'use client';

import { useUser } from '@civic/auth-web3/react';
import { CustomUserButton } from '@/components/auth/UserButton';
import { 
  CheckCircle, 
  Shield, 
  Wallet, 
  Coins, 
  ArrowRight,
  Home,
  User,
  Mail
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function SuccessPage() {
  const { user } = useUser();
  const [imageError, setImageError] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🎉 Welcome to CreatorVault Pro!
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Your Civic Auth verification was successful. You&apos;re now ready to start creating and earning!
          </p>

          {user && (
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 mb-8">
              <div className="flex items-center justify-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center overflow-hidden">
                  {user.picture && !imageError ? (
                    <Image 
                      src={user.picture} 
                      alt="Profile" 
                      width={64} 
                      height={64} 
                      className="w-16 h-16 rounded-full object-cover"
                      onError={() => setImageError(true)}
                      unoptimized={true}
                    />
                  ) : (
                    <User className="w-8 h-8 text-white" />
                  )}
                </div>
                <div className="text-left">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {user.name || 'Creator'}
                  </h3>
                  <p className="text-gray-600 flex items-center">
                    <Mail className="w-4 h-4 mr-1" />
                    {user.email}
                  </p>
                  <div className="flex items-center text-green-600 text-sm mt-1">
                    <Shield className="w-4 h-4 mr-1" />
                    Verified by Civic Auth
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Identity Verified</h3>
              <p className="text-sm text-gray-600">Secure authentication through Civic</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Wallet className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Web3 Wallet Ready</h3>
              <p className="text-sm text-gray-600">Your embedded wallet is being set up</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Coins className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Start Earning</h3>
              <p className="text-sm text-gray-600">Direct payments to your wallet</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/" className="inline-flex items-center justify-center bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-medium">
              <Home className="w-5 h-5 mr-2" />
              Go to Dashboard
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            
            <Link href="/debug" className="inline-flex items-center justify-center bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium">
              View Debug Info
            </Link>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex justify-center">
              <CustomUserButton />
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            🔐 Your connection is secure and your data is protected by Civic Auth
          </p>
        </div>
      </div>
    </div>
  );
}
