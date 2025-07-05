'use client';

import { WalletInfo } from '@/components/web3/WalletInfo';
import { TrendingUp, DollarSign, Calendar, BarChart3 } from 'lucide-react';

export default function EarningsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Earnings Dashboard</h1>
          <p className="text-gray-600">Track your Web3 creator earnings and analytics</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Earnings Stats */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Earnings Overview</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-gray-600">Total Earnings</span>
                  </div>
                  <span className="font-semibold text-gray-900">0.000000 ETH</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-gray-600">This Month</span>
                  </div>
                  <span className="font-semibold text-gray-900">0.000000 ETH</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-purple-600" />
                    <span className="text-sm text-gray-600">Growth</span>
                  </div>
                  <span className="font-semibold text-green-600">+0%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Wallet Details */}
          <div className="lg:col-span-2">
            <WalletInfo />
          </div>
        </div>
      </div>
    </div>
  );
}
