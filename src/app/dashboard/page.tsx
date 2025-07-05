'use client';

import { useState } from 'react';
import { WalletInfo } from '@/components/web3/WalletInfo';
import { ContentList } from '@/components/content/ContentList';
import { CreateContentForm } from '@/components/content/CreateContentForm';
import { 
  Plus, 
  BarChart3, 
  FileText, 
  Wallet, 
  TrendingUp,
  Users,
  Eye,
  DollarSign
} from 'lucide-react';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'content' | 'analytics' | 'wallet' | 'create'>('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'content', label: 'My Content', icon: FileText },
    { id: 'create', label: 'Create', icon: Plus },
    { id: 'wallet', label: 'Wallet', icon: Wallet },
  ];

  const stats = [
    { label: 'Total Views', value: '1.2M', icon: Eye, color: 'blue' },
    { label: 'Total Earnings', value: '$5,432.10', icon: DollarSign, color: 'green' },
    { label: 'Subscribers', value: '45.6K', icon: Users, color: 'purple' },
    { label: 'Videos', value: '127', icon: FileText, color: 'orange' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Creator Dashboard</h1>
          <p className="text-gray-600">
            Welcome to your creator dashboard! Here you can manage your content, view analytics, and track your Web3 earnings.
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                      <div key={stat.label} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            stat.color === 'blue' ? 'bg-blue-100' :
                            stat.color === 'green' ? 'bg-green-100' :
                            stat.color === 'purple' ? 'bg-purple-100' :
                            'bg-orange-100'
                          }`}>
                            <Icon className={`w-5 h-5 ${
                              stat.color === 'blue' ? 'text-blue-600' :
                              stat.color === 'green' ? 'text-green-600' :
                              stat.color === 'purple' ? 'text-purple-600' :
                              'text-orange-600'
                            }`} />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                            <p className="text-xl font-semibold text-gray-900">{stat.value}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Recent Content */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Content</h3>
                  <ContentList showCreatorOnly={true} limit={3} />
                </div>
              </div>
            )}

            {/* Content Tab */}
            {activeTab === 'content' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">My Content</h3>
                  <button
                    onClick={() => setActiveTab('create')}
                    className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 px-4 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create New</span>
                  </button>
                </div>
                <ContentList showCreatorOnly={true} />
              </div>
            )}

            {/* Create Tab */}
            {activeTab === 'create' && (
              <div>
                <CreateContentForm 
                  onSuccess={() => setActiveTab('content')}
                />
              </div>
            )}

            {/* Wallet Tab */}
            {activeTab === 'wallet' && (
              <div>
                <WalletInfo />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
