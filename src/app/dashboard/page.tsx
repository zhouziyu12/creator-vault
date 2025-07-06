'use client';

import { PageLayout } from '@/components/layout/PageLayout';
import { WalletInfo } from '@/components/web3/WalletInfo';
import { ContentList } from '@/components/content/ContentList';
import { CreatePaidContent } from '@/components/demo/CreatePaidContent';
import { useUser } from '@civic/auth-web3/react';
import Link from 'next/link';
import { 
  TrendingUp,
  Users,
  Eye,
  DollarSign,
  FileText,
  Globe,
  Zap,
  Star,
  Calendar,
  ArrowUp,
  ArrowDown,
  Plus,
  TestTube
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useUser();

  const stats = [
    { label: 'Total Views', value: '1.2K', icon: Eye, color: 'blue', change: '+12%', trend: 'up' },
    { label: 'Total Earnings', value: '0.045 ETH', icon: DollarSign, color: 'green', change: '+8%', trend: 'up' },
    { label: 'Followers', value: '256', icon: Users, color: 'purple', change: '+5%', trend: 'up' },
    { label: 'Content', value: '12', icon: FileText, color: 'orange', change: '+2', trend: 'up' },
  ];

  return (
    <PageLayout 
      title="Dashboard" 
      description="Welcome to your creator dashboard! Track your Web3 earnings and content performance."
    >
      <div className="space-y-6">
        {/* Demo Tools */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-center space-x-2 mb-4">
            <TestTube className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-blue-900">Payment System Testing</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <CreatePaidContent />
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-2">🔍 Debug Console</h4>
              <p className="text-sm text-gray-600 mb-3">Open browser console (F12) and use:</p>
              <div className="text-xs font-mono bg-gray-800 text-green-400 p-2 rounded">
                <div>showPaymentData() // View all payments</div>
                <div>clearPaymentData() // Clear all data</div>
              </div>
            </div>
          </div>
          <div className="text-sm text-blue-700">
            <p>💡 <strong>Test Flow:</strong> Create paid content → Visit /browse → Click content → Test purchase → Check /analytics</p>
          </div>
        </div>

        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                Welcome back, {user?.id ? user.id.slice(0, 8) + '...' : 'Creator'}!
              </h2>
              <p className="text-purple-100 mb-4">
                You're earning with Web3 - no platform fees, instant payments!
              </p>
              <div className="flex items-center space-x-2 text-sm">
                <Globe className="w-4 h-4" />
                <span>Decentralized • Global • Zero Fees</span>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <Zap className="w-12 h-12" />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            const TrendIcon = stat.trend === 'up' ? ArrowUp : ArrowDown;
            
            return (
              <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    stat.color === 'blue' ? 'bg-blue-100' :
                    stat.color === 'green' ? 'bg-green-100' :
                    stat.color === 'purple' ? 'bg-purple-100' :
                    'bg-orange-100'
                  }`}>
                    <Icon className={`w-6 h-6 ${
                      stat.color === 'blue' ? 'text-blue-600' :
                      stat.color === 'green' ? 'text-green-600' :
                      stat.color === 'purple' ? 'text-purple-600' :
                      'text-orange-600'
                    }`} />
                  </div>
                  <div className={`flex items-center space-x-1 text-sm ${
                    stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <TrendIcon className="w-4 h-4" />
                    <span>{stat.change}</span>
                  </div>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Recent Content</h3>
                <Link href="/content" className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                  View All
                </Link>
              </div>
              <ContentList showCreatorOnly={true} limit={3} />
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  href="/content/create"
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-medium flex items-center justify-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create New Content</span>
                </Link>
                <Link
                  href="/browse"
                  className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center justify-center space-x-2"
                >
                  <Globe className="w-4 h-4" />
                  <span>Browse Community</span>
                </Link>
                <Link
                  href="/analytics"
                  className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center justify-center space-x-2"
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>View Analytics</span>
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Wallet Overview</h3>
              <WalletInfo compact={true} />
            </div>
          </div>
        </div>

        {/* Web3 Features */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Globe className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-blue-900">Why Web3 Creators Win</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2 text-blue-800">
              <Star className="w-5 h-5" />
              <span className="font-medium">0% Platform Fees</span>
            </div>
            <div className="flex items-center space-x-2 text-blue-800">
              <Zap className="w-5 h-5" />
              <span className="font-medium">Instant Payments</span>
            </div>
            <div className="flex items-center space-x-2 text-blue-800">
              <Globe className="w-5 h-5" />
              <span className="font-medium">Global Reach</span>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
