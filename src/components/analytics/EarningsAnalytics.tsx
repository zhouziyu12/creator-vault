'use client';

import { useUser } from '@/components/providers/CivicAuthProvider';
import { web3Utils } from '@/lib/web3/config';
import { useState, useEffect } from 'react';
import {
  TrendingUp,
  DollarSign,
  Eye,
  Users,
  Calendar,
  ArrowUpRight,
  ArrowDownLeft,
  Coins,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';

interface EarningsData {
  totalEarnings: number;
  monthlyEarnings: number;
  contentSales: number;
  tips: number;
  views: number;
  subscribers: number;
}

export function EarningsAnalytics() {
  const { user } = useUser();
  const [earnings, setEarnings] = useState<EarningsData>({
    totalEarnings: 0.15,
    monthlyEarnings: 0.05,
    contentSales: 0.12,
    tips: 0.03,
    views: 1245,
    subscribers: 87
  });

  const stats = [
    {
      title: 'Total Earnings',
      value: `${web3Utils.formatBalance(earnings.totalEarnings)} ETH`,
      change: '+12.5%',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      title: 'Monthly Revenue',
      value: `${web3Utils.formatBalance(earnings.monthlyEarnings)} ETH`,
      change: '+8.2%',
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      title: 'Content Sales',
      value: `${web3Utils.formatBalance(earnings.contentSales)} ETH`,
      change: '+15.3%',
      icon: Coins,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    {
      title: 'Tips Received',
      value: `${web3Utils.formatBalance(earnings.tips)} ETH`,
      change: '+22.1%',
      icon: ArrowUpRight,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    }
  ];

  const engagementStats = [
    {
      title: 'Total Views',
      value: earnings.views.toLocaleString(),
      icon: Eye,
      color: 'text-gray-600'
    },
    {
      title: 'Subscribers',
      value: earnings.subscribers.toString(),
      icon: Users,
      color: 'text-gray-600'
    }
  ];

  return (
    <div className="space-y-6">
      {/* 收益概览 */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
          <BarChart3 className="w-6 h-6 text-purple-600" />
          <span>Earnings Analytics</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.title}
                className={`${stat.bgColor} ${stat.borderColor} border rounded-xl p-6 hover:shadow-md transition-all duration-200`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <span className="text-sm font-medium text-green-600">{stat.change}</span>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.title}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 互动统计 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <Activity className="w-5 h-5 text-blue-600" />
          <span>Engagement Metrics</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {engagementStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.title}
                className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
              >
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div>
                  <div className="text-xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.title}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 收益趋势图表占位 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <PieChart className="w-5 h-5 text-green-600" />
          <span>Revenue Breakdown</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Content Sales</span>
              <span className="font-medium">80%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-purple-600 h-2 rounded-full" style={{ width: '80%' }}></div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Tips</span>
              <span className="font-medium">20%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-orange-600 h-2 rounded-full" style={{ width: '20%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* 钱包余额集成 */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <Coins className="w-5 h-5 text-purple-600" />
          <span>Wallet Balance</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">Current Balance</div>
            <div className="text-2xl font-bold text-gray-900">
              {user?.wallet?.balance ? web3Utils.formatBalance(user.wallet.balance) : '0.000000'} SepoliaETH
            </div>
            <div className="text-sm text-gray-500 mt-1">≈ $0.00 USD</div>
          </div>
          
          <div className="bg-white rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">Available to Withdraw</div>
            <div className="text-2xl font-bold text-green-600">
              {web3Utils.formatBalance(earnings.totalEarnings)} ETH
            </div>
            <div className="text-sm text-gray-500 mt-1">Ready for payout</div>
          </div>
        </div>
      </div>

      {/* 最近交易 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-gray-600" />
          <span>Recent Transactions</span>
        </h3>
        
        <div className="space-y-3">
          {[
            { type: 'sale', amount: '0.05', item: 'Web3 Development Course', time: '2 hours ago' },
            { type: 'tip', amount: '0.01', item: 'NFT Art Tutorial', time: '1 day ago' },
            { type: 'sale', amount: '0.03', item: 'Blockchain Whitepaper', time: '3 days ago' }
          ].map((tx, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  tx.type === 'sale' ? 'bg-green-100' : 'bg-orange-100'
                }`}>
                  {tx.type === 'sale' ? 
                    <ArrowDownLeft className="w-4 h-4 text-green-600" /> : 
                    <ArrowUpRight className="w-4 h-4 text-orange-600" />
                  }
                </div>
                <div>
                  <div className="font-medium text-gray-900">{tx.item}</div>
                  <div className="text-sm text-gray-500">{tx.time}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium text-gray-900">+{tx.amount} ETH</div>
                <div className="text-sm text-gray-500">{tx.type}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
